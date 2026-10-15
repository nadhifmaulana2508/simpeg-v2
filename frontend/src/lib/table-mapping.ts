import type { ScreenId } from "./navigation";

export type LegacyTableReference = {
  name: string;
  note: string;
  kind?: "table" | "column";
};

export type ScreenTableMapping = {
  legacyTables: LegacyTableReference[];
  sourceCoverage: string;
  proposedTables: string[];
  discussionPrompt: string;
};

const employeeMaster = {
  name: "tb_pegawai",
  note: "Pengguna mengonfirmasi tabel ini sebagai daftar pegawai dan biodata.",
};

const oldKpi = {
  name: "tb_dp3",
  note: "Arsip KPI lama. Bukan sumber langsung untuk KPI baru atau data Monbis.",
};

const attendanceSourceUnknown = "Inventaris DDL belum menunjukkan tabel absensi yang terkonfirmasi. Tanyakan sumber aktif ke pemilik proses.";

// Kandidat sumber diambil dari inventaris DDL dan target dari ERD konseptual.
// Hubungan belum membuktikan pemakaian aplikasi atau kesesuaian isi record.
export const tableMappings: Record<ScreenId, ScreenTableMapping> = {
  home: {
    legacyTables: [employeeMaster, { name: "tb_jabatan", note: "Kandidat sumber ringkasan penempatan; validasi pemakaian dan tanggal efektif." }, oldKpi],
    sourceCoverage: "Beranda merangkum domain lain, bukan tabel khusus. Sumber KPI dan absensi belum terkonfirmasi.",
    proposedTables: ["employees", "employee_assignments", "assessments", "attendance_days"],
    discussionPrompt: "Ringkasan apa yang dibutuhkan tiap role, dari periode mana, dan apakah cukup metadata tanpa membuka nilai atau data pribadi?",
  },
  profile: {
    legacyTables: [employeeMaster],
    sourceCoverage: "Sumber legacy utama teridentifikasi; daftar field final tetap perlu review HR.",
    proposedTables: ["employees", "employee_profiles"],
    discussionPrompt: "Field mana yang menjadi biodata resmi, siapa boleh melihat atau mengubahnya, dan bukti apa yang diperlukan?",
  },
  jobHistory: {
    legacyTables: [
      { name: "tb_jabatan", note: "Kandidat riwayat jabatan/penempatan dan dasar keputusan." },
      { name: "tb_mutasi", note: "Kandidat perubahan penempatan; cocokkan dengan tanggal dan kantor tujuan." },
      { name: "tb_pangkat", note: "Riwayat pangkat perlu dibedakan dari posisi." },
      { name: "tb_angkat", note: "Arti status dan relasi ke pangkat/jabatan perlu dikonfirmasi." },
      { name: "tb_penugasan", note: "Kandidat penugasan; arti kolom perlu dikonfirmasi pemilik proses." },
    ],
    sourceCoverage: "Beberapa tabel kandidat teridentifikasi, tetapi makna dan relasinya belum disahkan.",
    proposedTables: ["positions", "position_catalog", "employee_assignments", "career_events"],
    discussionPrompt: "Riwayat mana yang dianggap jabatan, pangkat, mutasi, atau penugasan? Apa tanggal efektif dan dokumen sumbernya?",
  },
  education: {
    legacyTables: [{ name: "tb_pendidikan", note: "Kandidat riwayat pendidikan; verifikasi format jenjang, tahun, sekolah, dan ijazah." }],
    sourceCoverage: "Kandidat tabel tersedia pada inventaris DDL; isi dan aturan verifikasi belum ditinjau.",
    proposedTables: ["education_records", "documents"],
    discussionPrompt: "Jenjang, bidang, institusi, tahun, dan bukti apa yang wajib? Siapa yang memverifikasi?",
  },
  training: {
    legacyTables: [
      { name: "tb_diklat", note: "Kandidat master kegiatan atau riwayat peserta; perlu dipisahkan setelah isi diperiksa." },
      { name: "tb_lat_jabatan", note: "Kandidat pelatihan jabatan; arti field dan keterkaitan peserta perlu dikonfirmasi." },
      { name: "tb_seminar", note: "Penggabungan dengan pelatihan belum diputuskan HR." },
    ],
    sourceCoverage: "Sumber pelatihan memiliki beberapa kandidat; belum jelas mana master kegiatan dan keikutsertaan pegawai.",
    proposedTables: ["training_courses", "employee_trainings", "documents"],
    discussionPrompt: "Bagaimana membedakan master program dan keikutsertaan, serta data hasil, durasi, penyelenggara, dan bukti yang dicatat?",
  },
  certification: {
    legacyTables: [{ name: "tb_sertifikasi", note: "Kandidat data sertifikasi; validasi nomor, penerbit, masa berlaku, dan lokasi bukti." }],
    sourceCoverage: "Kandidat tabel teridentifikasi; klasifikasi sertifikasi dan validasi dokumen perlu disepakati.",
    proposedTables: ["certification_catalog", "employee_certifications", "documents"],
    discussionPrompt: "Sertifikasi apa yang dicatat, apakah ada masa berlaku, dan siapa yang memeriksa penerbit serta bukti?",
  },
  family: {
    legacyTables: [
      { name: "tb_anak", note: "Kandidat data anggota keluarga dengan relasi anak." },
      { name: "tb_ortu", note: "Kandidat data orang tua; field identitas perlu tinjauan privasi." },
      { name: "tb_suamiistri", note: "Kandidat data pasangan; akses dan retensi perlu dibatasi." },
      { name: "tb_master_pekerjaan", note: "Kandidat referensi pekerjaan; pastikan tabel ini masih digunakan." },
    ],
    sourceCoverage: "Sumber keluarga teridentifikasi sebagai beberapa tabel terpisah; tujuan penggunaan dan akses belum disahkan.",
    proposedTables: ["family_members", "occupation_catalog", "documents"],
    discussionPrompt: "Relasi dan field keluarga mana yang benar-benar dibutuhkan? Siapa boleh melihat, memperbarui, dan mengunduh buktinya?",
  },
  cv: {
    legacyTables: [
      employeeMaster,
      { name: "tb_jabatan", note: "Kandidat riwayat jabatan." },
      { name: "tb_pendidikan", note: "Kandidat riwayat pendidikan." },
      { name: "tb_diklat", note: "Kandidat riwayat pelatihan." },
      { name: "tb_sertifikasi", note: "Kandidat sertifikasi." },
      { name: "tb_bahasa", note: "Kandidat kemampuan bahasa." },
      { name: "tb_penghargaan", note: "Cakupan penghargaan perlu disetujui HR." },
    ],
    sourceCoverage: "CV merupakan gabungan beberapa domain, bukan satu tabel. Field yang boleh diekspor belum disetujui.",
    proposedTables: ["employees", "employee_profiles", "employee_assignments", "career_events", "education_records", "employee_trainings", "employee_certifications", "language_skills", "employee_awards", "documents"],
    discussionPrompt: "Bagian apa yang boleh masuk CV, apa yang dikecualikan, format ekspor apa yang diperlukan, dan apakah ekspor perlu dicatat?",
  },
  profileChange: {
    legacyTables: [
      { name: "tb_edit_pending", note: "Kandidat antrean perubahan; periksa payload, status, dan riwayat sebelum dipetakan." },
      { name: "tb_notifikasi", note: "Tabel notifikasi tercantum di inventaris; hubungan ke pengajuan harus dicocokkan dengan kode." },
      employeeMaster,
    ],
    sourceCoverage: "Kandidat perubahan pending teridentifikasi; bentuk approval dan histori belum dikonfirmasi.",
    proposedTables: ["profile_change_requests", "approval_cases", "approval_steps", "audit_events"],
    discussionPrompt: "Field apa yang boleh diajukan sendiri, bukti dan approver siapa yang dibutuhkan, serta bagaimana penolakan atau revisi dicatat?",
  },
  attendanceCorrection: {
    legacyTables: [{ name: "tb_cuti", note: "Tabel cuti/izin, bukan sumber event absensi atau koreksi kehadiran." }],
    sourceCoverage: attendanceSourceUnknown,
    proposedTables: ["attendance_days", "attendance_corrections", "approval_cases", "approval_steps", "documents"],
    discussionPrompt: "Sistem mana yang menjadi sumber hadir/pulang, batas koreksi, bukti wajib, approver, dan aturan penguncian periode?",
  },
  requestStatus: {
    legacyTables: [
      { name: "tb_edit_pending", note: "Kandidat permohonan perubahan data." },
      { name: "tb_cuti", note: "Kandidat catatan cuti/izin; status persetujuannya perlu diperiksa." },
      { name: "tb_notifikasi", note: "Tabel notifikasi tercantum di inventaris; kategori dan status bacanya perlu divalidasi." },
    ],
    sourceCoverage: "Status lintas jenis pengajuan mungkin berasal dari proses berbeda; relasi dan status belum dipastikan.",
    proposedTables: ["approval_cases", "approval_steps", "profile_change_requests", "leave_requests", "attendance_corrections"],
    discussionPrompt: "Jenis pengajuan dan status apa yang perlu dilihat pegawai? Kapan sebuah permohonan dianggap final?",
  },
  kpi: {
    legacyTables: [oldKpi],
    sourceCoverage: "`tb_dp3` dicatat sebagai arsip KPI lama saja. KPI baru dan realisasi Monbis memerlukan pemetaan serta kontrak terpisah.",
    proposedTables: ["kpi_periods", "kpi_cycles", "kpi_indicators", "kpi_targets", "assessments", "assessment_scores", "score_reviews"],
    discussionPrompt: "Indikator, target, periode, sumber angka, status final, dan siapa yang boleh melihat hasilnya apa saja?",
  },
  selfAssessment: {
    legacyTables: [oldKpi],
    sourceCoverage: "Arsip `tb_dp3` tidak membuktikan alur self-assessment baru. Form dan bukti perlu dirancang bersama pemilik KPI.",
    proposedTables: ["kpi_cycles", "kpi_indicators", "assessments", "assessment_scores", "documents"],
    discussionPrompt: "Apa yang diisi pegawai, bagaimana skala dan bukti dinilai, serta kapan isian dapat dikirim ulang?",
  },
  kpiReport: {
    legacyTables: [oldKpi],
    sourceCoverage: "Sumber laporan KPI baru belum dipetakan dari record legacy; `tb_dp3` hanya arsip untuk ditinjau.",
    proposedTables: ["kpi_cycles", "assessments", "assessment_scores", "score_reviews", "kpi_adjustments"],
    discussionPrompt: "Kolom laporan, cut-off, status final, filter, serta batas unduh per role dan kantor apa yang diperlukan?",
  },
  attendance: {
    legacyTables: [],
    sourceCoverage: attendanceSourceUnknown,
    proposedTables: ["work_calendars", "calendar_days", "work_schedules", "schedule_assignments", "attendance_events", "attendance_days", "attendance_import_runs"],
    discussionPrompt: "Kanal absensi aktif apa, kapan event dianggap sah, dan bagaimana jadwal, kantor, dinas luar, serta gangguan sumber diperlakukan?",
  },
  attendanceHistory: {
    legacyTables: [],
    sourceCoverage: attendanceSourceUnknown,
    proposedTables: ["attendance_events", "attendance_days", "attendance_corrections", "leave_requests", "attendance_period_locks"],
    discussionPrompt: "Rentang histori yang dibutuhkan, alasan koreksi, dan siapa yang dapat melihat detail per hari apa?",
  },
  employeeDirectory: {
    legacyTables: [
      employeeMaster,
      { name: "tb_recycle_bin_pegawai", note: "Kandidat cadangan data pegawai terhapus; alur pemulihan harus diverifikasi sebelum dipetakan." },
      { name: "tb_recycle_bin", note: "Penyimpanan penghapusan lintas modul teramati pada beberapa proses; bukan daftar pegawai aktif." },
    ],
    sourceCoverage: "Sumber daftar pegawai teridentifikasi. Filter dan batas data per kantor belum diputuskan.",
    proposedTables: ["employees", "employee_profiles", "employee_assignments", "offices", "organizational_units"],
    discussionPrompt: "Kolom apa yang tampil di daftar, filter yang dipakai, dan bagaimana scope kantor SDM dibatasi?",
  },
  employeeCreate: {
    legacyTables: [employeeMaster, { name: "tb_kantor", note: "Kandidat master kantor untuk penempatan awal; kode dan status perlu validasi." }],
    sourceCoverage: "Form entri baru adalah alur target; cara penerbitan ID dan sumber pegawai baru perlu dikonfirmasi.",
    proposedTables: ["employees", "employee_profiles", "offices", "organizational_units", "positions", "employee_assignments"],
    discussionPrompt: "Data minimum saat pegawai dibuat, asal nomor pegawai, validasi duplikasi, dan tahap aktivasi akun apa?",
  },
  employeeHistory: {
    legacyTables: [
      { name: "tb_jabatan", note: "Kandidat riwayat jabatan/penempatan." },
      { name: "tb_mutasi", note: "Kandidat riwayat perpindahan kantor/unit." },
      { name: "tb_pangkat", note: "Kandidat riwayat pangkat." },
      { name: "tb_angkat", note: "Kandidat peristiwa pengangkatan; validasi arti status." },
      { name: "tb_penugasan", note: "Kandidat riwayat penugasan; arti kolom perlu dikonfirmasi." },
      { name: "tb_cuti", note: "Riwayat cuti lama, bukan catatan kehadiran harian." },
      { name: "tb_penghargaan", note: "Kandidat riwayat penghargaan; pastikan masih termasuk kebutuhan." },
      { name: "tb_hukuman", note: "Kandidat riwayat hukuman disiplin, data sensitif dengan akses khusus." },
      { name: "tb_mastergol", note: "Kandidat referensi golongan; relasi dengan riwayat pangkat perlu divalidasi." },
      { name: "tb_masteresl", note: "Kandidat referensi tingkat jabatan; keberlakuan perlu dikonfirmasi." },
      { name: "tb_master_jabatan", note: "Kandidat master jabatan; bandingkan dengan `tb_ref_jabatan`." },
      { name: "tb_ref_jabatan", note: "Kandidat referensi jabatan; jangan digabung sebelum pemakaian diverifikasi." },
    ],
    sourceCoverage: "Kandidat riwayat dan master ada; keputusan pemisahan pangkat, posisi, dan event masih terbuka.",
    proposedTables: ["position_catalog", "positions", "employee_assignments", "career_events", "offices", "organizational_units"],
    discussionPrompt: "Apa master jabatan yang aktif, bagaimana urutan approval mutasi, dan bagaimana histori kantor/jabatan ditutup atau dikoreksi?",
  },
  employeeChanges: {
    legacyTables: [{ name: "tb_edit_pending", note: "Kandidat antrean perubahan yang perlu dicocokkan dengan kode lama." }, employeeMaster],
    sourceCoverage: "Kandidat perubahan ada di inventaris DDL; kepemilikan pemeriksaan dan histori keputusan perlu divalidasi.",
    proposedTables: ["profile_change_requests", "approval_cases", "approval_steps", "audit_events"],
    discussionPrompt: "Field apa yang perlu verifikasi manual, unit mana yang menjadi approver, dan bukti apa yang tersimpan?",
  },
  employeeTraining: {
    legacyTables: [
      { name: "tb_diklat", note: "Kandidat kegiatan atau keikutsertaan diklat." },
      { name: "tb_biaya_pendidikan", note: "Kandidat daftar kegiatan dan anggaran pengembangan; cek hubungan ke peserta." },
      { name: "tb_lat_jabatan", note: "Kandidat riwayat pelatihan jabatan." },
      { name: "tb_seminar", note: "Perlu keputusan apakah masuk domain pelatihan." },
      { name: "tb_ref_pengembangan", note: "Kandidat referensi kategori pengembangan." },
      { name: "tb_ref_pelaksana", note: "Kandidat referensi jenis/pelaksana kegiatan." },
    ],
    sourceCoverage: "Kandidat beberapa tabel; hubungan peserta, program, dan bukti belum diverifikasi.",
    proposedTables: ["training_courses", "employee_trainings", "documents"],
    discussionPrompt: "Field program dan peserta apa yang wajib, siapa mengesahkan, dan data mana yang berasal dari impor?",
  },
  employeeCertifications: {
    legacyTables: [{ name: "tb_sertifikasi", note: "Kandidat sertifikasi; periksa file dan masa berlaku." }],
    sourceCoverage: "Kandidat tabel ada; data dan alur verifikasi perlu review HR.",
    proposedTables: ["certification_catalog", "employee_certifications", "documents"],
    discussionPrompt: "Siapa yang mengesahkan sertifikasi, apakah tanggal kedaluwarsa wajib, dan bagaimana pembaruan bukti dilacak?",
  },
  employeeFamily: {
    legacyTables: [
      { name: "tb_anak", note: "Kandidat data anak." },
      { name: "tb_ortu", note: "Kandidat data orang tua." },
      { name: "tb_suamiistri", note: "Kandidat data pasangan." },
    ],
    sourceCoverage: "Tabel keluarga legacy terpisah; field dan tujuan penggunaan wajib dibatasi bersama HR.",
    proposedTables: ["family_members", "occupation_catalog", "documents"],
    discussionPrompt: "Data keluarga apa yang relevan untuk proses SDM, siapa yang diberi akses, dan bagaimana masking serta retensinya?",
  },
  employeeDocuments: {
    legacyTables: [
      { name: "tb_pegawai.foto", kind: "column", note: "Kolom foto teramati pada biodata; file tidak boleh disimpan di Git atau dibuat publik." },
      { name: "tb_pendidikan", note: "Kandidat metadata ijazah/bukti pendidikan; perlu cek lokasi file." },
      { name: "tb_sertifikasi", note: "Kandidat metadata bukti sertifikasi; cek penyimpanan legacy." },
    ],
    sourceCoverage: "Beberapa kolom/tabel mungkin menunjuk file. Isi file dan lokasi penyimpanan belum diperiksa.",
    proposedTables: ["documents", "employee_documents", "employee_trainings", "employee_certifications"],
    discussionPrompt: "Jenis file, ukuran, akses, verifikasi, retensi, dan riwayat unduh apa yang harus diterapkan?",
  },
  hrReports: {
    legacyTables: [
      employeeMaster,
      { name: "tb_kantor", note: "Kandidat sumber kantor." },
      { name: "tb_jabatan", note: "Kandidat sumber penempatan." },
      { name: "tb_diklat", note: "Kandidat sumber pelatihan." },
      { name: "tb_biaya_pendidikan", note: "Kandidat sumber rekap biaya kegiatan diklat." },
      { name: "tb_formasi", note: "Kandidat sumber formasi; kolom dan pemakaian perlu dikonfirmasi." },
      { name: "tb_sertifikasi", note: "Kandidat sumber sertifikasi." },
    ],
    sourceCoverage: "Laporan adalah agregat beberapa domain. KPI dan absensi tidak dianggap punya sumber legacy terkonfirmasi dari daftar ini.",
    proposedTables: ["employees", "offices", "employee_assignments", "employee_trainings", "employee_certifications", "assessments", "attendance_days"],
    discussionPrompt: "Laporan mana yang benar-benar diperlukan tiap divisi, definisi setiap kolom, scope kantor, dan aturan export apa?",
  },
  hrOfficeReport: {
    legacyTables: [employeeMaster, { name: "tb_kantor", note: "Kandidat master kantor; jenis dan hierarki perlu disahkan." }, { name: "tb_jabatan", note: "Kandidat relasi pegawai ke jabatan/kantor." }, { name: "tb_mastergol", note: "Kandidat referensi golongan untuk laporan; relasi perlu diperiksa." }, { name: "tb_masteresl", note: "Kandidat referensi tingkat jabatan untuk laporan; pemakaian perlu diperiksa." }],
    sourceCoverage: "Kandidat kantor dan penempatan tersedia; relasi pusat, korwil, cabang, dan kankas perlu dikonfirmasi.",
    proposedTables: ["offices", "office_relationships", "organizational_units", "positions", "employee_assignments"],
    discussionPrompt: "Apa struktur resmi kantor, hubungan administratif vs koordinasi, dan periode berlakunya perubahan?",
  },
  hrTrainingReport: {
    legacyTables: [
      { name: "tb_diklat", note: "Kandidat kegiatan/riwayat diklat." },
      { name: "tb_biaya_pendidikan", note: "Kandidat daftar kegiatan, target peserta, dan anggaran." },
      { name: "tb_lat_jabatan", note: "Kandidat pelatihan terkait jabatan." },
      { name: "tb_seminar", note: "Kategori dan cakupan perlu keputusan HR." },
      { name: "tb_ref_pengembangan", note: "Kandidat referensi kategori pengembangan." },
      { name: "tb_ref_pelaksana", note: "Kandidat referensi jenis/pelaksana kegiatan." },
      { name: "tb_sertifikasi", note: "Kandidat sertifikasi dan masa berlaku." },
    ],
    sourceCoverage: "Beberapa kandidat tersedia; agregasi peserta, kategori, dan status verifikasi belum disepakati.",
    proposedTables: ["training_courses", "employee_trainings", "certification_catalog", "employee_certifications"],
    discussionPrompt: "Laporan wajib per program/kantor/periode apa, bagaimana definisi kelengkapan, dan apa yang boleh diekspor?",
  },
  hrKpiReport: {
    legacyTables: [oldKpi],
    sourceCoverage: "`tb_dp3` adalah arsip untuk ditinjau, bukan mapping otomatis KPI baru. Kontrak Monbis belum tersedia.",
    proposedTables: ["kpi_cycles", "assessments", "assessment_scores", "score_reviews", "monbis_import_runs"],
    discussionPrompt: "Apakah laporan untuk kelengkapan proses, hasil final, atau keduanya? Siapa boleh melihat skor lintas kantor?",
  },
  hrAttendanceReport: {
    legacyTables: [],
    sourceCoverage: attendanceSourceUnknown,
    proposedTables: ["attendance_days", "attendance_events", "attendance_corrections", "leave_requests", "attendance_period_locks"],
    discussionPrompt: "Definisi hadir, terlambat, izin, dan data tidak lengkap apa; serta kapan periode dikunci dan boleh dibuka kembali?",
  },
  monbis: {
    legacyTables: [],
    sourceCoverage: "Tabel Monbis pada dump SIMPEG belum teridentifikasi. Minta kontrak API/export, kode, periode, dan contoh data sintetis dari pemilik Monbis.",
    proposedTables: ["monbis_import_runs", "monbis_source_rows", "monbis_employee_mappings", "monbis_indicator_mappings", "monbis_reconciliations"],
    discussionPrompt: "Apa endpoint/format resmi, kunci pegawai dan indikator, cut-off, cara retry, serta pemilik rekonsiliasi?",
  },
  kpiMonitoring: {
    legacyTables: [oldKpi],
    sourceCoverage: "`tb_dp3` hanya rujukan arsip; status integrasi dan proses KPI baru harus ditetapkan dari kebutuhan pemilik KPI.",
    proposedTables: ["kpi_cycles", "assessments", "evaluator_assignments", "monbis_import_runs", "monbis_reconciliations", "kpi_adjustments"],
    discussionPrompt: "Pengecualian apa yang dipantau, siapa boleh memperbaiki mapping, dan perubahan mana yang memerlukan approval?",
  },
  reviewFirst: {
    legacyTables: [{ ...oldKpi, note: "Arsip KPI lama saja; inventaris belum mengonfirmasi tabel workflow penilai tahap pertama." }],
    sourceCoverage: "Tabel penugasan dan keputusan reviewer belum teridentifikasi di inventaris legacy.",
    proposedTables: ["evaluator_assignments", "assessments", "assessment_scores", "score_reviews", "approval_steps"],
    discussionPrompt: "Siapa penilai pertama untuk tiap kategori, data apa yang boleh dilihat, tenggat, dan alasan keputusan yang wajib dicatat?",
  },
  reviewSecond: {
    legacyTables: [{ ...oldKpi, note: "Arsip KPI lama saja; inventaris belum mengonfirmasi tabel workflow reviewer tahap kedua." }],
    sourceCoverage: "Reviewer tahap kedua perlu mengikuti assignment efektif dan jalur khusus Kacab/Kadiv.",
    proposedTables: ["evaluator_assignments", "assessment_scores", "score_reviews", "approval_steps", "audit_events"],
    discussionPrompt: "Kapan Kacab atau Kadiv menjadi penilai tahap kedua, bagaimana konflik kepentingan dihindari, dan kapan hasil dikunci?",
  },
  reviewDirector: {
    legacyTables: [{ ...oldKpi, note: "Arsip KPI lama saja; tabel workflow penilaian Direksi belum teridentifikasi." }],
    sourceCoverage: "Jalur penilaian Direksi untuk Kacab, Korwil, dan Kadiv adalah arahan kebutuhan; tabel lama belum mengonfirmasinya.",
    proposedTables: ["evaluator_assignments", "assessments", "assessment_scores", "score_reviews", "audit_events"],
    discussionPrompt: "Apa jalur Direksi untuk tiap jabatan, delegasi yang diperbolehkan, dan batas akses terhadap hasil?",
  },
  reviewHistory: {
    legacyTables: [{ ...oldKpi, note: "Arsip KPI lama; bentuk histori penilai dan keputusan baru belum teridentifikasi." }],
    sourceCoverage: "Riwayat penilaian baru memerlukan versioning; jangan menyimpulkan histori lengkap dari `tb_dp3` saja.",
    proposedTables: ["assessments", "assessment_scores", "score_reviews", "evaluator_assignments", "audit_events"],
    discussionPrompt: "Apa yang dapat dilihat setelah final, berapa lama riwayat dipertahankan, dan bagaimana koreksi/reopen ditampilkan?",
  },
  access: {
    legacyTables: [
      { name: "tb_user", note: "Kandidat akun lama; password tidak dipindahkan dan `hak_akses` perlu review." },
      { name: "tb_apk", note: "Flag akses beberapa aplikasi; kolom password/OTP tidak dimigrasikan." },
      { name: "tb_config", note: "Kandidat konfigurasi aplikasi; setiap nilai perlu klasifikasi dan tidak disalin tanpa review." },
      { name: "tb_log_aktivitas", note: "Tabel log tercantum di inventaris DDL; halaman pembaca log lama belum teridentifikasi." },
      { name: "tb_recycle_bin", note: "Kandidat penyimpanan data terhapus lintas modul; alur restore/purge terpusat belum dikonfirmasi." },
      employeeMaster,
    ],
    sourceCoverage: "`tb_apk` terkait entitlement aplikasi; DDL tidak membuktikan provisioning otomatis atau pemilik entitlement.",
    proposedTables: ["simpeg_users", "roles", "permissions", "role_permissions", "simpeg_user_roles", "simpeg_user_office_scopes", "applications", "employee_application_access"],
    discussionPrompt: "Siapa menetapkan role dan scope, siapa pemilik entitlement per aplikasi, serta bagaimana pegawai nonaktif diblokir saat login?",
  },
};
