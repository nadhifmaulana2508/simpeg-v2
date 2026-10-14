# SIMPEG Internal API

Dokumentasi endpoint API pada branch `simpeg-v3`.

## Base URL

Environment yang saat ini dipakai:

- Local: `http://localhost:8081/dummy/api`
- Server: `https://simpeg.bkkjateng.co.id/api`

Runtime REST API v3 wajib PHP 8.2+. Jika project masih dibuka melalui XAMPP
PHP 5.6, entrypoint `/api` akan mengembalikan response JSON `503` yang
menjelaskan kebutuhan runtime tersebut, bukan menjalankan query API.

Contoh menjalankan project ini dengan PHP 8.2 tanpa mengubah XAMPP lama:

```powershell
C:\xampp\php\php.exe -S 127.0.0.1:8105 -t C:\xampp56\htdocs\DUMMY
```

Lalu buka `http://127.0.0.1:8105/frontend/`.

## Format Response

Semua endpoint saat ini mengembalikan JSON dengan format umum:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Jika gagal:

```json
{
  "success": false,
  "message": "Pesan error"
}
```

## Endpoint

### 1. Health Check

`GET /health`

Contoh:

```text
http://localhost:8081/dummy/api/health
```

Contoh response:

```json
{
  "success": true,
  "data": {
    "name": "SIMPEG Internal API",
    "status": "ok",
    "timestamp": "2026-06-18T00:00:00+07:00",
    "version": "simpeg-v3"
  }
}
```

### 2. Root Info API

`GET /`

Contoh:

```text
http://localhost:8081/dummy/api
```

Endpoint ini menampilkan informasi API dan daftar route awal yang tersedia.

### 3. List Pegawai

`GET /pegawai`

Query parameter yang tersedia:

- `page` default `1`
- `limit` default `20`, maksimal `100`
- `q` untuk pencarian `id_peg`, `nip`, atau `nama`
- `unit_kerja` untuk filter unit kerja

Contoh:

```text
http://localhost:8081/dummy/api/pegawai
http://localhost:8081/dummy/api/pegawai?limit=10
http://localhost:8081/dummy/api/pegawai?q=andi
http://localhost:8081/dummy/api/pegawai?unit_kerja=KC01
```

Contoh response ringkas:

```json
{
  "success": true,
  "data": [
    {
      "id_peg": "117-061",
      "nip": "1234567890",
      "nama": "Nama Pegawai",
      "jk": "L",
      "email": "pegawai@example.com",
      "telp": "08123456789",
      "status_kepeg": "Tetap",
      "status_aktif": "Y",
      "foto": "foto.jpg",
      "jabatan": "Kabid Operasional",
      "unit_kerja": "KC01",
      "tmt_jabatan": "2025-01-01"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

### 4. Detail Pegawai

`GET /pegawai/{id_peg}`

Contoh:

```text
http://localhost:8081/dummy/api/pegawai/117-061
```

### 5. Data Keluarga Pegawai

`GET /pegawai/{id_peg}/keluarga`

Contoh:

```text
http://localhost:8081/dummy/api/pegawai/117-061/keluarga
```

Response berisi:

- data pegawai
- data pasangan
- data anak
- data orang tua

### 6. API Catalog / REST API Center

`GET /catalog`

Endpoint ini tidak membutuhkan database. Response-nya berisi daftar module
legacy, jumlah file page yang masih ada, status migrasi (`ready`, `partial`, atau
`planned`), serta endpoint yang sudah bisa diuji dari menu **REST API** di FE.
Gunakan endpoint ini sebagai checklist sebelum memindahkan page legacy ke
frontend component-based.

Saat ini catalog mencatat 21 module legacy. Endpoint yang sudah dapat diuji
langsung adalah API info, health check, catalog, dan list pegawai.

### 7. Generic resource read API

Resource yang sudah masuk registry dapat diuji dengan pola:

```text
GET /resources/{resource}?page=1&limit=20&q=
GET /resources/{resource}/{id}
```

Contoh resource yang sudah dipetakan: `pegawai`, `anak`, `pasangan`, `ortu`,
`jabatan`, `kantor`, `user`, `pendidikan`, `diklat`, `sertifikasi`, `mutasi`,
`pelanggaran`, dan seluruh riwayat kepegawaian. Query resource memakai daftar
tabel whitelist dan prepared statement. Saat koneksi database belum tersedia,
endpoint akan mengembalikan error JSON 500 dan dapat dilihat dari REST API
Center.

Mutation resource memakai pola `POST /resources/{resource}` dan `PATCH
/resources/{resource}/{id}`. Semua mutation sengaja disabled secara default.
Aktifkan hanya pada environment terproteksi dengan
`SIMPEG_ENABLE_MUTATIONS=true` dan `SIMPEG_API_TOKEN`, lalu kirim header
`Authorization: Bearer ...`. DELETE langsung dinonaktifkan dan mengembalikan
`405` sampai mekanisme trash serta restore benar-benar tersedia.

## Cara Test Cepat

### Browser

Buka langsung:

```text
http://localhost:8081/dummy/api/health
```

### cURL

```bash
curl "http://localhost:8081/dummy/api/health"
curl "http://localhost:8081/dummy/api/pegawai?limit=5"
curl "http://localhost:8081/dummy/api/pegawai/117-061"
curl "http://localhost:8081/dummy/api/pegawai/117-061/keluarga"
curl "http://localhost:8081/dummy/api/catalog"
```

### Postman

1. Buat collection baru `SIMPEG Internal API`
2. Tambahkan request `GET`
3. Isi URL sesuai endpoint di atas
4. Tekan `Send`

Endpoint data masih berada dalam fase migrasi dan belum mengaktifkan autentikasi API secara default. Jangan membuka endpoint ini ke internet sebelum middleware autentikasi dan otorisasi role selesai.

## Catatan Tahap Berikutnya

Tahap selanjutnya yang direncanakan:

- tambah autentikasi API
- tambah endpoint create/update/delete
- tambah endpoint referensi master
- pindahkan FE lama supaya baca data dari REST API
