class UiDrawer extends HTMLElement {
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;

    const content = document.createDocumentFragment();
    while (this.firstChild) content.appendChild(this.firstChild);
    const title = this.getAttribute('title') || 'Panel';
    const side = this.getAttribute('side') || 'right';

    this.innerHTML = `
      <div class="drawer drawer--${side}" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div class="drawer__backdrop" data-drawer-close></div>
        <aside class="drawer__panel">
          <header class="drawer__header">
            <h2 id="drawer-title">${title}</h2>
            <button class="icon-button" type="button" data-drawer-close aria-label="Tutup panel"><ui-icon name="close"></ui-icon></button>
          </header>
          <div class="drawer__body"></div>
        </aside>
      </div>
    `;
    this.querySelector('.drawer__body').appendChild(content);
    this.querySelectorAll('[data-drawer-close]').forEach((button) => button.addEventListener('click', () => this.close()));
    this._drawer = this.querySelector('.drawer');
    this._onKeydown = (event) => {
      if (event.key === 'Escape' && this.hasAttribute('open')) this.close();
    };
    document.addEventListener('keydown', this._onKeydown);
    if (this.hasAttribute('open')) this.open();
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._onKeydown);
  }

  open() {
    this.setAttribute('open', '');
    this._drawer?.classList.add('is-open');
    document.body.classList.add('has-drawer-open');
  }

  close() {
    this.removeAttribute('open');
    this._drawer?.classList.remove('is-open');
    document.body.classList.remove('has-drawer-open');
  }
}

customElements.define('ui-drawer', UiDrawer);
