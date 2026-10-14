<?php
declare(strict_types=1);

namespace Simpeg\Catalog;

use Simpeg\Resources\ResourceRegistry;

final class ApiCatalog
{
    /** @return array<string, mixed> */
    public static function payload(): array
    {
        $modules = array(
            array(
                'key' => 'system',
                'label' => 'System',
                'group' => 'Platform',
                'legacy_path' => null,
                'status' => 'ready',
                'description' => 'Endpoint dasar untuk health check dan discovery API.',
                'endpoints' => array(
                    array('method' => 'GET', 'path' => '/', 'label' => 'API info', 'testable' => true, 'sample' => '/'),
                    array('method' => 'GET', 'path' => '/health', 'label' => 'Health check', 'testable' => true, 'sample' => '/health'),
                    array('method' => 'GET', 'path' => '/catalog', 'label' => 'API catalog', 'testable' => true, 'sample' => '/catalog'),
                ),
            ),
            array(
                'key' => 'pegawai',
                'label' => 'Data Pegawai',
                'group' => 'Master Data',
                'legacy_path' => 'pages/pegawai',
                'status' => 'partial',
                'description' => 'List, detail, dan keluarga pegawai sudah tersedia dalam tahap read-only.',
                'endpoints' => array(
                    array('method' => 'GET', 'path' => '/pegawai', 'label' => 'List pegawai', 'testable' => true, 'sample' => '/pegawai?limit=5'),
                    array('method' => 'GET', 'path' => '/pegawai/{id_peg}', 'label' => 'Detail pegawai', 'testable' => false, 'sample' => '/pegawai/{id_peg}'),
                    array('method' => 'GET', 'path' => '/pegawai/{id_peg}/keluarga', 'label' => 'Keluarga pegawai', 'testable' => false, 'sample' => '/pegawai/{id_peg}/keluarga'),
                ),
            ),
            array('key' => 'kantor', 'label' => 'Kantor', 'group' => 'Master Data', 'legacy_path' => 'pages/kantor', 'status' => 'planned', 'description' => 'Master kantor dan detail pegawai berdasarkan kantor.', 'endpoints' => array()),
            array('key' => 'user', 'label' => 'User & Akses', 'group' => 'Security', 'legacy_path' => 'pages/user', 'status' => 'planned', 'description' => 'Manajemen user, role, dan status akses aplikasi.', 'endpoints' => array()),
            array('key' => 'login', 'label' => 'Autentikasi', 'group' => 'Security', 'legacy_path' => 'pages/login', 'status' => 'planned', 'description' => 'Login, logout, session, dan identitas pengguna API.', 'endpoints' => array()),
            array('key' => 'otorisasi', 'label' => 'Otorisasi', 'group' => 'Security', 'legacy_path' => 'pages/otorisasi', 'status' => 'planned', 'description' => 'Approval dan proses otorisasi perubahan data.', 'endpoints' => array()),
            array('key' => 'config', 'label' => 'Konfigurasi', 'group' => 'System', 'legacy_path' => 'pages/config', 'status' => 'planned', 'description' => 'Konfigurasi aplikasi, identitas, logo, dan URL sistem.', 'endpoints' => array()),
            array('key' => 'ref-master', 'label' => 'Master Referensi', 'group' => 'Referensi', 'legacy_path' => 'pages/ref-master', 'status' => 'planned', 'description' => 'Master golongan, eselon, pekerjaan, dan referensi pendukung.', 'endpoints' => array()),
            array('key' => 'ref-jabatan', 'label' => 'Jabatan', 'group' => 'Referensi', 'legacy_path' => 'pages/ref-jabatan', 'status' => 'planned', 'description' => 'Riwayat dan master jabatan pegawai.', 'endpoints' => array()),
            array('key' => 'ref-keluarga', 'label' => 'Keluarga', 'group' => 'Referensi', 'legacy_path' => 'pages/ref-keluarga', 'status' => 'planned', 'description' => 'Pasangan, anak, orang tua, dan data keluarga pegawai.', 'endpoints' => array()),
            array('key' => 'ref-pendidikan', 'label' => 'Pendidikan', 'group' => 'Referensi', 'legacy_path' => 'pages/ref-pendidikan', 'status' => 'planned', 'description' => 'Riwayat pendidikan dan bahasa pegawai.', 'endpoints' => array()),
            array('key' => 'ref-biaya-pendidikan', 'label' => 'Biaya Pendidikan', 'group' => 'Referensi', 'legacy_path' => 'pages/ref-biaya-pendidikan', 'status' => 'planned', 'description' => 'Data pembiayaan pendidikan pegawai.', 'endpoints' => array()),
            array('key' => 'ref-diklat', 'label' => 'Diklat', 'group' => 'Referensi', 'legacy_path' => 'pages/ref-diklat', 'status' => 'planned', 'description' => 'Diklat pegawai, peserta, import, dan rekap biaya.', 'endpoints' => array()),
            array('key' => 'ref-sertifikasi', 'label' => 'Sertifikasi', 'group' => 'Referensi', 'legacy_path' => 'pages/ref-sertifikasi', 'status' => 'planned', 'description' => 'Sertifikasi, masa berlaku, import, dan export.', 'endpoints' => array()),
            array('key' => 'ref-pengangkatan', 'label' => 'Pengangkatan', 'group' => 'Riwayat Kepegawaian', 'legacy_path' => 'pages/ref-pengangkatan', 'status' => 'planned', 'description' => 'Data pengangkatan dan status awal pegawai.', 'endpoints' => array()),
            array('key' => 'ref-mutasi', 'label' => 'Mutasi', 'group' => 'Riwayat Kepegawaian', 'legacy_path' => 'pages/ref-mutasi', 'status' => 'planned', 'description' => 'Mutasi pegawai dan perubahan unit kerja.', 'endpoints' => array()),
            array('key' => 'ref-pelanggaran', 'label' => 'Pelanggaran', 'group' => 'Riwayat Kepegawaian', 'legacy_path' => 'pages/ref-pelanggaran', 'status' => 'planned', 'description' => 'Hukuman dan pelanggaran disiplin pegawai.', 'endpoints' => array()),
            array('key' => 'ref-riwayat', 'label' => 'Riwayat Lainnya', 'group' => 'Riwayat Kepegawaian', 'legacy_path' => 'pages/ref-riwayat', 'status' => 'planned', 'description' => 'Pangkat, cuti, penghargaan, penugasan, seminar, dan DP3.', 'endpoints' => array()),
            array('key' => 'import', 'label' => 'Import Data', 'group' => 'Tools', 'legacy_path' => 'pages/import', 'status' => 'planned', 'description' => 'Import data pegawai dan data keluarga.', 'endpoints' => array()),
            array('key' => 'report', 'label' => 'Laporan', 'group' => 'Reporting', 'legacy_path' => 'pages/report', 'status' => 'planned', 'description' => 'Laporan nominatif, keadaan pegawai, formasi, dan export.', 'endpoints' => array()),
            array('key' => 'tools', 'label' => 'Tools', 'group' => 'Tools', 'legacy_path' => 'pages/tools', 'status' => 'planned', 'description' => 'Sinkronisasi dan utilitas administratif.', 'endpoints' => array()),
        );

        $legacyCounts = array(
            'config' => 2, 'import' => 3, 'kantor' => 9, 'login' => 5, 'otorisasi' => 3,
            'pegawai' => 28, 'ref-biaya-pendidikan' => 8, 'ref-diklat' => 21, 'ref-jabatan' => 19,
            'ref-keluarga' => 40, 'ref-master' => 8, 'ref-mutasi' => 8, 'ref-pelanggaran' => 13,
            'ref-pendidikan' => 19, 'ref-pengangkatan' => 7, 'ref-riwayat' => 40,
            'ref-sertifikasi' => 16, 'report' => 27, 'tools' => 1, 'user' => 9,
        );
        foreach ($modules as &$module) {
            $module['legacy_files'] = $legacyCounts[$module['key']] ?? 0;
            $resources = ResourceRegistry::forModule($module['key']);
            $module['resources'] = array_map(static fn (array $resource): array => array(
                'key' => $resource['key'],
                'label' => $resource['label'],
                'read_only' => $resource['read_only'],
            ), $resources);
            foreach ($resources as $resource) {
                $module['endpoints'][] = array(
                    'method' => 'GET',
                    'path' => '/resources/' . $resource['key'],
                    'label' => 'List ' . strtolower($resource['label']),
                    'testable' => true,
                    'sample' => '/resources/' . $resource['key'] . '?limit=5',
                );
                $module['endpoints'][] = array(
                    'method' => 'GET',
                    'path' => '/resources/' . $resource['key'] . '/{id}',
                    'label' => 'Detail ' . strtolower($resource['label']),
                    'testable' => false,
                    'sample' => '/resources/' . $resource['key'] . '/{id}',
                );
                if (!$resource['read_only']) {
                    $module['endpoints'][] = array(
                        'method' => 'POST',
                        'path' => '/resources/' . $resource['key'],
                        'label' => 'Create ' . strtolower($resource['label']),
                        'testable' => false,
                        'sample' => '/resources/' . $resource['key'],
                    );
                    $module['endpoints'][] = array(
                        'method' => 'PATCH',
                        'path' => '/resources/' . $resource['key'] . '/{id}',
                        'label' => 'Update ' . strtolower($resource['label']),
                        'testable' => false,
                        'sample' => '/resources/' . $resource['key'] . '/{id}',
                    );
                    $module['endpoints'][] = array(
                        'method' => 'DELETE',
                        'path' => '/resources/' . $resource['key'] . '/{id}',
                        'label' => 'Pindahkan ke sampah (belum tersedia) - ' . strtolower($resource['label']),
                        'testable' => false,
                        'disabled' => true,
                        'disabled_reason' => 'Trash dan restore belum tersedia.',
                        'sample' => '/resources/' . $resource['key'] . '/{id}',
                    );
                }
            }
            if ($resources !== array() && $module['status'] === 'planned') {
                $module['status'] = 'partial';
            }
            if ($module['key'] === 'login') {
                $module['endpoints'][] = array('method' => 'POST', 'path' => '/auth/login', 'label' => 'Login', 'testable' => false, 'sample' => '/auth/login');
                $module['endpoints'][] = array('method' => 'GET', 'path' => '/auth/me', 'label' => 'Current session', 'testable' => true, 'sample' => '/auth/me');
                $module['endpoints'][] = array('method' => 'POST', 'path' => '/auth/logout', 'label' => 'Logout', 'testable' => false, 'sample' => '/auth/logout');
                $module['status'] = 'partial';
            }
        }
        unset($module);

        $counts = array('total' => count($modules), 'ready' => 0, 'partial' => 0, 'planned' => 0, 'testable_endpoints' => 0);
        foreach ($modules as $module) {
            $status = $module['status'];
            if (isset($counts[$status])) {
                $counts[$status]++;
            }
            foreach ($module['endpoints'] as $endpoint) {
                if ($endpoint['testable']) {
                    $counts['testable_endpoints']++;
                }
            }
        }

        return array(
            'name' => 'SIMPEG API',
            'version' => 'simpeg-v3',
            'base_path' => '/api',
            'generated_at' => date(DATE_ATOM),
            'mutation_enabled' => getenv('SIMPEG_ENABLE_MUTATIONS') === 'true',
            'stats' => $counts,
            'modules' => $modules,
        );
    }
}
