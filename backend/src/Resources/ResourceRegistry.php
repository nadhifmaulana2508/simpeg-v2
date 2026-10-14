<?php
declare(strict_types=1);

namespace Simpeg\Resources;

final class ResourceRegistry
{
    /** @return array<string, array<string, mixed>> */
    public static function all(): array
    {
        return array(
            'pegawai' => self::definition('pegawai', 'Data Pegawai', 'pegawai', 'tb_pegawai', 'id_peg', array('id_peg', 'nip', 'nama', 'email')),
            'anak' => self::definition('anak', 'Anak', 'ref-keluarga', 'tb_anak', 'id_anak', array('id_peg', 'nik', 'nama')),
            'pasangan' => self::definition('pasangan', 'Pasangan', 'ref-keluarga', 'tb_suamiistri', 'id_si', array('id_peg', 'nik', 'nama')),
            'ortu' => self::definition('ortu', 'Orang Tua', 'ref-keluarga', 'tb_ortu', 'id_ortu', array('id_peg', 'nik', 'nama')),
            'jabatan' => self::definition('jabatan', 'Riwayat Jabatan', 'ref-jabatan', 'tb_jabatan', 'id_jab', array('id_peg', 'jabatan', 'unit_kerja', 'kode_jabatan')),
            'ref-jabatan' => self::definition('ref-jabatan', 'Master Jabatan', 'ref-jabatan', 'tb_ref_jabatan', 'kode_jabatan', array('kode_jabatan', 'jabatan', 'group')),
            'kantor' => self::definition('kantor', 'Kantor', 'kantor', 'tb_kantor', 'kode_kantor_detail', array('kode_kantor_detail', 'kode_cabang', 'nama_kantor')),
            'user' => self::definition('user', 'User', 'user', 'tb_user', 'id_user', array('id_user', 'nama_user', 'id_pegawai', 'hak_akses')),
            'config' => self::definition('config', 'Konfigurasi Aplikasi', 'config', 'tb_config', 'id_app', array('id_app', 'nama_app', 'alias_app')),
            'master-pekerjaan' => self::definition('master-pekerjaan', 'Master Pekerjaan', 'ref-master', 'tb_master_pekerjaan', 'id_pekerjaan', array('id_pekerjaan', 'desc_pekerjaan')),
            'master-jabatan' => self::definition('master-jabatan', 'Master Jabatan Internal', 'ref-master', 'tb_master_jabatan', 'kode_jabatan', array('kode_jabatan', 'nama_jabatan', 'nama_unit_kerja', 'group_jabatan')),
            'master-eselon' => self::definition('master-eselon', 'Master Eselon', 'ref-master', 'tb_masteresl', 'id_masteresl', array('id_masteresl', 'nama_masteresl')),
            'master-golongan' => self::definition('master-golongan', 'Master Golongan', 'ref-master', 'tb_mastergol', 'id_mastergol', array('id_mastergol', 'nama_mastergol')),
            'pendidikan' => self::definition('pendidikan', 'Pendidikan', 'ref-pendidikan', 'tb_pendidikan', 'id_sekolah', array('id_peg', 'nama_sekolah', 'jenjang', 'jurusan')),
            'bahasa' => self::definition('bahasa', 'Bahasa', 'ref-pendidikan', 'tb_bahasa', 'id_bhs', array('id_peg', 'bahasa')),
            'diklat' => self::definition('diklat', 'Diklat', 'ref-diklat', 'tb_diklat', 'id_diklat', array('id_peg', 'diklat', 'penyelenggara')),
            'sertifikasi' => self::definition('sertifikasi', 'Sertifikasi', 'ref-sertifikasi', 'tb_sertifikasi', 'id_sertif', array('id_peg', 'sertifikasi', 'penyelenggara')),
            'pengangkatan' => self::definition('pengangkatan', 'Pengangkatan', 'ref-pengangkatan', 'tb_angkat', 'id_angkat', array('id_peg', 'id_peg_baru', 'jns_mutasi')),
            'mutasi' => self::definition('mutasi', 'Mutasi', 'ref-mutasi', 'tb_mutasi', 'id_mutasi', array('id_peg', 'jns_mutasi', 'jabatan')),
            'pelanggaran' => self::definition('pelanggaran', 'Pelanggaran', 'ref-pelanggaran', 'tb_hukuman', 'id_hukum', array('id_peg', 'hukuman', 'no_sk')),
            'cuti' => self::definition('cuti', 'Cuti', 'ref-riwayat', 'tb_cuti', 'id_cuti', array('id_peg', 'jns_cuti', 'no_suratcuti')),
            'dp3' => self::definition('dp3', 'DP3', 'ref-riwayat', 'tb_dp3', 'id_dp3', array('id_peg', 'periode_awal', 'periode_akhir')),
            'lat-jabatan' => self::definition('lat-jabatan', 'Latihan Jabatan', 'ref-riwayat', 'tb_lat_jabatan', 'id_lat_jabatan', array('id_peg', 'nama_pelatih')),
            'pangkat' => self::definition('pangkat', 'Pangkat', 'ref-riwayat', 'tb_pangkat', 'id_pangkat', array('id_peg', 'pangkat', 'gol')),
            'penghargaan' => self::definition('penghargaan', 'Penghargaan', 'ref-riwayat', 'tb_penghargaan', 'id_penghargaan', array('id_peg', 'penghargaan')),
            'penugasan' => self::definition('penugasan', 'Penugasan', 'ref-riwayat', 'tb_penugasan', 'id_penugasan', array('id_peg', 'tujuan')),
            'seminar' => self::definition('seminar', 'Seminar', 'ref-riwayat', 'tb_seminar', 'id_seminar', array('id_peg', 'seminar', 'penyelenggara')),
            'formasi' => self::definition('formasi', 'Formasi', 'report', 'tb_formasi', 'id_formasi', array('kode_cabang', 'jabatan')),
            'edit-pending' => self::definition('edit-pending', 'Edit Pending', 'otorisasi', 'tb_edit_pending', 'id_edit', array('id_peg', 'jenis_data', 'status_otorisasi')),
            'notifikasi' => self::definition('notifikasi', 'Notifikasi', 'user', 'tb_notifikasi', 'id_notif', array('id_user', 'judul', 'pesan')),
            'log-aktivitas' => self::definition('log-aktivitas', 'Log Aktivitas', 'system', 'tb_log_aktivitas', 'id_log', array('id_user', 'aksi', 'keterangan'), false),
        );
    }

    /** @return array<string, mixed>|null */
    public static function find(string $resource): ?array
    {
        $all = self::all();
        return $all[$resource] ?? null;
    }

    /** @return array<int, array<string, mixed>> */
    public static function forModule(string $module): array
    {
        return array_values(array_filter(self::all(), static fn (array $item): bool => $item['module'] === $module));
    }

    /** @return array<string, mixed> */
    private static function definition(string $key, string $label, string $module, string $table, string $primaryKey, array $searchColumns, bool $writable = true): array
    {
        return array(
            'key' => $key,
            'label' => $label,
            'module' => $module,
            'table' => $table,
            'primary_key' => $primaryKey,
            'search_columns' => $searchColumns,
            'read_only' => !$writable,
            'writable' => $writable,
        );
    }
}
