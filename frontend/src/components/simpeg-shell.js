class SimpegShell extends HTMLElement {
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;

    const content = document.createDocumentFragment();
    while (this.firstChild) content.appendChild(this.firstChild);

    const appName = this.getAttribute('app-name') || 'SIMPEG';
    const pageTitle = this.getAttribute('page-title') || '';
    const pageDescription = this.getAttribute('page-description') || '';

    this.innerHTML = `
      <div class="app-shell">
        <div class="sidebar-backdrop" data-sidebar-close></div>
        <aside class="app-sidebar" data-sidebar>
          <div class="app-sidebar__top">
            <div class="brand-mark"><span class="brand-mark__dot"></span><span class="brand-mark__name">${appName}</span></div>
            <button class="icon-button sidebar-collapse" data-sidebar-collapse type="button" aria-label="Ciutkan sidebar" title="Ciutkan sidebar"><ui-icon name="chevronLeft" size="17"></ui-icon></button>
          </div>
          <p class="sidebar-caption">MAIN MENU</p>
          <nav class="app-nav" aria-label="Navigasi utama">
            <a class="app-nav__item is-active" data-nav-link href="#overview"><ui-icon name="home" size="17"></ui-icon><span>Overview</span></a>
            <a class="app-nav__item" data-nav-link href="#pegawai"><ui-icon name="users" size="17"></ui-icon><span>Data Pegawai</span><span class="nav-count">12</span></a>
            <a class="app-nav__item" data-nav-link href="#keluarga"><ui-icon name="users" size="17"></ui-icon><span>Data Keluarga</span></a>
            <a class="app-nav__item" data-nav-link href="#laporan"><ui-icon name="chart" size="17"></ui-icon><span>Laporan</span></a>
          </nav>
          <p class="sidebar-caption sidebar-caption--secondary">SYSTEM</p>
          <nav class="app-nav" aria-label="Navigasi sistem">
            <a class="app-nav__item" data-nav-link href="#pengaturan"><ui-icon name="edit" size="17"></ui-icon><span>Pengaturan</span></a>
            <a class="app-nav__item" data-nav-link href="#rest-api"><ui-icon name="database" size="17"></ui-icon><span>REST API</span><span class="nav-count">API</span></a>
          </nav>
          <div class="app-sidebar__footer">
            <div class="sidebar-user"><span class="avatar avatar--sidebar">A</span><span><strong>Admin SIMPEG</strong><small>Administrator</small></span><ui-icon name="chevronRight" size="15"></ui-icon></div>
            <small class="sidebar-version">SIMPEG v3 · PHP 8.2</small>
          </div>
        </aside>
        <main class="app-main">
          <header class="topbar">
            <div class="topbar__leading">
              <button class="icon-button menu-trigger" data-sidebar-open type="button" aria-label="Buka navigasi"><ui-icon name="menu" size="20"></ui-icon></button>
              <button class="icon-button desktop-collapse" data-sidebar-collapse type="button" aria-label="Ciutkan sidebar" title="Ciutkan sidebar"><ui-icon name="chevronLeft" size="18"></ui-icon></button>
              <div class="topbar__crumb"><span>Workspace</span><ui-icon name="chevronRight" size="14"></ui-icon><strong>${pageTitle}</strong></div>
            </div>
            <div class="topbar__actions">
              <label class="topbar__search"><ui-icon name="search" size="16"></ui-icon><input data-global-search type="search" placeholder="Cari apa saja..." aria-label="Pencarian global"></label>
              <button class="icon-button theme-toggle" data-theme-toggle type="button" aria-label="Ganti tema" title="Ganti tema"><ui-icon data-theme-icon name="moon" size="18"></ui-icon></button>
              <ui-dropdown class="topbar-dropdown notification-dropdown" icon="bell" icon-only aria-label="Notifikasi">
                <div class="dropdown__heading"><strong>Notifikasi</strong><span class="badge badge--danger">3 baru</span></div>
                <div class="notification-list">
                  <button class="notification-item is-unread" type="button" data-dropdown-close><span class="notification-item__icon"><ui-icon name="users" size="15"></ui-icon></span><span><strong>Data pegawai diperbarui</strong><small>2 menit yang lalu</small></span></button>
                  <button class="notification-item" type="button" data-dropdown-close><span class="notification-item__icon"><ui-icon name="file" size="15"></ui-icon></span><span><strong>Laporan bulanan siap</strong><small>1 jam yang lalu</small></span></button>
                  <button class="notification-item" type="button" data-dropdown-close><span class="notification-item__icon"><ui-icon name="check" size="15"></ui-icon></span><span><strong>Sinkronisasi berhasil</strong><small>Kemarin</small></span></button>
                </div>
                <button class="dropdown__footer" type="button" data-dropdown-close>Lihat semua notifikasi <ui-icon name="chevronRight" size="14"></ui-icon></button>
              </ui-dropdown>
              <ui-dropdown class="topbar-dropdown user-dropdown" label="Admin" icon="users" aria-label="Menu pengguna">
                <div class="user-menu__identity"><span class="avatar">A</span><span><strong>Admin SIMPEG</strong><small>admin@simpeg.go.id</small></span></div>
                <div class="dropdown__divider"></div>
                <button class="dropdown__item" type="button" data-dropdown-close><ui-icon name="users" size="16"></ui-icon>Profil saya</button>
                <button class="dropdown__item" type="button" data-dropdown-close><ui-icon name="edit" size="16"></ui-icon>Pengaturan akun</button>
                <button class="dropdown__item dropdown__item--danger" type="button" data-dropdown-close><ui-icon name="close" size="16"></ui-icon>Keluar</button>
              </ui-dropdown>
            </div>
          </header>
          <section class="page-heading">
            <div>
              <p class="eyebrow">SIMPEG workspace</p>
              <h1>${pageTitle}</h1>
              <p class="page-heading__description">${pageDescription}</p>
            </div>
            <div class="page-heading__status"><span class="status-dot"></span> API online</div>
          </section>
          <div class="page-content"></div>
        </main>
      </div>
    `;

    this.querySelector('.page-content').appendChild(content);
    this.querySelectorAll('[data-sidebar-open]').forEach((element) => element.addEventListener('click', () => this.toggleSidebar(true)));
    this.querySelectorAll('[data-sidebar-close]').forEach((element) => element.addEventListener('click', () => this.toggleSidebar(false)));
    this.querySelectorAll('[data-sidebar-collapse]').forEach((element) => element.addEventListener('click', () => this.toggleSidebarControl()));
    this.querySelectorAll('[data-nav-link]').forEach((item) => item.addEventListener('click', () => this.toggleSidebar(false)));
    this.querySelector('[data-global-search]')?.addEventListener('input', (event) => {
      this.dispatchEvent(new CustomEvent('global-search', { bubbles: true, detail: { query: event.target.value } }));
    });
    this.querySelector('[data-theme-toggle]')?.addEventListener('click', () => this.toggleTheme());
    window.addEventListener('hashchange', this._onHashChange);
    this._setActiveNav();
    this._restorePreferences();
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', this._onHashChange);
  }

  _onHashChange = () => this._setActiveNav();

  _setActiveNav() {
    const current = window.location.hash.replace('#', '') || 'overview';
    this.querySelectorAll('[data-nav-link]').forEach((item) => item.classList.toggle('is-active', item.getAttribute('href') === `#${current}`));
  }

  _restorePreferences() {
    const app = this.querySelector('.app-shell');
    if (localStorage.getItem('simpeg-sidebar-collapsed') === 'true') app.classList.add('is-sidebar-collapsed');
    if (localStorage.getItem('simpeg-theme') === 'dark') this._setTheme('dark');
    this._syncCollapseButtons();
  }

  toggleSidebar(isOpen) {
    this.querySelector('[data-sidebar]')?.classList.toggle('is-open', isOpen);
    this.querySelector('.sidebar-backdrop')?.classList.toggle('is-visible', isOpen);
  }

  toggleCollapsed() {
    const app = this.querySelector('.app-shell');
    app.classList.toggle('is-sidebar-collapsed');
    localStorage.setItem('simpeg-sidebar-collapsed', String(app.classList.contains('is-sidebar-collapsed')));
    this._syncCollapseButtons();
  }

  toggleSidebarControl() {
    if (window.matchMedia('(max-width: 800px)').matches) {
      this.toggleSidebar(false);
      return;
    }
    this.toggleCollapsed();
  }

  _syncCollapseButtons() {
    const collapsed = this.querySelector('.app-shell')?.classList.contains('is-sidebar-collapsed');
    this.querySelectorAll('[data-sidebar-collapse]').forEach((button) => {
      button.setAttribute('aria-label', collapsed ? 'Lebarkan sidebar' : 'Ciutkan sidebar');
      button.setAttribute('title', collapsed ? 'Lebarkan sidebar' : 'Ciutkan sidebar');
      const icon = button.querySelector('ui-icon');
      if (icon) icon.setAttribute('name', collapsed ? 'chevronRight' : 'chevronLeft');
    });
  }

  toggleTheme() {
    const app = this.querySelector('.app-shell');
    this._setTheme(app.classList.contains('is-dark') ? 'light' : 'dark');
  }

  _setTheme(theme) {
    const dark = theme === 'dark';
    const app = this.querySelector('.app-shell');
    app.classList.toggle('is-dark', dark);
    localStorage.setItem('simpeg-theme', dark ? 'dark' : 'light');
    this.querySelector('[data-theme-icon]')?.setAttribute('name', dark ? 'sun' : 'moon');
  }
}

customElements.define('simpeg-shell', SimpegShell);
