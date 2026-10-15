import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { TableWorkshopPanel } from "./components/TableWorkshopPanel";
import {
  moduleDetails,
  navigationForRole,
  roles,
  screenLabels,
  screensForRole,
  selectedRole,
  type DataPreview,
  type NavigationGroup,
  type NavigationItem,
  type RoleId,
  type ScreenId,
  type ReviewStatus,
} from "./lib/navigation";

const reviewSubjects: Record<RoleId, { id: string; name: string; role: string }[]> = {
  employee: [],
  hr: [],
  kabid: [{ id: "staff-demo-01", name: "Pegawai Demo 001", role: "Pegawai, contoh" }],
  secondReviewer: [{ id: "staff-demo-02", name: "Pegawai Demo 002", role: "Pegawai, contoh" }],
  korwil: [],
  director: [
    { id: "leader-demo-01", name: "Kacab Demo 001", role: "Kepala cabang, contoh" },
    { id: "leader-demo-02", name: "Korwil Demo 001", role: "Kepala korwil, contoh" },
    { id: "leader-demo-03", name: "Kadiv Demo 001", role: "Kepala divisi, contoh" },
  ],
  it: [
    { id: "staff-demo-01", name: "Pegawai Demo 001", role: "Pegawai, contoh" },
    { id: "leader-demo-01", name: "Kacab Demo 001", role: "Kepala cabang, contoh" },
  ],
};

function App() {
  const [role, setRole] = useState<RoleId>("employee");
  const [screen, setScreen] = useState<ScreenId>("home");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ "my-data": true, "my-kpi": true });
  const [dataPreview, setDataPreview] = useState<DataPreview>("normal");
  const [reviewStatuses, setReviewStatuses] = useState<Record<string, ReviewStatus>>({});
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [reviewNotice, setReviewNotice] = useState("");
  const allowedScreens = useMemo(() => screensForRole(role), [role]);
  const visibleNav = useMemo(() => navigationForRole(role), [role]);
  const visibleRole = selectedRole(role);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileMenuOpen]);

  function navigate(next: ScreenId) {
    if (!allowedScreens.includes(next)) return;
    setScreen(next);
    const parentGroup = visibleNav.find((item): item is NavigationGroup => item.kind === "group" && item.children.some((child) => child.id === next));
    if (parentGroup) setOpenGroups((current) => ({ ...current, [parentGroup.id]: true }));
    setMobileMenuOpen(false);
  }

  function changeRole(next: RoleId) {
    setRole(next);
    setScreen("home");
    setSelectedReview(null);
    setReviewNotice("");
    setOpenGroups({ "my-data": true, "my-kpi": true });
    setMobileMenuOpen(false);
  }

  function renderScreen() {
    const formScreens: ScreenId[] = ["profileChange", "attendanceCorrection", "selfAssessment", "attendance", "reviewFirst", "reviewSecond", "reviewDirector"];
    if (dataPreview !== "normal" && !formScreens.includes(screen)) {
      return <DataStatePreview mode={dataPreview} onReset={() => setDataPreview("normal")} />;
    }

    switch (screen) {
      case "profile":
        return <ProfilePage onNavigate={navigate} />;
      case "kpi":
        return <KpiPage role={role} mode="overview" onNavigate={navigate} />;
      case "selfAssessment":
        return <KpiPage role={role} mode="assessment" onNavigate={navigate} />;
      case "kpiReport":
        return <KpiPage role={role} mode="report" onNavigate={navigate} />;
      case "profileChange":
        return <RequestsPage key={screen} initialKind="profile" />;
      case "attendanceCorrection":
        return <RequestsPage key={screen} initialKind="attendance" />;
      case "attendance":
        return <AttendancePage />;
      case "hrReports":
        return <HrReportsPage />;
      case "reviewFirst":
      case "reviewSecond":
      case "reviewDirector": {
        const reviewerRole: RoleId = screen === "reviewFirst" ? "kabid" : screen === "reviewSecond" ? "secondReviewer" : "director";
        return (
          <ReviewPage
            role={reviewerRole}
            statuses={reviewStatuses}
            selectedId={selectedReview}
            notice={reviewNotice}
            onSelect={(id) => {
              setSelectedReview(id);
              setReviewNotice("");
            }}
            onDecide={(id, status) => {
              setReviewStatuses((current) => ({ ...current, [id]: status }));
              setReviewNotice(`Hasil tersimpan dalam simulasi: ${status.toLowerCase()}. Tidak ada data yang dikirim ke server.`);
            }}
          />
        );
      }
      case "access":
        return <AccessPage onNavigate={navigate} />;
      default:
        if (screen === "home") return <DashboardPage role={role} onNavigate={navigate} />;
        return <ModuleOverviewPage screen={screen} />;
    }
  }

  return (
    <div className="app-frame" data-theme={theme}>
      <a className="skip-link" href="#beranda">Lewati navigasi ke konten</a>
      <header className="topbar">
        <a className="wordmark" href="#beranda" onClick={(event) => { event.preventDefault(); navigate("home"); }} aria-label="SIMPEG, ke beranda">
          <span className="wordmark-name">SIMPEG</span>
          <span className="wordmark-version">v2</span>
        </a>

        <Button
          className="mobile-menu-trigger"
          variant="outline"
          aria-expanded={mobileMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? "Tutup menu" : "Menu"}
        </Button>

        <div className="topbar-controls">
          <label className="control-field role-control">
            <span>Simulasi peran</span>
            <select value={role} onChange={(event) => changeRole(event.target.value as RoleId)}>
              {roles.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <label className="control-field preview-control">
            <span>Tampilan data</span>
            <select value={dataPreview} onChange={(event) => setDataPreview(event.target.value as DataPreview)}>
              <option value="normal">Data contoh</option>
              <option value="loading">Memuat</option>
              <option value="empty">Kosong</option>
              <option value="error">Gangguan</option>
            </select>
          </label>
          <Button
            variant="outline"
            className="theme-button"
            aria-pressed={theme === "dark"}
            onClick={() => setTheme((current) => current === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "Mode gelap" : "Mode terang"}
          </Button>
        </div>
      </header>

      <div className="draft-notice" role="note">
        <strong>Rancangan FE</strong>
        <span>Data sintetis untuk review alur. Belum terhubung ke API atau database.</span>
      </div>

      <div className="workspace">
        <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
          <div className="sidebar-context">
            <span className="sidebar-caption">Ruang kerja</span>
            <strong>{visibleRole.label}</strong>
          </div>
          <nav id="primary-navigation" className="primary-navigation" aria-label="Navigasi utama">
            {visibleNav.map((item) => item.kind === "link" ? (
              <button
                className={`nav-item ${screen === item.id ? "nav-item-active" : ""}`}
                key={item.id}
                type="button"
                aria-current={screen === item.id ? "page" : undefined}
                onClick={() => navigate(item.id)}
              >
                <span>{item.label ?? screenLabels[item.id]}</span>
              </button>
            ) : (
              <section className="nav-group" key={item.id}>
                <button
                  className={`nav-group-trigger ${item.children.some((child) => child.id === screen) ? "nav-group-active" : ""}`}
                  type="button"
                  aria-expanded={Boolean(openGroups[item.id])}
                  aria-controls={openGroups[item.id] ? `nav-group-${item.id}` : undefined}
                  onClick={() => setOpenGroups((current) => ({ ...current, [item.id]: !current[item.id] }))}
                >
                  <span>{item.label}</span>
                  <span className={`nav-caret ${openGroups[item.id] ? "nav-caret-open" : ""}`} aria-hidden="true" />
                </button>
                {openGroups[item.id] && (
                  <div className="nav-subitems" id={`nav-group-${item.id}`}>
                    {item.children.map((child) => (
                      <button
                        className={`nav-subitem ${screen === child.id ? "nav-subitem-active" : ""}`}
                        key={child.id}
                        type="button"
                        aria-current={screen === child.id ? "page" : undefined}
                        onClick={() => navigate(child.id)}
                      >
                        {child.label ?? screenLabels[child.id]}
                      </button>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </nav>
          <div className="sidebar-footnote">
            <span className="draft-mark" aria-hidden="true">S</span>
            <p>SIMPEG v2<br />Prototype alur FE</p>
          </div>
        </aside>

        <main className="main-content" id="beranda">
          <div className="mobile-context">
            <span>{visibleRole.label}</span>
            <span>{screenLabels[screen]}</span>
          </div>
          <div className="page-heading-row">
            <div>
              <p className="eyebrow">{screenLabels[screen]}</p>
              <h1>{screen === "home" ? "Ruang kerja SIMPEG" : screenLabels[screen]}</h1>
            </div>
            <Badge tone="info">Simulasi saja</Badge>
          </div>
          <p className="role-description">{visibleRole.description}</p>
          {renderScreen()}
          <TableWorkshopPanel key={screen} screen={screen} />
          <footer className="page-footer">
            Data demo tidak disimpan. Catatan diskusi tersimpan lokal di browser ini atau dapat diunduh sebagai Markdown.
          </footer>
        </main>
      </div>
    </div>
  );
}

function DashboardPage({ role, onNavigate }: { role: RoleId; onNavigate: (screen: ScreenId) => void }) {
  const dashboardCopy: Record<RoleId, { heading: string; body: string; action: string; target: ScreenId }> = {
    employee: {
      heading: "Mulai dari kebutuhan hari ini",
      body: "Coba alur profil, pengajuan, KPI, dan absensi menggunakan data demo.",
      action: "Buka KPI saya",
      target: "kpi",
    },
    hr: {
      heading: "Pantau laporan SDM lintas kantor",
      body: "Pilih cakupan laporan contoh, lalu buka profil dan alur pegawai seperti persona pegawai.",
      action: "Buka laporan SDM",
      target: "hrReports",
    },
    kabid: {
      heading: "Tinjau penilaian tahap pertama",
      body: "Kabid dicontohkan sebagai penilai pertama. Jalur final tetap mengikuti hierarki yang disetujui.",
      action: "Buka antrean penilaian",
      target: "reviewFirst",
    },
    secondReviewer: {
      heading: "Lanjutkan penilaian tahap kedua",
      body: "Kacab atau Kadiv dicontohkan sebagai penilai kedua untuk alur yang memerlukannya.",
      action: "Buka antrean penilaian",
      target: "reviewSecond",
    },
    korwil: {
      heading: "Lihat KPI dan proses pribadi",
      body: "Dalam alur demo ini, KPI Korwil masuk penilaian Direksi. Peran penilaian bawahan belum ditentukan.",
      action: "Buka KPI saya",
      target: "kpi",
    },
    director: {
      heading: "Tinjau KPI pimpinan",
      body: "Contoh antrean memuat Kacab, Korwil, dan Kadiv untuk ditinjau Direksi.",
      action: "Buka antrean Direksi",
      target: "reviewDirector",
    },
    it: {
      heading: "Semua menu dibuka untuk review prototype",
      body: "Akses luas ini hanya untuk demo. Role dan izin produksi belum diatur dari layar ini.",
      action: "Lihat menu demo",
      target: "access",
    },
  };
  const content = dashboardCopy[role];

  return (
    <div className="page-stack">
      <section className="welcome-panel">
        <div className="welcome-copy">
          <p className="section-kicker">Alur utama</p>
          <h2>{content.heading}</h2>
          <p>{content.body}</p>
          <Button onClick={() => onNavigate(content.target)}>{content.action}</Button>
        </div>
        <div className="welcome-aside">
          <span className="aside-label">Status prototype</span>
          <strong>Data demo lokal</strong>
          <p>Aksi hanya mengubah tampilan selama sesi ini.</p>
        </div>
      </section>

      <section className="content-section" aria-labelledby="explore-title">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Coba alur</p>
            <h2 id="explore-title">Bagian yang bisa ditinjau</h2>
          </div>
          <p>Menu menyesuaikan persona demo yang dipilih.</p>
        </div>
        <div className="flow-list">
          <FlowRow title="Biodata dan riwayat" detail="Tinjau profil, riwayat jabatan, pelatihan, dan dokumen." onClick={() => onNavigate("profile")} action="Buka biodata" />
          <FlowRow title="KPI dan self-assessment" detail="Lihat ringkasan, isi capaian, lalu buka laporan pribadi." onClick={() => onNavigate("selfAssessment")} action="Isi self-assessment" />
          <FlowRow title="Pengajuan dan kehadiran" detail="Ajukan perubahan profil atau koreksi absensi, lalu pantau statusnya." onClick={() => onNavigate("profileChange")} action="Buat pengajuan" />
        </div>
      </section>
    </div>
  );
}

function FlowRow({ title, detail, action, onClick }: { title: string; detail: string; action: string; onClick: () => void }) {
  return (
    <div className="flow-row">
      <div>
        <h3>{title}</h3>
        <p>{detail}</p>
      </div>
      <Button variant="outline" onClick={onClick}>{action}</Button>
    </div>
  );
}

function ProfilePage({ onNavigate }: { onNavigate: (screen: ScreenId) => void }) {
  return (
    <div className="page-stack">
      <Card>
        <CardHeader>
          <CardTitle>Informasi profil</CardTitle>
          <CardDescription>Contoh struktur biodata. Nilai di bawah bukan data pegawai sebenarnya.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="profile-grid">
            <ProfileField label="Nama" value="Pegawai Demo 001" />
            <ProfileField label="Nomor pegawai" value="ID-DEMO-001" />
            <ProfileField label="Kantor" value="Kantor Contoh" />
            <ProfileField label="Jabatan" value="Jabatan Contoh" />
            <ProfileField label="Status" value="Data sintetis" />
            <ProfileField label="Atasan" value="Belum dipetakan" />
          </dl>
          <div className="card-actions">
            <Button onClick={() => onNavigate("profileChange")}>Ajukan perubahan data</Button>
          </div>
        </CardContent>
      </Card>
      <div className="notice-panel">
        <strong>Belum ada riwayat pada data demo.</strong>
        <p>Buka submenu Data Saya untuk meninjau rancangan riwayat jabatan, pendidikan, pelatihan, sertifikasi, keluarga, dan CV.</p>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return <div className="profile-field"><dt>{label}</dt><dd>{value}</dd></div>;
}

function KpiPage({ role, mode, onNavigate }: { role: RoleId; mode: "overview" | "assessment" | "report"; onNavigate: (screen: ScreenId) => void }) {
  const [saved, setSaved] = useState(false);
  const [realization, setRealization] = useState("");
  const [reflection, setReflection] = useState("");
  const evaluator = role === "korwil" || role === "secondReviewer"
    ? "Direksi untuk KPI pimpinan, sesuai arahan pengguna"
    : "Atasan sesuai hierarki efektif, pemetaan rinci masih perlu dikonfirmasi";

  function submitAssessment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  const note = <div className="notice-panel"><strong>Data KPI resmi belum tersedia.</strong><p>Indikator, target, bobot, periode, dan data Monbis belum tersambung. Isi di layar ini hanya simulasi.</p></div>;

  if (mode === "assessment") {
    return (
      <div className="page-stack">
        {note}
        <Card>
          <CardHeader><CardTitle>Self-assessment</CardTitle><CardDescription>Catatan pegawai menjadi bahan penilai, bukan hasil final.</CardDescription></CardHeader>
          <CardContent>
            <form className="form-stack form-narrow" onSubmit={submitAssessment}>
              <div className="demo-indicator"><span className="field-label">Indikator demo</span><strong>Indikator KPI contoh</strong><span>Nama, target, dan bobot menunggu keputusan pemilik KPI.</span></div>
              <label className="form-field"><span>Realisasi atau capaian</span><Input value={realization} onChange={(event) => setRealization(event.target.value)} placeholder="Tulis capaian untuk simulasi" required /></label>
              <label className="form-field"><span>Kendala atau konteks</span><textarea value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="Jelaskan konteks yang perlu diketahui penilai" rows={4} required /></label>
              <Button type="submit">Simpan isian demo</Button>
              {saved && <p className="form-feedback" role="status">Self-assessment tersimpan sementara di halaman ini. Belum dikirim ke API.</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === "report") {
    return (
      <div className="page-stack">
        {note}
        <Card>
          <CardHeader><CardTitle>Ringkasan periode</CardTitle><CardDescription>Nilai final baru ditampilkan setelah tahapan penilaian ditetapkan dan disahkan.</CardDescription></CardHeader>
          <CardContent>
            <dl className="summary-list">
              <div><dt>Status pengisian</dt><dd>{saved ? "Self-assessment demo tersimpan" : "Belum ada pengisian demo"}</dd></div>
              <div><dt>Periode KPI</dt><dd>Belum ditetapkan</dd></div>
              <div><dt>Penilai</dt><dd>{evaluator}</dd></div>
              <div><dt>Sumber KPI pemasaran</dt><dd>Monbis, kontrak API belum tersedia</dd></div>
            </dl>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-stack">
      {note}
      <section className="content-section" aria-labelledby="kpi-next-steps">
        <div className="section-heading"><div><p className="section-kicker">KPI pribadi</p><h2 id="kpi-next-steps">Lanjutkan proses</h2></div><p>Setiap tahap memiliki menu sendiri agar status dan tanggung jawabnya mudah dibedakan.</p></div>
        <div className="flow-list">
          <FlowRow title="Self-assessment" detail="Tuliskan capaian dan konteks untuk ditinjau atasan." onClick={() => onNavigate("selfAssessment")} action="Buka pengisian" />
          <FlowRow title="Laporan KPI" detail="Tinjau status periode, sumber data, dan hasil yang sudah disahkan." onClick={() => onNavigate("kpiReport")} action="Buka laporan" />
        </div>
      </section>
    </div>
  );
}

function RequestsPage({ initialKind }: { initialKind: "profile" | "attendance" }) {
  const kind = initialKind;
  const [field, setField] = useState("");
  const [newValue, setNewValue] = useState("");
  const [reason, setReason] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="page-stack">
      <Card>
        <CardHeader>
          <CardTitle>{kind === "profile" ? "Ajukan perubahan data" : "Ajukan koreksi absensi"}</CardTitle>
          <CardDescription>Pengajuan hanya disimulasikan dan tidak tersimpan setelah halaman ditutup.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="form-stack form-narrow" onSubmit={submitRequest}>
            {kind === "profile" ? (
              <>
                <label className="form-field"><span>Data yang ingin diubah</span><Input value={field} onChange={(event) => setField(event.target.value)} placeholder="Contoh: nomor telepon" required /></label>
                <label className="form-field"><span>Nilai perubahan</span><Input value={newValue} onChange={(event) => setNewValue(event.target.value)} placeholder="Isi nilai baru untuk simulasi" required /></label>
              </>
            ) : (
              <label className="form-field"><span>Tanggal yang dikoreksi</span><Input type="date" value={requestDate} onChange={(event) => setRequestDate(event.target.value)} required /></label>
            )}
            <label className="form-field"><span>Alasan dan keterangan</span><textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Jelaskan alasan pengajuan" rows={4} required /></label>
            <Button type="submit">Kirim pengajuan demo</Button>
            {submitted && <p className="form-feedback" role="status">Pengajuan demo tercatat sementara di halaman ini. Belum masuk ke proses persetujuan.</p>}
          </form>
        </CardContent>
      </Card>
      <div className="empty-note">
        <strong>Belum ada riwayat pengajuan demo.</strong>
        <span>Pengajuan yang dikirim tidak disimpan ke database.</span>
      </div>
    </div>
  );
}

function AttendancePage() {
  const [locationChecked, setLocationChecked] = useState(false);
  const [faceChecked, setFaceChecked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="page-stack">
      <div className="notice-panel">
        <strong>Simulasi absensi. Kamera dan lokasi perangkat tidak digunakan.</strong>
        <p>Verifikasi wajah dan radius kantor 20 meter ditampilkan sebagai alur contoh, belum sebagai pemeriksaan nyata.</p>
      </div>
      <div className="split-layout">
        <Card>
          <CardHeader>
            <CardTitle>Pemeriksaan zona kantor</CardTitle>
            <CardDescription>Zona kantor contoh. Titik koordinat belum dikonfigurasi.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="check-status">
              <span className="check-symbol" aria-hidden="true">{locationChecked ? "✓" : "?"}</span>
              <div><strong>{locationChecked ? "Pemeriksaan lokasi simulasi selesai" : "Lokasi belum diperiksa"}</strong><p>Radius kebutuhan: 20 meter dari zona kantor yang dikonfigurasi.</p></div>
            </div>
            <Button variant="outline" onClick={() => { setLocationChecked(true); setSaved(false); }}>Simulasikan pemeriksaan lokasi</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pemeriksaan wajah</CardTitle>
            <CardDescription>Tidak ada foto atau data biometrik yang diambil.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="check-status">
              <span className="check-symbol" aria-hidden="true">{faceChecked ? "✓" : "?"}</span>
              <div><strong>{faceChecked ? "Pemeriksaan wajah simulasi selesai" : "Kamera tidak diaktifkan"}</strong><p>Belum ada verifikasi identitas atau liveness sungguhan.</p></div>
            </div>
            <Button variant="outline" onClick={() => { setFaceChecked(true); setSaved(false); }}>Simulasikan pemeriksaan wajah</Button>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Catat absensi demo</CardTitle>
          <CardDescription>Aktif setelah kedua pemeriksaan contoh dijalankan.</CardDescription>
        </CardHeader>
        <CardContent className="attendance-submit">
          <p className="muted-copy">Pemeriksaan lokasi: {locationChecked ? "simulasi selesai" : "belum"}. Pemeriksaan wajah: {faceChecked ? "simulasi selesai" : "belum"}.</p>
          <Button disabled={!locationChecked || !faceChecked} onClick={() => setSaved(true)}>Catat absensi simulasi</Button>
          {saved && <p className="form-feedback" role="status">Absensi contoh tercatat sementara. Tidak ada koordinat atau biometrik yang disimpan.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

const demoOffices = ["Semua kantor demo", "Kantor Pusat Contoh", "Cabang Contoh A", "Kankas Contoh B", "Korwil Contoh"];
const demoReportRows = [
  { id: "ID-DEMO-001", office: "Kantor Pusat Contoh", status: "Contoh aktif", position: "Jabatan contoh" },
  { id: "ID-DEMO-002", office: "Cabang Contoh A", status: "Contoh aktif", position: "Jabatan contoh" },
  { id: "ID-DEMO-003", office: "Kankas Contoh B", status: "Status belum dipetakan", position: "Jabatan contoh" },
  { id: "ID-DEMO-004", office: "Korwil Contoh", status: "Contoh aktif", position: "Jabatan contoh" },
];

function HrReportsPage() {
  const [office, setOffice] = useState(demoOffices[0]);
  const rows = office === demoOffices[0] ? demoReportRows : demoReportRows.filter((row) => row.office === office);

  return (
    <div className="page-stack">
      <Card>
        <CardHeader>
          <div className="report-heading">
            <div><CardTitle>Direktori SDM contoh</CardTitle><CardDescription>Baris dan status berikut data sintetis untuk uji tampilan.</CardDescription></div>
            <label className="form-field office-filter"><span>Filter kantor</span><select value={office} onChange={(event) => setOffice(event.target.value)}>{demoOffices.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <div className="empty-state"><strong>Tidak ada baris demo untuk filter ini.</strong><span>Pilih kantor lain untuk melihat contoh data.</span></div>
          ) : (
            <div className="report-list" role="list" aria-label="Daftar pegawai simulasi">
              {rows.map((row) => (
                <article className="report-row" role="listitem" key={row.id}>
                  <div><span className="row-label">Nomor contoh</span><strong>{row.id}</strong></div>
                  <div><span className="row-label">Kantor</span><span>{row.office}</span></div>
                  <div><span className="row-label">Jabatan</span><span>{row.position}</span></div>
                  <div><span className="row-label">Status</span><Badge tone={row.status === "Contoh aktif" ? "success" : "warning"}>{row.status}</Badge></div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="notice-panel"><strong>Cakupan dan izin data masih rancangan.</strong><p>Laporan lintas kantor perlu mengikuti scope SDM yang disetujui. Field sensitif tidak ditampilkan pada prototype ini.</p></div>
    </div>
  );
}

function ReviewPage({
  role,
  statuses,
  selectedId,
  notice,
  onSelect,
  onDecide,
}: {
  role: RoleId;
  statuses: Record<string, ReviewStatus>;
  selectedId: string | null;
  notice: string;
  onSelect: (id: string) => void;
  onDecide: (id: string, status: ReviewStatus) => void;
}) {
  const subjects = reviewSubjects[role];
  const selected = subjects.find((item) => item.id === selectedId);
  const stage = role === "kabid"
    ? "Penilai 1, Kabid"
    : role === "secondReviewer"
      ? "Penilai 2, Kacab atau Kadiv"
      : role === "it"
        ? "Contoh antrean lintas tahap"
        : "Penilaian Direksi";

  return (
    <div className="page-stack">
      <div className="notice-panel"><strong>Alur penilai masih perlu dicocokkan dengan struktur jabatan.</strong><p>Daftar ini hanya berisi subjek contoh. Tidak mewakili pegawai atau jalur persetujuan sebenarnya.</p></div>
      <Card>
        <CardHeader><CardTitle>{stage}</CardTitle><CardDescription>Antrean penilaian sintetis.</CardDescription></CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <div className="empty-state"><strong>Belum ada subjek penilaian demo.</strong><span>Peran ini belum memiliki antrean contoh.</span></div>
          ) : (
            <div className="review-list">
              {subjects.map((subject) => (
                <div className="review-row" key={subject.id}>
                  <div><strong>{subject.name}</strong><span>{subject.role}</span></div>
                  <Badge tone={statuses[subject.id] === "Disetujui dalam simulasi" ? "success" : "warning"}>{statuses[subject.id] ?? "Menunggu"}</Badge>
                  <Button variant="outline" onClick={() => onSelect(subject.id)}>{selectedId === subject.id ? "Sedang ditinjau" : "Tinjau"}</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {selected && (
        <Card>
          <CardHeader><CardTitle>Penilaian untuk {selected.name}</CardTitle><CardDescription>Rincian KPI belum tersedia. Gunakan hanya untuk mencoba perubahan status.</CardDescription></CardHeader>
          <CardContent className="review-actions">
            <Button onClick={() => onDecide(selected.id, "Disetujui dalam simulasi")}>Setujui dalam simulasi</Button>
            <Button variant="outline" onClick={() => onDecide(selected.id, "Perlu perbaikan dalam simulasi")}>Minta perbaikan demo</Button>
            {notice && <p className="form-feedback" role="status">{notice}</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AccessPage({ onNavigate }: { onNavigate: (screen: ScreenId) => void }) {
  return (
    <div className="page-stack">
      <div className="notice-panel"><strong>Tim IT melihat seluruh menu dalam prototype ini.</strong><p>Daftar berikut adalah rancangan untuk review. Hak akses produksi harus ditetapkan dan ditegakkan oleh backend.</p></div>
      <Card>
        <CardHeader><CardTitle>Struktur menu per role</CardTitle><CardDescription>Buka satu role untuk melihat kelompok menu dan submenu. Pilih nama submenu untuk melihat rincian flow-nya.</CardDescription></CardHeader>
        <CardContent>
          <div className="role-map-list">
            {roles.map((item) => (
              <details className="role-map-item" key={item.id}>
                <summary><span><strong>{item.label}</strong><small>{item.description}</small></span><span className="role-map-caret" aria-hidden="true" /></summary>
                <div className="role-map-content"><NavigationOutline items={navigationForRole(item.id)} onNavigate={onNavigate} /></div>
              </details>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NavigationOutline({ items, onNavigate }: { items: NavigationItem[]; onNavigate: (screen: ScreenId) => void }) {
  return (
    <div className="outline-groups">
      {items.map((item) => item.kind === "link" ? (
        <button className="outline-link" type="button" key={item.id} onClick={() => onNavigate(item.id)}>{item.label ?? screenLabels[item.id]}</button>
      ) : (
        <section className="outline-group" key={item.id}>
          <h3>{item.label}</h3>
          <div className="outline-links">
            {item.children.map((child) => (
              <button className="outline-link" type="button" key={child.id} onClick={() => onNavigate(child.id)}>{child.label ?? screenLabels[child.id]}</button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ModuleOverviewPage({ screen }: { screen: ScreenId }) {
  const detail = moduleDetails[screen];
  if (!detail) {
    return <div className="empty-state"><strong>Rincian layar belum tersedia.</strong><span>Catat kebutuhan ini untuk dibahas sebelum implementasi.</span></div>;
  }

  return (
    <div className="page-stack">
      <div className="module-intro">
        <Badge tone="neutral">{detail.status}</Badge>
        <p>{detail.summary}</p>
      </div>
      <div className="module-detail-layout">
        <Card>
          <CardHeader><CardTitle>Alur yang dirancang</CardTitle><CardDescription>Urutan ini menjadi bahan validasi, belum workflow final.</CardDescription></CardHeader>
          <CardContent>
            <ol className="module-steps">{detail.workflow.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Data dan informasi</CardTitle><CardDescription>Field final mengikuti kamus data serta izin role.</CardDescription></CardHeader>
          <CardContent><ul className="module-data-list">{detail.data.map((item) => <li key={item}>{item}</li>)}</ul></CardContent>
        </Card>
      </div>
      <div className="notice-panel module-dependency"><strong>Yang masih perlu diputuskan</strong><p>{detail.dependency}</p></div>
    </div>
  );
}

function DataStatePreview({ mode, onReset }: { mode: DataPreview; onReset: () => void }) {
  const messages: Record<Exclude<DataPreview, "normal">, { title: string; body: string; action: string }> = {
    loading: { title: "Memuat data demo", body: "Status ini hanya pratinjau. Tidak ada permintaan API yang sedang berjalan.", action: "Kembali ke data contoh" },
    empty: { title: "Belum ada data untuk ditampilkan", body: "Ini adalah state kosong untuk uji alur pertama kali. Kembali ke data contoh untuk mencoba halaman.", action: "Tampilkan data contoh" },
    error: { title: "Data demo tidak dapat ditampilkan", body: "Gangguan ini disimulasikan. Tidak ada server atau koneksi database yang diperiksa.", action: "Coba lagi" },
  };
  if (mode === "normal") return null;
  const content = messages[mode];

  return (
    <Card className="state-card">
      <CardHeader><Badge tone={mode === "error" ? "warning" : "neutral"}>{mode === "loading" ? "Memuat" : mode === "empty" ? "Kosong" : "Gangguan demo"}</Badge><CardTitle>{content.title}</CardTitle><CardDescription>{content.body}</CardDescription></CardHeader>
      <CardContent><Button variant="outline" onClick={onReset}>{content.action}</Button></CardContent>
    </Card>
  );
}

export default App;
