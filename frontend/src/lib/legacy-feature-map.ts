import type { ScreenId } from "./navigation";

export type LegacyCoverage = "menu-aktif" | "route-terdeteksi" | "belum-ditemukan";

export type LegacyFeature = {
  title: string;
  description: string;
  evidence: string[];
};

export type LegacyFeatureDetail = {
  coverage: LegacyCoverage;
  legacyMenu: string;
  summary: string;
  features: LegacyFeature[];
};

// Rujukan di bawah berasal dari sidebar, dispatcher, dan halaman PHP legacy-origin/main.
// "Route terdeteksi" tidak berarti link tersebut masih aktif atau aman dipakai.
export const legacyFeatureMap: Record<ScreenId, LegacyFeatureDetail> = {
  home: {
    coverage: "menu-aktif",
    legacyMenu: "Dashboard",
    summary: "Dashboard lama menggabungkan ringkasan statistik, grafik, tabel pensiun, dan keterisian data.",
    features: [
      {
        title: "Statistik dan grafik kepegawaian",
        description: "Menampilkan ringkasan, masa kerja, jenis kelamin, pendidikan, status, pelanggaran, dan jabatan.",
        evidence: ["dashboard.php", "komponen/statistik-box.php", "komponen/chart-masakerja.php", "komponen/chart-pie-jk.php", "komponen/chart-bar-pendidikan.php", "komponen/chart-bar-status.php", "komponen/chart-line-pelanggaran.php", "komponen/chart-bar-jabatan.php"],
      },
      {
        title: "Pensiun dan keterisian data",
        description: "Ada tabel pegawai yang mendekati pensiun serta keterisian data eksekutif dan struktural.",
        evidence: ["komponen/tabel-pensiun.php", "komponen/tabel-keterisian-eksekutif.php", "komponen/tabel-keterisian-struktural.php"],
      },
      {
        title: "Filter unit pada dashboard",
        description: "Tampilan dashboard memiliki kontrol filter unit dan kode memanggil endpoint pemuat ulang; file handler yang dirujuk belum ditemukan pada snapshot legacy ini.",
        evidence: ["dashboard.php"],
      },
    ],
  },
  profile: {
    coverage: "menu-aktif",
    legacyMenu: "Profil Saya (untuk role user)",
    summary: "Profil lama menyatukan biodata dan beberapa bagian riwayat pegawai.",
    features: [
      { title: "Lihat dan ubah biodata", description: "Profil menampilkan biodata pegawai dan menyediakan edit untuk role tertentu.", evidence: ["templates/layout-sidebar.php", "pages/pegawai/profil-pegawai.php"] },
      { title: "Ganti foto dan cetak CV", description: "Profil menyediakan alur ganti foto dan tautan Cetak CV yang menuju halaman cetak biodata.", evidence: ["pages/pegawai/profil-pegawai.php", "pages/pegawai/form-ganti-foto.php", "pages/report/print-biodata-pegawai.php"] },
      { title: "Bagian riwayat dalam profil", description: "Rincian pegawai membuka bagian seperti keluarga dan riwayat, termasuk data SKP/DP3 yang tersedia.", evidence: ["pages/pegawai/view-detail-data-pegawai.php"] },
    ],
  },
  jobHistory: {
    coverage: "menu-aktif",
    legacyMenu: "Master Data > Jabatan",
    summary: "Menu Jabatan lama mengelola posisi aktif dan histori, terpisah dari pemetaan jabatan target yang masih perlu review.",
    features: [
      { title: "Daftar dan kelola jabatan pegawai", description: "Halaman jabatan menyediakan tampilan, entry, edit, dan penentuan jabatan yang berlaku.", evidence: ["templates/layout-sidebar.php", "pages/ref-jabatan/form-view-data-jabatan.php", "pages/ref-jabatan/form-master-data-jabatan.php", "pages/ref-jabatan/set-jabatan-sekarang.php"] },
      { title: "Riwayat dan import jabatan", description: "Ada form untuk membuat riwayat jabatan dan import kolektif jabatan.", evidence: ["pages/ref-jabatan/form-master-create-history-jabatan.php", "pages/ref-jabatan/form-import-jabatan.php"] },
    ],
  },
  education: {
    coverage: "menu-aktif",
    legacyMenu: "Master Data > Pendidikan",
    summary: "Menu lama mencatat pendidikan formal dan memiliki jalur untuk memperbarui data pendidikan secara kolektif.",
    features: [
      { title: "Riwayat pendidikan formal", description: "Daftar pendidikan pegawai dapat ditinjau dan dikelola; ada fungsi untuk menetapkan pendidikan akhir.", evidence: ["templates/layout-sidebar.php", "pages/ref-pendidikan/form-view-data-pendidikan.php", "pages/ref-pendidikan/set-pendidikan-akhir.php"] },
      { title: "Import pendidikan", description: "Tersedia form import pendidikan.", evidence: ["pages/ref-pendidikan/form-import-data-pendidikan.php"] },
    ],
  },
  training: {
    coverage: "menu-aktif",
    legacyMenu: "Master Data > Daftar Kegiatan Diklat dan Pelatihan",
    summary: "Sistem lama memisahkan daftar kegiatan/biaya dari catatan keikutsertaan pegawai.",
    features: [
      { title: "Daftar kegiatan dan biaya", description: "Kegiatan pengembangan memiliki tampilan daftar, form kegiatan, kategori, pelaksana, waktu, target peserta, dan anggaran.", evidence: ["templates/layout-sidebar.php", "pages/ref-biaya-pendidikan/view-data-biaya-pendidikan.php", "pages/ref-biaya-pendidikan/form-biaya-pendidikan.php"] },
      { title: "Riwayat pelatihan pegawai", description: "Catatan diklat pegawai dapat ditinjau, dikelola, dan diimport.", evidence: ["templates/layout-sidebar.php", "pages/ref-diklat/form-view-data-diklat.php", "pages/ref-diklat/form-master-data-diklat.php", "pages/ref-diklat/form-import-data-diklat.php"] },
      { title: "Rekap pelatihan dan biaya", description: "Laporan lama menyediakan rekap pelatihan/biaya; cara menghubungkan kegiatan dengan peserta perlu diverifikasi.", evidence: ["pages/report/view-rekap.php", "pages/report/view-rekap-biaya.php", "pages/report/rekap-biaya-diklat.php"] },
    ],
  },
  certification: {
    coverage: "menu-aktif",
    legacyMenu: "Master Data > Sertifikasi",
    summary: "Sertifikasi termasuk menu utama master data lama.",
    features: [
      { title: "Kelola daftar sertifikasi", description: "Tersedia halaman daftar, entry/edit, dan import sertifikasi.", evidence: ["templates/layout-sidebar.php", "pages/ref-sertifikasi/form-view-data-sertifikasi.php", "pages/ref-sertifikasi/form-master-data-sertifikasi.php", "pages/ref-sertifikasi/form-import-data-sertifikasi.php"] },
      { title: "Lihat atau unduh bukti", description: "Ada route untuk mengunduh berkas sertifikasi; format dan retensi file perlu ditinjau.", evidence: ["pages/ref-sertifikasi/download-sertif.php"] },
    ],
  },
  family: {
    coverage: "menu-aktif",
    legacyMenu: "Master Data > Keluarga",
    summary: "Menu keluarga lama memisahkan data pasangan, anak, dan orang tua.",
    features: [
      { title: "Data pasangan, anak, dan orang tua", description: "Setiap kategori memiliki halaman daftar dan form kelola masing-masing.", evidence: ["templates/layout-sidebar.php", "pages/ref-keluarga/form-view-data-suami-istri.php", "pages/ref-keluarga/form-view-data-anak.php", "pages/ref-keluarga/form-view-data-ortu.php"] },
      { title: "Import kategori keluarga", description: "Tersedia form import untuk data pasangan, anak, dan orang tua.", evidence: ["pages/ref-keluarga/form-import-data-pasangan.php", "pages/ref-keluarga/form-import-data-anak.php", "pages/ref-keluarga/form-import-data-ortu.php"] },
    ],
  },
  cv: {
    coverage: "route-terdeteksi",
    legacyMenu: "Profil Saya > Cetak CV",
    summary: "CV bukan submenu tersendiri pada sidebar yang ditinjau; aksi cetak tersedia dari profil pegawai.",
    features: [
      { title: "Cetak CV/biodata pegawai", description: "Profil lama menyediakan tautan Cetak CV menuju halaman print biodata; format final perlu dilihat bersama pemilik proses.", evidence: ["pages/pegawai/profil-pegawai.php", "pages/report/print-biodata-pegawai.php"] },
    ],
  },
  profileChange: {
    coverage: "route-terdeteksi",
    legacyMenu: "Perubahan data dan otorisasi",
    summary: "Kode lama memiliki preview perubahan dan halaman otorisasi, tetapi bukan sebagai submenu utama yang tampak pada sidebar yang ditinjau.",
    features: [
      { title: "Preview perubahan pegawai", description: "Ada halaman untuk melihat usulan perubahan sebelum diproses.", evidence: ["pages/pegawai/preview-edit.php", "pages/pegawai/otorisasi-edit.php"] },
      { title: "Pemeriksaan dan keputusan otorisasi", description: "Tersedia halaman antrean/detail/proses otorisasi untuk perubahan data.", evidence: ["pages/otorisasi/otorisasi-approval.php", "pages/otorisasi/otorisasi-detail.php", "pages/otorisasi/proses-otorisasi.php"] },
      { title: "Notifikasi pengguna", description: "Ada halaman notifikasi pengguna; hubungan tabel dan jenis notifikasi perlu dicocokkan dengan implementasi.", evidence: ["pages/pegawai/notifikasi-user.php"] },
    ],
  },
  attendanceCorrection: {
    coverage: "route-terdeteksi",
    legacyMenu: "Data historis cuti",
    summary: "Halaman cuti lama bukan fitur pencatatan absensi atau koreksi event kehadiran.",
    features: [
      { title: "Pencatatan riwayat cuti", description: "Halaman historis cuti memuat jenis, nomor/tanggal persetujuan, rentang tanggal, dan keterangan.", evidence: ["pages/ref-riwayat/form-view-data-cuti.php", "pages/ref-riwayat/form-master-data-cuti.php"] },
    ],
  },
  requestStatus: {
    coverage: "route-terdeteksi",
    legacyMenu: "Notifikasi dan otorisasi, belum satu halaman status",
    summary: "Ada halaman notifikasi pengguna dan antrean otorisasi, tetapi belum ditemukan satu inbox yang menggabungkan seluruh pengajuan.",
    features: [
      { title: "Notifikasi pengguna", description: "Pengguna memiliki halaman notifikasi; status baca dan kategori perlu dicek terhadap kode serta DDL.", evidence: ["pages/pegawai/notifikasi-user.php"] },
      { title: "Status proses otorisasi", description: "Pemeriksa dapat membuka antrean dan detail otorisasi perubahan data.", evidence: ["pages/otorisasi/otorisasi-approval.php", "pages/otorisasi/otorisasi-detail.php"] },
    ],
  },
  kpi: {
    coverage: "route-terdeteksi",
    legacyMenu: "SKP/DP3 pada rincian pegawai",
    summary: "Data DP3/SKP lama terdeteksi, tetapi tidak membuktikan KPI baru atau integrasi Monbis.",
    features: [
      { title: "Riwayat penilaian DP3/SKP", description: "Rincian pegawai memuat riwayat DP3 per periode, nilai beberapa unsur, pejabat penilai, atasan penilai, dan hasil penilaian.", evidence: ["pages/pegawai/view-detail-data-pegawai.php", "pages/ref-riwayat/master-data-dp3.php", "pages/ref-riwayat/view-detail-data-dp3.php"] },
    ],
  },
  selfAssessment: {
    coverage: "belum-ditemukan",
    legacyMenu: "Belum ada padanan yang dapat dikonfirmasi",
    summary: "Belum ditemukan alur mandiri pegawai untuk mengisi self-assessment. DP3/SKP lama saja tidak membuktikan fitur tersebut.",
    features: [],
  },
  kpiReport: {
    coverage: "route-terdeteksi",
    legacyMenu: "DP3/SKP pada profil pegawai, bukan menu laporan KPI khusus",
    summary: "Riwayat nilai DP3 dapat dilihat pada rincian pegawai; laporan KPI berjenjang belum teridentifikasi.",
    features: [
      { title: "Detail nilai DP3/SKP", description: "Kode profil mengambil nilai per periode dan membuka detail DP3; ini bukan laporan KPI baru dari Monbis.", evidence: ["pages/pegawai/view-detail-data-pegawai.php", "pages/ref-riwayat/view-detail-data-dp3.php"] },
    ],
  },
  attendance: {
    coverage: "belum-ditemukan",
    legacyMenu: "Belum ada menu absensi harian yang teridentifikasi",
    summary: "Pada sidebar, router, dan daftar halaman yang ditinjau belum ditemukan fitur check-in/out, face recognition, atau geofence absensi.",
    features: [],
  },
  attendanceHistory: {
    coverage: "route-terdeteksi",
    legacyMenu: "Riwayat cuti saja yang teridentifikasi",
    summary: "Data cuti historis tidak sama dengan event masuk/pulang atau rekap kehadiran harian.",
    features: [
      { title: "Riwayat cuti", description: "Sistem lama memiliki halaman histori cuti, namun sumber event kehadiran harian belum ditemukan.", evidence: ["pages/ref-riwayat/form-view-data-cuti.php"] },
    ],
  },
  employeeDirectory: {
    coverage: "menu-aktif",
    legacyMenu: "Data Pegawai > Daftar Pegawai",
    summary: "Menu lama menyediakan daftar dan rincian pegawai untuk pengelolaan data SDM.",
    features: [
      { title: "Daftar, cari, dan buka rincian", description: "Daftar pegawai membuka rincian; profil lama memanggil form master dalam mode edit untuk biodata.", evidence: ["templates/layout-sidebar.php", "pages/pegawai/form-view-data-pegawai.php", "pages/pegawai/view-detail-data-pegawai.php", "pages/pegawai/form-master-data-pegawai.php"] },
      { title: "Data pegawai purna", description: "Ada jalur untuk menampilkan pegawai purna/keluar; status dan alasan perlu dicocokkan dengan kebijakan HR.", evidence: ["pages/pegawai/ajax-pegawai-purna.php", "pages/ref-mutasi/form-view-data-mutasi.php"] },
    ],
  },
  employeeCreate: {
    coverage: "menu-aktif",
    legacyMenu: "Data Pegawai > Tambah Pegawai / Import Excel",
    summary: "Sistem lama memiliki entry individual dan import kolektif. Satu label submenu lama tampak tidak sesuai dengan route yang dituju.",
    features: [
      { title: "Entry pegawai satu per satu", description: "Tersedia form master pegawai untuk memasukkan data pegawai.", evidence: ["templates/layout-sidebar.php", "pages/pegawai/form-master-data-pegawai.php"] },
      { title: "Import pegawai dari Excel", description: "Ada form, template, dan proses upload data pegawai kolektif.", evidence: ["templates/layout-sidebar.php", "pages/pegawai/form-upload-data-pegawai.php", "pages/pegawai/download-template-pegawai.php", "pages/pegawai/upload-data-pegawai.php"] },
      { title: "Label pengangkatan perlu diklarifikasi", description: "Sidebar menulis “Pengakatan Pegawai”, tetapi route yang dibuka adalah form ubah ID pegawai dengan jenis pengangkatan, ID baru, nomor/tanggal SK, TMT, dan file SK.", evidence: ["templates/layout-sidebar.php", "pages/pegawai/form-ubah-id-peg.php"] },
    ],
  },
  employeeHistory: {
    coverage: "menu-aktif",
    legacyMenu: "Master Data > Jabatan dan Data Pegawai > Penonaktifan",
    summary: "Riwayat lama tersebar ke beberapa modul, bukan satu timeline terpadu.",
    features: [
      { title: "Jabatan dan mutasi", description: "Ada pengelolaan jabatan serta data mutasi/penonaktifan pegawai.", evidence: ["templates/layout-sidebar.php", "pages/ref-jabatan/form-view-data-jabatan.php", "pages/ref-mutasi/form-view-data-mutasi.php"] },
      { title: "Pengangkatan dan penonaktifan", description: "Halaman pengangkatan serta penonaktifan mencatat jenis kejadian, SK, tanggal, dan TMT.", evidence: ["pages/ref-pengangkatan/form-view-data-angkat.php", "pages/ref-mutasi/form-view-data-mutasi.php"] },
      { title: "Cuti, penghargaan, dan hukuman", description: "Halaman untuk beberapa riwayat ini ada di kode, tetapi tidak semuanya tampak sebagai submenu pada sidebar aktif yang ditinjau.", evidence: ["pages/ref-riwayat/form-view-data-cuti.php", "pages/ref-riwayat/master-data-penghargaan.php", "pages/ref-pelanggaran/form-view-data-pelanggaran.php"] },
    ],
  },
  employeeChanges: {
    coverage: "route-terdeteksi",
    legacyMenu: "Preview edit dan otorisasi",
    summary: "Kode lama memiliki proses review perubahan data; kelengkapan maker-checker dan audit perlu diverifikasi sebelum dianggap setara.",
    features: [
      { title: "Review perubahan yang diajukan", description: "Ada halaman preview, edit otorisasi, antrean, dan proses keputusan perubahan.", evidence: ["pages/pegawai/preview-edit.php", "pages/pegawai/otorisasi-edit.php", "pages/otorisasi/otorisasi-approval.php", "pages/otorisasi/proses-otorisasi.php"] },
    ],
  },
  employeeTraining: {
    coverage: "menu-aktif",
    legacyMenu: "Master Data > Pelatihan",
    summary: "Riwayat pelatihan pegawai ada di menu utama lama dan berbeda dari daftar kegiatan serta anggaran.",
    features: [
      { title: "Kelola riwayat peserta diklat", description: "Ada daftar dan form untuk mencatat keikutsertaan pelatihan/diklat per pegawai.", evidence: ["templates/layout-sidebar.php", "pages/ref-diklat/form-view-data-diklat.php", "pages/ref-diklat/form-master-data-diklat.php"] },
      { title: "Import data pelatihan", description: "Tersedia alur import untuk catatan diklat.", evidence: ["pages/ref-diklat/form-import-data-diklat.php", "pages/ref-diklat/upload-data-diklat.php"] },
    ],
  },
  employeeCertifications: {
    coverage: "menu-aktif",
    legacyMenu: "Master Data > Sertifikasi",
    summary: "Pengelolaan sertifikasi pegawai berada di menu master data lama.",
    features: [
      { title: "Kelola data dan bukti sertifikasi", description: "Ada daftar/form sertifikasi, import, dan route unduh berkas.", evidence: ["templates/layout-sidebar.php", "pages/ref-sertifikasi/form-view-data-sertifikasi.php", "pages/ref-sertifikasi/form-import-data-sertifikasi.php", "pages/ref-sertifikasi/download-sertif.php"] },
    ],
  },
  employeeFamily: {
    coverage: "menu-aktif",
    legacyMenu: "Master Data > Keluarga",
    summary: "Pengelolaan keluarga dipisah menjadi tiga kategori.",
    features: [
      { title: "Kelola pasangan, anak, dan orang tua", description: "Masing-masing kategori memiliki daftar serta form pengelolaan.", evidence: ["templates/layout-sidebar.php", "pages/ref-keluarga/form-view-data-suami-istri.php", "pages/ref-keluarga/form-view-data-anak.php", "pages/ref-keluarga/form-view-data-ortu.php"] },
      { title: "Import data keluarga", description: "Ada form import untuk pasangan, anak, dan orang tua.", evidence: ["pages/ref-keluarga/form-import-data-pasangan.php", "pages/ref-keluarga/form-import-data-anak.php", "pages/ref-keluarga/form-import-data-ortu.php"] },
    ],
  },
  employeeDocuments: {
    coverage: "route-terdeteksi",
    legacyMenu: "Dokumen pada profil dan halaman cetak",
    summary: "File terkait profil dan laporan ditemukan, tetapi belum teridentifikasi sebagai satu menu dokumen terpusat.",
    features: [
      { title: "Ganti foto profil", description: "Profil memiliki alur unggah/ganti foto pegawai.", evidence: ["pages/pegawai/form-ganti-foto.php", "pages/pegawai/ganti-foto.php"] },
      { title: "Cetak biodata/CV", description: "Ada halaman cetak biodata yang dipanggil sebagai Cetak CV dari profil.", evidence: ["pages/report/print-biodata-pegawai.php", "pages/pegawai/profil-pegawai.php"] },
    ],
  },
  hrReports: {
    coverage: "menu-aktif",
    legacyMenu: "Laporan",
    summary: "Menu lama memuat laporan kepegawaian, keadaan pegawai, formasi jabatan, dan laporan pelatihan/biaya.",
    features: [
      { title: "Laporan nominatif/kepegawaian", description: "Daftar nominatif merangkum pegawai per unit dan menyediakan ekspor.", evidence: ["templates/layout-sidebar.php", "pages/report/nominatif-pegawai.php", "pages/report/export-nominatif-excel.php"] },
      { title: "Keadaan dan formasi pegawai", description: "Tersedia laporan keadaan pegawai dan formasi jabatan, termasuk cetak/unduh.", evidence: ["pages/report/keadaan-pegawai.php", "pages/report/formasi-pegawai.php", "pages/report/export-keadaan-pegawai.php", "pages/report/export-formasi.php"] },
      { title: "Rekap diklat dan biaya", description: "Menu laporan mencakup pelatihan pegawai serta rekap/daftar biaya kegiatan diklat.", evidence: ["pages/report/view-rekap.php", "pages/report/view-rekap-biaya.php", "pages/report/rekap-biaya-diklat.php"] },
    ],
  },
  hrOfficeReport: {
    coverage: "route-terdeteksi",
    legacyMenu: "Master kantor dan filter dashboard",
    summary: "Halaman master kantor dan filter dashboard ditemukan; laporan hierarki pusat/korwil/cabang/kankas belum terbukti sebagai satu fitur.",
    features: [
      { title: "Lihat dan kelola master kantor", description: "Ada halaman kantor beserta route tambah/edit/detail.", evidence: ["pages/kantor/form-view-data-kantor.php", "pages/kantor/form-master-data-kantor.php", "pages/kantor/view-detail-data-kantor.php"] },
      { title: "Filter dashboard per unit", description: "Tampilan dashboard cabang memiliki kontrol filter unit; file handler untuk memuat ulang data tidak ditemukan pada snapshot yang ditinjau.", evidence: ["dashboard-cabang.php"] },
    ],
  },
  hrTrainingReport: {
    coverage: "menu-aktif",
    legacyMenu: "Laporan > Pelatihan Pegawai / Daftar Diklat",
    summary: "Laporan pelatihan dan biaya kegiatan muncul sebagai submenu laporan lama.",
    features: [
      { title: "Rekap pelatihan pegawai", description: "Ada halaman rekap pelatihan pegawai dan daftar kegiatan/biaya diklat.", evidence: ["templates/layout-sidebar.php", "pages/report/view-rekap.php", "pages/report/view-rekap-biaya.php", "pages/report/rekap-biaya-diklat.php"] },
    ],
  },
  hrKpiReport: {
    coverage: "route-terdeteksi",
    legacyMenu: "DP3/SKP pada rincian pegawai",
    summary: "Nilai DP3/SKP lama dapat ditampilkan pada rincian pegawai; laporan KPI lintas kantor belum teridentifikasi.",
    features: [
      { title: "Rincian hasil DP3/SKP", description: "Kode menampilkan periode, nilai unsur, pejabat penilai, dan hasil pada bagian profil pegawai.", evidence: ["pages/pegawai/view-detail-data-pegawai.php", "pages/ref-riwayat/view-detail-data-dp3.php"] },
    ],
  },
  hrAttendanceReport: {
    coverage: "belum-ditemukan",
    legacyMenu: "Belum ada laporan absensi harian yang teridentifikasi",
    summary: "Laporan cuti lama tidak membuktikan tersedianya laporan event kehadiran atau rekap absensi harian.",
    features: [],
  },
  monbis: {
    coverage: "belum-ditemukan",
    legacyMenu: "Integrasi Monbis belum terlihat pada kode SIMPEG lama yang ditinjau",
    summary: "Tidak ditemukan kontrak/API Monbis di menu dan route legacy yang diperiksa. `tb_dp3` bukan pengganti sumber Monbis.",
    features: [],
  },
  kpiMonitoring: {
    coverage: "route-terdeteksi",
    legacyMenu: "DP3/SKP per pegawai, bukan monitoring siklus KPI",
    summary: "Kode lama menampilkan data DP3/SKP per pegawai, tetapi alur monitoring target dan sinkronisasi Monbis belum teridentifikasi.",
    features: [
      { title: "Riwayat DP3/SKP", description: "Nilai per periode dapat dibuka dari rincian pegawai; tidak ditemukan rekonsiliasi sumber Monbis.", evidence: ["pages/pegawai/view-detail-data-pegawai.php", "pages/ref-riwayat/view-detail-data-dp3.php"] },
    ],
  },
  reviewFirst: {
    coverage: "belum-ditemukan",
    legacyMenu: "Penilai 1 KPI belum ditemukan",
    summary: "Ada otorisasi perubahan data, tetapi belum ditemukan penugasan dan keputusan penilaian KPI oleh Kabid.",
    features: [],
  },
  reviewSecond: {
    coverage: "belum-ditemukan",
    legacyMenu: "Penilai 2 KPI belum ditemukan",
    summary: "Modul otorisasi perubahan data bukan bukti alur penilaian KPI oleh Kacab atau Kadiv.",
    features: [],
  },
  reviewDirector: {
    coverage: "belum-ditemukan",
    legacyMenu: "Penilaian Direksi belum ditemukan",
    summary: "Belum ditemukan menu/route penilaian Direksi untuk Kacab, Korwil, dan Kadiv.",
    features: [],
  },
  reviewHistory: {
    coverage: "route-terdeteksi",
    legacyMenu: "Riwayat DP3/SKP, bukan histori keputusan reviewer berjenjang",
    summary: "Record DP3 lama menyimpan periode penilaian, tetapi audit perubahan dan riwayat reviewer baru belum teridentifikasi.",
    features: [
      { title: "Buka detail penilaian lama", description: "Rincian DP3 dapat dibuka per record dari profil pegawai.", evidence: ["pages/pegawai/view-detail-data-pegawai.php", "pages/ref-riwayat/view-detail-data-dp3.php"] },
    ],
  },
  access: {
    coverage: "menu-aktif",
    legacyMenu: "Data User dan Pengaturan Aplikasi",
    summary: "Pengelolaan akun dan konfigurasi aplikasi merupakan menu admin lama; batas role lama tidak otomatis sama dengan role SIMPEG baru.",
    features: [
      { title: "Kelola akun pengguna", description: "Sidebar admin menyediakan Data User; router memiliki halaman daftar/form user.", evidence: ["templates/layout-sidebar.php", "pages/user/form-view-data-user.php", "pages/user/form-master-data-user.php"] },
      { title: "Konfigurasi aplikasi", description: "Admin memiliki menu pengaturan aplikasi yang mengarah ke form dan proses konfigurasi.", evidence: ["templates/layout-sidebar.php", "pages/config/form-config-aplikasi.php", "pages/config/config-aplikasi.php"] },
      { title: "Sinkronisasi akun dari data pegawai", description: "Ada file tool sinkronisasi user, tetapi keberadaan file saja belum membuktikan tool tampil di sidebar atau masih aktif.", evidence: ["pages/tools/sinkron-user.php"] },
    ],
  },
};
