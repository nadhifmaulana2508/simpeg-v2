# PRD SIMPEG Perbankan

Versi: 0.3, 15 Oktober 2026. Status: draft untuk pembahasan bisnis dan ERD.
Branch dokumentasi: `prd/migrasi-simpeg-v2`.
Pemilik keputusan bisnis: belum ditetapkan.

## 1. Tujuan dan cara membaca

SIMPEG mengelola data pegawai, pengukuran kinerja, dan absensi untuk organisasi perbankan dengan lebih dari 100 kantor di Jawa Tengah. Jenis organisasi mencakup pusat, korwil, cabang, dan kantor kas. Jumlah pegawai, relasi kantor, dan volume transaksi perlu dikonfirmasi; tidak boleh disimpulkan dari jumlah kantor.

Dokumen ini adalah rancangan produk baru. Inventaris kemampuan aplikasi lama tetap tersimpan di `PRD-REBUILD-LARAVEL-INERTIA-REACT.md`. Adanya fitur di sistem lama tidak otomatis menjadikan fitur tersebut prioritas implementasi baru.

Label keputusan:

- **Ditetapkan pengguna**: tiga domain utama, PHP sebagai backend REST API, React/Vite/TypeScript/shadcn/ui sebagai FE, KPI pemasaran bersumber dari Monbis, nonpemasaran memakai self-assessment dengan Kabid/Kadiv sebagai penilai sesuai hierarki, pengerjaan bertahap dengan `issue.md`, dokumentasi API yang bisa dicoba, serta dump legacy `masq2971_simpeg_dummy.sql` sebagai sumber pemeriksaan/migrasi sambil mempertahankan database lama.
- **Usulan**: detail alur, role, status, rumus, dan target mutu di bawah ini. Wajib ditinjau sebelum tahap terkait dibangun.
- **Terbuka**: kebijakan atau informasi belum tersedia. Tidak boleh diam-diam dianggap keputusan final.

Keputusan arsitektur dikonfirmasi pengguna pada 14 Oktober 2026: React SPA + Vite + TypeScript + shadcn/ui, backend PHP REST API, tanpa Inertia. Framework PHP masih terbuka; lihat bagian 5.

## 2. Hasil yang diharapkan

1. HR memiliki satu sumber data pegawai dan riwayat yang dapat ditelusuri.
2. Pegawai dapat mengajukan pembaruan profil dan melihat hasil pengajuannya.
3. Pimpinan memperoleh informasi sesuai tanggung jawab organisasi, tanpa membuka data pribadi di luar kebutuhan.
4. KPI memiliki sumber realisasi, periode, target, penilai, dan jejak perubahan yang jelas.
5. Absensi dapat direkonsiliasi dengan jadwal kerja, izin, dan koreksi yang disetujui.
6. Setiap perubahan sistem memiliki issue, acceptance criteria, bukti verifikasi, dan catatan keputusan.

Indikator keberhasilan yang diusulkan: cakupan data wajib, tingkat kegagalan migrasi, pengajuan melewati tenggat, keterlambatan sinkronisasi Monbis, penilaian belum selesai, dan absensi belum direkonsiliasi. Nilai target ditentukan setelah baseline tersedia.

## 3. Batas produk

| Termasuk rancangan | Belum termasuk implementasi awal |
| --- | --- |
| Organisasi, jabatan, penempatan, identitas, hak akses | Payroll dan perhitungan pajak |
| Biodata, keluarga, pendidikan, riwayat jabatan, pelatihan, sertifikasi, CV | Rekrutmen, onboarding lengkap, dan talent succession |
| Approval, dokumen privat, audit, laporan | Transaksi nasabah atau pengganti core banking |
| KPI pemasaran dari Monbis dan nonpemasaran dari self-assessment | Penghitungan bonus otomatis dari KPI |
| Absensi, jadwal, koreksi, izin yang memengaruhi kehadiran | Absensi wajah/biometrik atau pelacakan lokasi terus-menerus |
| Migrasi data lama dan rekonsiliasi | Semua modul legacy sekaligus |

Riwayat pangkat, pengangkatan, penghargaan, penugasan, seminar, pelanggaran, cuti, dan biaya pendidikan dari legacy menjadi backlog yang perlu dipetakan. Tidak dihapus dari kebutuhan tanpa keputusan bisnis.

## 4. Organisasi dan hierarki

### 4.1 Model kantor

Setiap kantor memiliki ID stabil, kode unik, nama, jenis, status, tanggal berlaku, alamat, dan referensi parent. Parent tidak boleh membentuk siklus. Kantor yang ditutup diarsipkan, bukan dihapus jika memiliki riwayat.

Contoh struktur untuk validasi: pusat -> korwil -> cabang -> kantor kas. Ini bukan aturan final. Korwil dapat merupakan koordinasi lintas cabang tanpa menjadi parent administratif; model harus mampu menyimpan hubungan koordinasi terpisah jika diperlukan.

Unit kerja seperti divisi dan bidang merupakan entitas terpisah dari kantor fisik. Penempatan pegawai menghubungkan pegawai, kantor, unit, posisi, atasan, tanggal mulai/akhir, dan dasar penetapan.

### 4.2 Posisi dan pelaporan

- Pisahkan master jabatan dari posisi: satu jabatan dapat dipakai oleh banyak posisi di kantor berbeda.
- Posisi memuat unit, lokasi, atasan posisi, status aktif, dan tanggal berlaku.
- Pegawai dapat memiliki jabatan utama dan penugasan tambahan; hak akses rangkap perlu disetujui eksplisit.
- Struktur atasan mencakup Kabid, Kadiv, kepala kantor/cabang, dan koordinator wilayah sesuai kondisi nyata.
- Atasan penilai tidak disimpulkan hanya dari nama jabatan atau jenis kantor.
- Penugasan PLT dan delegasi memiliki tanggal berakhir; tidak menjadi hak permanen.
- Penempatan historis tidak boleh ditimpa. Mutasi menghasilkan record berlaku baru.
- Hak akses operasional mengikuti penempatan saat ini; akses evaluasi historis mengikuti assignment penilai untuk periode tersebut.
- Perubahan retroaktif yang memengaruhi akses atau KPI harus masuk pemeriksaan dampak dan audit.

### 4.3 Lingkup akses

Lingkup berupa diri sendiri, bawahan yang ditugaskan, kantor tertentu, kantor beserta turunannya, wilayah, unit, atau seluruh organisasi. Role dan scope diberikan terpisah. Role kepala cabang tidak otomatis mendapat seluruh wilayah.

Penggabungan beberapa penugasan harus eksplisit. Penolakan akses data sensitif tetap berlaku meskipun pengguna memiliki akses laporan agregat. Semua scope diperiksa backend pada daftar, detail, pencarian, lampiran, export, dan proses background.

## 5. Arsitektur dan batas FE/BE

### 5.1 Arsitektur yang disepakati

| Komponen | Tanggung jawab | Status |
| --- | --- | --- |
| React SPA + TypeScript | Halaman dan routing browser; seluruh data bisnis dibaca/diubah melalui REST API | Disepakati |
| Vite | Development server dan build frontend | Disepakati |
| shadcn/ui | Komponen UI yang disesuaikan kebutuhan operasional bank | Disepakati |
| PHP REST API | Authentication, authorization, workflow, data, perhitungan, dan integrasi | Disepakati; framework belum dipilih |

Inertia tidak digunakan dalam target produk ini. Backend tidak mengirim props halaman Inertia. Laravel tetap merupakan opsi framework PHP, bukan keputusan final. Library routing browser, autentikasi, deployment, dan versi dependency ditentukan pada fondasi setelah kebutuhan disepakati. Jangan memasang dependency pada tahap PRD.

Referensi: [Inertia](https://inertiajs.com/) menjelaskan routing server dan pendekatan tanpa kebutuhan API; [shadcn/ui](https://ui.shadcn.com/docs/installation) menyediakan jalur instalasi Vite maupun Laravel. Versi paket ditentukan pada tahap fondasi setelah pemeriksaan kompatibilitas.

### 5.2 Tanggung jawab

- FE: navigasi, form, tampilan data, state loading/kosong/error, aksesibilitas, dan validasi untuk membantu pengguna.
- BE: autentikasi, authorization, validasi final, rumus KPI, workflow, transaksi, audit, penyimpanan, dan integrasi Monbis.
- FE tidak menyimpan kredensial Monbis, mengakses database, menentukan izin final, atau menghitung skor resmi.
- Integrasi Monbis terjadi di BE; browser tidak mengakses Monbis langsung.
- Database dan penyimpanan dokumen privat tidak dapat diakses publik.

### 5.3 Kontrak API usulan

- Prefix versi `/api/v1`; daftar endpoint final dibuat per tahap.
- Respons sukses konsisten: `data`, `meta` untuk pagination, serta `request_id` bila diperlukan.
- Error: kode stabil, pesan pengguna, detail validasi per field, dan ID penelusuran; tidak memuat stack trace atau kredensial.
- Pagination server, search, sort whitelist, dan filter scope. Jangan mengunduh semua pegawai untuk filter browser.
- Status HTTP: 401 autentikasi, 403 izin, 404 objek tidak tersedia, 409 konflik versi/status, 422 validasi, 429 pembatasan request.
- Query daftar dan hasil export memakai aturan filter serta izin yang sama.
- Mutation memakai transaksi dan pemeriksaan versi untuk mencegah overwrite pengeditan bersamaan.
- Job import/sinkronisasi memiliki ID, status, jumlah hasil, dan daftar error yang aman.
- Pengulangan submit/sinkronisasi harus idempotent, khususnya approval, absensi, dan realisasi KPI.
- Autentikasi SPA memakai cookie/session yang dikelola BE menjadi rekomendasi; pilihan final deployment domain, CORS, CSRF, serta masa sesi ditetapkan pada tahap fondasi.

### 5.3.1 Dokumentasi API yang bisa dicoba

Setiap endpoint baru dan perubahan kontrak API wajib disertai spesifikasi OpenAPI 3.1 yang diperbarui bersama implementasinya. Dokumentasi menjadi kontrak yang bisa diperiksa FE, BE, QA, dan pemilik integrasi, bukan catatan yang tertinggal dari kode.

- Sediakan halaman Swagger UI atau alat kompatibel dengan tombol `Try it out` pada lingkungan lokal dan test. Akses ke halaman ini tidak dibuka di produksi kecuali pemilik keamanan menyetujuinya.
- Dokumentasikan method, path, tujuan, role/scope, parameter, skema request dan response, status HTTP, format error, pagination/filter, serta batasan data sensitif.
- Sertakan contoh request/response sintetis dan contoh `curl`. Nilai token, password, NIK, nomor rekening, data pegawai nyata, dan alamat layanan internal tidak boleh ditanam di contoh.
- Endpoint yang memerlukan autentikasi harus menyediakan cara memasukkan kredensial test melalui UI dokumentasi. Gunakan akun dan data khusus lingkungan lokal/test, bukan token SSO pegawai.
- Untuk autentikasi cookie/session, sajikan Swagger UI dari origin API yang sama bila memungkinkan. Jika test memakai origin berbeda, konfigurasi credentialed CORS dan CSRF hanya untuk lingkungan test, lalu uji alur login dan request terlindungi dari UI tersebut.
- `Try it out` harus mengarah ke API lokal/test yang dikonfigurasi. Konfigurasi produksi tidak boleh tersimpan pada bundle FE atau repositori.
- CI atau pemeriksaan tahap API memvalidasi sintaks OpenAPI dan menjalankan smoke test request/response untuk endpoint dalam scope issue.
- Postman collection boleh disediakan sebagai ekspor tambahan, tetapi OpenAPI menjadi sumber kontrak utama.

Acceptance criteria untuk setiap issue API: spesifikasi cocok dengan endpoint yang berjalan, contoh sukses dan error dapat dicoba di test, kebutuhan autentikasi/role terlihat, dan perubahan kontrak tercatat di PRD atau changelog API bila berdampak lintas konsumen.

### 5.4 Login terpusat melalui SSO BKK (arah kebutuhan pengguna)

Pengguna menjelaskan bahwa layanan SSO BKK mengambil/memvalidasi data pegawai dari SIMPEG sebagai sumber status akun. Tujuannya satu status pegawai berlaku untuk semua aplikasi yang terhubung, sehingga tidak perlu mengubah akun satu per satu. API yang dibagikan: `POST /api/auth/login` menerima `id_peg`, `password`, dan `app`; `GET /api/auth/whoami` menerima bearer token dan mengembalikan identitas/konteks pegawai. Contoh kredensial/token dari percakapan tidak disalin ke dokumen.

Alur login untuk SIMPEG baru:

1. Pegawai mengirim ID dan password melalui HTTPS ke endpoint login backend SIMPEG.
2. Backend SIMPEG menjadi klien SSO dan meneruskan request ke SSO BKK dengan `app` yang terdaftar. SSO memvalidasi kredensial dan status pegawai berdasarkan sumber SIMPEG.
3. Jika akun aktif dan autentikasi berhasil, backend SIMPEG meminta `whoami`, mencocokkan `employee_id` dengan record pegawai lokal, lalu membuat sesi SIMPEG sendiri.
4. React hanya menerima informasi profil minimum dan status sesi. Token SSO tetap di server dan tidak masuk ke JavaScript/browser storage.
5. Request API berikutnya memakai sesi SIMPEG. Backend tetap menentukan role dan scope akses dari otorisasi SIMPEG; `level` atau `job_position` SSO tidak otomatis menjadi izin aplikasi.
6. Logout menutup sesi SIMPEG. Revoke/logout SSO dipanggil jika layanan menyediakannya dan kontraknya diketahui.

Untuk semua aplikasi, identitas/status aktif dan autentikasi disentralisasi melalui SSO. Aplikasi boleh memiliki role/izin khusus aplikasi, tetapi tidak membuat password atau status aktif yang menyimpang dari sumber pegawai SIMPEG.

### 5.5 Penonaktifan pegawai dan sesi aplikasi

Kebijakan yang dikonfirmasi pengguna: status keluar/pensiun di SIMPEG memblokir login baru melalui SSO pada semua aplikasi terhubung. Sesi yang sedang aktif boleh berlanjut sampai pengguna logout atau sesi aplikasi berakhir. Setelah itu, login ulang harus ditolak karena SSO membaca status nonaktif dari SIMPEG. Pencabutan sesi aktif seketika bukan kebutuhan saat ini.

Semua aplikasi wajib meminta autentikasi ke SSO setiap kali pengguna login atau autentikasi ulang. Sesi lokal aplikasi harus memiliki batas idle/absolut yang ditentukan; tanpa batas sesi, pengguna dapat tetap mengakses aplikasi terlalu lama tanpa login ulang. Jika aplikasi memakai refresh token atau memperpanjang sesi, proses refresh harus mengecek status pegawai terbaru ke SSO agar status nonaktif tidak memperoleh sesi baru. Logout mengakhiri sesi aplikasi.

Perlu dibedakan bahwa JWT yang sudah diterbitkan dapat tetap diterima hingga kedaluwarsa oleh aplikasi yang hanya memeriksa tanda tangan/expiry. Ini sesuai kebijakan selama sesi/token tersebut masih berlaku, tetapi masa berlaku dan sesi lokal harus dibatasi serta disepakati. Endpoint introspeksi/revoke untuk memutus sesi yang sudah aktif dapat menjadi kebutuhan masa depan jika kebijakan berubah; belum diwajibkan pada scope ini.

Integrasi status SIMPEG ke SSO harus memakai service-to-service path yang terautentikasi dan tidak membuat lingkaran autentikasi (misalnya SSO memanggil endpoint pegawai yang hanya dapat diakses setelah login SSO). Database tidak dibuka langsung ke browser atau jaringan umum. Jika akses baca SSO ke data SIMPEG terpisah, proses sinkronisasinya harus memiliki target kesegaran dan audit.

Kontrak yang perlu diminta dari pemilik SSO: sumber otoritatif dan waktu update status; jaminan bahwa login menolak status nonaktif; masa berlaku token; perilaku refresh; kode error akun nonaktif/token kedaluwarsa; rate limit, SLA, dan batas request; audience/`app` per aplikasi; serta jalur aman SSO membaca status pegawai. Endpoint revoke/introspeksi dicatat sebagai opsi jika nantinya dibutuhkan. Backend tidak mencatat password, bearer token, atau isi token dalam log.

Jika memakai Laravel, Laravel Sanctum dengan autentikasi SPA berbasis cookie/session adalah opsi yang disarankan untuk klien browser first-party. Cookie harus dikonfigurasi `HttpOnly`, `Secure` pada HTTPS, `SameSite` yang sesuai, dan request perubahan data harus dilindungi CSRF. Bila SPA dan API berada pada subdomain berbeda, konfigurasi stateful domain, credentialed CORS, cookie domain, dan CSRF perlu diuji. Token SSO tidak disimpan di `localStorage` atau `sessionStorage`.

Identitas SSO membuktikan siapa pengguna, tetapi tidak menentukan izin SIMPEG. Role aplikasi, scope kantor, assignment penilai, dan status pegawai berasal dari aturan serta data otorisasi SIMPEG, bukan langsung dari `level` atau `job_position` pada respons `whoami`.

Kontrak yang perlu diminta dari pemilik SSO sebelum implementasi: masa berlaku token dan format expiry resmi, error/status untuk kredensial salah/akun nonaktif/token kedaluwarsa, rate limit dan lockout, endpoint logout/revoke/refresh jika ada, ketersediaan layanan, batas request, serta aturan penggunaan email/telepon. Backend tidak mencatat password, bearer token, atau isi token dalam log. Mengikuti keputusan pengguna, sesi yang sudah aktif berlanjut sampai logout atau timeout. Pemilik sistem tetap perlu menyetujui batas idle/absolut sesi dan perilaku refresh agar pegawai nonaktif tidak memperoleh sesi baru.

Catatan: endpoint login SSO menggunakan pola request-response sendiri; SIMPEG boleh memakai REST API yang lebih konsisten untuk endpoint miliknya tanpa mengubah kontrak SSO eksternal.

## 6. Peran dan pemisahan tugas

Nama role di bawah adalah usulan. Jabatan bisnis, role aplikasi, dan scope bukan satu hal yang sama.

| Peran | Tugas | Batas utama |
| --- | --- | --- |
| Administrator teknis | Akun, konfigurasi teknis, pemulihan layanan | Tidak otomatis berwenang menilai KPI atau menyetujui data HR |
| Administrator akses | Memberi role/scope melalui permintaan resmi | Tidak boleh menyetujui peningkatan akses dirinya sendiri |
| Admin HR pusat | Master pegawai, dokumen HR, migrasi, laporan organisasi | Data sangat sensitif dibatasi berdasarkan izin khusus |
| Operator HR kantor/wilayah | Memeriksa kelengkapan dan memproses data sesuai scope | Tidak dapat melihat atau mengubah kantor di luar penugasan |
| Pegawai | Profil sendiri, pengajuan, CV, KPI sendiri, absensi sendiri | Tidak mengubah data resmi/hasil final langsung |
| Kepala kantor kas/cabang | Monitoring dan approval bawahan yang ditugaskan | Tidak otomatis membuka dokumen keluarga semua pegawai |
| Koordinator wilayah | Monitoring wilayah dan evaluasi sesuai assignment | Agregat wilayah tidak otomatis memberi akses detail privat |
| Kabid | Penilai tingkat pertama untuk pegawai yang ditugaskan | Dilarang menilai dirinya sendiri |
| Kadiv | Penilai/reviewer tingkat berikutnya sesuai hierarki | Tidak otomatis menjadi penilai seluruh organisasi |
| Admin KPI | Periode, indikator, target, assignment, validasi kelengkapan | Tidak mengganti nilai penilai tanpa alur koreksi |
| Operator integrasi Monbis | Mapping, sync, rekonsiliasi, retry | Tidak membuat realisasi manual seolah berasal dari Monbis |
| Admin absensi | Jadwal, mesin/sumber absensi, rekonsiliasi | Tidak menyetujui koreksi absensinya sendiri |
| Direksi/manajemen | Dashboard dan laporan agregat sesuai kewenangan | Detail pribadi dan nilai draft perlu izin terpisah |
| Auditor/internal control | Baca bukti, audit, dan export yang diizinkan | Tidak melakukan mutation operasional |

Satu pengguna dapat mendapat beberapa role. Sistem harus menguji konflik kepentingan, scope, serta masa berlaku, bukan sekadar menggabungkan menu.

### 6.1 Matriks aksi inti

| Aksi | Pelaksana | Pemeriksa/otorisasi usulan |
| --- | --- | --- |
| Ajukan biodata/keluarga | Pegawai | HR yang berwenang; pemeriksaan kantor jika diperlukan |
| Tambah pegawai/penempatan | HR | Pejabat HR berwenang sesuai kebijakan |
| Mutasi/jabatan baru | HR | Pemilik kewenangan berdasarkan SK |
| Ubah role/scope | Admin akses | Pemilik akses yang berbeda |
| Self-assessment | Pegawai | Kabid, lalu Kadiv apabila hierarki mensyaratkan |
| Evaluasi pimpinan | Penilai yang ditugaskan | Atasan berikutnya, tidak memakai aturan Kabid untuk semua kasus |
| Koreksi realisasi Monbis | Operator melakukan rekonsiliasi | Pemilik data Monbis dan admin KPI; bukti wajib |
| Koreksi absensi | Pegawai/admin | Atasan atau pejabat yang ditugaskan |
| Buka kembali KPI final | Admin KPI mengajukan | Pejabat berwenang yang terpisah |

### 6.2 Status pegawai, akun, akses aplikasi, dan menu

Keempat hal ini disimpan dan dievaluasi terpisah:

| Lapisan | Makna | Dampak jika nonaktif/off |
| --- | --- | --- |
| Status pegawai | Hubungan kerja pegawai menurut SIMPEG | SSO menolak login baru ke seluruh aplikasi terhubung. Sesi yang sudah berjalan mengikuti kebijakan sesi yang disepakati. |
| Akun/identitas | Identitas pegawai yang dipetakan ke SSO dan akun lokal SIMPEG | Tidak menyimpan password SSO di SIMPEG. Proses provisioning harus tercatat dan dapat diulang tanpa membuat akun ganda. |
| Akses aplikasi | Hak seorang pegawai untuk membuka satu aplikasi tertentu | API aplikasi tersebut menolak request baru; aplikasi lain tidak ikut dinonaktifkan. |
| Role dan permission | Aksi serta menu yang boleh digunakan di dalam satu aplikasi | Menu tanpa izin tidak ditampilkan, dan backend menolak endpoint terkait. Menyembunyikan menu saja tidak cukup. |

Klarifikasi pengguna: `tb_apk` berhubungan dengan akses pegawai ke aplikasi dan tiap aplikasi dapat diaktifkan atau dimatikan. DDL berisi flag aplikasi seperti `monbis`, `ims`, `simpeg`, dan lainnya. Target memetakan satu flag menjadi entitlement per pegawai dan aplikasi, bukan kolom menu bernilai 0/1. Saat akses aplikasi dimatikan, semua menu/endpoint aplikasi itu tidak dapat dipakai, tetapi status pegawai dan akses ke aplikasi lain tidak berubah.

Rancangan target memisahkan `application_access_status` dari `provisioning_status`. SIMPEG dapat menyiapkan record provisioning otomatis sesuai kebijakan, sementara hak masuk tetap mengikuti entitlement. Usulan keamanan: entitlement baru berstatus `off` sampai pejabat berwenang memberi akses; akun boleh diprovision lebih awal bila proses bisnis memerlukannya. Pemilik proses masih perlu memastikan apakah setiap pegawai mendapat akun untuk semua aplikasi sejak awal atau hanya saat akses diberikan, serta apakah entitlement dikelola SIMPEG atau SSO. Role/permission menu tetap menjadi aturan aplikasi tujuan kecuali pemilik SSO menetapkan registry terpusat.

## 7. Manajemen pegawai

### 7.1 Identitas dan biodata

ID internal permanen terpisah dari NIP/nomor pegawai yang dapat berubah. Data mencakup identitas dasar, kontak, alamat, tanggal lahir, status pegawai, tanggal bergabung, kantor/unit/jabatan aktif, dan data administratif sesuai kebutuhan.

NIK, rekening, BPJS, data keluarga, dan dokumen pendukung bersifat terbatas. Field wajib, pilihan referensi, siapa yang boleh melihat, masking, dan kewajiban dokumen ditetapkan dalam kamus data sebelum implementasi. Data nasabah tidak menjadi bagian profil pegawai.

Kemampuan: daftar terfilter, tambah, detail, pembaruan, aktif/nonaktif, pencarian, import preview, dan riwayat perubahan. Penonaktifan akun dan status pegawai diatur sebagai kejadian terkait; tidak menghapus riwayat KPI/absensi.

### 7.2 Keluarga dan pendidikan

Pasangan, anak, orang tua, serta pendidikan formal disimpan sebagai record terpisah. Identitas hubungan, tanggal berlaku, status, jenjang, institusi, tanggal kelulusan, serta bukti disesuaikan kamus data. Tidak menyalin data keluarga ke laporan umum.

Pegawai mengajukan perubahan; persetujuan menerapkan versi baru. Data lama tetap dapat ditelusuri oleh petugas yang berwenang. Penghapusan relasi historis memakai arsip atau koreksi, bukan menghilangkan bukti.

### 7.3 Jabatan dan penempatan

Riwayat mencatat jabatan, posisi, kantor, unit, atasan, jenis penugasan, tanggal efektif, tanggal berakhir, serta nomor/tanggal SK. Sistem mencegah periode jabatan utama bertumpang tindih tanpa aturan rangkap yang disetujui.

Mutasi mendatang dapat dijadwalkan. Aktivasi memengaruhi scope baru, assignment kerja, dan notifikasi. Mutasi di tengah periode KPI mengikuti kebijakan atribusi target/realisasi yang masih perlu diputuskan.

### 7.4 Pelatihan

Master kegiatan mencakup judul, penyelenggara, kategori, tanggal, metode, lokasi, biaya jika diizinkan, dan status. Kepesertaan mencakup pegawai, kehadiran/kelulusan, hasil, serta bukti. Kegiatan dibatalkan tidak dihitung sebagai pelatihan selesai.

Pegawai dapat mengajukan pelatihan historis mandiri, HR memverifikasi. Rekap berdasarkan periode, kantor pada saat kegiatan, jenis kegiatan, dan peserta. Hindari menghitung peserta yang sama dua kali setelah import ulang.

### 7.5 Sertifikasi

Jenis, lembaga, nomor, tanggal terbit/berakhir, status verifikasi, dokumen, dan hubungan sertifikasi pengganti. Sertifikasi tanpa tanggal berakhir dibedakan dari tanggal yang belum diisi.

Pengingat berakhir diusulkan dapat dikonfigurasi. Status kedaluwarsa mengikuti tanggal bisnis; unggah dokumen baru tidak otomatis berarti perpanjangan terverifikasi. Daftar kewajiban sertifikasi per jabatan dan kebijakan pemberitahuan masih terbuka.

### 7.6 CV

CV dihasilkan dari data resmi terverifikasi: biodata yang relevan, pendidikan, riwayat jabatan, pelatihan, sertifikasi, dan penugasan sesuai template. Pengguna melihat preview dan memilih template yang diizinkan.

CV tidak secara default memuat NIK, rekening, keluarga, pelanggaran, atau nilai KPI. Export mencatat pembuat, waktu, template, dan versi data. Usulan format awal: PDF; template bank perlu disetujui.

### 7.7 Pengajuan dan approval

Status: `draft -> submitted -> in_review -> approved/rejected`; `returned` digunakan untuk perbaikan. Penarikan hanya selama belum diproses menurut kebijakan. Persetujuan menyimpan aktor, waktu, alasan, data sebelum/sesudah, dan dokumen.

Penolakan wajib alasan dan tidak mengubah data resmi. Saat data utama berubah sejak pengajuan, sistem menandai konflik dan meminta pemeriksaan ulang. Approval ganda tidak boleh menerapkan perubahan dua kali. Pengaju tidak menyetujui pengajuannya sendiri.

### 7.8 Kriteria selesai domain pegawai

- Pegawai hanya melihat profil sendiri; scope kantor dan wilayah diuji pada API.
- Mutasi menghasilkan riwayat berlaku dan akses baru yang benar.
- Approval yang ditolak tidak mengubah data resmi.
- Konflik versi dan pengulangan request tidak menyebabkan kehilangan data.
- File privat hanya dapat diunduh setelah pemeriksaan izin.
- CV tidak mengekspos field privat yang dilarang.
- Import ulang tidak menduplikasi pegawai/riwayat.

## 8. KPI

### 8.1 Struktur umum

KPI menyimpan periode, kategori pegawai, template indikator, target, bobot, satuan, rumus, sumber realisasi, assignment penilai, bukti, hasil per indikator, dan skor akhir. Template memiliki versi; periode yang sudah dibuka mengacu versi tertentu.

Satu periode dapat bulanan, triwulanan, semester, atau tahunan; pilihan final belum ditentukan. Template pemasaran, nonpemasaran, dan pimpinan dapat berbeda. Bobot wajib berjumlah 100% sebelum publikasi. Target nol, realisasi negatif, data hilang, dan indikator tidak berlaku memiliki aturan eksplisit.

Self-assessment adalah masukan pegawai, bukan nilai final. KPI tidak otomatis menjadi dasar bonus/sanksi dalam scope awal.

### 8.2 Periode dan status

Periode: `draft -> published -> open -> review -> finalized -> archived`. Tenggat self-assessment, penilai pertama, reviewer, dan keberatan ditentukan terpisah.

Assessment individu: `draft -> submitted -> first_review -> final_review -> finalized`; pengembalian untuk revisi tidak menghapus versi terdahulu. Jalur satu tingkat dimungkinkan jika kebijakan organisasi menetapkan demikian.

Assignment penilai diambil dari hierarki efektif, lalu disimpan sebagai snapshot periode. Perubahan assignment dicatat dengan alasan dan otorisasi. Tidak ada self-approval; atasan kosong, PLT, konflik kepentingan, atau penilai nonaktif masuk antrean penyelesaian admin KPI.

### 8.3 Pemasaran: integrasi Monbis

Monbis menjadi sumber realisasi KPI pemasaran. SIMPEG mengelola definisi indikator/target hanya sesuai keputusan pemilik bisnis; target juga mungkin berasal dari Monbis dan harus dipastikan.

Kontrak integrasi wajib menetapkan:

1. Protokol tersedia: API, file terjadwal, atau kanal lain. Jangan mengasumsikan Monbis menyediakan REST API.
2. Identitas sumber, kode kantor, ID pegawai, indikator, periode, tanggal cut-off, unit/satuan, dan versi revisi.
3. Data realisasi berada pada level pegawai atau hanya kantor. Data kantor tidak boleh dibagi ke individu dengan asumsi otomatis.
4. Kepemilikan target, aturan pembulatan, koreksi transaksi, pembatalan, dan nilai negatif.
5. Jadwal sinkronisasi, batas keterlambatan, hak akses, serta perilaku saat sumber tidak tersedia.

Alur usulan: ekstraksi BE -> staging -> validasi -> mapping -> rekonsiliasi -> publikasi realisasi. Data gagal mapping masuk karantina; tidak dianggap realisasi nol.

Setiap run menyimpan ID, timestamp sumber, cut-off, jumlah record, status, error, dan versi data. Retry memakai identitas record stabil agar idempotent. Koreksi Monbis membentuk versi baru; snapshot KPI final tidak berubah otomatis.

Pegawai melihat sumber, periode, waktu sync terakhir, dan status data. Saat Monbis gagal, tampilkan data terakhir dengan penanda kedaluwarsa; jangan menampilkan nol sebagai hasil baru. Koreksi manual di SIMPEG harus bertipe adjustment dengan bukti dan persetujuan, bukan menimpa nilai sumber.

Saat mutasi, atribusi realisasi menurut identitas transaksi, kantor asal, tanggal efektif, dan aturan bisnis; aturan final dibahas dengan Monbis. Hindari menarik nama pegawai sebagai kunci identitas.

### 8.4 Nonpemasaran: self-assessment

Admin KPI menetapkan template sesuai fungsi pekerjaan dan periode. Pegawai mengisi hasil kerja, capaian, kendala, bukti, dan usulan nilai menurut rubrik yang dipublikasikan.

Kabid menilai pegawai yang berada dalam assignment-nya, mengisi nilai dan alasan per indikator, lalu mengembalikan atau meneruskan. Kadiv melakukan review sesuai hierarki; jika mengubah nilai, nilai awal dan alasan perubahan tetap tercatat.

Kabid yang dinilai, Kadiv yang dinilai, pegawai tanpa Kabid, pegawai kantor cabang, dan pejabat rangkap harus memiliki jalur khusus berdasarkan struktur nyata. Tidak memaksakan Kabid -> Kadiv untuk semua pegawai.

Rubrik menyatakan arti tiap tingkat nilai, bukti minimum, dan cara menangani indikator tidak berlaku. Indikator kualitatif dan kuantitatif dipisahkan. Aturan pembobotan ulang ketika indikator tidak berlaku harus disetujui sebelum periode dibuka.

### 8.5 Perhitungan dan finalisasi

Usulan dasar: skor akhir = jumlah skor indikator ternormalisasi x bobot. Rumus capaian, ceiling/floor, pembulatan, rentang skor, dan kategori hasil masih terbuka; tidak boleh dipasang sebagai konstanta tanpa kebijakan.

Contoh untuk diskusi, bukan rumus resmi: indikator semakin tinggi semakin baik dapat memakai realisasi/target; indikator semakin rendah semakin baik memerlukan rumus berbeda. Target nol dan data tidak lengkap harus menghasilkan status khusus, bukan pembagian nol atau nilai penuh.

Nilai resmi dihitung BE. Finalisasi menyimpan versi rumus, bobot, target, data Monbis, bukti, nilai penilai, dan assignment. Setelah final, perubahan hanya lewat reopen berotorisasi, alasan wajib, dan versi baru. Hasil lama tetap dapat diaudit.

### 8.6 Keberatan, monitoring, dan laporan

Pegawai dapat mengajukan keberatan pada rentang waktu yang disepakati; reviewer berbeda dari pihak yang dipersoalkan jika kebijakan mensyaratkan. Status keberatan dan dampaknya terhadap finalisasi ditetapkan sebelum rilis.

Dashboard memisahkan kelengkapan penilaian, hasil final, dan data sementara. Ranking lintas jabatan/template tidak dibuat otomatis karena indikator dapat tidak sebanding. Laporan menampilkan periode, versi, cut-off, filter, serta status final.

### 8.7 Kriteria selesai domain KPI

- Mapping Monbis tidak valid tidak masuk perhitungan.
- Sync ulang tidak menggandakan realisasi; koreksi membentuk versi.
- Tidak ada realisasi level kantor yang dianggap individu tanpa aturan.
- Kabid/Kadiv hanya menilai assignment yang berlaku; self-approval ditolak.
- Mutasi tidak diam-diam mengubah penilai atau hasil historis.
- Rumus diuji dengan batas nol, kosong, negatif, bobot salah, dan pembulatan.
- Hasil final dapat direproduksi dari snapshot dan versi rumus.
- Reopen/keberatan memiliki audit dan akses yang benar.

## 9. Absensi

### 9.1 Sumber dan jadwal

Metode belum diputuskan: mesin absensi, aplikasi check-in/out, atau integrasi sistem yang sudah ada. Pilot dimulai dengan satu sumber yang disetujui, bukan seluruh metode sekaligus.

Master mencakup kalender kerja, hari libur, jadwal kantor, shift jika ada, toleransi keterlambatan, dan penugasan jadwal pegawai. Jam disimpan dengan timezone eksplisit; konteks operasional Jawa Tengah menggunakan Asia/Jakarta. Jadwal lintas tengah malam memakai tanggal kerja terpisah dari timestamp event.

### 9.2 Data mentah dan hasil harian

Event mentah menyimpan ID sumber, pegawai, perangkat/kanal, waktu kejadian, waktu diterima, dan jenis event. Event tidak ditimpa ketika ada koreksi. Hasil harian menyimpan jadwal berlaku, masuk/pulang terpilih, keterlambatan, kekurangan jam, status, serta versi perhitungan.

Status usulan: hadir, terlambat, izin, sakit, cuti, dinas luar, tidak hadir, dan data belum lengkap. Tidak ada event belum tentu mangkir: jadwal libur, izin, serta kegagalan sumber harus diperiksa terlebih dahulu.

### 9.3 Koreksi dan izin

Pegawai mengajukan koreksi dengan tanggal, jenis masalah, alasan, dan bukti. Atasan berwenang menyetujui/menolak; admin menjalankan rekonsiliasi sesuai izin. Koreksi tidak menghapus event asal.

Cuti/izin/dinas yang disetujui memengaruhi status harian sesuai aturan; pengajuan pending belum dianggap disetujui. Tenggat koreksi dan lock periode diusulkan dapat dikonfigurasi.

### 9.4 Pengecualian

- Event ganda dan retry deduplikasi berdasarkan ID sumber.
- Pulang tanpa masuk, event tidak berurutan, jam perangkat meleset, dan pegawai tidak terpetakan masuk daftar pemeriksaan.
- Gangguan jaringan/mesin tidak otomatis menyebabkan penalti.
- Check-in berbasis lokasi, jika dipilih, membutuhkan kebijakan izin lokasi, akurasi, spoofing, kantor alternatif, dan kondisi dinas. Tidak diputuskan dalam draft ini.
- Kebijakan lembur, potongan, dan hubungan absensi ke KPI belum masuk perhitungan otomatis.

### 9.5 Kriteria selesai domain absensi

- Jadwal, libur, izin, dan mutasi kantor menghasilkan status harian yang benar.
- Event duplicate dan retry tidak menambah kehadiran.
- Data gagal sync ditandai belum lengkap.
- Koreksi memerlukan izin dan meninggalkan jejak data asal.
- Periode terkunci tidak berubah tanpa proses reopen.
- Export memakai scope dan filter yang sama dengan layar.

## 10. Kebutuhan lintas domain

### 10.1 Dokumen, privasi, dan audit

Dokumen disimpan privat dengan nama internal acak, pembatasan ukuran/tipe, verifikasi konten, dan pemeriksaan keamanan upload sesuai infrastruktur. URL unduhan berumur pendek jika digunakan. Audit mencatat unduhan/export sensitif tanpa menyalin isi dokumen atau rahasia ke log.

Aktivitas wajib diaudit: login gagal/berhasil sesuai kebijakan, perubahan role, biodata, penempatan, approval, import, sinkronisasi, perubahan target/rumus, penilaian, finalisasi, reopen, koreksi absensi, dan export sensitif. Audit memuat aktor, waktu, objek, perubahan relevan, request ID, serta alasan; field rahasia di-redact.

Kebijakan retensi data, lokasi hosting, backup, akses vendor, dan kepatuhan yang berlaku harus ditetapkan bersama pihak bank yang berwenang. Draft ini tidak menyatakan produk telah memenuhi ketentuan regulator tertentu.

### 10.2 Notifikasi

Notifikasi dalam aplikasi untuk pengajuan, hasil approval, penugasan penilai, tenggat, data sync bermasalah, sertifikasi berakhir, dan koreksi absensi. Email/kanal lain masih terbuka. Notifikasi tidak memuat data pribadi atau nilai sensitif pada kanal yang tidak disetujui.

Pengiriman yang gagal dapat diulang; notifikasi tidak menjadi sumber kebenaran status bisnis. Pengguna dapat membuka daftar tugas aktual meskipun notifikasi gagal.

### 10.3 FE dan Anti-Slop

React/TypeScript/shadcn/ui digunakan untuk layar operasional: pencarian pegawai, tabel terfilter, profil bertab, antrean tugas, form evaluasi, dan kalender absensi. Desain mengutamakan keterbacaan tabel dan tugas pengguna.

Sebelum tabel fisik atau migrasi dibuat, tim mengadakan workshop per menu bersama pemilik proses terkait. Catatan minimum per menu: nama tabel legacy yang benar-benar dipakai, kolom dan definisinya, sumber/pemilik data, validasi, workflow, hak baca/ubah/export, pengecualian, retensi, keputusan, pertanyaan terbuka, role PIC, serta rujukan bukti tanpa menyalin record pribadi. Status setiap relasi harus jelas: terkonfirmasi, kandidat, belum diketahui, atau tidak dipakai. Hasilnya ditautkan ke [template catatan diskusi](CATATAN-DISKUSI-SIMPEG.md) dan [ERD konseptual](ERD-SIMPEG-V2.md); kandidat pada prototype tidak otomatis menjadi schema final.

Prototype menampilkan tabel legacy dan target usulan pada setiap menu, lalu menyediakan catatan per menu. Penyimpanan browser hanya bersifat lokal pada perangkat tersebut; hasil rapat resmi harus diekspor, ditinjau pemilik proses, dan disimpan ke dokumentasi proyek. Jangan masukkan PII, password, token, foto, atau isi dokumen pegawai ke catatan.

Setiap layar prototype juga menjelaskan fitur yang teramati pada menu/kode SIMPEG lama dan menampilkan rujukan file sumber. Bedakan `menu aktif` (terlihat pada sidebar legacy), `kode ditemukan` (file/halaman tersedia tetapi aksesnya dari menu belum dipastikan), dan `belum ditemukan` pada sumber yang ditinjau. Nama tabel dari DDL adalah kandidat keterkaitan, bukan bukti bahwa menu memakai tabel tersebut. Jangan mengklaim absensi harian, self-assessment, KPI Monbis, atau alur penilai berjenjang sebagai fitur lama tanpa bukti. Perbedaan label dan route, seperti submenu “Pengakatan Pegawai” yang mengarah ke form ubah ID, ditampilkan sebagai pertanyaan validasi.

Setiap halaman memiliki loading, kosong, error, retry yang relevan, izin ditolak, serta feedback sukses. Form mempertahankan input setelah gagal dan mencegah submit ganda. Filter/pagination dapat dibagikan melalui URL jika aman. Desain diuji desktop dan ponsel; tabel lebar memakai strategi responsive yang eksplisit.

Gunakan copy Indonesia yang konkret, focus keyboard terlihat, label field, kontras memadai, dan status tidak hanya melalui warna. Tidak memakai dashboard dekoratif, angka palsu, atau tombol yang belum bekerja sebagai hasil selesai. Arah visual bank, logo, kepadatan, serta tema ditentukan sebelum UI tahap pertama.

### 10.4 Operasional dan mutu

Usulan target untuk disepakati: API interaktif P95 <= 2 detik pada beban uji representatif; pekerjaan import/export besar memakai job; daftar minimal diuji dengan 100+ kantor dan dataset pegawai representatif. Beban pengguna serentak, jumlah pegawai, SLA, RPO/RTO, dan ukuran lampiran perlu dikonfirmasi sebelum mengunci angka.

Backup harus diuji restore. Monitoring mencakup error API, kegagalan job, antrean, storage, auth, dan sync Monbis. Lingkungan dev/test memakai data sintetis atau anonimisasi yang disetujui; foto/.env/data produksi tidak dimasukkan repository.

### 10.5 Penyimpanan catatan dan pedoman per menu

Prototype saat ini menyimpan catatan di `localStorage`, sehingga hanya tersedia pada browser/perangkat yang sama dan bukan arsip resmi. Untuk mendukung workshop lintas divisi dan menjadi pedoman pembangunan ulang maupun aplikasi lain, rancangan target menyediakan katalog proyek-menu, sesi workshop, catatan terstruktur, riwayat revisi, serta peta tabel/kolom sumber ke target. Rancangan konseptual dan relasinya ada di bagian 9 [ERD](ERD-SIMPEG-V2.md).

Aturan produk:

- Satu katalog dapat menampung beberapa proyek; menu/submenu punya kode stabil dan hirarki.
- Catatan per menu memiliki jenis, status review, pemilik peran, sumber bukti, keputusan/pertanyaan, dan hubungan opsional ke sesi workshop. Satu menu dapat mengumpulkan catatan dari banyak workshop; catatan draft boleh belum terikat sesi.
- Status `confirmed` hanya diberikan oleh pemilik proses/approver yang berwenang. Perubahan membuat revisi baru; keputusan lama tetap dapat ditelusuri.
- Pemetaan mencatat sistem, tabel dan bila perlu kolom sumber/target, status kepastian, tindakan migrasi, aturan transformasi/validasi, reviewer, serta alasan/bukti.
- Catatan tidak boleh memuat PII pegawai, foto, isi dokumen, password, token, atau sampel record. Bukti dirujuk melalui lokasi yang aksesnya disetujui.
- Catatan resmi perlu autentikasi dan audit perubahan. Penyimpanan lintas perangkat serta hak reviewer/approver harus ditegakkan oleh BE, bukan hanya disembunyikan di FE.

Rute REST berikut adalah usulan kontrak awal, bukan endpoint yang sudah dibuat: `GET /api/v1/design-projects/{projectCode}/menus`, `GET /api/v1/design-projects/{projectCode}/menus/{menuCode}/notes`, `POST /api/v1/design-projects/{projectCode}/workshops`, `POST /api/v1/design-projects/{projectCode}/notes`, `PATCH /api/v1/menu-notes/{id}`, `GET /api/v1/menu-notes/{id}/revisions`, dan `POST /api/v1/menu-data-mappings`. Backend membuat snapshot revisi secara atomik setiap catatan berubah; klien tidak menulis langsung ke tabel revisi. Kontrak final wajib masuk OpenAPI dan menyediakan contoh `Try it out` di lingkungan lokal/test.

Penempatan fisik tabel masih terbuka: dapat menjadi layanan dokumentasi/workshop terpisah atau modul dalam aplikasi. Jangan memasukkannya ke schema operasional pegawai `simpeg_v2` sebelum owner sistem menyetujui retensi, scope akses, pemilik data, dan kebutuhan penggunaan lintas aplikasi. Sampai saat itu, dokumen Markdown yang direview adalah sumber keputusan; catatan localStorage hanya draft.

## 11. Database dan ERD

### 11.1 Sumber legacy dan nama database target

Dump `db/masq2971_simpeg_dummy.sql` menjadi sumber legacy yang dirujuk untuk inventaris dan rancangan migrasi. Pemeriksaan tahap ini membaca definisi `CREATE TABLE`, nama kolom, tipe, primary/foreign key, dan indeks. Pemeriksaan ini menemukan 44 definisi tabel. Tahap ini tidak mengimpor dump, mengubah database, atau menyimpulkan kualitas isi record.

Nama produk yang diminta adalah `simpeg-v2`. Pengguna menyetujui nama schema MySQL `simpeg_v2` pada 15 Oktober 2026. Database legacy tetap dipertahankan; implementasi migrasi kelak membuat target baru dan tidak me-rename atau menghapus database lama.

File dump tetap menjadi artefak sumber untuk migrasi di lingkungan yang diizinkan, bukan file yang harus dimasukkan ke Git. Sebelum dipakai di lingkungan pengembangan bersama, pemilik data perlu memastikan isinya memang dummy atau sudah dianonimkan. Dokumentasi ini hanya mencatat metadata struktur, bukan data pegawai.

### 11.2 Prinsip rancangan schema target

- Gunakan primary key internal yang stabil. `id_peg`, NIP, kode kantor, dan identitas dari SSO disimpan sebagai identifier bisnis atau mapping, bukan primary key lintas tabel yang boleh berubah.
- Pisahkan `employees` dari profil pribadi, akun aplikasi, penempatan kerja, dan riwayat. Akun lokal memetakan pegawai SSO, tanpa menyimpan password SSO.
- Simpan kantor, unit kerja, katalog jabatan, posisi organisasi, dan penempatan pegawai sebagai entitas berbeda. Penempatan menyimpan tanggal berlaku dan tidak menimpa riwayat lama.
- Gunakan foreign key, unique constraint, tanggal efektif, dan audit metadata untuk mencegah relasi putus serta duplikasi. Penghapusan fisik pegawai tidak menjadi alur operasional; status nonaktif dan kebijakan retensi yang mengatur akses.
- Data pribadi dan file punya aturan akses, retensi, masking, serta audit tersendiri. Jangan menaruh path upload publik atau salinan data sensitif pada tabel log.
- KPI dan absensi menyimpan data sumber, hasil olahan, status rekonsiliasi, dan koreksi secara terpisah. Nilai final dapat ditelusuri ke periode, versi indikator, penilai, dan sumber data.
- Nama tabel/kolom target memakai konvensi konsisten dan eksplisit. Mapping legacy ke nama target disetujui sebelum migrasi; nama lama tidak dipertahankan hanya demi menghindari keputusan desain.
- Model di [ERD SIMPEG v2](ERD-SIMPEG-V2.md) adalah rancangan konseptual. Tipe data, nullability, enum/reference table, indeks, aturan penghapusan, dan cardinality final masih perlu review HR, pemilik SSO, KPI, absensi, dan DBA.

### 11.3 Temuan struktur legacy yang memengaruhi ERD

- Pengguna mengonfirmasi `tb_pegawai` dipakai sebagai daftar pegawai dan biodata. DDL menetapkan `id_peg` sebagai primary key; `pegawai_uid` bukan primary key. `tb_pegawai_copy1`, `tb_pegawai_copy2`, dan `tb_pegawai_copy3` memiliki 27 kolom seperti tabel tersebut; `tb_pegawai_2` memiliki bentuk lama dengan 20 kolom. Kesamaan struktur tidak membuktikan record atau penggunaan aplikasi sama.
- Relasi banyak tabel legacy memakai `id_peg` langsung, tetapi tidak semua relasi memiliki foreign key. Sejumlah foreign key mengatur `ON DELETE SET NULL`, yang dapat memutus hubungan riwayat. Target menggunakan status arsip/nonaktif dan mempertahankan referensi historis.
- Pengguna menjelaskan `tb_apk` mengatur akses pegawai ke beberapa aplikasi. DDL memuat kolom status, delapan flag aplikasi (`monbis`, `ims`, `rekrutmen`, `simstock`, `simpeg`, `visitin-ao`, `portal_bkk`, `sipatuh`) dengan default `0`, serta `pass` dan OTP. Flag aplikasi dipetakan ke entitlement per aplikasi. Default `0` menunjukkan nilai awal flag saat insert, tetapi DDL tidak membuktikan proses auto-provisioning yang berjalan.
- `tb_apk` mendefinisikan dua foreign key pada `id_peg` yang sama, satu `ON DELETE CASCADE` dan satu `ON DELETE RESTRICT`. Tujuan dan constraint yang benar harus diperiksa sebelum migrasi.
- Kolom `pass`, `otp`, dan `otp_expired_at` tidak disalin ke sistem baru. Pemilik SSO perlu memastikan kredensial dan OTP ditangani layanan autentikasi resmi, bukan disimpan sebagai rahasia lokal atau dianggap sebagai permission.
- `tb_kantor`, master jabatan, unit, dan hubungan atasan belum membentuk satu model relasional yang memadai untuk lingkup akses pusat/korwil/cabang/kantor kas. ERD target memisahkan struktur, posisi, dan assignment.
- `tb_user` memiliki kolom `password` dan `hak_akses`. Rancangan target tidak memigrasikan password legacy ke autentikasi baru. Role dan scope aplikasi harus dipetakan ulang dan ditinjau pemilik akses.
- `tb_dp3` merupakan data penilaian lama; struktur itu tidak dianggap otomatis setara dengan KPI Monbis atau self-assessment yang baru.

Belum ada dasar yang cukup untuk menyatakan tabel atau kolom mana tidak digunakan. Nama `copy`, `old`, `trash`, atau `recycle_bin` hanya menjadi penanda untuk investigasi. Penghapusan hanya boleh diputuskan setelah pencarian pemakaian di kode lama, pengecekan relasi/data oleh pemilik, laporan rekonsiliasi, persetujuan retensi, dan tersedianya backup/rollback.

## 12. Migrasi dan rekonsiliasi

Urutan migrasi: inventaris schema dan pemakaian kode -> mapping field/ID -> pemeriksaan kualitas dan privasi -> dry-run ke `simpeg_v2` -> validasi HR/IT -> pilot -> cutover -> rekonsiliasi -> dukungan pascarilis. Target database baru tidak menggantikan database lama saat desain atau dry-run.

Laporan migrasi memuat jumlah sumber/tujuan, duplikasi, identifier yang tidak cocok, referensi putus, tanggal tidak valid, record ditolak, hasil deduplikasi, dan status dokumen. Aturan resolusi setiap kasus harus disetujui pemilik data. ID pegawai stabil dan hubungan kantor/jabatan dibersihkan sebelum KPI/absensi dihubungkan.

Tabel dan kolom legacy yang dianggap kandidat arsip harus memiliki pemilik, alasan, bukti tidak dipakai, kebijakan retensi, dan persetujuan sebelum dikeluarkan dari schema target. Pembersihan dilakukan pada schema baru atau melalui migrasi yang dapat diaudit, bukan dengan menghapus kolom dari database lama lebih dahulu.

File sensitif dipindahkan melalui kanal yang disetujui, bukan Git. Salinan sumber dijaga untuk rollback sesuai retensi. Strategi perubahan selama cutover, freeze, sumber kebenaran, serta rollback disetujui sebelum produksi.

## 13. Urutan pengerjaan dan gate selesai

Satu tahap aktif pada satu waktu. Tahap berikutnya tidak dimulai hanya karena kode selesai. Semua acceptance criteria, verifikasi, dokumentasi, review bisnis, dan masalah penghalang harus ditutup dahulu; pengguna memberi arahan lanjut.

| Tahap | Hasil yang harus tersedia | Syarat selesai |
| --- | --- | --- |
| 00: PRD, inventaris legacy, dan ERD | Arsitektur, contoh organisasi, role/scope, inventaris 44 tabel, draft ERD dan mapping awal, daftar terbuka | Review HR/IT atas entitas dan batas data; nama schema dan keputusan penghalang dicatat; belum ada perubahan DB |
| 01: Fondasi dan kontrak API | Setup FE/BE, auth, akun, permission, error, audit dasar, shell, OpenAPI dan UI `Try it out` untuk endpoint fondasi | Tes akses dan login; kontrak API cocok dengan implementasi; contoh berjalan di lokal/test; tidak ada fitur bisnis luas |
| 02: Organisasi | Kantor, unit, posisi, atasan, assignment/delegasi | Scope lintas kantor dan tanggal efektif diuji |
| 03: Pegawai inti | CRUD profil resmi, daftar/detail, identitas stabil | Validasi, konflik edit, akses data privat diuji |
| 04: Pengajuan dan keluarga | Approval biodata/keluarga, dokumen, notifikasi | Approve/reject/konflik/self-approval diuji |
| 05: Riwayat jabatan | Mutasi, penugasan, SK, dampak scope | Riwayat dan periode overlapping diuji |
| 06: Pelatihan/sertifikasi/CV | Riwayat, verifikasi, masa berlaku, PDF CV | Bukti privat, status, dan template CV ditinjau |
| 07: Migrasi pegawai pilot | Mapping, dry-run, kantor pilot, rekonsiliasi | HR menyetujui jumlah/relasi/dokumen; rollback diuji |
| 08: KPI dasar | Periode, versi template, target, assignment, rubrik | Aturan rumus/jalur penilai final; belum sync produksi |
| 09: Nonpemasaran | Self-assessment -> penilai -> reviewer -> final | Jalur Kabid/Kadiv dan pengecualian lulus UAT |
| 10: Monbis dan pemasaran | Kontrak, staging, mapping, sync, reconciliation | Retry/koreksi/cut-off/data hilang lulus UAT |
| 11: KPI akhir | Keberatan/reopen, snapshot, laporan | Hasil dapat direproduksi; akses laporan diuji |
| 12: Absensi dasar | Kalender/jadwal, satu sumber, event/rekap | Libur/duplicate/gangguan/jam diuji |
| 13: Koreksi absensi | Izin, koreksi, approval, lock, laporan | Alur lengkap dan pengecualian lulus UAT |
| 14: Rollout | UAT lintas jenis kantor, restore, panduan, support | Pilot disetujui dan rollout bertahap terukur |

Nomor tahap bukan jadwal waktu. Estimasi dibuat setelah rincian tahap disepakati. Jika tahap terlalu besar, pecah menjadi subissue kecil dan tetap pertahankan satu fokus aktif.

## 14. Aturan `issue.md`

`issue.md` di root merupakan indeks kerja dan catatan keputusan. Setiap issue wajib memuat ID, tahap, tujuan, in/out scope, dependensi, acceptance criteria, status, hasil, bukti verifikasi, file berubah, keputusan, blocker, dan langkah berikut.

Status: `backlog`, `ready`, `in_progress`, `blocked`, `in_review`, `done`. `done` hanya jika seluruh kriteria terverifikasi. Status tahap tambahan `awaiting_continue` digunakan setelah gate selesai untuk menunggu arahan pengguna.

Mulai sesi: baca PRD dan issue, periksa branch/status Git, identifikasi satu issue aktif. Akhir sesi: update hasil, apa yang belum selesai, bukti test, blocker, dan langkah paling kecil berikut. Jangan menulis test lulus jika belum dijalankan. Commit mengacu ID issue. Perubahan keputusan memperbarui PRD dan decision log bersama-sama.

Dokumen PRD belum memberi izin implementasi semua tahap. Pengerjaan saat ini hanya tahap 00.

## 15. Pertanyaan bisnis berurutan

### Sebelum fondasi

1. Framework PHP Laravel atau lainnya? Arsitektur React SPA + PHP REST API tanpa Inertia sudah disepakati.
2. Pemilik SSO mengonfirmasi sumber SIMPEG, penolakan login untuk pegawai nonaktif, TTL/refresh, SLA, dan audience per aplikasi?
3. Contoh struktur nyata pusat/korwil/cabang/kankas, unit, Kabid/Kadiv, dan pelaporan silang?
4. Siapa pemilik persetujuan role/scope dan data HR?

### Sebelum schema dan migrasi

5. Apakah sistem membuat akun/record untuk setiap pegawai di semua aplikasi secara otomatis, atau hanya saat akses diberikan? Apa status default akun dan entitlement baru?
6. Siapa pemilik data akses per aplikasi, SIMPEG atau layanan SSO? Apakah `off` hanya menutup satu aplikasi, sementara role/menu dikelola aplikasi masing-masing?
7. Database lama mana yang menjadi sumber otoritatif dan siapa pemilik persetujuan backup/retensi?
8. Siapa yang dapat memeriksa penggunaan tabel/kolom legacy di kode, laporan, dan integrasi sebelum kandidat arsip dikeluarkan dari schema target?
9. Apakah HR/DBA menyetujui ERD konseptual dan daftar mapping awal sebelum tim membuat migration SQL?

### Sebelum profil dan migrasi

10. Jumlah pegawai, status kepegawaian, field wajib, dan identitas unik?
11. Data yang boleh diedit mandiri, kebutuhan approval, format SK/CV, dan retensi dokumen?
12. Kantor pilot, sumber data utama, kualitas legacy, serta kebutuhan modul tambahan?

### Sebelum KPI

13. Periode, indikator, bobot, target, rubrik, ceiling/floor, pembulatan, dan kategori hasil?
14. Monbis menyimpan level individu atau kantor; target dari mana; protokol/akses/cut-off tersedia?
15. Kabid/Kadiv untuk tiap kategori pegawai, termasuk pimpinan, PLT, dan pegawai cabang?
16. Kebijakan mutasi tengah periode, keberatan, reopen, dan adjustment?

### Sebelum absensi dan rollout

17. Mesin/sumber existing, shift, toleransi, kalender libur, dinas, serta cuti/izin?
18. Kebijakan koreksi, periode lock, dan hubungan absensi dengan KPI?
19. Beban serentak, hosting, backup/restore, target layanan, serta pihak compliance/internal control?

## 16. Skenario UAT lintas domain

1. Pegawai kantor kas tidak dapat membaca pegawai cabang lain lewat manipulasi URL/API.
2. Kepala cabang melihat kantor yang ditugaskan; korwil hanya wilayah yang diberikan.
3. HR mengajukan perubahan jabatan efektif bulan depan; riwayat dan hak akses mengikuti tanggal.
4. Pegawai submit keluarga, HR reject dengan alasan; data resmi tidak berubah.
5. Pegawai mutasi saat KPI berjalan; assignment historis dan atribusi Monbis tetap konsisten.
6. Kabid mencoba menilai dirinya sendiri; sistem menolak dan mengarahkan penyelesaian assignment.
7. Sync Monbis gagal dan retry; tidak terjadi realisasi nol atau record ganda.
8. Kadiv mengubah nilai dengan alasan; nilai awal tetap terlihat dalam audit berizin.
9. KPI final dikoreksi setelah keberatan; versi sebelumnya tetap dapat direproduksi.
10. Mesin absensi gagal pada hari kerja; hasil ditandai belum lengkap, bukan otomatis mangkir.
11. Absensi dikoreksi setelah approval; event asal dan dasar koreksi tetap tercatat.
12. Export CV/laporan dari akun tidak berwenang ditolak, termasuk akses URL file langsung.
