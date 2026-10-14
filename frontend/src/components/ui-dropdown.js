class UiDropdown extends HTMLElement {
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;

    const content = document.createDocumentFragment();
    while (this.firstChild) content.appendChild(this.firstChild);

    const label = this.getAttribute('label') || '';
    const icon = this.getAttribute('icon') || '';
    const ariaLabel = this.getAttribute('aria-label') || label || 'Buka menu';
    const iconMarkup = icon ? `<ui-icon name="${icon}" size="18"></ui-icon>` : '';
    const labelMarkup = label ? `<span>${label}</span>` : '';
    const chevronMarkup = this.hasAttribute('icon-only') ? '' : '<ui-icon class="dropdown__chevron" name="chevronDown" size="14"></ui-icon>';

    this.classList.add('dropdown');
    this.innerHTML = `
      <button class="dropdown__trigger${this.hasAttribute('icon-only') ? ' dropdown__trigger--icon' : ''}" type="button" aria-expanded="false" aria-label="${ariaLabel}">
        ${iconMarkup}${labelMarkup}${chevronMarkup}
      </button>
      <div class="dropdown__menu" role="menu"></div>
    `;
    this.querySelector('.dropdown__menu').appendChild(content);
    this._trigger = this.querySelector('.dropdown__trigger');
    this._trigger.addEventListener('click', () => this.toggle());
    this.querySelectorAll('[data-dropdown-close]').forEach((element) => element.addEventListener('click', () => this.close()));
    this._onDocumentClick = (event) => {
      if (!this.contains(event.target)) this.close();
    };
    this._onKeydown = (event) => {
      if (event.key === 'Escape') this.close();
    };
    document.addEventListener('click', this._onDocumentClick);
    document.addEventListener('keydown', this._onKeydown);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onDocumentClick);
    document.removeEventListener('keydown', this._onKeydown);
  }

  toggle() {
    this.hasAttribute('open') ? this.close() : this.open();
  }

  open() {
    this.setAttribute('open', '');
    this._trigger?.setAttribute('aria-expanded', 'true');
    this.dispatchEvent(new CustomEvent('dropdown-open', { bubbles: true }));
  }

  close() {
    this.removeAttribute('open');
    this._trigger?.setAttribute('aria-expanded', 'false');
  }
}

customElements.define('ui-dropdown', UiDropdown);
