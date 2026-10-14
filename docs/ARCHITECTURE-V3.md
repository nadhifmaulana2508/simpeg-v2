# SIMPEG v3: arah arsitektur

Branch `simpeg-v3` memulai pemisahan frontend dan backend secara bertahap.
Aplikasi lama tetap menjadi fallback selama modul dipindahkan satu per satu.

## Batas baru

```text
frontend/                 # UI component-based, hanya konsumsi HTTP API
  src/components/         # shell, card, table, badge
  src/pages/              # halaman per fitur
  src/services/           # REST API client
backend/                  # kode aplikasi PHP 8 untuk REST API
  public/index.php        # router API baru
  src/Controllers/        # orchestration request/response
  src/Repositories/       # query database prepared statement
  src/Http/               # request dan response JSON
api/index.php             # compatibility entry point ke backend/
pages/, templates/        # legacy FE, dimigrasikan bertahap
```

## Kontrak API awal

Semua response memakai format:

```json
{
  "success": true,
  "data": [],
  "meta": {}
}
```

Route yang sudah dipindahkan ke backend baru:

- `GET /api`
- `GET /api/health`
- `GET /api/catalog`
- `GET /api/resources/{resource}`
- `GET /api/resources/{resource}/{id}`
- `GET /api/pegawai?page=1&limit=20&q=&unit_kerja=`
- `GET /api/pegawai/{id_peg}`
- `GET /api/pegawai/{id_peg}/keluarga`

Query pada repository baru memakai prepared statement. Selama masa transisi,
repository memakai koneksi legacy jika `SIMPEG_DB_*` belum dikonfigurasi.

## Frontend component rule

Halaman baru tidak boleh menjalankan SQL atau menyisipkan query database. UI
dibangun dari komponen bersama dan mengambil data melalui `api-client.js`.
Registry `frontend/src/components/index.js` menjadi pintu masuk component bersama:
icon, button, input/select/form, alert, modal, toast, badge, card, table, dan
pagination. Halaman daftar pegawai menjadi referensi pertama untuk pola filter,
state loading, error, tabel, dan badge status.

Palette FE yang disepakati:

- `#1B3C53` navy utama
- `#456882` blue aksen
- `#D2C1B6` sand/highlight
- `#F9F3EF` cream background

## Konfigurasi database PHP 8.2

Untuk deployment baru, gunakan environment variable berikut:

```text
SIMPEG_DB_HOST=127.0.0.1
SIMPEG_DB_PORT=3306
SIMPEG_DB_NAME=simpeg
SIMPEG_DB_USER=simpeg
SIMPEG_DB_PASSWORD=change-me
SIMPEG_CORS_ORIGIN=https://frontend.example.test
SIMPEG_ENABLE_MUTATIONS=false
SIMPEG_API_TOKEN=change-me
```

Fallback ke `dist/koneksi.php` hanya untuk menjaga aplikasi lama tetap berjalan.
Fallback tersebut harus dihapus setelah seluruh modul legacy selesai dipindahkan.

Resource API menggunakan registry whitelist di `backend/src/Resources` sehingga
URL tidak pernah dipakai langsung sebagai nama tabel. Endpoint GET dapat dipakai
untuk audit data, sedangkan mutation POST/PATCH/DELETE tetap disabled sampai
environment dan token API dikonfigurasi secara eksplisit.

## Hasil audit PHP 8 awal

- Source v3 dan seluruh halaman aplikasi di luar library lama lolos lint PHP 8.2.
- Tiga copy `excel_reader2.php` diperbaiki pada assignment reference yang sudah
  tidak valid di PHP 8.
- Blocker tersisa ada pada library PDF lama di `plugins/mpdf/` dan `plugins/tcpdf/`.
  Keduanya masih memakai akses string dengan kurung kurawal. Library tersebut
  perlu diganti dengan package Composer yang kompatibel PHP 8 sebelum modul print
  dan export laporan dipindahkan.
- `ext-zip` harus diaktifkan di runtime deployment karena dibutuhkan PhpSpreadsheet.

## Urutan migrasi berikutnya

1. Jadikan menu **REST API** di FE sebagai checklist coverage semua module legacy.
2. Tambahkan autentikasi API dan otorisasi role.
3. Migrasikan login/session ke endpoint API tanpa mengubah password lama secara massal.
4. Pindahkan repository dan controller per module, lalu test dari REST API Center.
5. Migrasikan page FE hanya setelah endpoint module lulus test.
6. Pindahkan dashboard dan laporan terakhir karena query dan export paling kompleks.
7. Setelah smoke test tiap modul, hapus query langsung dari `pages/`.
