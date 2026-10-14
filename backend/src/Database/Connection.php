<?php
declare(strict_types=1);

namespace Simpeg\Database;

use mysqli;
use RuntimeException;

final class Connection
{
    public static function make(string $projectRoot): mysqli
    {
        $host = getenv('SIMPEG_DB_HOST');
        $user = getenv('SIMPEG_DB_USER');
        $password = getenv('SIMPEG_DB_PASSWORD');
        $database = getenv('SIMPEG_DB_NAME');
        $port = getenv('SIMPEG_DB_PORT');

        if ($host !== false && $host !== '' && $user !== false && $database !== false) {
            mysqli_report(MYSQLI_REPORT_OFF);
            $connection = @mysqli_connect(
                $host,
                $user,
                $password === false ? '' : $password,
                $database,
                $port === false || $port === '' ? 3306 : (int) $port
            );
        } else {
            // Transitional fallback: existing app pages still own the legacy
            // connection until their queries are moved to repositories.
            $legacyFile = $projectRoot . DIRECTORY_SEPARATOR . 'dist' . DIRECTORY_SEPARATOR . 'koneksi.php';
            if (!is_file($legacyFile)) {
                throw new RuntimeException('Konfigurasi koneksi database tidak ditemukan.');
            }

            // The legacy file creates `$conn` in the scope where it is
            // included. Because this include happens inside this method, the
            // connection must be read from the local include scope instead of
            // the global scope.
            require_once $legacyFile;
            $connection = isset($conn) ? $conn : null;
        }

        if (!$connection instanceof mysqli) {
            throw new RuntimeException('Koneksi database gagal dibuat.');
        }

        if (!mysqli_set_charset($connection, 'utf8mb4')) {
            throw new RuntimeException('Charset database tidak dapat diatur.');
        }

        return $connection;
    }
}
