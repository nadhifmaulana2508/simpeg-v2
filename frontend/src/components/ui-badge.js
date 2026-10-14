class UiBadge extends HTMLElement {
  connectedCallback() {
    const value = this.getAttribute('value') || this.textContent.trim() || '-';
    const tone = this.getAttribute('tone') || (['aktif', 'y', 'success'].includes(value.toLowerCase()) ? 'success' : 'neutral');
    this.className = `badge badge--${tone}`;
    this.textContent = value.toLowerCase() === 'y' ? 'Aktif' : value;
  }
}

customElements.define('ui-badge', UiBadge);
