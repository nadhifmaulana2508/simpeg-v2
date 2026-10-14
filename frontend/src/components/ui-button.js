class UiButton extends HTMLElement {
  connectedCallback() {
    const label = this.getAttribute('label') || this.textContent.trim();
    const icon = this.getAttribute('icon');
    const iconPosition = this.getAttribute('icon-position') || 'left';
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'md';
    const type = this.getAttribute('type') || 'button';
    const disabled = this.hasAttribute('disabled');

    this.innerHTML = `
      <button class="button button--${variant} button--${size}" type="${type}" ${disabled ? 'disabled' : ''}>
        ${icon && iconPosition === 'left' ? `<ui-icon name="${icon}" size="16"></ui-icon>` : ''}
        <span>${label}</span>
        ${icon && iconPosition === 'right' ? `<ui-icon name="${icon}" size="16"></ui-icon>` : ''}
      </button>
    `;
  }

  get button() {
    return this.querySelector('button');
  }

  setLoading(isLoading, text = 'Memproses...') {
    const button = this.button;
    if (!button) return;
    button.disabled = isLoading;
    button.classList.toggle('is-loading', isLoading);
    const label = button.querySelector('span');
    if (label) label.textContent = isLoading ? text : this.getAttribute('label') || label.textContent;
  }
}

customElements.define('ui-button', UiButton);
