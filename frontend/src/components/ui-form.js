class UiForm extends HTMLElement {
  connectedCallback() {
    const content = document.createDocumentFragment();
    while (this.firstChild) content.appendChild(this.firstChild);

    const form = document.createElement('form');
    form.className = 'ui-form';
    form.noValidate = this.hasAttribute('no-validate');
    form.appendChild(content);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.noValidate && !form.checkValidity()) {
        form.reportValidity();
        return;
      }
      this.dispatchEvent(new CustomEvent('form-submit', {
        bubbles: true,
        detail: { form, data: new FormData(form) },
      }));
    });
    this.appendChild(form);
    this._form = form;
  }

  reset() {
    this._form?.reset();
  }
}

customElements.define('ui-form', UiForm);
