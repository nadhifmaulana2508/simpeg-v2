# Catatan Diskusi Menu dan Data SIMPEG

Status: template kerja. Belum berisi keputusan bisnis yang disetujui.

Dokumen ini menjadi tempat bersama untuk mencatat hasil workshop dengan Divisi SDM, pemilik KPI/Monbis, pemilik absensi, IT/SSO, dan DBA. Daftar tabel pada prototype dan [ERD konseptual](ERD-SIMPEG-V2.md) adalah kandidat awal, bukan keputusan schema.

## Cara menggunakan

1. Buka menu yang akan dibahas pada prototype dan tinjau tabel legacy serta target usulan.
2. Cocokkan nama tabel dan kolom dengan kode aplikasi lama, proses nyata, dan pemilik datanya. Inventaris DDL saja tidak membuktikan tabel masih digunakan.
3. Catat definisi data, validasi, alur, akses, pengecualian, dan keputusan pada template di bawah.
4. Tandai setiap relasi sebagai `terkonfirmasi`, `kandidat`, `belum diketahui`, atau `tidak dipakai`, sertakan peran pemilik dan bukti yang dapat diperiksa.
5. Catatan yang diketik pada prototype tersimpan hanya di browser lokal. Gunakan tombol unduh untuk mengekspor buku catatan Markdown, lalu tinjau dan pindahkan keputusan resmi ke dokumen ini.

Jangan menyimpan nama/ID pegawai, NIK, nomor rekening, password, token, foto, dokumen, atau record pribadi di file diskusi/Git. Referensikan nama proses, nama kolom, dan lokasi bukti yang aksesnya sudah disetujui, bukan salinan datanya.

## Form catatan per menu

Salin bagian ini untuk setiap menu yang dibahas.

### [Nama menu]

- Divisi/pemilik proses:
- Tanggal diskusi:
- Peran peserta (tanpa data pribadi):
- Status review: `belum dibahas` / `kandidat` / `terkonfirmasi` / `tidak dipakai`
- Tabel legacy yang benar-benar digunakan:
- Kolom yang dipakai dan definisinya:
- Sumber dan pemilik data:
- Target konseptual yang disepakati:
- Validasi dan aturan bisnis:
- Workflow, approver, dan status:
- Hak baca, ubah, unduh, dan scope kantor:
- Pengecualian, retensi, serta audit:
- Laporan/export yang diperlukan:
- Keputusan:
- Pertanyaan terbuka:
- PIC tindak lanjut (peran):
- Bukti/rujukan yang dapat diperiksa tanpa memuat data pribadi:
- Persetujuan pemilik proses:

## Indeks review awal

| Domain | Contoh tabel legacy pada inventaris | Entitas target konseptual | Hal yang perlu dikonfirmasi |
| --- | --- | --- | --- |
| Biodata dan akun | `tb_pegawai`, `tb_user`, `tb_apk` | `employees`, `employee_profiles`, `simpeg_users`, `employee_application_access` | Sumber status aktif, identifier pegawai, entitlement aplikasi, field yang boleh dibaca |
| Organisasi dan riwayat | `tb_kantor`, `tb_jabatan`, `tb_mutasi`, `tb_pangkat` | `offices`, `office_relationships`, `positions`, `employee_assignments`, `career_events` | Hirarki pusat/korwil/cabang/kankas, tanggal efektif, beda posisi dan pangkat |
| Pendidikan, keluarga, pengembangan | `tb_pendidikan`, `tb_anak`, `tb_ortu`, `tb_suamiistri`, `tb_diklat`, `tb_sertifikasi` | `education_records`, `family_members`, `employee_trainings`, `employee_certifications`, `documents` | Field minimum, verifikasi, privasi, retensi dokumen |
| KPI | `tb_dp3` sebagai arsip untuk review | `kpi_cycles`, `assessments`, `assessment_scores`, `score_reviews` | Indikator, periode, sumber angka, jalur penilai, finalisasi, keberatan |
| Monbis | Belum ada tabel sumber Monbis terkonfirmasi pada inventaris DDL SIMPEG | `monbis_import_runs`, `monbis_source_rows`, `monbis_reconciliations` dan tabel mapping | Kontrak API/export, kunci pegawai/indikator, cut-off, koreksi dan retry |
| Absensi | Belum ada tabel sumber absensi terkonfirmasi pada inventaris DDL SIMPEG | `attendance_events`, `attendance_days`, `attendance_corrections`, kalender dan jadwal | Sumber aktif, event mentah, geofence/face recognition, koreksi, lock periode |

Nama tabel legacy di atas berasal dari inventaris DDL `db/masq2971_simpeg_dummy.sql`. Belum dilakukan pemeriksaan seluruh pemakaian tabel pada kode aplikasi, isi record, atau file. Jangan menghapus, rename, atau menggabungkan tabel pada database lama berdasarkan indeks ini saja.

## Log keputusan yang disetujui

| ID | Menu/domain | Keputusan | Status | Tanggal | Pemilik (peran) | Rujukan |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  | Belum dibahas |  |  |  |
