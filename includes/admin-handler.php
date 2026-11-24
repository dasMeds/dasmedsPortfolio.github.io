<?php
declare(strict_types=1);

function admin_json(int $status, array $payload, array $headers = []): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    foreach ($headers as $name => $value) {
        header($name . ': ' . $value);
    }
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function admin_same_origin(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') {
        return;
    }
    $originHost = parse_url($origin, PHP_URL_HOST);
    $forwardedHost = $_SERVER['HTTP_X_FORWARDED_HOST'] ?? '';
    $requestHostHeader = $forwardedHost !== ''
        ? trim(explode(',', $forwardedHost)[0])
        : ($_SERVER['HTTP_HOST'] ?? '');
    $requestHost = parse_url('http://' . $requestHostHeader, PHP_URL_HOST);
    if (
        !is_string($originHost)
        || !is_string($requestHost)
        || strcasecmp($originHost, $requestHost) !== 0
    ) {
        admin_json(403, ['error' => 'This request did not originate from this site.']);
    }
}

function admin_secure_request(): bool
{
    $forwardedProtocol = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')[0]);
    return (
        (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || $forwardedProtocol === 'https'
    );
}

function admin_cookie_secret(): string
{
    $secret = getenv('ADMIN_SESSION_SECRET') ?: '';
    if (strlen($secret) < 32) {
        admin_json(503, ['error' => 'Set ADMIN_SESSION_SECRET to a random value of at least 32 characters.']);
    }
    return $secret;
}

function admin_base64url_encode(string $value): string
{
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function admin_signed_cookie(array $claims): string
{
    $payload = admin_base64url_encode(json_encode($claims, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR));
    $signature = admin_base64url_encode(hash_hmac('sha256', $payload, admin_cookie_secret(), true));
    return $payload . '.' . $signature;
}

function admin_read_session(): ?array
{
    $secret = getenv('ADMIN_SESSION_SECRET') ?: '';
    $cookie = $_COOKIE['dasmeds_admin'] ?? '';
    if (strlen($secret) < 32 || !is_string($cookie)) {
        return null;
    }
    $parts = explode('.', $cookie);
    if (count($parts) !== 2) {
        return null;
    }
    [$encodedPayload, $submittedSignature] = $parts;
    $expectedSignature = admin_base64url_encode(hash_hmac('sha256', $encodedPayload, $secret, true));
    if (!hash_equals($expectedSignature, $submittedSignature)) {
        return null;
    }
    $padding = str_repeat('=', (4 - strlen($encodedPayload) % 4) % 4);
    $payload = base64_decode(strtr($encodedPayload, '-_', '+/') . $padding, true);
    if (!is_string($payload)) {
        return null;
    }
    try {
        $claims = json_decode($payload, true, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        return null;
    }
    if (
        !is_array($claims)
        || !is_int($claims['expires'] ?? null)
        || $claims['expires'] <= time()
        || !is_string($claims['csrf'] ?? null)
        || !is_string($claims['auth'] ?? null)
        || !is_string($claims['username'] ?? null)
    ) {
        return null;
    }
    $authVersion = hash_hmac(
        'sha256',
        (getenv('ADMIN_USERNAME') ?: '') . "\0" . (getenv('ADMIN_PASSWORD') ?: ''),
        $secret
    );
    if (!hash_equals($authVersion, $claims['auth'])) {
        return null;
    }
    return $claims;
}

function admin_set_session_cookie(string $value, int $expires): void
{
    setcookie('dasmeds_admin', $value, [
        'expires' => $expires,
        'path' => '/api/admin',
        'secure' => admin_secure_request(),
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
}

function admin_clear_session_cookie(): void
{
    admin_set_session_cookie('', time() - 3600);
}

function admin_require_login(): void
{
    if (!is_array($GLOBALS['admin_session'] ?? null)) {
        admin_json(401, ['error' => 'Please sign in again.']);
    }
}

function admin_require_csrf(): void
{
    admin_require_login();
    $submittedToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $sessionToken = $GLOBALS['admin_session']['csrf'] ?? '';
    if (!is_string($submittedToken) || !is_string($sessionToken) || $sessionToken === '' || !hash_equals($sessionToken, $submittedToken)) {
        admin_json(403, ['error' => 'Your session expired. Refresh the page and try again.']);
    }
}

function admin_read_json(): array
{
    $rawBody = file_get_contents('php://input') ?: '';
    if (strlen($rawBody) > 6 * 1024 * 1024) {
        admin_json(413, ['error' => 'The request is too large.']);
    }
    try {
        $body = json_decode($rawBody, true, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        admin_json(400, ['error' => 'A valid JSON request body is required.']);
    }
    if (!is_array($body)) {
        admin_json(400, ['error' => 'A JSON object is required.']);
    }
    return $body;
}

function admin_string(mixed $value, string $field, int $maxLength, bool $allowEmpty = false): string
{
    if (!is_string($value)) {
        admin_json(400, ['error' => "{$field} must be text."]);
    }
    $value = trim($value);
    if ((!$allowEmpty && $value === '') || mb_strlen($value) > $maxLength) {
        admin_json(400, ['error' => "{$field} is required and must be at most {$maxLength} characters."]);
    }
    return $value;
}

function admin_site_asset(mixed $value, string $prefix, array $extensions, string $field): string
{
    $path = admin_string($value, $field, 240);
    $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    if (
        !str_starts_with($path, $prefix)
        || str_contains($path, '..')
        || !in_array($extension, $extensions, true)
        || preg_match('/[\r\n?#]/', $path)
    ) {
        admin_json(400, ['error' => "{$field} must be a site asset under {$prefix}."]);
    }
    return $path;
}

function admin_validate_records(array $data): array
{
    if (!function_exists('mb_strlen')) {
        admin_json(503, ['error' => 'Admin editing requires the PHP mbstring extension.']);
    }
    $data['resume'] = admin_site_asset($data['resume'] ?? null, '/documents/', ['pdf'], 'Resume');
    foreach (['certifications', 'posters', 'repositories', 'videos'] as $section) {
        if (!isset($data[$section]) || !is_array($data[$section]) || !array_is_list($data[$section]) || count($data[$section]) > 200) {
            admin_json(400, ['error' => "The {$section} list is invalid or too large."]);
        }
    }

    $ids = [];
    foreach ($data['certifications'] as $index => $record) {
        if (!is_array($record)) {
            admin_json(400, ['error' => 'Every certification must be an object.']);
        }
        foreach (['id', 'date', 'title', 'issuer', 'track'] as $field) {
            $record[$field] = admin_string($record[$field] ?? null, "Certification {$index} {$field}", 240);
        }
        if (isset($ids[$record['id']])) {
            admin_json(400, ['error' => 'Certification IDs must be unique.']);
        }
        $ids[$record['id']] = true;
        $date = DateTimeImmutable::createFromFormat('!Y-m-d', $record['date']);
        if (!$date || $date->format('Y-m-d') !== $record['date']) {
            admin_json(400, ['error' => "Certification {$record['id']} needs a valid YYYY-MM-DD date."]);
        }
        $record['image'] = admin_site_asset($record['image'] ?? null, '/images/', ['png', 'jpg', 'jpeg', 'webp'], 'Certification image');
        if (isset($record['document']) && $record['document'] !== '') {
            $record['document'] = admin_site_asset($record['document'], '/documents/', ['pdf'], 'Certification document');
        } else {
            unset($record['document']);
        }
        if (isset($record['verifyUrl']) && $record['verifyUrl'] !== '') {
            $verifyUrl = admin_string($record['verifyUrl'], 'Verification URL', 500);
            if (parse_url($verifyUrl, PHP_URL_SCHEME) !== 'https' || !is_string(parse_url($verifyUrl, PHP_URL_HOST))) {
                admin_json(400, ['error' => 'Verification links must use HTTPS.']);
            }
            $record['verifyUrl'] = $verifyUrl;
        } else {
            unset($record['verifyUrl']);
        }
        $data['certifications'][$index] = $record;
    }

    foreach ($data['posters'] as $index => $record) {
        if (!is_array($record)) {
            admin_json(400, ['error' => 'Every poster must be an object.']);
        }
        foreach (['title', 'category'] as $field) {
            $record[$field] = admin_string($record[$field] ?? null, "Poster {$index} {$field}", 240);
        }
        $record['image'] = admin_site_asset($record['image'] ?? null, '/images/', ['png', 'jpg', 'jpeg', 'webp'], 'Poster image');
        foreach (['width', 'height'] as $field) {
            if (!isset($record[$field]) || filter_var($record[$field], FILTER_VALIDATE_INT) === false || $record[$field] < 1 || $record[$field] > 10000) {
                admin_json(400, ['error' => "Poster {$field} must be a positive number no greater than 10000."]);
            }
            $record[$field] = (int) $record[$field];
        }
        foreach (['class', 'tools', 'intent', 'note'] as $field) {
            $record[$field] = admin_string($record[$field] ?? '', "Poster {$field}", 2000, true);
        }
        $data['posters'][$index] = $record;
    }

    foreach ($data['repositories'] as $index => $record) {
        if (!is_array($record)) {
            admin_json(400, ['error' => 'Every repository must be an object.']);
        }
        foreach (['name', 'callSign', 'objective'] as $field) {
            $record[$field] = admin_string($record[$field] ?? null, "Repository {$index} {$field}", 500);
        }
        if (!preg_match('/^[A-Za-z0-9_.-]+$/', $record['name'])) {
            admin_json(400, ['error' => 'Repository names may contain only letters, numbers, dots, underscores, and hyphens.']);
        }
        if (!isset($record['technologies']) || !is_array($record['technologies']) || !array_is_list($record['technologies']) || count($record['technologies']) > 20) {
            admin_json(400, ['error' => 'Repository technologies must be a list of up to 20 items.']);
        }
        foreach ($record['technologies'] as $technologyIndex => $technology) {
            $record['technologies'][$technologyIndex] = admin_string($technology, 'Technology', 80);
        }
        $data['repositories'][$index] = $record;
    }

    foreach ($data['videos'] as $index => $record) {
        if (!is_array($record)) {
            admin_json(400, ['error' => 'Every video must be an object.']);
        }
        foreach (['title', 'shortTitle', 'channel'] as $field) {
            $record[$field] = admin_string($record[$field] ?? null, "Video {$index} {$field}", 240);
        }
        $record['src'] = admin_site_asset($record['src'] ?? null, '/videos/', ['mp4'], 'Video source');
        $record['poster'] = admin_site_asset($record['poster'] ?? null, '/images/', ['png', 'jpg', 'jpeg', 'webp'], 'Video poster');
        if (!isset($record['software']) || !is_array($record['software']) || !array_is_list($record['software']) || count($record['software']) > 20) {
            admin_json(400, ['error' => 'Video software must be a list of up to 20 items.']);
        }
        foreach ($record['software'] as $softwareIndex => $software) {
            $record['software'][$softwareIndex] = admin_string($software, 'Video software', 80);
        }
        $data['videos'][$index] = $record;
    }
    return $data;
}

function admin_github_settings(): array
{
    $token = getenv('GITHUB_CONTENTS_TOKEN') ?: '';
    if ($token === '') {
        admin_json(503, ['error' => 'GitHub saving is not configured. Set GITHUB_CONTENTS_TOKEN on the server.']);
    }
    $repository = getenv('GITHUB_REPOSITORY') ?: 'dasMeds/dasmedsPortfolio.github.io';
    if (!preg_match('/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/', $repository)) {
        admin_json(500, ['error' => 'GITHUB_REPOSITORY must use owner/repository format.']);
    }
    $branch = getenv('GITHUB_BRANCH') ?: 'main';
    if (preg_match('/[\r\n?#]/', $branch) || $branch === '') {
        admin_json(500, ['error' => 'GITHUB_BRANCH is invalid.']);
    }
    return [$token, $repository, $branch];
}

function admin_github_request(
    string $method,
    string $url,
    string $token,
    ?array $payload = null,
    bool $allowNotFound = false
): array
{
    if (!function_exists('curl_init')) {
        admin_json(503, ['error' => 'GitHub saving requires the PHP cURL extension.']);
    }
    $handle = curl_init($url);
    if ($handle === false) {
        error_log('Unable to initialize the GitHub admin request.');
        admin_json(502, ['error' => 'GitHub could not be reached.']);
    }
    $headers = [
        'Accept: application/vnd.github+json',
        'Authorization: Bearer ' . $token,
        'X-GitHub-Api-Version: 2022-11-28',
        'User-Agent: dasmeds-portfolio-admin',
        'Content-Type: application/json',
    ];
    $options = [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_HTTPHEADER => $headers,
    ];
    if ($payload !== null) {
        $options[CURLOPT_POSTFIELDS] = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    }
    if (!curl_setopt_array($handle, $options)) {
        curl_close($handle);
        error_log('Unable to configure the GitHub admin request.');
        admin_json(502, ['error' => 'GitHub could not be reached.']);
    }
    $response = curl_exec($handle);
    $status = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
    $error = curl_error($handle);
    curl_close($handle);
    if ($response === false) {
        error_log('GitHub admin request failed: ' . $error);
        admin_json(502, ['error' => 'GitHub could not be reached.']);
    }
    try {
        $decoded = json_decode($response, true, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        error_log('GitHub returned an invalid response to the admin editor.');
        admin_json(502, ['error' => 'GitHub returned an unexpected response.']);
    }
    if ($status === 404 && $allowNotFound) {
        return [$status, $decoded];
    }
    if ($status < 200 || $status >= 300) {
        error_log('GitHub rejected an admin request with HTTP ' . $status . '.');
        $message = $status === 409 || $status === 422
            ? 'GitHub detected a conflicting update. Reload the editor and try again.'
            : 'GitHub could not save this update (HTTP ' . $status . ').';
        admin_json($status === 409 || $status === 422 ? 409 : 502, ['error' => $message]);
    }
    return [$status, $decoded];
}

function admin_commit_file(string $path, string $contents, string $message): void
{
    [$token, $repository, $branch] = admin_github_settings();
    $apiRoot = 'https://api.github.com/repos/' . $repository . '/contents/';
    $encodedPath = implode('/', array_map('rawurlencode', explode('/', $path)));
    $url = $apiRoot . $encodedPath . '?ref=' . rawurlencode($branch);
    [$readStatus, $current] = admin_github_request('GET', $url, $token, null, true);
    $payload = [
        'message' => $message,
        'content' => base64_encode($contents),
        'branch' => $branch,
    ];
    if ($readStatus === 200 && is_string($current['sha'] ?? null)) {
        $payload['sha'] = $current['sha'];
    }
    admin_github_request('PUT', $apiRoot . $encodedPath, $token, $payload);
}

function admin_client_ip(): string
{
    $forwardedFor = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    $forwardedAddresses = $forwardedFor !== '' ? explode(',', $forwardedFor) : [];
    $ip = trim((string) end($forwardedAddresses));
    if ($ip === '') {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : 'unknown';
}

admin_same_origin();
$GLOBALS['admin_session'] = admin_read_session();
$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($requestPath === '/api/admin/session' && $method === 'GET') {
    $configured = (getenv('ADMIN_USERNAME') ?: '') !== ''
        && (getenv('ADMIN_PASSWORD') ?: '') !== ''
        && strlen(getenv('ADMIN_SESSION_SECRET') ?: '') >= 32;
    admin_json(200, [
        'authenticated' => $GLOBALS['admin_session'] !== null,
        'configured' => $configured,
        'csrfToken' => $GLOBALS['admin_session']['csrf'] ?? '',
    ]);
}

if ($requestPath === '/api/admin/login' && $method === 'POST') {
    $body = admin_read_json();
    $configuredUsername = getenv('ADMIN_USERNAME') ?: '';
    $configuredPassword = getenv('ADMIN_PASSWORD') ?: '';
    if ($configuredUsername === '' || $configuredPassword === '') {
        admin_json(503, ['error' => 'Admin sign-in is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD on the server.']);
    }
    if (strlen(getenv('ADMIN_SESSION_SECRET') ?: '') < 32) {
        admin_json(503, ['error' => 'Admin sign-in requires ADMIN_SESSION_SECRET with at least 32 random characters.']);
    }
    $attempts = 0;
    if (function_exists('apcu_fetch') && function_exists('apcu_store') && apcu_enabled()) {
        $key = 'admin-login:' . hash('sha256', admin_client_ip());
        $attempts = (int) apcu_fetch($key);
        if ($attempts >= 8) {
            admin_json(429, ['error' => 'Too many sign-in attempts. Try again later.']);
        }
    }
    $username = is_string($body['username'] ?? null) ? $body['username'] : '';
    $password = is_string($body['password'] ?? null) ? $body['password'] : '';
    if (
        strlen($username) > 200
        || strlen($password) > 1024
        || !hash_equals($configuredUsername, $username)
        || !hash_equals($configuredPassword, $password)
    ) {
        if (function_exists('apcu_store') && function_exists('apcu_enabled') && apcu_enabled()) {
            apcu_store($key, $attempts + 1, 900);
        }
        admin_json(401, ['error' => 'The username or password is incorrect.']);
    }
    if (function_exists('apcu_delete') && isset($key)) {
        apcu_delete($key);
    }
    $expires = time() + 8 * 60 * 60;
    $claims = [
        'username' => $configuredUsername,
        'auth' => hash_hmac(
            'sha256',
            $configuredUsername . "\0" . $configuredPassword,
            admin_cookie_secret()
        ),
        'csrf' => bin2hex(random_bytes(32)),
        'expires' => $expires,
    ];
    admin_set_session_cookie(admin_signed_cookie($claims), $expires);
    $GLOBALS['admin_session'] = $claims;
    admin_json(200, ['authenticated' => true, 'csrfToken' => $claims['csrf']]);
}

if ($requestPath === '/api/admin/logout' && $method === 'POST') {
    admin_require_csrf();
    admin_clear_session_cookie();
    $GLOBALS['admin_session'] = null;
    admin_json(200, ['authenticated' => false]);
}

if ($requestPath === '/api/admin/portfolio' && $method === 'GET') {
    admin_require_login();
    admin_json(200, ['portfolio' => require __DIR__ . '/../data/portfolio-data.php']);
}

if ($requestPath === '/api/admin/portfolio' && $method === 'PUT') {
    admin_require_csrf();
    $body = admin_read_json();
    if (!isset($body['portfolio']) || !is_array($body['portfolio'])) {
        admin_json(400, ['error' => 'The portfolio content is missing.']);
    }
    $portfolio = admin_validate_records($body['portfolio']);
    $phpSource = "<?php\n\ndeclare(strict_types=1);\n\nreturn " . var_export($portfolio, true) . ";\n";
    admin_commit_file('data/portfolio-data.php', $phpSource, 'Update portfolio content from admin editor');
    admin_json(200, ['message' => 'Changes were committed. The live site updates after the deployment completes.']);
}

if ($requestPath === '/api/admin/upload' && $method === 'POST') {
    admin_require_csrf();
    $body = admin_read_json();
    $fileData = is_string($body['content'] ?? null) ? base64_decode($body['content'], true) : false;
    if (!is_string($fileData) || $fileData === '' || strlen($fileData) > 4 * 1024 * 1024) {
        admin_json(400, ['error' => 'Choose a non-empty PDF or image smaller than 4 MB.']);
    }
    if (!class_exists('finfo')) {
        admin_json(503, ['error' => 'File validation is not available on this server.']);
    }
    $fileInfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $fileInfo->buffer($fileData);
    $mimeTypes = [
        'application/pdf' => ['documents', 'pdf'],
        'image/png' => ['images', 'png'],
        'image/jpeg' => ['images', 'jpg'],
        'image/webp' => ['images', 'webp'],
    ];
    $uploadKind = $body['kind'] ?? '';
    if (!is_string($mime) || !isset($mimeTypes[$mime]) || $mimeTypes[$mime][0] !== $uploadKind) {
        admin_json(400, ['error' => 'Upload a PDF for documents or a PNG, JPEG, or WebP image for artwork.']);
    }
    $originalName = is_string($body['name'] ?? null) ? basename($body['name']) : '';
    $baseName = pathinfo($originalName, PATHINFO_FILENAME);
    $safeName = strtolower(trim((string) preg_replace('/[^A-Za-z0-9]+/', '-', $baseName), '-'));
    if ($safeName === '') {
        $safeName = 'portfolio-file';
    }
    $extension = $mimeTypes[$mime][1];
    $filename = substr($safeName, 0, 60) . '-' . bin2hex(random_bytes(4)) . '.' . $extension;
    $path = 'public/' . $mimeTypes[$mime][0] . '/' . $filename;
    admin_commit_file($path, $fileData, 'Upload portfolio asset: ' . $filename);
    $publicPath = '/' . $mimeTypes[$mime][0] . '/' . $filename;
    admin_json(201, ['path' => $publicPath, 'message' => 'File committed. It becomes available after deployment.']);
}

admin_json(404, ['error' => 'Admin endpoint not found.']);
