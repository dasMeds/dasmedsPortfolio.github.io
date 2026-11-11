<?php
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$filePath = __DIR__ . $path;

if ($path !== '/' && is_file($filePath)) {
    return false;
}

require __DIR__ . '/index.php';
