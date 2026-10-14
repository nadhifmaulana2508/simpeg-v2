<?php
declare(strict_types=1);

namespace Simpeg\Controllers;

use Simpeg\Http\Request;
use Simpeg\Http\Response;
use Simpeg\Repositories\EmployeeRepository;
use Throwable;

final class EmployeeController
{
    public function __construct(private EmployeeRepository $employees)
    {
    }

    /** @param array<string, string> $params */
    public function index(Request $request, array $params): void
    {
        try {
            $page = $request->queryInt('page', 1, 1, PHP_INT_MAX);
            $limit = $request->queryInt('limit', 20, 1, 100);
            $result = $this->employees->paginate(
                $page,
                $limit,
                $request->queryString('q'),
                $request->queryString('unit_kerja')
            );

            Response::success($result['items'], array(
                'page' => $page,
                'limit' => $limit,
                'total' => $result['total'],
            ));
        } catch (Throwable $exception) {
            error_log($exception->getMessage());
            Response::error('Gagal mengambil data pegawai.', 500);
        }
    }

    /** @param array<string, string> $params */
    public function show(Request $request, array $params): void
    {
        try {
            $employee = $this->employees->find($params['id_peg'] ?? '');
            if ($employee === null) {
                Response::error('Data pegawai tidak ditemukan.', 404);
            }

            Response::success($employee);
        } catch (Throwable $exception) {
            error_log($exception->getMessage());
            Response::error('Gagal mengambil detail pegawai.', 500);
        }
    }

    /** @param array<string, string> $params */
    public function family(Request $request, array $params): void
    {
        try {
            $family = $this->employees->family($params['id_peg'] ?? '');
            if ($family === array()) {
                Response::error('Data pegawai tidak ditemukan.', 404);
            }

            Response::success($family);
        } catch (Throwable $exception) {
            error_log($exception->getMessage());
            Response::error('Gagal mengambil data keluarga.', 500);
        }
    }
}
