class ComponentShowcase extends HTMLElement {
  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.innerHTML = `
      <div class="showcase-intro">
        <div>
          <span class="section-kicker">Design system</span>
          <h2>Bangun sekali, pakai di semua page.</h2>
          <p>Semua halaman baru cukup merakit component yang sama. Warna, spacing, state, dan perilaku responsive terpusat di FE.</p>
        </div>
        <div class="showcase-intro__mark"><span>UI</span><small>v0.1</small></div>
      </div>

      <div class="showcase-stack">
        <section>
          <div class="section-heading"><div><span class="section-kicker">Feedback</span><h3>Alert & notification</h3></div><span class="section-note">ui-alert &middot; ui-toast</span></div>
          <div class="showcase-alerts">
            <ui-alert type="success" title="Berhasil" message="Data pegawai berhasil disimpan." dismissible></ui-alert>
            <ui-alert type="warning" title="Perhatian" message="Lengkapi field wajib sebelum melanjutkan."></ui-alert>
            <ui-alert type="danger" title="Terjadi kesalahan" message="Data belum dapat dimuat. Coba lagi."></ui-alert>
          </div>
        </section>

        <div class="showcase-grid showcase-grid--two">
          <ui-card title="Button & icon" subtitle="Variant, size, dan icon memakai API yang sama.">
            <div class="component-row">
              <ui-button label="Primary" icon="plus"></ui-button>
              <ui-button label="Secondary" variant="secondary" icon="download"></ui-button>
              <ui-button label="Tertiary" variant="ghost" icon="edit"></ui-button>
              <ui-button label="Danger" variant="danger" icon="trash"></ui-button>
            </div>
            <div class="component-row component-row--compact">
              <span class="icon-demo"><ui-icon name="search"></ui-icon> search</span>
              <span class="icon-demo"><ui-icon name="bell"></ui-icon> bell</span>
              <span class="icon-demo"><ui-icon name="chart"></ui-icon> chart</span>
              <span class="icon-demo"><ui-icon name="users"></ui-icon> users</span>
            </div>
          </ui-card>

          <ui-card title="Badge & status" subtitle="Status dibuat singkat dan mudah discan.">
            <div class="status-showcase">
              <div><span>Aktif</span><ui-badge value="Aktif" tone="success"></ui-badge></div>
              <div><span>Menunggu approval</span><ui-badge value="Pending" tone="warning"></ui-badge></div>
              <div><span>Nonaktif</span><ui-badge value="Nonaktif" tone="neutral"></ui-badge></div>
              <div><span>Gagal</span><ui-badge value="Gagal" tone="danger"></ui-badge></div>
            </div>
          </ui-card>
        </div>

        <div class="showcase-grid showcase-grid--two">
          <ui-card title="Form component" subtitle="Field siap dipakai untuk form create/edit.">
            <ui-form data-demo-form>
              <div class="form-grid">
                <ui-input name="nama" label="Nama lengkap" placeholder="Masukkan nama" icon="users" required></ui-input>
                <ui-input name="email" label="Email" type="email" placeholder="nama@instansi.go.id" icon="file" required></ui-input>
                <ui-select name="status" label="Status kepegawaian">
                  <option value="">Pilih status</option>
                  <option value="tetap">Pegawai tetap</option>
                  <option value="kontrak">Pegawai kontrak</option>
                </ui-select>
                <ui-input name="unit" label="Unit kerja" placeholder="Contoh: 000001"></ui-input>
              </div>
              <div class="form-actions"><ui-button type="submit" label="Simulasikan submit" icon="check"></ui-button></div>
            </ui-form>
          </ui-card>

          <ui-card title="Modal component" subtitle="Untuk detail, konfirmasi, dan form bertahap.">
            <div class="modal-demo">
              <div class="modal-demo__icon"><ui-icon name="file" size="22"></ui-icon></div>
              <p>Gunakan modal yang sama untuk semua aksi yang perlu fokus pengguna.</p>
              <ui-button data-open-modal label="Buka modal" variant="secondary" icon="plus"></ui-button>
            </div>
          </ui-card>
        </div>

        <ui-card title="Table component" subtitle="Table desktop dan mobile memakai markup yang sama.">
          <div class="table-toolbar">
            <div><strong>Daftar pegawai terbaru</strong><small>Data contoh untuk preview component</small></div>
            <ui-button label="Export" variant="ghost" size="sm" icon="download"></ui-button>
          </div>
          <ui-data-table data-showcase-table></ui-data-table>
          <ui-pagination current="1" total="8"></ui-pagination>
        </ui-card>

        <div class="showcase-grid showcase-grid--two">
          <ui-card title="Tabs & drawer" subtitle="Untuk navigasi konteks dan filter tanpa memenuhi layar.">
            <ui-tabs active="ringkasan">
              <button data-tab="ringkasan">Ringkasan</button>
              <button data-tab="aktivitas">Aktivitas</button>
              <div data-panel="ringkasan"><p class="component-copy">Tabs menjaga konten tetap ringkas ketika satu page punya beberapa konteks.</p></div>
              <div data-panel="aktivitas"><p class="component-copy">Panel aktivitas dapat diisi timeline, audit trail, atau riwayat perubahan.</p></div>
            </ui-tabs>
            <div class="component-row component-row--compact"><ui-button data-open-drawer label="Buka drawer filter" variant="secondary" icon="edit"></ui-button></div>
          </ui-card>

          <ui-card title="Loading & empty state" subtitle="State standar agar pengalaman pengguna tetap konsisten.">
            <div class="state-preview">
              <div><span class="preview-label">Loading</span><ui-skeleton variant="text" lines="4"></ui-skeleton></div>
              <div><span class="preview-label">Empty</span><ui-empty-state title="Belum ada draft" message="Draft laporan akan muncul di sini." icon="file"></ui-empty-state></div>
            </div>
          </ui-card>
        </div>
      </div>

      <ui-modal title="Tambah pegawai" size="md" data-demo-modal>
        <p class="modal-lead">Modal ini nanti bisa dipakai ulang untuk form pegawai, keluarga, jabatan, dan modul lain.</p>
        <div class="form-grid">
          <ui-input name="modal_nama" label="Nama lengkap" placeholder="Nama pegawai"></ui-input>
          <ui-input name="modal_nip" label="NIP" placeholder="Nomor induk pegawai"></ui-input>
        </div>
        <div class="modal__actions">
          <ui-button data-modal-close label="Batal" variant="ghost"></ui-button>
          <ui-button data-modal-close label="Simpan pegawai" icon="check"></ui-button>
        </div>
      </ui-modal>
      <ui-drawer title="Filter data pegawai" data-demo-drawer>
        <p class="modal-lead">Gunakan drawer untuk filter cepat atau detail tambahan tanpa meninggalkan halaman.</p>
        <ui-form data-drawer-form>
          <div class="showcase-stack showcase-stack--tight">
            <ui-input name="keyword" label="Cari pegawai" placeholder="Nama atau NIP" icon="search"></ui-input>
            <ui-select name="unit" label="Unit kerja">
              <option value="">Semua unit kerja</option>
              <option value="pusat">Kantor Pusat</option>
              <option value="semarang">Korwil Semarang</option>
            </ui-select>
            <ui-select name="status" label="Status">
              <option value="">Semua status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </ui-select>
          </div>
          <div class="modal__actions"><ui-button data-drawer-close label="Terapkan filter" icon="check"></ui-button></div>
        </ui-form>
      </ui-drawer>
      <ui-toast data-toast></ui-toast>
    `;

    const table = this.querySelector('[data-showcase-table]');
    table.columns = [
      { label: 'Pegawai', key: 'nama' },
      { label: 'NIP', key: 'nip' },
      { label: 'Jabatan', key: 'jabatan' },
      { label: 'Unit kerja', key: 'unit' },
      {
        label: 'Status',
        render: (item) => {
          const badge = document.createElement('ui-badge');
          badge.setAttribute('value', item.status);
          badge.setAttribute('tone', 'success');
          return badge;
        },
      },
    ];
    table.data = [
      { nama: 'Andi Pratama', nip: '198705122010011001', jabatan: 'Analis Kepegawaian', unit: 'Kantor Pusat', status: 'Aktif' },
      { nama: 'Rina Kartika', nip: '199103252018022004', jabatan: 'Kepala Subbagian', unit: 'Korwil Semarang', status: 'Aktif' },
      { nama: 'Bagus Wicaksono', nip: '198910162014061002', jabatan: 'Pengelola Data', unit: 'Cabang Ungaran', status: 'Aktif' },
    ];
  }

  bindEvents() {
    const toast = this.querySelector('[data-toast]');
    const modal = this.querySelector('[data-demo-modal]');
    const drawer = this.querySelector('[data-demo-drawer]');
    this.querySelector('[data-open-modal]').addEventListener('click', () => modal.open());
    this.querySelector('[data-open-drawer]').addEventListener('click', () => drawer.open());
    this.querySelector('[data-demo-form]').addEventListener('form-submit', () => toast.show('Form berhasil divalidasi.', 'success'));
    this.querySelector('[data-demo-table]')?.addEventListener('click', () => toast.show('Aksi table dipanggil.', 'info'));
  }
}

customElements.define('component-showcase', ComponentShowcase);
