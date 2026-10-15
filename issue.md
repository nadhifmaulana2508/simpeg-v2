# Catatan pengerjaan SIMPEG

Dokumen utama: [PRD SIMPEG Perbankan](docs/PRD-SIMPEG-PERBANKAN.md).
Referensi legacy: [inventaris sistem lama](docs/PRD-REBUILD-LARAVEL-INERTIA-REACT.md).
Branch saat ini: `feature/prototype-fe`.
Terakhir diperbarui: 15 Oktober 2026.

## Aturan kerja

- Baca dokumen ini dan PRD sebelum mengerjakan tugas.
- Satu tahap dan satu issue implementasi aktif pada satu waktu.
- Kerjakan cakupan issue; catat kebutuhan tambahan sebagai backlog.
- Status `done` wajib memiliki bukti acceptance criteria dan hasil verifikasi.
- Setelah gate tahap selesai, tunggu arahan pengguna untuk lanjut.
- Setiap akhir sesi catat hasil, keputusan, blocker, dan langkah berikut.
- Jangan mengubah keputusan bisnis yang terbuka menjadi asumsi implementasi tanpa catatan.
- Jangan memasukkan `.env`, kredensial, foto pegawai, dokumen pribadi, atau dump produksi ke Git.
- Commit dan PR menyebut ID issue. Push dilakukan mengikuti instruksi pengguna untuk sesi terkait.

## Posisi saat ini

Tahap aktif: **Prototype alur FE**.
Issue aktif: **SIMPEG-PROTO-001**.
Prototype berjalan sebagai React SPA + Vite + TypeScript + shadcn/ui dengan data sintetis, tanpa API dan database. Arah visual: minimal-modern; menu/submenu dirinci per role. PRD tetap draft; framework PHP dan pemetaan organisasi belum final.

## Indeks tahap

| ID | Tahap | Status | Dependensi |
| --- | --- | --- | --- |
| SIMPEG-000 | PRD dan keputusan | in_progress | Masukan pemilik bisnis |
| SIMPEG-PROTO-001 | Prototype alur FE | in_review | Menu/submenu draft menunggu review atasan; keputusan role/scope produksi belum final |
| SIMPEG-001 | Fondasi FE/BE dan akses | backlog | 000 disetujui dan arahan lanjut |
| SIMPEG-002 | Organisasi dan hierarki | backlog | 001 |
| SIMPEG-003 | Pegawai inti | backlog | 002 |
| SIMPEG-004 | Pengajuan, keluarga, dokumen | backlog | 003 |
| SIMPEG-005 | Riwayat jabatan dan mutasi | backlog | 004 |
| SIMPEG-006 | Pelatihan, sertifikasi, CV | backlog | 005 |
| SIMPEG-007 | Migrasi pegawai pilot | backlog | 006 |
| SIMPEG-008 | KPI dasar | backlog | 007 dan kebijakan KPI |
| SIMPEG-009 | KPI nonpemasaran | backlog | 008 |
| SIMPEG-010 | Monbis dan KPI pemasaran | backlog | 009 dan kontrak Monbis |
| SIMPEG-011 | KPI final, keberatan, laporan | backlog | 010 |
| SIMPEG-012 | Absensi dasar | backlog | 011 dan sumber absensi |
| SIMPEG-013 | Koreksi/izin/lock absensi | backlog | 012 |
| SIMPEG-014 | UAT dan rollout bertahap | backlog | 013 |

## SIMPEG-PROTO-001 - Prototype alur FE

Status: `in_review`.
Tujuan: memberi atasan gambaran flow dan menu berdasarkan persona sebelum API dan database dibangun.
Cakupan: selector persona demo; navigasi menu dan submenu per role; peta menu; rincian tujuan, alur, data, dan keputusan terbuka tiap submenu; profil/riwayat pegawai, laporan SDM, KPI/self-assessment/Monbis, antrean penilaian, pengajuan perubahan/koreksi absensi, serta simulasi absensi.
Di luar cakupan: autentikasi SSO, otorisasi produksi, API, database, pengiriman foto/lokasi, face recognition sungguhan, dan validasi geofence perangkat.

Acceptance criteria:

- [x] Tiap persona menampilkan menu yang sesuai rancangan awal; Tim IT melihat semua menu hanya di prototype.
- [x] Menu dikelompokkan menjadi submenu yang dapat dibuka; tiap submenu menuju layar detail rancangan.
- [x] Peta menu menunjukkan daftar per role dan menyediakan navigasi langsung ke rincian submenu.
- [x] Halaman rancangan menjelaskan tujuan, alur, data, dan keputusan yang belum disepakati; rancangan tidak diklaim sebagai fitur final.
- [x] Alur profil, laporan lintas kantor, self-assessment, penilaian berjenjang, perubahan data, dan koreksi absensi bisa dicoba.
- [x] Absensi menunjukkan konsep pemeriksaan wajah dan radius 20 meter tanpa membuka kamera atau meminta lokasi perangkat.
- [x] Data sintetis ditandai demo dan tidak dikirim ke server.
- [x] Layout memiliki perubahan nyata untuk desktop, tablet, dan ponsel; tersedia mode terang/gelap.
- [x] Setiap menu menampilkan referensi tabel legacy dan entitas target konseptual; sumber yang belum teridentifikasi dinyatakan terbuka.
- [x] Setiap menu memiliki formulir catatan diskusi yang tersimpan lokal per menu dan dapat diekspor menjadi satu buku Markdown.
- [x] Batas penyimpanan lokal dan larangan mencatat PII/kredensial ditampilkan pada UI serta didokumentasikan.
- [x] Build produksi Vite dan pemeriksaan TypeScript berhasil.
- [ ] Click-through dan pemeriksaan visual lintas viewport oleh browser selesai.
- [ ] Pengguna/atasan mengonfirmasi flow dan label peran sebelum prototype dianggap selesai.

Hasil sementara: menu bertingkat per persona dan halaman detail submenu dilengkapi daftar tabel lama, entitas target usulan, pertanyaan diskusi, serta catatan workshop lokal yang dapat diekspor. Nama tabel legacy dicocokkan dengan inventaris ERD; kandidat KPI/absensi yang belum terkonfirmasi ditandai terbuka. Template catatan bersama ditambahkan di `docs/CATATAN-DISKUSI-SIMPEG.md`.
Verifikasi: `npm run build` menjalankan TypeScript dan Vite, keduanya berhasil. `curl -I http://127.0.0.1:5175/` merespons HTTP 200. Pemeriksaan statis menemukan 25 nama tabel legacy unik pada mapping dan semuanya ada di inventaris ERD. Pasangan teks baru yang memakai warna muted/subtle melewati contrast checker; fokus terlihat dari aturan bersama yang sebelumnya diperiksa. `git diff --check` bersih. Browser tidak tersedia di sesi ini, jadi penyimpanan, unduh, klik-through, dan tampilan lintas viewport belum dicoba langsung.
Blocker: browser lokal tidak tersedia untuk uji interaksi/visual. Jalur evaluasi KPI, kewenangan laporan lintas kantor, dan sejumlah kandidat mapping tetap menunggu persetujuan pemilik proses.
Langkah berikut: tinjau menu dan tabel bersama atasan/SDM/IT; ekspor serta tinjau catatan workshop; lakukan click-through desktop/tablet/ponsel saat browser tersedia. Jangan hubungkan API sebelum tahap PRD dan arahan implementasi disetujui.

## SIMPEG-000 - Susun PRD dan keputusan bisnis

Status: `in_progress`.
Tujuan: menyepakati produk dan urutan pembangunan sebelum menulis aplikasi.
Cakupan: tiga domain, kantor/hierarki, role/scope, workflow, integrasi, arsitektur, inventaris DDL legacy, ERD konseptual, kebijakan dokumentasi API, migration, acceptance criteria, dan pencatatan kerja.
Di luar cakupan: setup framework, schema/migration SQL final, endpoint, komponen UI, import dump, perubahan database lama, dan migrasi produksi.

Acceptance criteria:

- [x] Draft tiga domain terpisah beserta kebutuhan lintas domain.
- [x] Rancangan role dan scope, termasuk konflik kepentingan.
- [x] KPI pemasaran/Monbis dan nonpemasaran/Kabid-Kadiv memiliki alur dan pengecualian.
- [x] Absensi memiliki sumber, jadwal, koreksi, dan status belum lengkap.
- [x] Urutan tahap dan aturan gate selesai tertulis.
- [x] `issue.md` memiliki status, template, keputusan, dan catatan sesi.
- [x] Pilihan arsitektur disepakati: React SPA + PHP REST API, tanpa Inertia.
- [x] Requirement OpenAPI dengan Swagger UI `Try it out` di lokal/test ditambahkan ke PRD.
- [x] DDL `masq2971_simpeg_dummy.sql` diperiksa tanpa mengimpor atau membaca isi record; 44 definisi tabel tercatat.
- [x] ERD konseptual dan peta awal tabel legacy ke entitas target dibuat.
- [x] PRD menyatakan database legacy tidak diubah dan penghapusan tabel/kolom perlu bukti serta persetujuan.
- [x] Nama schema target dikonfirmasi pengguna: `simpeg_v2`.
- [x] Klarifikasi bahwa `tb_pegawai` dipakai untuk biodata dan `tb_apk` mencatat akses ke beberapa aplikasi ditambahkan.
- [x] Cara validasi tabel/kolom per menu, pencatatan keputusan workshop, serta batas penggunaan catatan lokal dimasukkan ke PRD.
- [ ] Framework PHP disepakati.
- [ ] Struktur kantor dan contoh jalur penilai nyata dikonfirmasi.
- [ ] Aturan auto-provisioning akun dan pemilik entitlement per aplikasi (SIMPEG atau SSO) disepakati.
- [ ] HR/IT/DBA meninjau ERD, mapping, identitas SSO, dan tabel kandidat arsip.
- [ ] Pemilik persetujuan bisnis dan scope tahap pertama ditetapkan.
- [ ] PRD draft ditinjau pengguna; tahap 00 belum dianggap selesai.

Hasil: PRD diperluas dengan database dan dokumentasi API; ERD target serta inventory/mapping awal dibuat di `docs/ERD-SIMPEG-V2.md`. Database lama dan dump tidak diubah.
Verifikasi: parsing DDL menghasilkan 44 tabel dan ERD memetakan seluruh 44 nama. `tb_pegawai.id_peg` adalah PK dan `pegawai_uid` bukan PK; `tb_apk` punya delapan flag aplikasi default `0`, kolom `pass`/OTP, serta dua FK `id_peg` yang bertentangan. Empat blok Mermaid dan tautan lokal diperiksa; file memiliki nol trailing whitespace dan nol em/en dash. Tidak ada import/query terhadap database. Diagram belum dirender dengan Mermaid CLI.
File berubah: `docs/PRD-SIMPEG-PERBANKAN.md`, `docs/ERD-SIMPEG-V2.md`, dan `issue.md`.
Blocker sebelum schema SQL: framework PHP, pemetaan organisasi, review HR/IT/DBA, aturan provisioning/entitlement, pemilik persetujuan, serta verifikasi penggunaan tabel/kolom lama.
Langkah berikut: review ERD, setujui identifier pegawai dan hubungan korwil/kantor, lalu pastikan apakah SIMPEG atau SSO menjadi pemilik akses per aplikasi. Jangan mulai hapus/rename tabel di database lama.

## Log keputusan

| ID | Keputusan | Status | Dampak |
| --- | --- | --- | --- |
| D-001 | FE React/Vite/TypeScript/shadcn/ui; BE PHP | arahan pengguna | Versi/framework ditentukan tahap 00/01 |
| D-002 | React SPA mengakses PHP REST API; tanpa Inertia | disepakati pengguna, 14 Oktober 2026 | Routing halaman di FE; framework PHP belum dipilih |
| D-003 | KPI pemasaran menggunakan realisasi Monbis | arahan pengguna | Protokol dan granularity sumber belum diketahui |
| D-004 | Nonpemasaran self-assessment, Kabid/Kadiv sesuai hierarki | arahan pengguna | Jalur per kategori dan pengecualian perlu contoh nyata |
| D-005 | Kantor 100+ di Jateng, pusat/korwil/cabang/kankas | arahan pengguna | Relasi parent vs koordinasi belum final |
| D-006 | Selesaikan satu tahap sebelum lanjut | arahan pengguna | Gate dan persetujuan lanjut wajib dicatat |
| D-007 | Inventaris legacy terpisah dari target produk baru | rancangan dokumen | Fitur lama tidak otomatis dibangun sekaligus |
| D-008 | SSO BKK mengambil/memvalidasi status pegawai dari SIMPEG; semua aplikasi memakai login terpusat | arah kebutuhan dikonfirmasi pengguna; kontrak teknis perlu diverifikasi | Status nonaktif memblokir login baru di semua aplikasi |
| D-009 | React mengakses API SIMPEG; backend SIMPEG menjadi klien SSO dan membuat sesi aplikasi | rekomendasi arsitektur, menunggu persetujuan | Token SSO disimpan server-side; role dan scope tetap dikelola tiap aplikasi |
| D-010 | Sesi aktif boleh berlanjut; setelah logout atau sesi berakhir, pegawai nonaktif tidak dapat login ulang | dikonfirmasi pengguna | Batas sesi/refresh harus mencegah sesi tanpa akhir; pencabutan seketika tidak diwajibkan |
| D-011 | Setiap API baru memiliki kontrak OpenAPI dan dokumentasi interaktif yang dapat dicoba pada lokal/test | permintaan pengguna; standar teknis usulan | Swagger UI `Try it out`, contoh sintetis, dan pemeriksaan kontrak masuk acceptance criteria issue API |
| D-012 | Produk bernama `simpeg-v2`; schema MySQL target `simpeg_v2` | dikonfirmasi pengguna, 15 Oktober 2026 | Buat target terpisah; database lama dipertahankan |
| D-013 | `db/masq2971_simpeg_dummy.sql` menjadi sumber legacy untuk inventaris dan rancangan migrasi | arahan pengguna | Dump hanya diperiksa sebagai DDL saat tahap ini; tidak dijalankan, diubah, atau dimasukkan ke Git |
| D-014 | Tabel/kolom legacy hanya diarsipkan/dikecualikan setelah audit penggunaan, review data, retensi, dan persetujuan | batas aman rancangan PRD | Label `copy`, `old`, `trash`, atau kolom kosong bukan bukti cukup untuk menghapus |
| D-015 | `tb_pegawai` menyimpan daftar/biodata; `tb_apk` mengatur akses pegawai ke beberapa aplikasi | klarifikasi pengguna, 15 Oktober 2026; aturan auto-provisioning belum final | Entitlement aplikasi dipisah dari status pegawai, akun, dan permission/menu; flag legacy dipetakan per aplikasi |

## Template issue

Gunakan template ini ketika memecah tahap menjadi pekerjaan kecil:

```text
ID dan judul:
Tahap:
Status: backlog/ready/in_progress/blocked/in_review/done
Tujuan dan pemilik:
Cakupan:
Di luar cakupan:
Dependensi:
Keputusan bisnis yang diperlukan:
Acceptance criteria:
- [ ] Kriteria yang dapat diperiksa
Hasil implementasi:
File berubah:
Verifikasi: perintah/skenario, hasil aktual, tanggal
Risiko atau batasan yang masih ada:
Blocker:
Langkah berikut:
Commit/PR:
Persetujuan selesai/lanjut:
```

## Log sesi

### 14 Oktober 2026 - Draft PRD 0.1

Permintaan: diskusi dan dokumentasi SIMPEG perbankan; belum implementasi aplikasi.
Hasil: PRD target ditulis dengan tiga domain, role/scope, organisasi bertanggal berlaku, alur Monbis, self-assessment, absensi, migrasi, dan 15 tahap. Pencatatan kerja dibuat di root.
Keputusan belum tersedia: penggunaan Inertia bersama REST API, detail hirarki nyata, kontrak Monbis, sumber absensi, rumus KPI, dan pemilik kebijakan.
Langkah berikut: lanjut pembahasan tahap 00. Tidak memulai tahap 01 tanpa penyelesaian keputusan dan arahan pengguna.

### 14 Oktober 2026 - Konfirmasi arsitektur

Pengguna memilih React SPA + Vite + TypeScript + shadcn/ui, PHP REST API, tanpa Inertia. PRD bagian 5 dan D-002 diperbarui; checklist arsitektur ditutup. Catatan draft sebelumnya merekam kondisi sebelum konfirmasi ini.
Verifikasi: pilihan dan status keputusan diperiksa pada PRD dan issue; belum ada implementasi aplikasi.
Langkah berikut: validasi hubungan kantor dan unit kerja serta contoh jalur penilai nonpemasaran. Framework PHP tetap terbuka.

### 14 Oktober 2026 - Diskusi login SSO BKK

Pengguna membagikan contoh `POST /api/auth/login` dan `GET /api/auth/whoami` di `apisso.bkkjateng.co.id`. PRD menambahkan rancangan server-to-server: backend SIMPEG meneruskan kredensial ke SSO, mengambil identitas, memetakan pegawai lokal, lalu membuat sesi SIMPEG untuk React SPA. Token/kredensial contoh tidak dicatat.
Status: rancangan rekomendasi, belum final. Perlu konfirmasi pemilik SSO tentang TTL, revoke/logout, lockout/rate limit, SLA, dan aturan akun nonaktif.
Verifikasi: cek panduan resmi Laravel Sanctum dan rekomendasi pengelolaan sesi OWASP; belum melakukan request login terhadap layanan SSO.
Langkah berikut: pastikan framework PHP dan kebijakan sesi SSO sebelum menutup keputusan tahap 00.

### 14 Oktober 2026 - Klarifikasi sumber status dan SSO

Pengguna mengklarifikasi bahwa layanan login SSO mengambil data pegawai dari SIMPEG. Satu status nonaktif di SIMPEG dimaksudkan untuk mencegah login ke semua aplikasi SSO tanpa mengubah user satu per satu. PRD diperbarui untuk menjadikan SIMPEG sumber status pegawai, memisahkan autentikasi pusat dari role per aplikasi, dan mencatat kebutuhan validasi/introspeksi sesi yang sudah aktif.
Catatan teknis: pemeriksaan status saat login hanya menolak login baru. Pemblokiran request pada sesi/JWT yang sudah diterbitkan memerlukan validasi status/token terbaru atau mekanisme pencabutan/propagasi.
Verifikasi sumber: RFC 7662 menjelaskan introspeksi status aktif token dan trade-off cache; belum melakukan request ke SSO.
Langkah berikut: konfirmasi kontrak SSO untuk `whoami`, validasi/introspeksi, revoke, TTL, dan batas propagasi status.

### 14 Oktober 2026 - Klarifikasi sesi pegawai nonaktif

Pengguna menetapkan bahwa sesi yang masih terbuka boleh berlanjut. Setelah pengguna logout atau sesi berakhir, pegawai yang sudah keluar/pensiun tidak dapat login lagi karena SSO memeriksa status SIMPEG. PRD dan D-010 diperbarui; pencabutan sesi aktif seketika diturunkan menjadi opsi masa depan.
Langkah berikut: tetapkan durasi idle/absolut sesi dan pastikan proses refresh meminta status terbaru dari SSO.

### 14 Oktober 2026 - Requirement API docs, database, dan ERD

Pengguna meminta API yang dibuat nanti memiliki dokumentasi yang bisa dicoba langsung, menyebut `db/masq2971_simpeg_dummy.sql` sebagai sumber data SIMPEG, meminta database baru `simpeg-v2`, dan meminta database lama tetap ada. Fokus pekerjaan ditetapkan pada PRD dan ERD, belum perubahan schema.

Hasil: PRD menambahkan OpenAPI 3.1, Swagger UI `Try it out` di lokal/test, contoh sintetis, dan acceptance criteria per endpoint. ERD konseptual membagi identitas/organisasi, profil/approval, KPI/Monbis, dan absensi; dokumen memetakan semua 44 tabel DDL ke kandidat target atau kategori review.

Temuan struktur yang perlu ditinjau: ada tiga salinan tabel `tb_pegawai` dengan 27 kolom serupa, `tb_pegawai_2` versi 20 kolom, dan dua FK bertentangan pada `tb_apk.id_peg`. Ini bukan persetujuan menghapus atau menggabungkan tabel.

Keputusan saat itu: `simpeg-v2` dipakai sebagai nama produk; `simpeg_v2` diusulkan sebagai nama schema MySQL. Pengguna mengonfirmasi nama fisik `simpeg_v2` pada 15 Oktober 2026. Database lama dan dump tidak disentuh.

Verifikasi: pembacaan hanya definisi DDL; tidak membaca record `INSERT`, menjalankan SQL, atau membuka koneksi database. Belum dilakukan pemeriksaan kode lama untuk mengetahui pemakaian tabel/kolom dan belum diverifikasi isi dummy/anonim pada dump.

Langkah berikut: pengguna/HR/IT/DBA review ERD dan mapping; setujui identifier pegawai, struktur kantor/korwil, serta pemilik dan aturan provisioning akses aplikasi sebelum issue pembuatan migration dibuka.

### 15 Oktober 2026 - Konfirmasi nama database dan fungsi tabel akses

Pengguna menyetujui nama schema target `simpeg_v2`, dengan database lama tetap dipertahankan. Pengguna mengonfirmasi `tb_pegawai` adalah daftar pegawai/biodata dan menjelaskan `tb_apk` untuk mengatur aplikasi yang boleh diakses pegawai.

Pemeriksaan DDL `tb_apk` menemukan flag per aplikasi (`monbis`, `ims`, `rekrutmen`, `simstock`, `simpeg`, `visitin-ao`, `portal_bkk`, `sipatuh`), kolom `status`, `pass`, `otp`, dan `otp_expired_at`. Desain ERD memisahkan entitlement per pegawai/aplikasi dari provisioning akun serta permission/menu. Saat akses sebuah aplikasi dimatikan, API aplikasi itu ditolak; status pegawai dan akses aplikasi lain tidak berubah. Hak menu tetap ditegakkan oleh permission backend.

DDL menunjukkan `tb_pegawai.id_peg` adalah primary key dan `pegawai_uid` bukan primary key. Semua delapan flag aplikasi pada `tb_apk` memiliki default `0`. Nilai default tersebut tidak menjelaskan apakah proses lama otomatis membuat record untuk tiap pegawai atau tiap aplikasi.

Belum diputuskan apakah semua pegawai otomatis mendapat akun di setiap aplikasi atau hanya menerima record/akun saat entitlement diberikan. Pemilik entitlement juga belum dipastikan antara SIMPEG dan SSO. Kolom password/OTP tidak dipindahkan ke model baru. Database dan dump tidak diubah.

Langkah berikut: konfirmasi kebijakan provisioning default dan pemilik entitlement sebelum schema SQL atau integrasi SSO dirancang.

### 15 Oktober 2026 - Arahan visual dan detail menu prototype

Pengguna mengarahkan UI ke gaya minimal shadcn/ui yang modern serta meminta setiap menu dan submenu dijabarkan sedetail mungkin.

Hasil: navigasi prototype disusun bertingkat dan menyesuaikan persona Pegawai, Divisi SDM, Kabid/Penilai 1, Kacab atau Kadiv/Penilai 2, Korwil, Direksi, dan Tim IT. Peta role menyediakan semua struktur menu untuk ditinjau; setiap submenu memiliki layar dengan tujuan, urutan proses, informasi yang dikelola, dan keputusan yang masih terbuka. Layar simulasi KPI, pengajuan, absensi, dan penilaian tetap terpisah dari submenu rancangan. Menu Tim IT yang luas hanya untuk prototype.

Arahan desain dicatat di `frontend/README.md`: minimal-modern, hierarki menu operasional, aksen seperlunya, dan reflow mobile. File navigasi serta detail submenu berada di `frontend/src/lib/navigation.ts`; tampilan ada di `frontend/src/App.tsx` dan `frontend/src/index.css`.

Verifikasi: `npm run build` berhasil, termasuk `tsc --noEmit`. Pemeriksaan klik aktual dan visual lintas viewport masih menunggu browser review. Tidak ada API, database, kamera, atau lokasi perangkat yang diakses.

Status issue tetap `in_review`. Langkah berikut: minta atasan meninjau nama menu, batas akses, dan urutan alur; lalu click-through pada desktop/tablet/ponsel. Menu rancangan tidak dianggap keputusan fitur final.

### 15 Oktober 2026 - Pemetaan tabel dan catatan workshop per menu

Pengguna meminta tabel terkait ditampilkan di menu dan catatan diskusi disimpan agar pembahasan dengan divisi memudahkan pembangunan ulang.

Hasil: setiap screen memiliki referensi tabel legacy dari inventaris DDL, entitas target konseptual dari ERD, cakupan sumber, serta pertanyaan untuk pemilik proses. Sumber yang belum ditemukan, khususnya absensi dan Monbis, ditandai belum terkonfirmasi; `tb_dp3` diberi batas sebagai arsip KPI lama. Form catatan menyimpan isi per menu pada local storage browser dan tombol unduh menghasilkan satu buku Markdown untuk seluruh menu. Template keputusan resmi ditambahkan di `docs/CATATAN-DISKUSI-SIMPEG.md`, dan PRD menjelaskan workshop serta status kandidat/terkonfirmasi.

Batas: local storage tidak dibagikan lintas perangkat dan dapat dihapus browser. Jangan mencatat PII atau kredensial. Catatan yang disetujui perlu ditinjau dan disalin ke dokumen repo.

Verifikasi: build TypeScript/Vite berhasil; 25 nama tabel legacy unik di mapping ditemukan pada ERD; halaman dev merespons HTTP 200; pemeriksaan kontras teks baru lulus. Browser tidak tersedia, sehingga save/unduh, click-through, dan visual mobile belum diverifikasi langsung. Status tetap `in_review`.

Langkah berikut: lokakarya dengan SDM, pemilik KPI/Monbis, pemilik absensi, dan IT/DBA; catat field dan keputusan; lanjutkan uji browser saat tersedia.
