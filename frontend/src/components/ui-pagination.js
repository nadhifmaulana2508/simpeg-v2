class UiPagination extends HTMLElement {
  connectedCallback() {
    this.current = Number(this.getAttribute('current') || 1);
    this.total = Number(this.getAttribute('total') || 1);
    this.render();
  }

  setPage(page) {
    this.current = Math.max(1, Math.min(this.total, page));
    this.render();
    this.dispatchEvent(new CustomEvent('page-change', { bubbles: true, detail: { page: this.current } }));
  }

  render() {
    this.innerHTML = `
      <nav class="pagination" aria-label="Pagination">
        <button class="icon-button icon-button--small" data-page="${this.current - 1}" ${this.current <= 1 ? 'disabled' : ''} aria-label="Halaman sebelumnya"><ui-icon name="chevronLeft" size="16"></ui-icon></button>
        <span>Halaman <strong>${this.current}</strong> dari ${this.total}</span>
        <button class="icon-button icon-button--small" data-page="${this.current + 1}" ${this.current >= this.total ? 'disabled' : ''} aria-label="Halaman berikutnya"><ui-icon name="chevronRight" size="16"></ui-icon></button>
      </nav>
    `;
    this.querySelectorAll('[data-page]').forEach((button) => button.addEventListener('click', () => this.setPage(Number(button.dataset.page))));
  }
}

customElements.define('ui-pagination', UiPagination);
