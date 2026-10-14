<?php
declare(strict_types=1);

namespace Simpeg\Http;

final class Response
{
    /** @param array<string, mixed> $payload */
    public static function json(array $payload, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        self::corsHeaders();

        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    /** @param mixed $data @param array<string, mixed> $meta */
    public static function success($data, array $meta = array(), int $status = 200): void
    {
        $payload = array(
            'success' => true,
            'data' => $data,
        );

        if ($meta !== array()) {
            $payload['meta'] = $meta;
        }

        self::json($payload, $status);
    }

    /** @param array<string, mixed> $errors */
    public static function error(string $message, int $status, array $errors = array()): void
    {
        $payload = array(
            'success' => false,
            'message' => $message,
        );

        if ($errors !== array()) {
            $payload['errors'] = $errors;
        }

        self::json($payload, $status);
    }

    public static function options(): void
    {
        self::json(array('success' => true, 'data' => array()), 200);
    }

    private static function corsHeaders(): void
    {
        $origin = getenv('SIMPEG_CORS_ORIGIN');
        header('Access-Control-Allow-Origin: ' . ($origin !== false && $origin !== '' ? $origin : '*'));
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    }
}
