class UiStatusBadge extends HTMLElement {
  connectedCallback() {
    const value = this.getAttribute('value') || '-';
    const tone = value.toLowerCase() === 'y' || value.toLowerCase() === 'aktif' ? 'success' : 'neutral';
    this.className = `badge badge--${tone}`;
    this.textContent = value.toLowerCase() === 'y' ? 'Aktif' : value;
  }
}

customElements.define('ui-status-badge', UiStatusBadge);
