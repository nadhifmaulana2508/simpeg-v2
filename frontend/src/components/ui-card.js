class UiCard extends HTMLElement {
  connectedCallback() {
    const content = document.createDocumentFragment();
    while (this.firstChild) content.appendChild(this.firstChild);

    const title = this.getAttribute('title') || '';
    const subtitle = this.getAttribute('subtitle') || '';
    const actions = content.querySelector('[slot="actions"]');
    actions?.removeAttribute('slot');
    this.classList.add('ui-card');

    const header = document.createElement('div');
    header.className = 'ui-card__header';
    header.innerHTML = `
      <div>
        <h2>${title}</h2>
        ${subtitle ? `<p>${subtitle}</p>` : ''}
      </div>
    `;
    if (actions) header.appendChild(actions);

    const body = document.createElement('div');
    body.className = 'ui-card__body';
    body.appendChild(content);
    this.append(header, body);
  }
}

customElements.define('ui-card', UiCard);
