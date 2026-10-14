class UiModal extends HTMLElement {
  connectedCallback() {
    const content = document.createDocumentFragment();
    while (this.firstChild) content.appendChild(this.firstChild);

    const title = this.getAttribute('title') || 'Dialog';
    const size = this.getAttribute('size') || 'md';
    this.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal__backdrop" data-modal-close></div>
        <div class="modal__dialog modal__dialog--${size}">
          <header class="modal__header">
            <h2 id="modal-title">${title}</h2>
            <button class="icon-button" type="button" data-modal-close aria-label="Tutup modal"><ui-icon name="close"></ui-icon></button>
          </header>
          <div class="modal__body"></div>
        </div>
      </div>
    `;

    this.querySelector('.modal__body').appendChild(content);
    this.querySelectorAll('[data-modal-close]').forEach((button) => button.addEventListener('click', () => this.close()));
    this._modal = this.querySelector('.modal');
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
    this._modal?.classList.add('is-open');
    document.body.classList.add('has-modal-open');
    this.querySelector('.modal__dialog')?.focus();
  }

  close() {
    this.removeAttribute('open');
    this._modal?.classList.remove('is-open');
    document.body.classList.remove('has-modal-open');
  }
}

customElements.define('ui-modal', UiModal);
