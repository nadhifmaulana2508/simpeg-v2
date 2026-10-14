class UiSelect extends HTMLElement {
  connectedCallback() {
    const options = this.innerHTML;
    const name = this.getAttribute('name') || '';
    const label = this.getAttribute('label') || name;
    const hint = this.getAttribute('hint') || '';
    const id = `select-${name || 'input'}-${Math.random().toString(36).slice(2, 7)}`;

    this.innerHTML = `
      <label class="field" for="${id}">
        <span class="field__label">${label}</span>
        <span class="field__control field__control--select">
          <select id="${id}" name="${name}">${options}</select>
          <ui-icon name="chevronDown" size="16"></ui-icon>
        </span>
        ${hint ? `<small class="field__hint">${hint}</small>` : ''}
      </label>
    `;
  }

  get select() {
    return this.querySelector('select');
  }
}

customElements.define('ui-select', UiSelect);
