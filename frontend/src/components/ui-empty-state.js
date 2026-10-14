class UiEmptyState extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || 'Belum ada data';
    const message = this.getAttribute('message') || 'Data yang kamu cari belum tersedia.';
    const icon = this.getAttribute('icon') || 'file';
    const action = this.getAttribute('action-label');

    this.classList.add('empty-state');
    this.innerHTML = `
      <span class="empty-state__icon"><ui-icon name="${icon}" size="24"></ui-icon></span>
      <h3>${title}</h3>
      <p>${message}</p>
      ${action ? `<button class="button button--secondary" type="button" data-empty-action>${action}</button>` : ''}
    `;
    this.querySelector('[data-empty-action]')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('empty-action', { bubbles: true }));
    });
  }
}

customElements.define('ui-empty-state', UiEmptyState);
