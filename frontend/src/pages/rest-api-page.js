import '../components/index.js';
import { apiGet, apiProbe } from '../services/api-client.js';

class RestApiPage extends HTMLElement {
  connectedCallback() {
    this.catalog = null;
    this.selectedKey = 'system';
    this.query = '';
    this.group = 'all';
    this.render();
    this.bindEvents();
    this.loadCatalog();
  }

  render() {
    this.innerHTML = `
      <div class="api-page">
        <div class="api-intro">
          <div>
            <span class="section-kicker">Backend control center</span>
            <h2>REST API menu</h2>
            <p>Satu tempat untuk memantau coverage API, mencoba endpoint, dan melihat response sebelum page FE dibangun.</p>
          </div>
          <div class="api-intro__actions">
            <span class="api-url-chip"><ui-icon name="database" size="15"></ui-icon><code>../api</code></span>
            <span class="api-connection" data-api-connection>Memuat catalog...</span>
            <button class="button button--secondary button--sm" type="button" data-api-run-all disabled><ui-icon name="refresh" size="14"></ui-icon> Test semua ready</button>
          </div>
        </div>

        <div class="api-metrics" data-api-metrics>
          <div class="api-metric"><span>Module</span><strong>—</strong><small>terdaftar</small></div>
          <div class="api-metric"><span>Ready</span><strong>—</strong><small>siap dipakai</small></div>
          <div class="api-metric"><span>Partial</span><strong>—</strong><small>sedang dimigrasi</small></div>
          <div class="api-metric"><span>Testable</span><strong>—</strong><small>endpoint dapat diuji</small></div>
        </div>

        <div class="api-layout">
          <ui-card title="Menu backend" subtitle="Status menunjukkan prioritas migrasi dari folder legacy.">
            <div class="api-toolbar">
              <label class="api-filter"><ui-icon name="search" size="15"></ui-icon><input data-api-search type="search" placeholder="Cari module atau deskripsi..." aria-label="Cari module API"></label>
              <select class="api-group-filter" data-api-group aria-label="Filter group"><option value="all">Semua group</option></select>
            </div>
            <div class="api-module-list" data-api-modules><ui-skeleton variant="card" lines="5"></ui-skeleton></div>
          </ui-card>

          <ui-card title="Endpoint tester" subtitle="Pilih module, cek route, lalu jalankan request dari FE.">
            <div class="api-detail-empty" data-api-empty>
              <ui-empty-state title="Pilih module API" message="Pilih salah satu module di sebelah kiri untuk melihat endpoint yang tersedia." icon="database"></ui-empty-state>
            </div>
            <div class="api-detail is-hidden" data-api-detail hidden>
              <div class="api-detail__head">
                <div><span class="section-kicker" data-api-detail-group></span><h3 data-api-detail-title></h3><p data-api-detail-description></p></div>
                <span class="badge" data-api-detail-status></span>
              </div>
              <div class="api-request-bar">
                <label class="api-method-picker"><span>Method</span><select data-api-method aria-label="HTTP method"><option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option value="DELETE" disabled>DELETE (nonaktif)</option></select></label>
                <label><span>Request path</span><input data-api-request-path type="text" value="/"></label>
                <button class="button button--primary" type="button" data-api-run><ui-icon name="refresh" size="15"></ui-icon> Jalankan</button>
              </div>
              <div class="api-body-field">
                <div class="api-body-toolbar">
                  <div><span>Request body JSON</span><small data-api-body-hint>GET tidak memakai body. Pilih endpoint Create/Update untuk memakai dummy payload.</small></div>
                  <div class="api-body-actions"><button class="button button--ghost button--sm" type="button" data-api-body-template disabled>Isi contoh</button><button class="button button--ghost button--sm" type="button" data-api-body-format disabled>Format</button></div>
                </div>
                <textarea data-api-body rows="5" spellcheck="false" placeholder='{"field":"value"}'></textarea>
              </div>
              <div class="api-endpoint-list" data-api-endpoints></div>
              <div class="api-result-head"><strong>Response</strong><span data-api-result-status>Belum ada request</span></div>
              <pre class="api-response" data-api-response>Response akan tampil di sini setelah endpoint dijalankan.</pre>
            </div>
          </ui-card>
        </div>

        <ui-card title="Migrasi workflow" subtitle="Urutan kerja untuk menjaga legacy tetap aman selama semua API dibangun.">
          <div class="api-steps">
            <div><span>01</span><strong>Catalog</strong><p>Daftarkan module dan endpoint legacy.</p></div>
            <div><span>02</span><strong>Repository</strong><p>Pindahkan query ke PHP 8.2 dengan prepared statement.</p></div>
            <div><span>03</span><strong>Test API</strong><p>Validasi response lewat menu ini sebelum membuat page FE.</p></div>
            <div><span>04</span><strong>Migrate FE</strong><p>Baru setelah stabil, page lama diganti komponen modern.</p></div>
          </div>
        </ui-card>
      </div>
    `;
  }

  bindEvents() {
    this.querySelector('[data-api-search]').addEventListener('input', (event) => {
      this.query = event.target.value.toLowerCase().trim();
      this.renderModules();
    });
    this.querySelector('[data-api-group]').addEventListener('change', (event) => {
      this.group = event.target.value;
      this.renderModules();
    });
    this.querySelector('[data-api-modules]').addEventListener('click', (event) => {
      const item = event.target.closest('[data-module-key]');
      if (item) this.selectModule(item.dataset.moduleKey);
    });
    this.querySelector('[data-api-endpoints]').addEventListener('click', (event) => {
      const button = event.target.closest('[data-endpoint-sample]');
      if (!button || button.disabled) return;
      this.applyEndpoint({
        path: button.dataset.endpointPath,
        sample: button.dataset.endpointSample,
        method: button.dataset.endpointMethod,
      });
      if (button.dataset.endpointTestable === 'true') this.runRequest();
    });
    this.querySelector('[data-api-method]').addEventListener('change', () => this.updateBodyEditor());
    this.querySelector('[data-api-body-template]').addEventListener('click', () => {
      const path = this.querySelector('[data-api-request-path]').value.trim();
      const method = this.querySelector('[data-api-method]').value;
      this.querySelector('[data-api-body]').value = this.requestBodyExample({ path, method });
      this.updateBodyEditor();
    });
    this.querySelector('[data-api-body-format]').addEventListener('click', () => this.formatBody());
    this.querySelector('[data-api-run]').addEventListener('click', () => this.runRequest());
    this.querySelector('[data-api-run-all]').addEventListener('click', () => this.runAll());
  }

  async loadCatalog() {
    try {
      const payload = await apiGet('catalog');
      this.catalog = payload.data;
      this.renderMetrics();
      this.renderGroups();
      this.renderModules();
      this.selectModule(this.catalog.modules[0]?.key || 'system');
      this.querySelector('[data-api-run-all]').disabled = false;
      this.setConnection('ok', `${this.catalog.stats.testable_endpoints} endpoint siap diuji`);
    } catch (error) {
      this.setConnection('error', 'Catalog API gagal dimuat');
      this.querySelector('[data-api-modules]').innerHTML = '';
      const empty = document.createElement('ui-empty-state');
      empty.setAttribute('title', 'Catalog belum tersedia');
      empty.setAttribute('message', error.message);
      empty.setAttribute('icon', 'warning');
      this.querySelector('[data-api-modules]').appendChild(empty);
    }
  }

  renderMetrics() {
    const stats = this.catalog.stats;
    this.querySelector('[data-api-metrics]').innerHTML = `
      <div class="api-metric"><span>Module</span><strong>${stats.total}</strong><small>terdaftar</small></div>
      <div class="api-metric"><span>Ready</span><strong>${stats.ready}</strong><small>siap dipakai</small></div>
      <div class="api-metric"><span>Partial</span><strong>${stats.partial}</strong><small>sedang dimigrasi</small></div>
      <div class="api-metric"><span>Testable</span><strong>${stats.testable_endpoints}</strong><small>endpoint dapat diuji</small></div>
    `;
  }

  renderGroups() {
    const groups = [...new Set(this.catalog.modules.map((module) => module.group))].sort();
    this.querySelector('[data-api-group]').innerHTML = '<option value="all">Semua group</option>' + groups.map((group) => `<option value="${this.escape(group)}">${this.escape(group)}</option>`).join('');
  }

  renderModules() {
    if (!this.catalog) return;
    const modules = this.catalog.modules.filter((module) => {
      const matchesQuery = !this.query || `${module.label} ${module.description} ${module.key}`.toLowerCase().includes(this.query);
      const matchesGroup = this.group === 'all' || module.group === this.group;
      return matchesQuery && matchesGroup;
    });
    const container = this.querySelector('[data-api-modules]');
    if (!modules.length) {
      container.innerHTML = '<ui-empty-state title="Module tidak ditemukan" message="Coba ubah kata kunci atau filter group." icon="search"></ui-empty-state>';
      return;
    }
    container.innerHTML = modules.map((module) => `
      <button class="api-module-item${module.key === this.selectedKey ? ' is-active' : ''}" type="button" data-module-key="${this.escape(module.key)}">
        <span class="api-module-item__icon"><ui-icon name="${module.key === 'system' ? 'database' : module.key === 'report' ? 'chart' : 'file'}" size="17"></ui-icon></span>
        <span class="api-module-item__content"><strong>${this.escape(module.label)}</strong><small>${this.escape(module.group)} · ${module.legacy_files} legacy file · ${module.endpoints.length} endpoint</small></span>
        <span class="badge badge--${this.statusTone(module.status)}">${this.statusLabel(module.status)}</span>
      </button>
    `).join('');
  }

  selectModule(key) {
    const module = this.catalog?.modules.find((item) => item.key === key);
    if (!module) return;
    this.selectedKey = key;
    this.renderModules();
    const emptyState = this.querySelector('[data-api-empty]');
    const detail = this.querySelector('[data-api-detail]');
    emptyState.hidden = true;
    emptyState.classList.add('is-hidden');
    detail.hidden = false;
    detail.classList.remove('is-hidden');
    this.querySelector('[data-api-detail-group]').textContent = module.group;
    this.querySelector('[data-api-detail-title]').textContent = module.label;
    this.querySelector('[data-api-detail-description]').textContent = `${module.description}${module.legacy_path ? ` Source: ${module.legacy_path}` : ''}`;
    const status = this.querySelector('[data-api-detail-status]');
    status.className = `badge badge--${this.statusTone(module.status)}`;
    status.textContent = this.statusLabel(module.status);
    const first = module.endpoints.find((endpoint) => endpoint.testable) || module.endpoints[0];
    this.applyEndpoint(first || { path: `/${module.key}`, sample: `/${module.key}`, method: 'GET' });
    this.querySelector('[data-api-endpoints]').innerHTML = module.endpoints.length
      ? module.endpoints.map((endpoint) => `
          <button class="api-endpoint-item${endpoint.method === 'DELETE' ? ' is-disabled' : ''}" type="button" ${endpoint.method === 'DELETE' ? 'disabled' : ''} title="${endpoint.method === 'DELETE' ? 'Delete dinonaktifkan; trash dan restore belum tersedia.' : ''}" data-endpoint-path="${this.escape(endpoint.path)}" data-endpoint-sample="${this.escape(endpoint.sample)}" data-endpoint-method="${this.escape(endpoint.method)}" data-endpoint-testable="${endpoint.testable}">
            <span class="api-method api-method--${endpoint.method.toLowerCase()}">${endpoint.method}</span>
            <span><strong>${this.escape(endpoint.label)}</strong><code>${this.escape(endpoint.path)}</code></span>
            <ui-icon name="${endpoint.method === 'DELETE' ? 'trash' : endpoint.testable ? 'refresh' : 'chevronRight'}" size="15"></ui-icon>
          </button>
        `).join('')
      : '<ui-empty-state title="Endpoint belum dibuat" message="Module ini sudah masuk catalog, tetapi repository dan route API-nya belum dipindahkan." icon="file"></ui-empty-state>';
    this.querySelector('[data-api-result-status]').textContent = 'Belum ada request';
    this.querySelector('[data-api-response]').textContent = 'Response akan tampil di sini setelah endpoint dijalankan.';
  }

  applyEndpoint(endpoint) {
    const path = endpoint.sample || endpoint.path || '/';
    this.querySelector('[data-api-request-path]').value = path;
    this.querySelector('[data-api-method]').value = endpoint.method || 'GET';
    this.querySelector('[data-api-body]').value = this.requestBodyExample(endpoint);
    this.updateBodyEditor();
  }

  updateBodyEditor() {
    const method = this.querySelector('[data-api-method]').value;
    const body = this.querySelector('[data-api-body]');
    const template = this.querySelector('[data-api-body-template]');
    const format = this.querySelector('[data-api-body-format]');
    const hint = this.querySelector('[data-api-body-hint]');
    const supportsBody = ['POST', 'PUT', 'PATCH'].includes(method);
    body.disabled = !supportsBody;
    template.disabled = !supportsBody;
    format.disabled = !supportsBody;
    if (!supportsBody) {
      body.value = '';
      hint.textContent = `${method} tidak membutuhkan request body.`;
      return;
    }
    if (!body.value.trim()) {
      body.value = this.requestBodyExample({
        path: this.querySelector('[data-api-request-path]').value,
        method,
      });
    }
    hint.textContent = 'Contoh body siap diedit sebelum request dijalankan.';
  }

  requestBodyExample(endpoint) {
    const method = endpoint.method || 'GET';
    if (!['POST', 'PUT', 'PATCH'].includes(method)) return '';
    const route = String(endpoint.path || endpoint.sample || '');
    if (route.includes('/auth/login')) return JSON.stringify({ username: 'demo', password: 'demo' }, null, 2);
    if (route.includes('/auth/logout')) return JSON.stringify({}, null, 2);
    const match = route.match(/\/resources\/([^/?]+)/);
    const resource = match ? match[1] : '';
    const examples = {
      kantor: { kode_kantor_detail: 'TEST-001', kode_cabang: 'TEST', nama_kantor: 'Kantor Uji' },
      pegawai: { id_peg: 'TEST-001', nama: 'Pegawai Uji' },
      anak: { id_peg: 'TEST-001', nama: 'Anak Uji' },
      pasangan: { id_peg: 'TEST-001', nama: 'Pasangan Uji' },
      ortu: { id_peg: 'TEST-001', nama: 'Orang Tua Uji' },
      jabatan: { id_peg: 'TEST-001', jabatan: 'Jabatan Uji' },
      'ref-jabatan': { kode_jabatan: 'TEST-001', jabatan: 'Jabatan Uji' },
      user: { id_user: 'user-test', nama_user: 'User Test', hak_akses: 'user' },
      config: { nama_app: 'SIMPEG', alias_app: 'SIMPEG V3' },
      'master-pekerjaan': { id_pekerjaan: 'TEST-001', desc_pekerjaan: 'Pekerjaan Uji' },
      'master-jabatan': { kode_jabatan: 'TEST-001', nama_jabatan: 'Jabatan Uji' },
      pendidikan: { id_peg: 'TEST-001', nama_sekolah: 'Sekolah Uji', jenjang: 'S1' },
      bahasa: { id_peg: 'TEST-001', bahasa: 'Bahasa Uji' },
      diklat: { id_peg: 'TEST-001', diklat: 'Diklat Uji' },
      sertifikasi: { id_peg: 'TEST-001', sertifikasi: 'Sertifikasi Uji' },
      pengangkatan: { id_peg: 'TEST-001', jns_mutasi: 'Pengangkatan Uji' },
      mutasi: { id_peg: 'TEST-001', jns_mutasi: 'Mutasi Uji' },
      pelanggaran: { id_peg: 'TEST-001', hukuman: 'Pelanggaran Uji' },
      cuti: { id_peg: 'TEST-001', jns_cuti: 'Cuti Uji' },
      dp3: { id_peg: 'TEST-001', periode_awal: '2026-01-01' },
      'lat-jabatan': { id_peg: 'TEST-001', nama_pelatih: 'Pelatih Uji' },
      pangkat: { id_peg: 'TEST-001', pangkat: 'Pangkat Uji' },
      penghargaan: { id_peg: 'TEST-001', penghargaan: 'Penghargaan Uji' },
      penugasan: { id_peg: 'TEST-001', tujuan: 'Penugasan Uji' },
      seminar: { id_peg: 'TEST-001', seminar: 'Seminar Uji' },
      formasi: { kode_cabang: 'TEST', jabatan: 'Formasi Uji' },
      'edit-pending': { id_peg: 'TEST-001', jenis_data: 'nama' },
      notifikasi: { id_user: 'user-test', judul: 'Notifikasi Uji', pesan: 'Pesan uji' },
    };
    return JSON.stringify(examples[resource] || { field: 'value' }, null, 2);
  }

  formatBody() {
    const body = this.querySelector('[data-api-body]');
    try {
      body.value = JSON.stringify(JSON.parse(body.value), null, 2);
      this.querySelector('[data-api-body-hint]').textContent = 'JSON valid dan sudah diformat.';
    } catch (error) {
      this.querySelector('[data-api-body-hint]').textContent = 'JSON belum valid. Periksa tanda kutip dan koma.';
    }
  }

  async runRequest() {
    const input = this.querySelector('[data-api-request-path]');
    const path = input.value.trim() || '/';
    const method = this.querySelector('[data-api-method]').value;
    const bodyText = this.querySelector('[data-api-body]').value.trim();
    const button = this.querySelector('[data-api-run]');
    if (method === 'DELETE') {
      this.querySelector('[data-api-result-status]').className = 'api-result-status is-error';
      this.querySelector('[data-api-result-status]').textContent = 'DELETE nonaktif';
      this.querySelector('[data-api-response]').textContent = JSON.stringify({ success: false, message: 'Delete langsung dinonaktifkan. Fitur trash dan restore belum tersedia.' }, null, 2);
      return { ok: false, status: 405, duration: 0, payload: { success: false, message: 'Delete langsung dinonaktifkan.' } };
    }
    button.disabled = true;
    button.classList.add('is-loading');
    if (bodyText && ['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        JSON.parse(bodyText);
      } catch (error) {
        button.disabled = false;
        button.classList.remove('is-loading');
        this.querySelector('[data-api-result-status]').className = 'api-result-status is-error';
        this.querySelector('[data-api-result-status]').textContent = 'BODY tidak valid';
        this.querySelector('[data-api-response]').textContent = JSON.stringify({ success: false, message: 'Request body harus berupa JSON valid.' }, null, 2);
        return { ok: false, status: 422, duration: 0, payload: { success: false, message: 'Request body harus berupa JSON valid.' } };
      }
    }
    const result = await apiProbe(path, { method, body: method === 'GET' || method === 'DELETE' || bodyText === '' ? undefined : bodyText });
    button.disabled = false;
    button.classList.remove('is-loading');
    const status = this.querySelector('[data-api-result-status]');
    status.className = `api-result-status ${result.ok ? 'is-success' : 'is-error'}`;
    const emptyData = result.ok && Array.isArray(result.payload?.data) && result.payload.data.length === 0;
    status.textContent = `${result.status || 'ERR'} · ${result.duration} ms${emptyData ? ' · data kosong' : ''}`;
    this.querySelector('[data-api-response]').textContent = JSON.stringify(result.payload, null, 2);
    return result;
  }

  async runAll() {
    if (!this.catalog) return;
    const button = this.querySelector('[data-api-run-all]');
    const endpoints = this.catalog.modules.flatMap((module) => module.endpoints.filter((endpoint) => endpoint.testable).map((endpoint) => ({ module, endpoint })));
    let passed = 0;
    button.disabled = true;
    button.classList.add('is-loading');
    for (const item of endpoints) {
      this.selectModule(item.module.key);
      this.applyEndpoint(item.endpoint);
      const result = await this.runRequest();
      if (result.ok) passed++;
    }
    button.disabled = false;
    button.classList.remove('is-loading');
    this.setConnection(passed === endpoints.length ? 'ok' : 'error', `${passed}/${endpoints.length} endpoint berhasil`);
  }

  setConnection(type, label) {
    const element = this.querySelector('[data-api-connection]');
    element.className = `api-connection api-connection--${type}`;
    element.textContent = label;
  }

  statusTone(status) {
    return status === 'ready' ? 'success' : status === 'partial' ? 'warning' : 'neutral';
  }

  statusLabel(status) {
    return status === 'ready' ? 'Ready' : status === 'partial' ? 'Partial' : 'Planned';
  }

  escape(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
  }
}

customElements.define('rest-api-page', RestApiPage);
