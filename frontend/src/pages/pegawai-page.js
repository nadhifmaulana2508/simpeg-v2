import '../components/index.js';
import { apiGet } from '../services/api-client.js';

class PegawaiPage extends HTMLElement {
  connectedCallback() {
    this.render();
    this.bindEvents();
    this.load();
  }

  render() {
    this.innerHTML = `
      <ui-card title="Daftar pegawai" subtitle="Halaman ini hanya merakit component bersama dan mengambil data melalui API.">
        <ui-form data-filter-form no-validate>
          <div class="form-grid form-grid--filters">
            <ui-input name="q" label="Cari pegawai" placeholder="Nama, NIP, atau ID pegawai" icon="search"></ui-input>
            <ui-input name="unit_kerja" label="Unit kerja" placeholder="Contoh: 000001"></ui-input>
            <ui-button type="submit" label="Terapkan filter" icon="search"></ui-button>
          </div>
        </ui-form>
        <div class="table-state" data-state aria-live="polite">Memuat data...</div>
        <ui-data-table data-table empty-text="Pegawai tidak ditemukan."></ui-data-table>
      </ui-card>
    `;

    const table = this.querySelector('[data-table]');
    table.columns = [
      { label: 'Pegawai', key: 'nama' },
      { label: 'NIP', key: 'nip' },
      { label: 'Jabatan', key: 'jabatan' },
      { label: 'Unit kerja', key: 'unit_kerja' },
      {
        label: 'Status',
        render: (item) => {
          const badge = document.createElement('ui-badge');
          badge.setAttribute('value', item.status_aktif || item.status_kepeg || '-');
          badge.setAttribute('tone', item.status_aktif === 'Y' ? 'success' : 'neutral');
          return badge;
        },
      },
    ];
  }

  bindEvents() {
    this.querySelector('[data-filter-form]').addEventListener('form-submit', (event) => this.load(event.detail.data));
  }

  async load(formData = null) {
    const state = this.querySelector('[data-state]');
    const table = this.querySelector('[data-table]');
    const params = formData ? Object.fromEntries(formData.entries()) : {};

    state.textContent = 'Memuat data...';
    state.className = 'table-state';
    table.setAttribute('loading', '');

    try {
      const payload = await apiGet('pegawai', { ...params, limit: 20 });
      table.removeAttribute('loading');
      table.data = payload.data || [];
      state.textContent = `${payload.meta?.total || 0} pegawai ditemukan`;
    } catch (error) {
      table.removeAttribute('loading');
      table.data = [];
      state.textContent = error.message;
      state.className = 'table-state table-state--error';
    }
  }
}

customElements.define('pegawai-page', PegawaiPage);
