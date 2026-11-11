<?php
declare(strict_types=1);

function contact_json(int $status, array $payload, array $headers = []): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    foreach ($headers as $name => $value) {
        header($name . ': ' . $value);
    }
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    contact_json(405, ['error' => 'Method not allowed.'], ['Allow' => 'POST']);
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
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
        contact_json(403, ['error' => 'Forbidden.']);
    }
}

$rawBody = file_get_contents('php://input') ?: '';
try {
    $body = json_decode($rawBody, false, 512, JSON_THROW_ON_ERROR);
} catch (JsonException) {
    contact_json(400, ['error' => 'A valid JSON request body is required.']);
}
if (!($body instanceof stdClass)) {
    contact_json(400, ['error' => 'A valid JSON request body is required.']);
}

if (!function_exists('mb_strlen') || !function_exists('curl_init')) {
    error_log('Contact endpoint requires the mbstring and cURL extensions.');
    contact_json(500, ['error' => 'Contact form is not configured.']);
}

$name = is_string($body->name ?? null) ? trim($body->name) : '';
$email = is_string($body->email ?? null) ? trim($body->email) : '';
$message = is_string($body->message ?? null) ? trim($body->message) : '';

if (
    $name === '' || mb_strlen($name) > 100
    || !preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $email) || mb_strlen($email) > 254
    || $message === '' || mb_strlen($message) > 5000
) {
    contact_json(400, ['error' => 'Enter a valid name, email, and message.']);
}

$apiKey = getenv('RESEND_API_KEY') ?: '';
$recipient = getenv('CONTACT_EMAIL') ?: '';
if ($apiKey === '' || $recipient === '') {
    error_log('Contact endpoint is missing RESEND_API_KEY or CONTACT_EMAIL.');
    contact_json(500, ['error' => 'Contact form is not configured.']);
}

// Best-effort rate limit, per container instance only.
if (
    function_exists('apcu_enabled')
    && apcu_enabled()
    && function_exists('apcu_fetch')
    && function_exists('apcu_store')
) {
    $forwardedFor = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    $clientAddress = $forwardedFor !== ''
        ? trim(explode(',', $forwardedFor)[0])
        : ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $key = 'contact:' . ($clientAddress !== '' ? $clientAddress : 'unknown');
    $count = (int) apcu_fetch($key);
    if ($count >= 5) {
        contact_json(429, ['error' => 'Too many messages. Try again later.']);
    }
    apcu_store($key, $count + 1, 600);
}

$ch = curl_init('https://api.resend.com/emails');
if ($ch === false) {
    error_log('Unable to initialize the Resend request.');
    contact_json(502, ['error' => 'The message could not be delivered.']);
}

$configured = curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'from' => getenv('CONTACT_FROM') ?: 'Portfolio Contact <onboarding@resend.dev>',
        'to' => [$recipient],
        'reply_to' => $email,
        'subject' => 'New portfolio contact message',
        'text' => "Name: {$name}\nEmail: {$email}\n\n{$message}",
    ]),
]);
if (!$configured) {
    curl_close($ch);
    error_log('Unable to configure the Resend request.');
    contact_json(502, ['error' => 'The message could not be delivered.']);
}

$response = curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
curl_close($ch);

if ($response === false || $status < 200 || $status >= 300) {
    error_log('Resend rejected the contact message: HTTP ' . $status);
    contact_json(502, ['error' => 'The message could not be delivered.']);
}

contact_json(200, ['message' => 'Message sent.']);
