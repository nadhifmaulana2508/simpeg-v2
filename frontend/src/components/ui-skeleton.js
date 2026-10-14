class UiSkeleton extends HTMLElement {
  connectedCallback() {
    const lines = Math.max(1, Number(this.getAttribute('lines') || 3));
    const variant = this.getAttribute('variant') || 'text';
    this.classList.add('skeleton-group', `skeleton-group--${variant}`);
    this.innerHTML = Array.from({ length: lines }, (_, index) => `<span class="skeleton skeleton--${variant}" style="--skeleton-index:${index}"></span>`).join('');
  }
}

customElements.define('ui-skeleton', UiSkeleton);
