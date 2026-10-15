import { useState, type FormEvent } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { screenLabels, type ScreenId } from "../lib/navigation";
import { tableMappings, type ScreenTableMapping } from "../lib/table-mapping";

type WorkshopNote = {
  meeting: string;
  fields: string;
  process: string;
  decisions: string;
  savedAt: string;
};

type NoteFields = Omit<WorkshopNote, "savedAt">;

const emptyNote: WorkshopNote = { meeting: "", fields: "", process: "", decisions: "", savedAt: "" };
const noteKey = (screen: ScreenId) => `simpeg-v2-workshop-note:${screen}`;

function readNote(screen: ScreenId): WorkshopNote {
  try {
    const raw = window.localStorage.getItem(noteKey(screen));
    if (!raw) return { ...emptyNote };
    const saved = JSON.parse(raw) as Partial<WorkshopNote>;
    return {
      meeting: typeof saved.meeting === "string" ? saved.meeting : "",
      fields: typeof saved.fields === "string" ? saved.fields : "",
      process: typeof saved.process === "string" ? saved.process : "",
      decisions: typeof saved.decisions === "string" ? saved.decisions : "",
      savedAt: typeof saved.savedAt === "string" ? saved.savedAt : "",
    };
  } catch {
    return { ...emptyNote };
  }
}

function formatSavedAt(value: string): string {
  if (!value) return "Belum tersimpan di browser ini";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Catatan tersimpan di browser ini";
  return `Terakhir disimpan ${new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(date)}`;
}

function toMarkdown(screen: ScreenId, mapping: ScreenTableMapping, note: WorkshopNote): string {
  const sourceTables = mapping.legacyTables.length
    ? mapping.legacyTables.map((table) => `- ${table.kind === "column" ? "Kolom " : "Tabel "}\`${table.name}\`: ${table.note}`).join("\n")
    : "- Belum ada tabel legacy yang terkonfirmasi.";
  const proposedTables = mapping.proposedTables.map((table) => `- \`${table}\``).join("\n");
  return [
    `## ${screenLabels[screen]}`,
    "",
    `**Cakupan sumber:** ${mapping.sourceCoverage}`,
    "",
    "**Referensi legacy terkait**",
    sourceTables,
    "",
    "**Tabel target usulan, belum final**",
    proposedTables,
    "",
    `**Pertanyaan workshop:** ${mapping.discussionPrompt}`,
    "",
    `- Divisi/rapat dan tanggal: ${note.meeting || "Belum dicatat"}`,
    `- Data/kolom yang dipakai: ${note.fields || "Belum dicatat"}`,
    `- Alur, validasi, akses, pengecualian: ${note.process || "Belum dicatat"}`,
    `- Keputusan, PIC, tindak lanjut: ${note.decisions || "Belum dicatat"}`,
    `- Status simpan lokal: ${note.savedAt ? formatSavedAt(note.savedAt) : "Belum disimpan; jika ada isi, bagian ini berasal dari draft saat ekspor"}`,
    "",
    "---",
    "",
  ].join("\n");
}

function downloadWorkshopNotebook(activeScreen: ScreenId, activeDraft: WorkshopNote) {
  const sections = (Object.keys(tableMappings) as ScreenId[]).map((screen) => {
    const note = screen === activeScreen ? activeDraft : readNote(screen);
    return toMarkdown(screen, tableMappings[screen], note);
  });
  const markdown = [
    "# Catatan Workshop Menu dan Data SIMPEG",
    "",
    `Diekspor: ${new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(new Date())}`,
    "",
    "> Pemetaan sumber adalah kandidat dari inventaris DDL; target adalah ERD konseptual. Keduanya perlu validasi pemilik proses. Jangan masukkan data pribadi, password, token, atau isi dokumen pegawai.",
    "",
    ...sections,
  ].join("\n");
  const file = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `catatan-workshop-simpeg-${new Date().toISOString().slice(0, 10)}.md`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function TableReferences({ title, description, names, emptyText }: {
  title: string;
  description?: string;
  names: { name: string; note?: string; kind?: "table" | "column" }[];
  emptyText: string;
}) {
  return (
    <section className="table-map-column" aria-label={title}>
      <h3>{title}</h3>
      {description && <p className="table-map-description">{description}</p>}
      {names.length ? (
        <ul className="table-reference-list">
          {names.map((item) => (
            <li key={item.name}>
              <code>{item.name}</code>
              {item.note && <span>{item.kind === "column" ? "Kolom legacy. " : "Tabel legacy. "}{item.note}</span>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="table-map-empty">{emptyText}</p>
      )}
    </section>
  );
}

export function TableWorkshopPanel({ screen }: { screen: ScreenId }) {
  const mapping = tableMappings[screen];
  const [savedNote, setSavedNote] = useState(() => readNote(screen));
  const [draft, setDraft] = useState(() => readNote(screen));
  const [saveFeedback, setSaveFeedback] = useState("");
  const isDirty = (Object.keys(emptyNote) as (keyof WorkshopNote)[])
    .filter((key) => key !== "savedAt")
    .some((key) => draft[key] !== savedNote[key]);

  function updateField(field: keyof NoteFields, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setSaveFeedback("");
  }

  function saveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: WorkshopNote = { ...draft, savedAt: new Date().toISOString() };
    try {
      window.localStorage.setItem(noteKey(screen), JSON.stringify(next));
      setSavedNote(next);
      setDraft(next);
      setSaveFeedback("Catatan tersimpan di browser ini.");
    } catch {
      setSaveFeedback("Catatan belum tersimpan. Unduh buku catatan Markdown agar isinya tidak hilang.");
    }
  }

  return (
    <section className="page-stack table-workshop-stack" aria-label={`Tabel dan catatan untuk ${screenLabels[screen]}`}>
      <Card className="table-mapping-card">
        <CardHeader>
          <CardTitle>Tabel terkait</CardTitle>
          <CardDescription>Peta awal dari inventaris DDL legacy dan ERD konseptual. Ini bahan diskusi, bukan keputusan skema.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="table-map-grid">
            <TableReferences
              title="Sistem lama: tabel dan kolom"
              description={mapping.sourceCoverage}
              names={mapping.legacyTables}
              emptyText="Belum ada tabel sumber yang terkonfirmasi untuk menu ini."
            />
            <TableReferences
              title="Target yang diusulkan"
              description="Nama konseptual dari ERD draft. Bentuk tabel dan relasi masih perlu persetujuan HR, pemilik proses, IT, dan DBA."
              names={mapping.proposedTables.map((name) => ({ name }))}
              emptyText="Belum ada entitas target yang dirancang."
            />
          </div>
          <div className="mapping-question">
            <strong>Bahan tanya ke divisi terkait</strong>
            <p>{mapping.discussionPrompt}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="workshop-note-card">
        <CardHeader>
          <CardTitle>Catatan diskusi</CardTitle>
          <CardDescription>
            Catatan tersimpan di browser ini saja. Unduh buku catatan Markdown untuk dibagikan atau disimpan di docs/CATATAN-DISKUSI-SIMPEG.md.
            Jangan masukkan PII pegawai, password, token, foto, atau isi dokumen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="workshop-note-form" onSubmit={saveNote}>
            <label className="workshop-field">
              <span>Divisi/rapat dan tanggal</span>
              <input value={draft.meeting} onChange={(event) => updateField("meeting", event.target.value)} placeholder="Contoh: Divisi SDM, tanggal rapat" />
            </label>
            <label className="workshop-field">
              <span>Data atau kolom yang benar-benar dipakai</span>
              <textarea value={draft.fields} onChange={(event) => updateField("fields", event.target.value)} rows={3} placeholder="Nama field, definisi, sumber, wajib atau opsional" />
            </label>
            <label className="workshop-field">
              <span>Alur, validasi, hak akses, dan pengecualian</span>
              <textarea value={draft.process} onChange={(event) => updateField("process", event.target.value)} rows={3} placeholder="Siapa mengisi, memeriksa, menyetujui, dan melihat data ini?" />
            </label>
            <label className="workshop-field">
              <span>Keputusan, PIC, dan tindak lanjut</span>
              <textarea value={draft.decisions} onChange={(event) => updateField("decisions", event.target.value)} rows={3} placeholder="Catat keputusan atau pertanyaan yang masih terbuka" />
            </label>
            <div className="workshop-note-actions">
              <span className="workshop-save-status" role="status">
                {saveFeedback || (isDirty ? "Ada perubahan yang belum disimpan" : formatSavedAt(savedNote.savedAt))}
              </span>
              <div className="workshop-buttons">
                <Button type="submit" disabled={!isDirty}>Simpan di browser ini</Button>
                <Button type="button" variant="outline" onClick={() => downloadWorkshopNotebook(screen, draft)}>
                  Unduh semua catatan (.md)
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
