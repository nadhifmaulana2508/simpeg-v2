class UiAlert extends HTMLElement {
  connectedCallback() {
    const type = this.getAttribute('type') || 'info';
    const title = this.getAttribute('title') || '';
    const message = this.getAttribute('message') || this.textContent.trim();
    const dismissible = this.hasAttribute('dismissible');
    const icon = type === 'success' ? 'check' : type === 'danger' ? 'warning' : type;

    this.className = `alert alert--${type}`;
    this.innerHTML = `
      <ui-icon name="${icon}" size="19"></ui-icon>
      <div class="alert__content">
        ${title ? `<strong>${title}</strong>` : ''}
        <span>${message}</span>
      </div>
      ${dismissible ? '<button class="alert__close" type="button" aria-label="Tutup"><ui-icon name="close" size="16"></ui-icon></button>' : ''}
    `;

    this.querySelector('.alert__close')?.addEventListener('click', () => this.remove());
  }
}

customElements.define('ui-alert', UiAlert);
