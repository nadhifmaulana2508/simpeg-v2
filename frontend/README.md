# SIMPEG v2 FE prototype

Status: **draft prototype for review**, not a production interface. This prototype uses synthetic data and does not call an API or database.

Design Read: modern, minimal shadcn/ui direction for an internal banking HR portal; ENERGY 1 / RHYTHM 2 / MOTION 1.

Design notes:

- Neutral surfaces keep long operational labels readable. A muted teal accent identifies the current destination, primary action, and keyboard focus, rather than decorating every section.
- System fonts avoid a remote font dependency and keep forms and tables familiar on office and mobile devices.
- Desktop uses a grouped sidebar because the role-based menu has many destinations. On phones and smaller tablets it becomes a labeled, collapsible menu; groups open on tap and the menu can scroll without covering page content.
- A skip link, visible keyboard focus, and touch targets of at least 44px support keyboard and touch use. Text/status colors and control edges are checked in light and dark themes.
- Data pages emphasize the task, its process, required information, and unresolved decisions. That structure helps reviewers discuss the actual HR workflow instead of placeholder charts.
- Movement is limited to menu disclosure and ordinary focus/hover feedback. It does not compete with review and data-entry work.
- Names and records are synthetic and marked as demo data. No employee photos, real identity records, or fabricated performance metrics are included.
- Face and location checks are button-driven simulations. The browser does not request camera or geolocation permission and collects no biometric or location data.

## Role menu overview

Every role has **Beranda** and personal menus. Exact visibility is implemented in `src/lib/navigation.ts`; each submenu opens a page with its purpose, proposed workflow, information involved, and open decisions.

Every menu also shows its candidate legacy tables and conceptual target entities from `src/lib/table-mapping.ts`. Source gaps are called out explicitly; the names are workshop material, not a final schema. The panel prompts reviewers to confirm real fields, workflow, access, and data ownership with each division.

The discussion form saves notes in this browser's local storage, per menu. It is not shared, backed up, or sent to an API. Use **Unduh semua catatan (.md)** to export the full menu/table index and saved notes, then review and place approved decisions in `docs/CATATAN-DISKUSI-SIMPEG.md`. Do not enter real employee identifiers, credentials, photos, or document contents.

| Role | Additional menu scope |
| --- | --- |
| Pegawai | Data saya: biodata, riwayat jabatan, pendidikan, pelatihan, sertifikasi, keluarga, CV/dokumen. KPI: ringkasan, self-assessment, laporan pribadi. Absensi: catat kehadiran, riwayat. Pengajuan: perubahan data, koreksi absensi, status. |
| Divisi SDM | Menu pribadi, manajemen pegawai, verifikasi perubahan data, data riwayat/pelatihan/sertifikasi/keluarga/dokumen, laporan SDM lintas kantor, monitoring KPI, dan rancangan sumber Monbis. |
| Kabid | Menu pribadi dan antrean penilai tahap 1 beserta riwayat penilaian. |
| Kacab atau Kadiv | Menu pribadi dan antrean penilai tahap 2 beserta riwayat penilaian. |
| Korwil | Menu pribadi. Arahan yang tersedia menyebut KPI Korwil dinilai Direksi; role ini belum diberi antrean penilaian bawahan. |
| Direksi | Menu pribadi dan rancangan penilaian untuk Kacab, Korwil, dan Kadiv. |
| Tim IT | Seluruh menu di atas dan peta menu per role untuk review. Akses luas ini hanya berlaku di prototype. |

Beberapa layar sudah memperlihatkan form/alur yang dapat dicoba, seperti self-assessment, pengajuan, absensi simulasi, dan keputusan penilai. Layar submenu lain merupakan rancangan proses, bukan klaim bahwa fiturnya sudah dibangun atau disetujui. Catatan `Yang masih perlu diputuskan` pada layar menandai keputusan bisnis atau integrasi yang masih terbuka.

## Menjalankan lokal

```powershell
cd frontend
npm install
npm run dev
```

`npm run build` menjalankan pemeriksaan TypeScript lalu membuat build Vite. Pemilih role, state data, mode terang/gelap, formulir, peta menu, catatan lokal, dan hasil penilaian hanya untuk review UI; tidak ada data bisnis yang dikirim ke server.
