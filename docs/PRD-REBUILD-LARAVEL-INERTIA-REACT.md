# PRD Rebuild SIMPEG

Status dokumen: draft berbasis audit kode saat ini
Target rebuild: Laravel + Inertia.js + React
Branch: `rebuild/prd-laravel-inertia-react`

## 1. Tujuan

Membangun ulang SIMPEG dengan alur kerja kepegawaian yang saat ini sudah dipakai, tetapi dengan struktur aplikasi yang lebih mudah dirawat, aturan akses yang jelas, dan frontend React melalui Inertia.js.

Branch ini hanya menyimpan PRD. Dokumen ini belum menjadi persetujuan desain visual, kontrak API final, atau keputusan migrasi database.

## 2. Sumber audit

Inventarisasi ini membaca sumber yang tersedia di repository saat ini:

- `README.md`
- `templates/layout-sidebar.php`
- `dist/functions.php`
- `pages/`
- `dashboard.php`, `dashboard-cabang.php`, dan komponen `komponen/`
- `backend/`, `api/`, dan `docs/API.md`
- `frontend/README.md` dan `frontend/src/`
- struktur tabel pada `db/masq2971_simpeg (struktur only).sql`

Status fitur di dokumen ini:

- **Ada**: alur atau halaman ditemukan pada aplikasi legacy.
- **Sebagian**: ada implementasi, tetapi masih terbatas, read-only, atau belum menjadi alur utama.
- **Rencana**: disebut pada katalog API, README, atau roadmap, tetapi belum menjadi fitur rebuild.
- **Validasi**: ada indikasi kode, tetapi aturan bisnisnya perlu dikonfirmasi sebelum dibawa ke Laravel.

## 3. Ringkasan fitur yang sudah ada

| Area | Status | Ringkasan |
| --- | --- | --- |
| Login dan logout | Ada | Login memakai ID pegawai atau ID user, session, logout, dan redirect berdasarkan role. |
| SSO | Sebagian | Ada integrasi SSO BKK dan pemulihan session dari cookie, dengan fallback login lokal. |
| Role dan akses | Ada | Role yang terlihat: `superadmin`, `admin`, `kepala`, dan `user`. |
| Dashboard | Ada | Ringkasan statistik, grafik, tabel pensiun, keterisian jabatan, dan filter wilayah. |
| Data pegawai | Ada | Daftar, pencarian, filter, detail, tambah, edit, import Excel, foto, perubahan ID, dan status nonaktif. |
| Data keluarga | Ada | Pasangan, anak, dan orang tua, termasuk CRUD, import, template, soft delete, dan pengajuan mandiri user. |
| Jabatan | Ada | Master jabatan, riwayat jabatan, pencarian pegawai, import, dan penetapan jabatan aktif. |
| Pendidikan | Ada | Riwayat pendidikan, sekolah, bahasa, import, dan penetapan pendidikan terakhir. |
| Diklat | Ada | Data pelatihan, peserta, import, detail, export, dan rekap biaya. |
| Sertifikasi | Ada | CRUD, import, template, export, download sertifikat, dan status masa berlaku. |
| Mutasi dan penonaktifan | Ada | Data mutasi, perubahan unit atau jabatan, dokumen SK, dan status pegawai. |
| Pengangkatan | Ada | Data pengangkatan dan dokumen SK. |
| Pelanggaran | Ada | Data hukuman atau pelanggaran, import, dokumen, dan soft delete. |
| Riwayat lain | Ada | Pangkat, cuti, DP3 atau SKP, latihan jabatan, penghargaan, penugasan, dan seminar. |
| Laporan | Ada | Nominatif, keadaan pegawai, formasi, rekap diklat, biaya pendidikan, print, Excel, dan PDF. |
| Manajemen user | Ada | Daftar user, tambah, edit, role, status aktif, filter, sinkronisasi, dan soft delete. |
| Approval perubahan | Ada | Review data lama dan baru, filter antrian, komentar, approve, reject, dan pembatasan wilayah. |
| Notifikasi | Ada | Halaman notifikasi user dan notifikasi approval pada header. |
| Konfigurasi aplikasi | Ada | Nama aplikasi, logo, alias, dan pengaturan tampilan yang tersimpan di `tb_config`. |
| Data kantor | Ada | Master kantor dan halaman detail pegawai berdasarkan kantor. |
| Tools sinkronisasi | Ada | Sinkronisasi user dari data pegawai dan jabatan aktif. |
| API internal | Sebagian | Health check, catalog, resource read, dan endpoint read-only pegawai sudah tersedia. |
| Frontend baru | Sebagian | Ada prototype Web Components dan REST API Center, tetapi belum menjadi aplikasi utama. |

## 4. Inventaris fitur per domain

### 4.1 Autentikasi dan identitas pengguna

Fitur yang ditemukan:

- Login memakai ID pegawai atau ID user dan password.
- Login utama terhubung ke SSO BKK melalui endpoint auth eksternal.
- Fallback login lokal tersedia untuk kebutuhan development dan akun lokal.
- Session diregenerasi setelah login.
- Session dapat dipulihkan dari cookie SSO.
- Logout membersihkan session dan cookie SSO.
- Akun tidak aktif ditolak.
- Redirect setelah login mengikuti role:
  - `admin` dan `superadmin` ke dashboard utama.
  - `kepala` ke dashboard cabang.
  - `user` ke profil sendiri.
- Terdapat session timeout pada shell aplikasi.

Catatan rebuild:

- Sumber kebenaran identitas perlu dipilih: SSO saja, lokal saja, atau keduanya.
- Mekanisme password legacy perlu dimigrasikan karena kode saat ini masih mengenali hash lama.
- Kontrak SSO, expiry token, pemetaan user, dan perilaku saat SSO tidak tersedia perlu ditulis sebagai keputusan teknis terpisah.

### 4.2 Role dan otorisasi

Role yang terlihat di source:

| Role | Akses yang terlihat saat ini |
| --- | --- |
| `superadmin` | Akses penuh yang sama dengan area admin pada menu, termasuk dashboard, data pegawai, master data, laporan, user, dan konfigurasi. |
| `admin` | Dashboard, data pegawai, master data, laporan, user, konfigurasi, dan approval. |
| `kepala` | Dashboard cabang, daftar dan detail pegawai sesuai konteks kantor, laporan kepegawaian, dan approval. |
| `user` | Profil sendiri, ganti foto, pengajuan perubahan biodata atau keluarga, riwayat pengajuan, dan notifikasi. |

Pemetaan role otomatis saat ini membaca jabatan aktif atau data dari SSO. Direktur atau direksi dipetakan ke `superadmin`, kepala cabang atau kepala kantor serta kabid operasional dipetakan ke `kepala`, dan jabatan lain dipetakan ke `user` jika tidak ada aturan lebih tinggi.

Aturan yang wajib dipertahankan pada rebuild:

- User tidak boleh membaca atau mengubah data pegawai lain.
- Scope approval mengikuti kantor atau unit kerja target.
- Kepala dan admin hanya melihat data yang sesuai dengan aksesnya.
- Semua endpoint dan page harus memeriksa authorization di server, bukan hanya menyembunyikan menu.

### 4.3 Dashboard

Dashboard utama saat ini menyediakan:

- Filter wilayah atau unit kerja.
- Statistik ringkas data pegawai.
- Statistik masa kerja.
- Distribusi jenis kelamin.
- Distribusi pendidikan.
- Distribusi status pegawai.
- Distribusi jabatan.
- Tren pelanggaran berdasarkan tahun.
- Tabel pegawai yang mendekati atau masuk masa pensiun.
- Tabel keterisian jabatan eksekutif.
- Tabel keterisian jabatan struktural.

Dashboard cabang memakai konteks kantor kepala dan menyediakan ringkasan yang lebih terbatas dibanding dashboard admin.

Catatan rebuild:

- Angka dashboard harus memiliki sumber query dan definisi bisnis yang dapat diuji.
- Filter unit kerja harus konsisten dengan scope role.
- Setiap widget perlu memiliki state loading, kosong, dan error.

### 4.4 Data pegawai

Fitur yang ditemukan:

- Daftar pegawai aktif.
- Daftar pegawai yang belum memiliki jabatan.
- Daftar pegawai purna atau nonaktif.
- Pencarian berdasarkan ID pegawai, NIP, atau nama.
- Filter kantor, divisi, dan jabatan.
- Detail pegawai.
- Tambah dan edit biodata.
- Import Excel dengan template.
- Ganti foto.
- Perubahan ID pegawai atau proses pengangkatan terkait ID.
- Penonaktifan atau mutasi melalui modul terkait.
- Tampilan tab biodata dan keluarga pada halaman detail.
- Akses ringkasan riwayat dari detail pegawai.
- Cetak biodata pegawai.

Data biodata yang terlihat antara lain nama, tempat dan tanggal lahir, jenis kelamin, agama, golongan darah, status nikah, status kepegawaian, alamat, telepon, email, BPJS Ketenagakerjaan, dan BPJS Kesehatan.

### 4.5 Data keluarga

Domain keluarga terdiri dari:

- Pasangan atau suami istri.
- Anak.
- Orang tua.

Fitur yang ditemukan:

- Daftar data per pegawai.
- Tambah, edit, dan hapus.
- Import data dengan template untuk beberapa jenis data.
- Validasi relasi terhadap pegawai.
- Pilihan pendidikan, pekerjaan, dan status hubungan dari master referensi.
- Soft delete yang menggunakan recycle bin pada beberapa alur.
- User dapat mengajukan tambah atau ubah data keluarga miliknya sendiri.
- Pengajuan user masuk ke `tb_edit_pending` dan menunggu approval.

Aturan data keluarga yang perlu dijadikan acceptance criteria:

- `id_peg` pada request user harus sama dengan `id_pegawai` di session.
- Approval harus menyimpan data lama dan data baru.
- Penolakan tidak boleh mengubah data utama.
- Pengajuan yang sudah diproses tidak boleh diproses ulang tanpa aturan yang jelas.

### 4.6 Jabatan dan unit kerja

Fitur jabatan:

- Master jabatan internal.
- Referensi jabatan.
- Riwayat jabatan pegawai.
- Pencarian pegawai saat mengisi jabatan.
- Import riwayat jabatan.
- Penetapan jabatan aktif.
- Filter jabatan berdasarkan kantor atau unit kerja.

Fitur kantor:

- Daftar dan master kantor.
- Edit dan hapus data kantor.
- Detail pegawai berdasarkan kantor.
- Ringkasan keluarga dan riwayat pegawai dari halaman detail kantor.

### 4.7 Pendidikan dan bahasa

Fitur yang ditemukan:

- Riwayat pendidikan pegawai.
- Master sekolah atau institusi pendidikan.
- Data kemampuan bahasa.
- Tambah, edit, dan hapus.
- Import pendidikan dengan template.
- Penetapan pendidikan terakhir.
- Penentuan pendidikan berdasarkan data sekolah dan jenjang.

### 4.8 Diklat, sertifikasi, dan biaya pendidikan

Diklat:

- Master atau daftar pelatihan.
- Data peserta pegawai.
- Detail diklat.
- Import dan template.
- Export data diklat.
- Rekap biaya diklat dan daftar peserta.

Sertifikasi:

- Daftar sertifikasi pegawai.
- Tambah, edit, dan hapus.
- Import dengan template.
- Export data.
- Download file sertifikat.
- Penentuan status aktif atau kedaluwarsa berdasarkan tanggal expired.

Biaya pendidikan:

- Daftar pembiayaan pendidikan atau kegiatan pengembangan.
- Upload atau import data.
- Detail peserta.
- Rekap dan export biaya.

### 4.9 Riwayat kepegawaian

Modul riwayat yang ditemukan:

- Pengangkatan.
- Mutasi.
- Pangkat.
- Cuti.
- DP3 atau SKP.
- Latihan jabatan.
- Penghargaan.
- Penugasan.
- Seminar.
- Pelanggaran atau hukuman.

Pola fitur umumnya mencakup daftar, detail, tambah, edit, hapus, dan beberapa dokumen atau file pendukung. Sebagian riwayat ditampilkan sebagai modal dari detail pegawai atau detail kantor.

Catatan rebuild:

- Pisahkan riwayat yang bersifat catatan historis dari transaksi yang mengubah status pegawai.
- Definisikan sumber status aktif, tanggal berlaku, dan hubungan antar riwayat.
- Jangan menyamakan semua riwayat sebagai CRUD biasa jika ada aturan bisnis atau approval.

### 4.10 Laporan dan export

Laporan yang ditemukan:

- Laporan nominatif pegawai.
- Laporan keadaan pegawai.
- Laporan formasi jabatan.
- Rekap biaya diklat.
- Daftar atau rekap diklat.
- Rekap biaya pendidikan.
- Print biodata pegawai.
- Print formasi.
- Print keadaan pegawai.
- Print nominatif pegawai.
- Print bezetting atau keterisian.

Kemampuan output yang ditemukan:

- Filter berdasarkan kantor, unit, periode, dan pilihan laporan tertentu.
- Detail melalui modal atau request AJAX.
- Export Excel.
- Export PDF atau tampilan siap cetak.

Acceptance criteria rebuild:

- Filter laporan harus tersimpan di URL atau request yang dapat dibagikan jika alur bisnis mengizinkannya.
- Hasil export harus memakai filter yang sama dengan tampilan layar.
- Data kosong harus menghasilkan dokumen yang jelas, bukan file yang terlihat berhasil tetapi tanpa konteks.
- Format dokumen lama perlu disetujui ulang sebelum dipertahankan.

### 4.11 Manajemen user dan sinkronisasi

Fitur yang ditemukan:

- Daftar user.
- Tambah dan edit user.
- Pengaturan role.
- Pengaturan status aktif.
- Filter berdasarkan role.
- Soft delete atau pemindahan ke recycle bin.
- Sinkronisasi user dari data pegawai.
- Pemetaan jabatan aktif menjadi role awal.
- Pencatatan pembuat atau pengubah pada beberapa proses.

### 4.12 Approval perubahan data

Jenis perubahan yang terlihat:

- `biodata_update`.
- Pengajuan keluarga, termasuk pasangan, anak, dan orang tua.

Fitur approval:

- Daftar antrian pengajuan.
- Filter status.
- Filter tanggal pengajuan atau tanggal otorisasi.
- Filter kantor jika scope user mengizinkan.
- Detail pegawai dan jenis perubahan.
- Perbandingan data lama dan data baru.
- Komentar approval.
- Approve.
- Reject.
- Pembatasan berdasarkan unit kerja atau kantor.
- Riwayat status pengajuan pada user.

Status yang ditemukan: `pending`, `approved`, dan `rejected`.

### 4.13 Notifikasi dan audit

Fitur yang terlihat:

- Halaman notifikasi user.
- Link notifikasi dari header layout.
- Notifikasi yang berkaitan dengan status pengajuan atau approval.
- Tabel `tb_notifikasi`.
- Tabel `tb_log_aktivitas` dengan user, aksi, keterangan, IP, dan user agent.

Rebuild wajib menentukan:

- Kapan notifikasi dibuat.
- Kapan notifikasi dianggap terbaca.
- Apakah audit log wajib untuk semua perubahan atau hanya operasi sensitif.
- Retensi dan akses ke audit log.

### 4.14 Konfigurasi aplikasi

Konfigurasi yang ditemukan:

- Nama aplikasi.
- Alias aplikasi.
- Logo aplikasi.
- Base URL dan routing legacy.
- Asset tampilan yang dipakai layout.

## 5. Status migrasi teknis saat ini

### 5.1 API dan backend

Backend PHP 8 yang ada saat ini sudah memiliki:

- Router API.
- Response JSON dengan format `success`, `data`, dan `meta`.
- Health check.
- API info.
- API catalog.
- List pegawai dengan pagination, pencarian, dan filter unit kerja.
- Detail pegawai.
- Data keluarga pegawai.
- Generic resource read API dengan whitelist tabel.
- Prepared statement pada repository baru.
- Endpoint mutation yang disabled secara default.
- Draft endpoint auth untuk login, current session, dan logout.

Resource yang sudah didaftarkan mencakup pegawai, keluarga, jabatan, kantor, user, konfigurasi, master referensi, pendidikan, bahasa, diklat, sertifikasi, pengangkatan, mutasi, pelanggaran, seluruh riwayat, formasi, pending edit, notifikasi, dan log aktivitas.

Statusnya belum menjadi aplikasi Laravel dan belum menggantikan page legacy.

### 5.2 Frontend prototype

Frontend prototype saat ini menyediakan:

- Shell dengan sidebar, menu mobile, search event, notification menu, user menu, dan toggle tema.
- Komponen button, input, select, form, alert, modal, toast, badge, card, table, pagination, dropdown, tabs, drawer, empty state, dan skeleton loading.
- Halaman daftar pegawai melalui API.
- REST API Center untuk melihat catalog dan mencoba endpoint.
- Component showcase sebagai playground.
- State loading, error, dan empty pada sebagian alur prototype.

Prototype ini bukan target akhir. Rebuild akan memakai Inertia.js dan React sebagai UI utama.

## 6. Target produk rebuild

### 6.1 Stack

- Backend: Laravel.
- Server-driven navigation: Inertia.js.
- UI: React.
- Database: MySQL atau MariaDB sesuai kompatibilitas data existing.
- Queue, file storage, dan cache: keputusan teknis dibuat pada fase setup.

Versi Laravel, React, Inertia, PHP, dan database belum ditentukan dalam PRD ini.

### 6.2 Prinsip arsitektur

- Page Inertia menjadi boundary UI per domain.
- Controller Laravel hanya menyiapkan data dan menjalankan use case, bukan menaruh query besar di view.
- Form Request menangani validasi input.
- Policy atau Gate menangani authorization di server.
- Service atau Action menangani alur yang melibatkan approval, import, export, dan perubahan status.
- Model dan query layer memakai relasi yang eksplisit.
- Import dijalankan dengan preview, validasi per baris, dan laporan hasil.
- Operasi delete memakai aturan yang jelas: soft delete, recycle bin, atau arsip.
- File disimpan melalui abstraction storage, bukan path hard-code di view.
- Audit log dibuat untuk perubahan data sensitif.
- UI tidak mengakses database secara langsung.

### 6.3 Frontend Anti-Slop

Aturan berikut menjadi acceptance criteria FE:

- UI dibuat berdasarkan kebutuhan layar dan tugas pengguna, bukan template dashboard generik.
- Setiap tombol, link, tab, modal, filter, dan form harus memiliki perilaku nyata.
- Setiap layar data wajib memiliki state loading, kosong, error, dan sukses.
- Navigasi hanya menampilkan destination yang benar-benar tersedia.
- Copy memakai istilah domain SIMPEG yang spesifik, tanpa klaim, angka, atau data contoh yang dibuat-buat.
- Tidak memakai placeholder realistis sebagai data final. Gunakan placeholder yang jelas jika data belum tersedia.
- Layout wajib dapat dipakai pada desktop, tablet, dan mobile tanpa horizontal overflow.
- Interaksi penting wajib dapat dijalankan dengan keyboard dan memiliki focus state yang terlihat.
- Kontras teks harus memenuhi WCAG AA.
- Warna, typography, layout, spacing, icon, card, dan motion harus memiliki alasan penggunaan yang tercatat.
- Tidak membuat visual yang meniru produk lain tanpa arahan pemilik produk.
- Arah visual harus ditentukan sebelum implementasi. Jika belum ada brief visual, implementasi harus ditandai sebagai draft tanpa direction dan tidak dianggap siap rilis.

Draft Design Read untuk fase implementasi:

> Membaca SIMPEG sebagai aplikasi operasional kepegawaian internal untuk admin, kepala unit, dan pegawai, dengan visual language yang tenang, jelas, dan berorientasi kerja. Nilai ENERGY, RHYTHM, dan MOTION ditetapkan setelah product owner memilih arah visual.

Dokumen ini tidak menetapkan palette, font, logo, icon set, atau tema final.

## 7. Prioritas rebuild yang disarankan

Urutan ini dipakai sebagai starting point dan masih dapat diubah setelah workshop bisnis.

### Fase 0: fondasi

- Setup Laravel, Inertia, React, database, storage, mail atau notification channel jika diperlukan.
- Migrasi authentication dan session.
- Definisi role, policy, scope kantor, dan audit log.
- Shell navigasi, error handling, form handling, dan pola state FE.

### Fase 1: akses dan profil pegawai

- Login, logout, current user, dan redirect role.
- Dashboard ringkas sesuai role.
- Daftar pegawai.
- Detail pegawai.
- Profil sendiri.
- Ganti foto.
- Riwayat pengajuan dan notifikasi.

### Fase 2: keluarga dan approval

- Pasangan, anak, dan orang tua.
- Pengajuan perubahan biodata.
- Pengajuan perubahan keluarga.
- Antrian approval.
- Detail perbandingan data lama dan data baru.
- Approve, reject, komentar, dan notifikasi hasil.

### Fase 3: master dan riwayat inti

- Kantor dan unit kerja.
- Jabatan dan riwayat jabatan.
- Pendidikan dan bahasa.
- Pangkat.
- Pengangkatan.
- Mutasi.

### Fase 4: pengembangan pegawai

- Diklat.
- Biaya pendidikan.
- Sertifikasi.
- Pelanggaran.
- Cuti.
- DP3 atau SKP.
- Latihan jabatan.
- Penghargaan.
- Penugasan.
- Seminar.

### Fase 5: laporan dan administrasi

- Laporan nominatif.
- Keadaan pegawai.
- Formasi dan keterisian.
- Rekap biaya diklat dan pendidikan.
- Print dan export.
- Manajemen user.
- Konfigurasi aplikasi.
- Tools sinkronisasi.

## 8. Kebutuhan nonfungsional

### Keamanan

- Authorization dicek di backend pada setiap page dan action.
- User hanya dapat mengakses data miliknya sesuai aturan bisnis.
- Validasi upload memeriksa tipe, ukuran, nama, dan lokasi penyimpanan.
- Password baru memakai hashing modern.
- SSO token dan session cookie memiliki expiry serta konfigurasi secure yang benar.
- Query memakai Eloquent atau prepared statement dan tidak menyisipkan input mentah.
- Endpoint internal tidak boleh terbuka ke internet tanpa autentikasi dan authorization.

### Data dan integritas

- Perubahan biodata dan keluarga yang sensitif memakai workflow approval.
- Import memiliki preview, validasi, daftar error, dan hasil sukses per baris.
- Delete sensitif memakai soft delete atau arsip sesuai keputusan bisnis.
- Perubahan status pegawai, jabatan aktif, mutasi, dan pengangkatan dicatat sebagai transaksi yang dapat diaudit.
- Migrasi data harus memiliki mapping kolom dan laporan baris yang gagal.

### Pengalaman pengguna

- Semua page utama memiliki title, konteks role, dan navigasi yang konsisten.
- Table besar mendukung pencarian, filter, pagination, dan empty state yang jelas.
- Form menampilkan validasi di dekat field serta ringkasan error saat submit gagal.
- Aksi destruktif meminta konfirmasi dan menjelaskan dampaknya.
- Loading state tidak membuat pengguna menekan submit berulang kali.
- Mobile tidak menjadi versi yang kehilangan fungsi penting.

### Observability

- Error aplikasi memiliki correlation identifier atau konteks request.
- Operasi import, approval, export, login gagal, dan perubahan permission dapat ditelusuri.
- Admin memiliki akses ke audit log sesuai policy.

## 9. Acceptance criteria tingkat produk

Rebuild dapat dianggap siap masuk tahap uji modul jika:

- Role dan scope akses dapat diuji dengan akun untuk setiap role.
- Tidak ada page yang dapat diakses hanya karena link disembunyikan.
- Alur login, logout, timeout, dan redirect role lulus smoke test.
- Alur daftar, detail, tambah, edit, dan validasi pegawai lulus test.
- Alur pengajuan user, approval, reject, dan notifikasi lulus test.
- Import menghasilkan preview, error per baris, dan ringkasan hasil.
- Export memakai filter yang sama dengan layar.
- Empty, loading, error, dan success state tersedia pada page data.
- Mobile dan keyboard test dilakukan pada semua page utama.
- Tidak ada data dummy yang terlihat seperti data produksi.
- Setiap keputusan visual utama memiliki alasan dan mengikuti brief visual yang telah disetujui.

## 10. Keputusan yang masih dibutuhkan

1. Apakah login rebuild memakai SSO BKK sebagai sumber utama, dengan login lokal sebagai fallback, atau memutus fallback lokal?
2. Apakah nama role tetap `superadmin`, `admin`, `kepala`, dan `user`?
3. Apakah pemetaan role otomatis dari jabatan masih berlaku, atau role harus selalu ditetapkan admin?
4. Apa definisi scope kantor untuk admin pusat, kepala, dan kabid operasional?
5. Apakah semua modul legacy dipertahankan, atau ada modul yang dihentikan?
6. Format laporan mana yang harus sama persis dengan output lama?
7. Apakah data lama dimigrasikan ke schema baru atau Laravel membaca schema existing terlebih dahulu?
8. Bagaimana aturan recycle bin, restore, dan retensi data?
9. Di mana file foto, sertifikat, SK, dan dokumen laporan disimpan?
10. Apakah notifikasi cukup in-app, atau perlu email atau kanal lain?
11. Apakah API publik atau integrasi aplikasi lain termasuk scope rebuild tahap pertama?
12. Siapa pemilik keputusan visual untuk palette, typography, density, theme, dan motion FE?

## 11. Di luar scope branch ini

- Implementasi Laravel.
- Instalasi dependency.
- Perubahan schema database.
- Migrasi data.
- Endpoint API baru.
- Page Inertia atau komponen React.
- File CSS, asset, logo, icon, dan design system final.
- Penghapusan atau pemindahan code legacy.

