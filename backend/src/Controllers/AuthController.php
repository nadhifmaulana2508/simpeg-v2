<?php
declare(strict_types=1);

namespace Simpeg\Controllers;

use Simpeg\Database\Connection;
use Simpeg\Http\Request;
use Simpeg\Http\Response;
use Throwable;

final class AuthController
{
    public function login(Request $request): void
    {
        $input = trim((string) $request->input('username', $request->input('id_user', '')));
        $password = (string) $request->input('password', '');
        if ($input === '' || $password === '') {
            Response::error('Username dan password wajib diisi.', 422);
        }

        try {
            $connection = Connection::make(dirname(__DIR__, 3));
            $statement = $connection->prepare(
                'SELECT id_user, nama_user, hak_akses, status_aktif, id_pegawai, password
                 FROM tb_user WHERE id_user = ? OR id_pegawai = ? LIMIT 1'
            );
            if (!$statement) {
                Response::error('Query autentikasi tidak dapat disiapkan.', 500);
            }
            $statement->bind_param('ss', $input, $input);
            $statement->execute();
            $row = $statement->get_result()->fetch_assoc() ?: null;
            $statement->close();

            if ($row === null || !$this->passwordMatches($password, (string) ($row['password'] ?? ''))) {
                Response::error('Kredensial login tidak valid.', 401);
            }
            if ((string) ($row['status_aktif'] ?? 'Y') === 'N') {
                Response::error('Akun tidak aktif.', 403);
            }

            if (session_status() !== PHP_SESSION_ACTIVE) {
                session_start();
            }
            session_regenerate_id(true);
            $_SESSION['id_user'] = $row['id_user'];
            $_SESSION['nama_user'] = $row['nama_user'];
            $_SESSION['hak_akses'] = strtolower((string) $row['hak_akses']);
            $_SESSION['id_pegawai'] = $row['id_pegawai'];

            Response::success($this->publicUser($row));
        } catch (Throwable $exception) {
            error_log($exception->getMessage());
            Response::error('Autentikasi API gagal.', 500);
        }
    }

    public function me(): void
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }
        if (empty($_SESSION['id_user'])) {
            Response::error('Sesi login tidak ditemukan.', 401);
        }

        Response::success(array(
            'id_user' => $_SESSION['id_user'],
            'nama_user' => $_SESSION['nama_user'] ?? '',
            'hak_akses' => $_SESSION['hak_akses'] ?? '',
            'id_pegawai' => $_SESSION['id_pegawai'] ?? null,
        ));
    }

    public function logout(): void
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }
        $_SESSION = array();
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], (bool) $params['secure'], (bool) $params['httponly']);
        }
        session_destroy();
        Response::success(array('logged_out' => true));
    }

    private function passwordMatches(string $password, string $stored): bool
    {
        if ($stored === '') {
            return false;
        }
        return password_verify($password, $stored) || hash_equals(strtolower($stored), md5($password));
    }

    /** @param array<string, mixed> $row @return array<string, mixed> */
    private function publicUser(array $row): array
    {
        return array(
            'id_user' => $row['id_user'],
            'nama_user' => $row['nama_user'],
            'hak_akses' => strtolower((string) $row['hak_akses']),
            'id_pegawai' => $row['id_pegawai'],
        );
    }
}
