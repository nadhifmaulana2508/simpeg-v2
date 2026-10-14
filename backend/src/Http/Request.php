<?php
declare(strict_types=1);

namespace Simpeg\Http;

final class Request
{
    /** @var array<string, mixed> */
    private array $query;

    /** @var array<string, mixed>|null */
    private ?array $body = null;

    public function __construct()
    {
        $this->query = is_array($_GET ?? null) ? $_GET : array();
    }

    public function method(): string
    {
        return strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
    }

    /**
     * Returns the path relative to /api. The rewrite rule passes it through
     * ?path=..., while direct requests are also supported for local testing.
     */
    public function path(): string
    {
        if (isset($this->query['path'])) {
            return '/' . trim((string) $this->query['path'], '/');
        }

        $uri = (string) ($_SERVER['REQUEST_URI'] ?? '');
        $uriPath = (string) parse_url($uri, PHP_URL_PATH);
        $apiPosition = strpos($uriPath, '/api');

        if ($apiPosition === false) {
            return '/';
        }

        return '/' . trim(substr($uriPath, $apiPosition + 4), '/');
    }

    public function queryString(string $key, string $default = ''): string
    {
        $value = $this->query[$key] ?? $default;
        return is_scalar($value) ? trim((string) $value) : $default;
    }

    public function queryInt(string $key, int $default, int $min, int $max): int
    {
        $value = filter_var($this->query[$key] ?? null, FILTER_VALIDATE_INT);
        if ($value === false || $value === null) {
            return $default;
        }

        return max($min, min($max, (int) $value));
    }

    /** @return array<string, mixed> */
    public function body(): array
    {
        if ($this->body !== null) {
            return $this->body;
        }

        $contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
        if (strpos($contentType, 'application/json') !== false) {
            $decoded = json_decode((string) file_get_contents('php://input'), true);
            $this->body = is_array($decoded) ? $decoded : array();
            return $this->body;
        }

        $this->body = is_array($_POST ?? null) ? $_POST : array();
        return $this->body;
    }

    public function input(string $key, mixed $default = null): mixed
    {
        return $this->body()[$key] ?? $default;
    }

    public function header(string $name, string $default = ''): string
    {
        $serverKey = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
        $value = $_SERVER[$serverKey] ?? ($name === 'Content-Type' ? ($_SERVER['CONTENT_TYPE'] ?? $default) : $default);
        return is_scalar($value) ? trim((string) $value) : $default;
    }
}
