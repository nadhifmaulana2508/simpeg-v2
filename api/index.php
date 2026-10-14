<?php

// Keep the compatibility entrypoint readable by the legacy PHP runtime so it
// can return a useful JSON diagnostic instead of a parse-error HTML page.
if (defined('PHP_VERSION_ID') && PHP_VERSION_ID < 80200) {
    http_response_code(503);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array(
        'success' => false,
        'message' => 'REST API v3 membutuhkan PHP 8.2 atau lebih baru.',
        'data' => array(
            'runtime' => PHP_VERSION,
            'required' => '8.2+',
            'hint' => 'Jalankan project melalui XAMPP PHP 8.2 atau PHP built-in server 8.2.',
        ),
    ));
    exit;
}

// Compatibility entry point. All new API code lives under backend/.
require dirname(__DIR__) . '/backend/public/index.php';
