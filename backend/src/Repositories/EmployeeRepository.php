<?php
declare(strict_types=1);

namespace Simpeg\Repositories;

use mysqli;
use RuntimeException;

final class EmployeeRepository
{
    public function __construct(private mysqli $connection)
    {
    }

    /** @return array{items: array<int, array<string, mixed>>, total: int} */
    public function paginate(int $page, int $limit, string $keyword = '', string $unit = ''): array
    {
        $where = array('p.status_aktif = ?');
        $types = 's';
        $params = array('Y');

        if ($keyword !== '') {
            $where[] = '(p.id_peg LIKE ? OR p.nip LIKE ? OR p.nama LIKE ?)';
            $keywordLike = '%' . $keyword . '%';
            $types .= 'sss';
            $params[] = $keywordLike;
            $params[] = $keywordLike;
            $params[] = $keywordLike;
        }

        if ($unit !== '') {
            $where[] = 'j.unit_kerja = ?';
            $types .= 's';
            $params[] = $unit;
        }

        $whereSql = implode(' AND ', $where);
        $count = $this->fetchOne(
            'SELECT COUNT(DISTINCT p.id_peg) AS total
             FROM tb_pegawai p
             LEFT JOIN tb_jabatan j ON j.id_peg = p.id_peg AND LOWER(j.status_jab) = \'aktif\'
             WHERE ' . $whereSql,
            $types,
            $params
        );

        $offset = ($page - 1) * $limit;
        $dataParams = $params;
        $dataParams[] = $limit;
        $dataParams[] = $offset;

        $items = $this->fetchAll(
            'SELECT
                p.id_peg,
                p.nip,
                p.nama,
                p.jk,
                p.email,
                p.telp,
                p.status_kepeg,
                p.status_aktif,
                p.foto,
                j.jabatan,
                j.unit_kerja,
                j.tmt_jabatan
             FROM tb_pegawai p
             LEFT JOIN tb_jabatan j ON j.id_peg = p.id_peg AND LOWER(j.status_jab) = \'aktif\'
             WHERE ' . $whereSql . '
             GROUP BY p.id_peg, p.nip, p.nama, p.jk, p.email, p.telp,
                      p.status_kepeg, p.status_aktif, p.foto,
                      j.jabatan, j.unit_kerja, j.tmt_jabatan
             ORDER BY p.nama ASC
             LIMIT ? OFFSET ?',
            $types . 'ii',
            $dataParams
        );

        return array(
            'items' => $items,
            'total' => (int) ($count['total'] ?? 0),
        );
    }

    /** @return array<string, mixed>|null */
    public function find(string $id): ?array
    {
        return $this->fetchOne(
            'SELECT p.*, j.jabatan, j.unit_kerja, j.tmt_jabatan
             FROM tb_pegawai p
             LEFT JOIN tb_jabatan j ON j.id_peg = p.id_peg AND LOWER(j.status_jab) = \'aktif\'
             WHERE p.id_peg = ?
             ORDER BY j.tmt_jabatan DESC
             LIMIT 1',
            's',
            array($id)
        );
    }

    /** @return array<string, mixed> */
    public function family(string $id): array
    {
        $employee = $this->fetchOne(
            'SELECT id_peg, nama, nip FROM tb_pegawai WHERE id_peg = ? LIMIT 1',
            's',
            array($id)
        );

        if ($employee === null) {
            return array();
        }

        return array(
            'pegawai' => $employee,
            'pasangan' => $this->fetchAll(
                'SELECT * FROM tb_suamiistri WHERE id_peg = ? ORDER BY nama ASC',
                's',
                array($id)
            ),
            'anak' => $this->fetchAll(
                'SELECT * FROM tb_anak WHERE id_peg = ? ORDER BY anak_ke ASC, nama ASC',
                's',
                array($id)
            ),
            'ortu' => $this->fetchAll(
                'SELECT * FROM tb_ortu WHERE id_peg = ? ORDER BY status_hub ASC, nama ASC',
                's',
                array($id)
            ),
        );
    }

    /** @param array<int, scalar> $params @return array<int, array<string, mixed>> */
    private function fetchAll(string $sql, string $types, array $params): array
    {
        $statement = $this->prepare($sql);
        $this->bind($statement, $types, $params);
        $this->execute($statement);

        $result = $statement->get_result();
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        $statement->close();

        return $rows;
    }

    /** @param array<int, scalar> $params @return array<string, mixed>|null */
    private function fetchOne(string $sql, string $types, array $params): ?array
    {
        $rows = $this->fetchAll($sql, $types, $params);
        return $rows[0] ?? null;
    }

    private function prepare(string $sql): \mysqli_stmt
    {
        $statement = $this->connection->prepare($sql);
        if (!$statement) {
            throw new RuntimeException('Query database tidak dapat disiapkan.');
        }

        return $statement;
    }

    /** @param array<int, scalar> $params */
    private function bind(\mysqli_stmt $statement, string $types, array $params): void
    {
        if ($params === array()) {
            return;
        }

        $references = array($types);
        foreach ($params as $index => $value) {
            $references[] = &$params[$index];
        }

        if (!call_user_func_array(array($statement, 'bind_param'), $references)) {
            throw new RuntimeException('Parameter query database tidak valid.');
        }
    }

    private function execute(\mysqli_stmt $statement): void
    {
        if (!$statement->execute()) {
            $statement->close();
            throw new RuntimeException('Query database gagal dijalankan.');
        }
    }
}
