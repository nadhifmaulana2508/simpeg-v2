# SIMPEG v3 frontend

Frontend awal SIMPEG v3 memakai native Web Components dan ES Modules. Tidak ada
ketergantungan build wajib, sehingga dapat dijalankan langsung dari Apache/XAMPP
di `frontend/index.html`.

Palette utama:

- `#1B3C53` navy utama
- `#456882` blue aksen
- `#D2C1B6` sand/highlight
- `#F9F3EF` cream background

## Struktur

- `src/components/index.js` registry komponen bersama untuk setiap page.
- `src/components/` komponen UI bersama: shell, button, icon, form, alert, modal,
  toast, badge, table, pagination, dropdown, tabs, drawer, empty state, dan
  skeleton loading.
- `src/pages/` komponen halaman/fitur.
- `src/services/` client REST API.
- `src/styles.css` token dan aturan visual global.

## Menambah halaman

1. Buat custom element di `src/pages/`.
2. Gunakan komponen bersama dari `src/components/`.
3. Ambil data melalui `src/services/api-client.js`, bukan query database.
4. Daftarkan halaman di `src/main.js` atau router FE berikutnya.

`index.html` membuka component showcase sebagai playground/kontrak visual.
Menu `#rest-api` membuka REST API Center untuk memantau catalog module legacy
dan mencoba endpoint dari FE. Halaman daftar pegawai tersedia di
`src/pages/pegawai-page.js` dan mengambil data lewat REST API.

## Contoh page baru

```js
import '../components/index.js';

class PegawaiPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <ui-card title="Data pegawai">
        <ui-form>
          <ui-input name="q" label="Cari pegawai" icon="search"></ui-input>
          <ui-button type="submit" label="Cari" icon="search"></ui-button>
        </ui-form>
        <ui-data-table data-table></ui-data-table>
      </ui-card>
    `;
  }
}
```

Component tersedia:

`ui-icon`, `ui-button`, `ui-input`, `ui-select`, `ui-form`, `ui-alert`,
`ui-modal`, `ui-toast`, `ui-badge`, `ui-status-badge`, `ui-card`, `ui-data-table`, dan
`ui-pagination`, `ui-dropdown`, `ui-tabs`, `ui-drawer`, `ui-empty-state`, dan
`ui-skeleton`.

Shell FE juga sudah menyediakan sidebar yang bisa di-collapse, menu mobile,
global search event, notification menu, user menu, dan toggle light/dark theme.
State sidebar dan tema disimpan di `localStorage` agar preferensi pengguna tetap
konsisten antar page.

Client `src/services/api-client.js` menyediakan `apiRequest` untuk method GET,
POST, PUT, PATCH, dan DELETE, serta `apiProbe` untuk kebutuhan tester endpoint.
