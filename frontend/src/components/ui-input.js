class UiInput extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name') || '';
    const label = this.getAttribute('label') || name;
    const type = this.getAttribute('type') || 'text';
    const placeholder = this.getAttribute('placeholder') || '';
    const value = this.getAttribute('value') || '';
    const hint = this.getAttribute('hint') || '';
    const required = this.hasAttribute('required');
    const id = `field-${name || 'input'}-${Math.random().toString(36).slice(2, 7)}`;

    this.innerHTML = `
      <label class="field" for="${id}">
        <span class="field__label">${label}${required ? ' <em>*</em>' : ''}</span>
        <span class="field__control">
          ${this.getAttribute('icon') ? `<ui-icon name="${this.getAttribute('icon')}" size="16"></ui-icon>` : ''}
          <input id="${id}" name="${name}" type="${type}" value="${value}" placeholder="${placeholder}" ${required ? 'required' : ''}>
        </span>
        ${hint ? `<small class="field__hint">${hint}</small>` : ''}
      </label>
    `;
  }

  get input() {
    return this.querySelector('input');
  }
}

customElements.define('ui-input', UiInput);
