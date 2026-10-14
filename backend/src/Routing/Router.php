<?php
declare(strict_types=1);

namespace Simpeg\Routing;

use Simpeg\Http\Request;
use Simpeg\Http\Response;

final class Router
{
    /** @var array<int, array{method: string, pattern: string, regex: string, params: array<int, string>, handler: callable}> */
    private array $routes = array();

    public function get(string $pattern, callable $handler): self
    {
        return $this->add('GET', $pattern, $handler);
    }

    public function post(string $pattern, callable $handler): self
    {
        return $this->add('POST', $pattern, $handler);
    }

    public function put(string $pattern, callable $handler): self
    {
        return $this->add('PUT', $pattern, $handler);
    }

    public function patch(string $pattern, callable $handler): self
    {
        return $this->add('PATCH', $pattern, $handler);
    }

    public function delete(string $pattern, callable $handler): self
    {
        return $this->add('DELETE', $pattern, $handler);
    }

    public function add(string $method, string $pattern, callable $handler): self
    {
        $params = array();
        $regex = preg_replace_callback('/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/', static function (array $match) use (&$params): string {
            $params[] = $match[1];
            return '([^/]+)';
        }, trim($pattern, '/'));

        $this->routes[] = array(
            'method' => strtoupper($method),
            'pattern' => $pattern,
            'regex' => '#^/' . $regex . '/?$#',
            'params' => $params,
            'handler' => $handler,
        );

        return $this;
    }

    public function dispatch(Request $request): void
    {
        $path = $request->path();
        $methodMatched = false;

        foreach ($this->routes as $route) {
            if (!preg_match($route['regex'], $path, $matches)) {
                continue;
            }

            $methodMatched = true;
            if ($route['method'] !== $request->method()) {
                continue;
            }

            $params = array();
            foreach ($route['params'] as $index => $name) {
                $params[$name] = rawurldecode((string) ($matches[$index + 1] ?? ''));
            }

            call_user_func($route['handler'], $request, $params);
            return;
        }

        if ($methodMatched) {
            Response::error('Method tidak diizinkan.', 405);
        }

        Response::error('Endpoint API tidak ditemukan.', 404, array('path' => $path));
    }
}
