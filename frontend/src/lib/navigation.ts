export type RoleId = "employee" | "hr" | "kabid" | "secondReviewer" | "korwil" | "director" | "it";

export type ScreenId =
  | "home"
  | "profile"
  | "jobHistory"
  | "education"
  | "training"
  | "certification"
  | "family"
  | "cv"
  | "profileChange"
  | "attendanceCorrection"
  | "requestStatus"
  | "kpi"
  | "selfAssessment"
  | "kpiReport"
  | "attendance"
  | "attendanceHistory"
  | "employeeDirectory"
  | "employeeCreate"
  | "employeeHistory"
  | "employeeChanges"
  | "employeeTraining"
  | "employeeCertifications"
  | "employeeFamily"
  | "employeeDocuments"
  | "hrReports"
  | "hrOfficeReport"
  | "hrTrainingReport"
  | "hrKpiReport"
  | "hrAttendanceReport"
  | "monbis"
  | "kpiMonitoring"
  | "reviewFirst"
  | "reviewSecond"
  | "reviewDirector"
  | "reviewHistory"
  | "access";

export type DataPreview = "normal" | "loading" | "empty" | "error";
export type ReviewStatus = "Menunggu" | "Disetujui dalam simulasi" | "Perlu perbaikan dalam simulasi";

export const roles: { id: RoleId; label: string; description: string }[] = [
  { id: "employee", label: "Pegawai", description: "Akses pribadi untuk melihat data, KPI, absensi, dan pengajuan." },
  { id: "hr", label: "Divisi SDM", description: "Akses pribadi pegawai, pengelolaan data SDM, dan rancangan laporan lintas kantor." },
  { id: "kabid", label: "Kabid, Penilai 1", description: "Akses pribadi dan antrean penilaian tahap pertama sesuai penugasan." },
  { id: "secondReviewer", label: "Kacab atau Kadiv, Penilai 2", description: "Akses pribadi dan antrean penilaian tahap kedua sesuai penugasan." },
  { id: "korwil", label: "Korwil", description: "Akses pribadi. Penilaian KPI Korwil dilakukan oleh Direksi sesuai arahan pengguna." },
  { id: "director", label: "Direksi", description: "Akses pribadi dan rancangan penilaian KPI Kacab, Korwil, serta Kadiv." },
  { id: "it", label: "Tim IT, akses demo luas", description: "Semua menu ditampilkan untuk review prototype, bukan izin produksi." },
];

export const screenLabels: Record<ScreenId, string> = {
  home: "Beranda",
  profile: "Biodata saya",
  jobHistory: "Riwayat jabatan",
  education: "Pendidikan",
  training: "Pelatihan",
  certification: "Sertifikasi",
  family: "Data keluarga",
  cv: "CV dan dokumen",
  profileChange: "Perubahan data",
  attendanceCorrection: "Koreksi absensi",
  requestStatus: "Status pengajuan",
  kpi: "Ringkasan KPI saya",
  selfAssessment: "Self-assessment",
  kpiReport: "Laporan KPI saya",
  attendance: "Catat kehadiran",
  attendanceHistory: "Riwayat kehadiran",
  employeeDirectory: "Direktori pegawai",
  employeeCreate: "Tambah pegawai",
  employeeHistory: "Jabatan dan penempatan",
  employeeChanges: "Verifikasi perubahan data",
  employeeTraining: "Data pelatihan pegawai",
  employeeCertifications: "Data sertifikasi pegawai",
  employeeFamily: "Data keluarga pegawai",
  employeeDocuments: "CV dan dokumen pegawai",
  hrReports: "Data pegawai lintas kantor",
  hrOfficeReport: "Sebaran kantor dan organisasi",
  hrTrainingReport: "Pelatihan dan sertifikasi",
  hrKpiReport: "Kelengkapan KPI",
  hrAttendanceReport: "Rekap absensi",
  monbis: "Sumber data Monbis",
  kpiMonitoring: "Monitoring penilaian",
  reviewFirst: "Antrean penilai 1",
  reviewSecond: "Antrean penilai 2",
  reviewDirector: "Penilaian Direksi",
  reviewHistory: "Riwayat penilaian",
  access: "Peta menu dan role",
};
export type NavigationLink = { kind: "link"; id: ScreenId; label?: string };
export type NavigationGroup = { kind: "group"; id: string; label: string; children: NavigationLink[] };
export type NavigationItem = NavigationLink | NavigationGroup;

const link = (id: ScreenId, label?: string): NavigationLink => ({ kind: "link", id, label });
const group = (id: string, label: string, ids: ScreenId[]): NavigationGroup => ({
  kind: "group",
  id,
  label,
  children: ids.map((id) => link(id)),
});

const personalNavigation: NavigationItem[] = [
  link("home"),
  group("my-data", "Data saya", ["profile", "jobHistory", "education", "training", "certification", "family", "cv"]),
  group("my-kpi", "Kinerja dan KPI", ["kpi", "selfAssessment", "kpiReport"]),
  group("my-attendance", "Absensi", ["attendance", "attendanceHistory"]),
  group("my-requests", "Pengajuan saya", ["profileChange", "attendanceCorrection", "requestStatus"]),
];

const hrNavigation: NavigationItem[] = [
  group("staff-management", "Manajemen pegawai", [
    "employeeDirectory",
    "employeeCreate",
    "employeeHistory",
    "employeeChanges",
    "employeeTraining",
    "employeeCertifications",
    "employeeFamily",
    "employeeDocuments",
  ]),
  group("hr-reports", "Laporan SDM", ["hrReports", "hrOfficeReport", "hrTrainingReport", "hrKpiReport", "hrAttendanceReport"]),
  group("kpi-operations", "KPI dan integrasi", ["monbis", "kpiMonitoring"]),
];

const firstReviewNavigation: NavigationItem[] = [
  group("review-stage-one", "Penilaian", ["reviewFirst", "reviewHistory"]),
];
const secondReviewNavigation: NavigationItem[] = [
  group("review-stage-two", "Penilaian", ["reviewSecond", "reviewHistory"]),
];
const directorReviewNavigation: NavigationItem[] = [
  group("review-director", "Penilaian", ["reviewDirector", "reviewHistory"]),
];

export function navigationForRole(role: RoleId): NavigationItem[] {
  if (role === "hr") return [...personalNavigation, ...hrNavigation];
  if (role === "kabid") return [...personalNavigation, ...firstReviewNavigation];
  if (role === "secondReviewer") return [...personalNavigation, ...secondReviewNavigation];
  if (role === "director") return [...personalNavigation, ...directorReviewNavigation];
  if (role === "it") {
    return [
      ...personalNavigation,
      ...hrNavigation,
      ...firstReviewNavigation,
      ...secondReviewNavigation,
      ...directorReviewNavigation,
      link("access"),
    ];
  }
  return personalNavigation;
}

export function screensForRole(role: RoleId): ScreenId[] {
  const screens = navigationForRole(role).flatMap((item) => item.kind === "link" ? [item.id] : item.children.map((child) => child.id));
  return [...new Set(screens)];
}

export function selectedRole(role: RoleId) {
  return roles.find((item) => item.id === role) ?? roles[0];
}

export type ModuleDetail = {
  summary: string;
  status: "Rancangan menu" | "Alur prototype";
  workflow: string[];
  data: string[];
  dependency: string;
};

export const moduleDetails: Partial<Record<ScreenId, ModuleDetail>> = {
  jobHistory: {
    summary: "Riwayat jabatan menampilkan perubahan posisi dan penempatan tanpa menimpa catatan sebelumnya.",
    status: "Rancangan menu",
    workflow: ["Pilih pegawai atau periode", "Bandingkan jabatan lama dan penempatan yang berlaku", "Tinjau tanggal efektif", "Buka dasar perubahan atau dokumen pendukung"],
    data: ["Jabatan dan level", "Unit kerja dan kantor", "Tanggal mulai/akhir berlaku", "Dasar perubahan, jika disetujui"],
    dependency: "Katalog jabatan, struktur unit, tanggal efektif, dan kebijakan mutasi perlu disepakati sebelum implementasi.",
  },
  education: {
    summary: "Data pendidikan menjadi bagian dari riwayat pegawai dan sumber informasi CV yang terverifikasi.",
    status: "Rancangan menu",
    workflow: ["Tinjau daftar pendidikan", "Ajukan koreksi melalui proses perubahan data"],
    data: ["Jenjang dan bidang", "Institusi", "Tahun/periode", "Bukti pendidikan dengan akses terbatas"],
    dependency: "Daftar field wajib, aturan verifikasi, dan akses dokumen masih memerlukan persetujuan pemilik data.",
  },
  training: {
    summary: "Pegawai melihat riwayat pelatihan yang tercatat dan status bukti keikutsertaannya.",
    status: "Rancangan menu",
    workflow: ["Buka daftar pelatihan", "Pilih catatan untuk melihat rincian atau ajukan koreksi"],
    data: ["Nama dan penyelenggara", "Tanggal dan durasi", "Hasil atau keterangan", "Dokumen pendukung"],
    dependency: "Sumber data pelatihan lama dan proses verifikasi SDM perlu dipetakan.",
  },
  certification: {
    summary: "Pegawai memeriksa sertifikasi, masa berlaku, serta bukti yang tersimpan pada profilnya.",
    status: "Rancangan menu",
    workflow: ["Tinjau daftar sertifikasi", "Buka rincian dan masa berlaku", "Ajukan pembaruan bukti melalui perubahan data"],
    data: ["Nama sertifikasi", "Penerbit dan nomor", "Tanggal terbit/kedaluwarsa", "Bukti sertifikat"],
    dependency: "Jenis sertifikasi yang dicatat, pengingat masa berlaku, dan hak akses dokumen belum diputuskan.",
  },
  family: {
    summary: "Informasi keluarga merupakan data terbatas yang hanya ditampilkan kepada pemilik dan petugas berwenang.",
    status: "Rancangan menu",
    workflow: ["Tinjau anggota keluarga", "Pilih informasi yang perlu diperbarui", "Ajukan perubahan dengan bukti bila diwajibkan", "Tunggu pemeriksaan petugas berwenang"],
    data: ["Hubungan keluarga", "Informasi identitas minimum yang disetujui", "Status tanggungan bila diperlukan", "Dokumen pendukung dengan pembatasan akses"],
    dependency: "Field sensitif, masking, tujuan penggunaan, retensi, dan role yang boleh melihat harus disetujui HR serta pihak privasi.",
  },
  cv: {
    summary: "CV dirancang berasal dari data pegawai yang sudah diverifikasi, bukan isian bebas yang menggandakan data resmi.",
    status: "Rancangan menu",
    workflow: ["Tinjau bagian CV yang tersedia", "Pilih informasi yang diizinkan untuk ditampilkan", "Pratinjau sebelum ekspor"],
    data: ["Biodata terpilih", "Pendidikan dan jabatan", "Pelatihan dan sertifikasi", "Dokumen yang dapat diakses pegawai"],
    dependency: "Template, format ekspor, field yang dikecualikan, dan pencatatan ekspor perlu persetujuan.",
  },
  profileChange: {
    summary: "Form perubahan data memisahkan usulan pegawai dari data resmi sampai proses pemeriksaan selesai.",
    status: "Alur prototype",
    workflow: ["Pilih field yang akan diperbarui", "Isi nilai usulan", "Tambahkan alasan dan bukti yang diminta", "Kirim lalu pantau status"],
    data: ["Field yang diajukan", "Nilai lama dan nilai usulan", "Alasan dan bukti", "Aktor, waktu, dan hasil pemeriksaan"],
    dependency: "Field yang dapat diajukan mandiri, bukti wajib, pemilik persetujuan, dan target waktu belum ditetapkan.",
  },
  attendanceCorrection: {
    summary: "Pegawai dapat mengajukan koreksi untuk catatan kehadiran yang dianggap tidak sesuai.",
    status: "Alur prototype",
    workflow: ["Pilih tanggal kehadiran", "Jelaskan kejadian dan lampirkan bukti bila diwajibkan", "Kirim untuk ditinjau pejabat yang berwenang"],
    data: ["Tanggal dan jenis koreksi", "Alasan", "Bukti pendukung", "Status serta keputusan pemeriksa"],
    dependency: "Sumber absensi, batas pengajuan, jenis pengecualian, approver, dan periode penguncian masih terbuka.",
  },
  requestStatus: {
    summary: "Satu tempat untuk melacak perubahan data dan koreksi absensi yang pernah diajukan.",
    status: "Rancangan menu",
    workflow: ["Lihat daftar pengajuan", "Buka status dan catatan pemeriksa", "Perbaiki data bila dikembalikan", "Tarik hanya jika kebijakan mengizinkan"],
    data: ["Nomor pengajuan", "Jenis dan tanggal pengajuan", "Status proses", "Catatan tindak lanjut tanpa membuka data sensitif"],
    dependency: "Status final, aturan tarik/perbaiki, notifikasi, dan SLA approval perlu disepakati.",
  },
  selfAssessment: {
    summary: "Pegawai menyampaikan capaian dan konteks sebagai bahan penilaian, bukan sebagai nilai final.",
    status: "Alur prototype",
    workflow: ["Baca indikator, target, dan rubrik periode", "Isi capaian dan kendala", "Lampirkan bukti yang diminta", "Kirim untuk dinilai sesuai hierarki"],
    data: ["Indikator dan target versi periode", "Realisasi dan bukti", "Catatan pegawai", "Status pengisian dan penilai"],
    dependency: "Template per fungsi, bobot, rubrik, periode, tenggat, dan langkah keberatan memerlukan keputusan bisnis.",
  },
  kpiReport: {
    summary: "Laporan KPI pribadi merangkum kelengkapan, hasil, periode, sumber, dan tahapan penilaian.",
    status: "Rancangan menu",
    workflow: ["Pilih periode", "Bedakan data sementara dan hasil final", "Buka rincian indikator serta catatan penilai"],
    data: ["Status self-assessment", "Status penilaian berjenjang", "Realisasi dan versi sumber", "Hasil final setelah disahkan"],
    dependency: "Format laporan, hak akses bukti, dan aturan publikasi nilai perlu disetujui.",
  },
  attendanceHistory: {
    summary: "Riwayat kehadiran menampilkan catatan harian dan menandai data yang belum lengkap untuk direkonsiliasi.",
    status: "Rancangan menu",
    workflow: ["Pilih rentang tanggal", "Tinjau jam masuk/pulang dan sumber catatan", "Ajukan koreksi jika ada perbedaan"],
    data: ["Tanggal kerja dan jadwal", "Catatan masuk/pulang", "Sumber dan status rekonsiliasi", "Koreksi yang sedang diproses"],
    dependency: "Sumber absensi, jadwal kerja, zona waktu, kebijakan hari kerja, dan masa retensi perlu dipastikan.",
  },
  employeeDirectory: {
    summary: "Direktori menjadi pintu pencarian pegawai dengan filter organisasi dan pembatasan berdasarkan scope petugas.",
    status: "Rancangan menu",
    workflow: ["Cari dengan identifier atau kriteria yang diizinkan", "Buka profil sesuai scope akses"],
    data: ["Identifier pegawai", "Nama dan status kerja", "Jabatan serta penempatan aktif", "Kantor/unit yang diizinkan untuk dilihat"],
    dependency: "Scope SDM lintas kantor, field pencarian, masking, dan ekspor data harus ditinjau sebelum implementasi.",
  },
  employeeCreate: {
    summary: "Form penambahan pegawai menyiapkan data inti tanpa membuat status kerja atau akses aplikasi secara diam-diam.",
    status: "Rancangan menu",
    workflow: ["Masukkan identifier dan data minimum", "Pilih penempatan awal yang telah diverifikasi", "Periksa duplikasi dan kelengkapan", "Simpan melalui proses yang dapat diaudit"],
    data: ["Identifier stabil dari sumber yang disetujui", "Data biodata minimum", "Tanggal mulai dan status kerja", "Unit, jabatan, dan kantor awal"],
    dependency: "Sumber kebenaran pegawai, provisioning akun, entitlement aplikasi, dan otorisasi pembuat perlu diputuskan.",
  },
  employeeHistory: {
    summary: "Petugas SDM menelusuri riwayat jabatan dan penempatan berdasarkan tanggal efektif.",
    status: "Rancangan menu",
    workflow: ["Cari pegawai", "Bandingkan penempatan berjalan dengan riwayat", "Tinjau dampak tanggal efektif terhadap scope dan KPI"],
    data: ["Jabatan dan level", "Unit kerja serta kantor", "Tanggal efektif", "Alasan dan referensi persetujuan"],
    dependency: "Relasi kantor, penugasan PLT, mutasi retroaktif, dan aturan periode KPI perlu disepakati.",
  },
  employeeChanges: {
    summary: "Antrean verifikasi untuk perubahan data yang diajukan pegawai, dengan jejak sebelum dan sesudah.",
    status: "Rancangan menu",
    workflow: ["Buka antrean sesuai scope", "Periksa field, alasan, dan bukti", "Pilih setujui, tolak, atau kembalikan", "Tulis catatan keputusan"],
    data: ["Field serta nilai sebelum/sesudah", "Bukti pendukung", "Riwayat pemeriksa", "Alasan dan waktu keputusan"],
    dependency: "Pemisahan tugas, pejabat approver, akses data keluarga, dan aturan eskalasi masih perlu validasi.",
  },
  employeeTraining: {
    summary: "Pengelolaan riwayat pelatihan pegawai untuk pencatatan, pemeriksaan bukti, dan koreksi.",
    status: "Rancangan menu",
    workflow: ["Cari pegawai atau catatan pelatihan", "Periksa detail dan bukti", "Catat koreksi melalui perubahan yang dapat diaudit"],
    data: ["Nama program dan penyelenggara", "Tanggal/durasi", "Peserta dan hasil", "Bukti keikutsertaan"],
    dependency: "Sumber legacy, proses impor, dan siapa yang berwenang mengesahkan catatan perlu dipetakan.",
  },
  employeeCertifications: {
    summary: "Pengelolaan sertifikasi menghubungkan bukti, penerbit, pemilik, dan masa berlakunya.",
    status: "Rancangan menu",
    workflow: ["Cari sertifikasi", "Periksa data penerbit dan tanggal", "Tindak lanjuti koreksi atau pembaruan"],
    data: ["Pegawai dan nama sertifikasi", "Penerbit/nomor", "Masa berlaku", "Bukti dan status verifikasi"],
    dependency: "Katalog, verifikasi sertifikat, akses dokumen, serta pengingat masa berlaku belum diputuskan.",
  },
  employeeFamily: {
    summary: "Akses petugas ke data keluarga dibatasi karena berisi informasi pribadi yang tidak diperlukan semua laporan.",
    status: "Rancangan menu",
    workflow: ["Cari pegawai sesuai scope", "Buka data hanya untuk tujuan yang diizinkan", "Catat perubahan dan akses sensitif"],
    data: ["Hubungan keluarga", "Field identitas yang disetujui", "Dokumen pendukung", "Jejak perubahan dan akses"],
    dependency: "Tujuan penggunaan, masking, role, retensi, dan audit akses harus disetujui sebelum layar produksi.",
  },
  employeeDocuments: {
    summary: "Dokumen pegawai dikelompokkan menurut jenis dan hak akses, bukan dijadikan tautan publik.",
    status: "Rancangan menu",
    workflow: ["Pilih pegawai dan kategori dokumen", "Tinjau metadata tanpa membuka file di daftar umum", "Periksa status verifikasi dan masa berlaku", "Buka atau kelola file hanya sesuai izin"],
    data: ["Kategori dan metadata dokumen", "Pemilik dan tanggal unggah", "Status pemeriksaan", "Riwayat akses dan perubahan"],
    dependency: "Format file, batas ukuran, penyimpanan, malware scan, retensi, dan peran pengakses perlu keputusan IT/HR.",
  },
  hrOfficeReport: {
    summary: "Laporan organisasi membandingkan data pegawai menurut struktur pusat, korwil, cabang, dan kantor kas.",
    status: "Rancangan menu",
    workflow: ["Pilih cakupan organisasi", "Terapkan filter yang tersedia", "Tinjau hasil dan waktu pembaruan data"],
    data: ["Kantor dan jenis organisasi", "Relasi parent yang berlaku", "Ringkasan status pegawai", "Waktu dan sumber data"],
    dependency: "Hierarki resmi, kantor aktif, scope SDM, dan definisi setiap ringkasan perlu dikonfirmasi.",
  },
  hrTrainingReport: {
    summary: "Laporan ini menampilkan kelengkapan pelatihan dan sertifikasi tanpa membuka dokumen kepada semua pengguna.",
    status: "Rancangan menu",
    workflow: ["Pilih cakupan kantor", "Filter periode atau status"],
    data: ["Program pelatihan dan sertifikasi", "Peserta dan kantor", "Masa berlaku/status verifikasi", "Metadata bukti, bukan file sensitif pada tabel"],
    dependency: "Definisi laporan, data yang dapat diekspor, dan pemilik pemeriksaan bukti harus disetujui.",
  },
  hrKpiReport: {
    summary: "Ringkasan untuk melihat kelengkapan pengisian dan tahapan evaluasi, bukan membandingkan skor yang tidak sebanding.",
    status: "Rancangan menu",
    workflow: ["Pilih periode dan cakupan", "Pisahkan KPI pemasaran dan nonpemasaran", "Tinjau status belum mulai, berjalan, dan final"],
    data: ["Pegawai/unit sesuai scope", "Status self-assessment", "Tahapan penilai", "Status sinkronisasi sumber bila relevan"],
    dependency: "Periode, kategori pegawai, matriks akses, dan definisi status harus selaras dengan kebijakan KPI.",
  },
  hrAttendanceReport: {
    summary: "Rekap absensi memisahkan catatan sumber, hasil rekonsiliasi, dan koreksi yang menunggu keputusan.",
    status: "Rancangan menu",
    workflow: ["Pilih periode dan kantor", "Tinjau kelengkapan serta anomali", "Telusuri koreksi sesuai hak akses"],
    data: ["Kehadiran harian", "Status rekonsiliasi", "Koreksi/pengecualian", "Jadwal dan sumber catatan"],
    dependency: "Metode absensi, jadwal, toleransi, aturan lock, dan kewenangan melihat data perlu ditetapkan.",
  },
  monbis: {
    summary: "Halaman rancangan untuk memperlihatkan asal realisasi KPI pemasaran dari Monbis dan kesehatan proses sinkronisasi.",
    status: "Rancangan menu",
    workflow: ["Tinjau definisi indikator dan kontrak sumber", "Pilih periode cut-off", "Periksa status run dan error", "Rekonsiliasi hanya melalui proses terotorisasi"],
    data: ["Identitas indikator/sumber", "Timestamp dan cut-off", "Status run dan error", "Versi realisasi yang dapat ditelusuri"],
    dependency: "Kontrak API Monbis, identifier stabil, owner target, retry, koreksi, dan jadwal sinkronisasi belum tersedia.",
  },
  kpiMonitoring: {
    summary: "Monitoring KPI memisahkan kelengkapan tugas, penilaian berjalan, hasil final, dan data yang bermasalah.",
    status: "Rancangan menu",
    workflow: ["Pilih periode dan kategori", "Temukan tahap yang belum selesai", "Tindak lanjuti sesuai kewenangan tanpa mengubah skor langsung"],
    data: ["Versi template dan periode", "Status pegawai/penilai", "Data Monbis bermasalah", "Hasil final dan jejak koreksi"],
    dependency: "Role admin KPI, tenggat, notifikasi, dan prosedur reopen/keberatan perlu disetujui.",
  },
  reviewHistory: {
    summary: "Riwayat penilaian menjaga keputusan setiap tahap tetap dapat ditelusuri tanpa menimpa hasil sebelumnya.",
    status: "Rancangan menu",
    workflow: ["Pilih periode dan pegawai sesuai scope", "Buka urutan penilaian", "Tinjau alasan, waktu, dan status hasil"],
    data: ["Penilai dan tahap", "Nilai/catatan sesuai izin", "Timestamp serta alasan keputusan", "Versi hasil final"],
    dependency: "Kebijakan kerahasiaan nilai, akses setelah final, dan proses keberatan belum ditetapkan.",
  },
  access: {
    summary: "Peta ini menunjukkan menu yang terlihat pada tiap persona demo agar rancangan akses mudah ditinjau.",
    status: "Alur prototype",
    workflow: ["Pilih role untuk membuka struktur menu", "Periksa tiap submenu dan tujuannya", "Catat role, scope, atau proses yang perlu dikoreksi"],
    data: ["Role persona demo", "Kelompok menu dan submenu", "Tujuan tiap layar", "Catatan bahwa akses produksi harus ditegakkan oleh backend"],
    dependency: "Matriks role, scope organisasi, konflik kepentingan, dan administrator akses perlu persetujuan bisnis.",
  },
};
