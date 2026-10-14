<?php
declare(strict_types=1);

namespace Simpeg\Controllers;

use Simpeg\Http\Request;
use Simpeg\Http\Response;
use Simpeg\Repositories\ResourceRepository;
use Simpeg\Resources\ResourceRegistry;
use Throwable;

final class ResourceController
{
    public function index(Request $request, array $params): void
    {
        $definition = ResourceRegistry::find($params['resource'] ?? '');
        if ($definition === null) {
            Response::error('Resource API tidak terdaftar.', 404);
        }

        try {
            $result = (new ResourceRepository($this->connection(), $definition))->paginate(
                $request->queryInt('page', 1, 1, PHP_INT_MAX),
                $request->queryInt('limit', 20, 1, 100),
                $request->queryString('q')
            );
            Response::success($result['items'], array(
                'resource' => $definition['key'],
                'page' => $request->queryInt('page', 1, 1, PHP_INT_MAX),
                'limit' => $request->queryInt('limit', 20, 1, 100),
                'total' => $result['total'],
            ));
        } catch (Throwable $exception) {
            error_log($exception->getMessage());
            Response::error('Gagal mengambil resource API.', 500);
        }
    }

    public function show(Request $request, array $params): void
    {
        $definition = ResourceRegistry::find($params['resource'] ?? '');
        if ($definition === null) {
            Response::error('Resource API tidak terdaftar.', 404);
        }

        try {
            $row = (new ResourceRepository($this->connection(), $definition))->find((string) ($params['id'] ?? ''));
            if ($row === null) {
                Response::error('Data resource tidak ditemukan.', 404);
            }
            Response::success($row, array('resource' => $definition['key']));
        } catch (Throwable $exception) {
            error_log($exception->getMessage());
            Response::error('Gagal mengambil detail resource API.', 500);
        }
    }

    public function store(Request $request, array $params): void
    {
        $definition = $this->definition($params);
        $this->authorizeMutation($request, $definition);
        try {
            $row = (new ResourceRepository($this->connection(), $definition))->create($request->body());
            Response::success($row, array('resource' => $definition['key']), 201);
        } catch (Throwable $exception) {
            error_log($exception->getMessage());
            Response::error('Gagal membuat data resource.', 500);
        }
    }

    public function update(Request $request, array $params): void
    {
        $definition = $this->definition($params);
        $this->authorizeMutation($request, $definition);
        try {
            $row = (new ResourceRepository($this->connection(), $definition))->update(
                (string) ($params['id'] ?? ''),
                $request->body()
            );
            if ($row === null) {
                Response::error('Data resource tidak ditemukan.', 404);
            }
            Response::success($row, array('resource' => $definition['key']));
        } catch (Throwable $exception) {
            error_log($exception->getMessage());
            Response::error('Gagal mengubah data resource.', 500);
        }
    }

    public function destroy(Request $request, array $params): void
    {
        Response::error('Delete langsung dinonaktifkan. Fitur trash dan restore belum tersedia.', 405);
    }

    /** @param array<string, string> $params @return array<string, mixed> */
    private function definition(array $params): array
    {
        $definition = ResourceRegistry::find($params['resource'] ?? '');
        if ($definition === null) {
            Response::error('Resource API tidak terdaftar.', 404);
        }
        return $definition;
    }

    /** @param array<string, mixed> $definition */
    private function authorizeMutation(Request $request, array $definition): void
    {
        if ($definition['read_only']) {
            Response::error('Resource ini hanya dapat dibaca.', 405);
        }
        if (getenv('SIMPEG_ENABLE_MUTATIONS') !== 'true') {
            Response::error('Mutation API belum diaktifkan pada environment ini.', 403);
        }

        $configuredToken = getenv('SIMPEG_API_TOKEN');
        $authorization = $request->header('Authorization');
        $token = preg_replace('/^Bearer\s+/i', '', $authorization ?? '');
        if ($configuredToken === false || $configuredToken === '' || !is_string($token) || !hash_equals($configuredToken, $token)) {
            Response::error('Token API tidak valid.', 401);
        }
    }

    private function connection(): \mysqli
    {
        return \Simpeg\Database\Connection::make(dirname(__DIR__, 3));
    }
}
