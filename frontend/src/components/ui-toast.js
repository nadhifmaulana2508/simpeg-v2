class UiToast extends HTMLElement {
  connectedCallback() {
    this.className = 'toast-region';
  }

  show(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    const icon = document.createElement('ui-icon');
    icon.setAttribute('name', type === 'danger' ? 'warning' : type === 'info' ? 'info' : 'check');
    icon.setAttribute('size', '18');
    const text = document.createElement('span');
    text.textContent = message;
    const close = document.createElement('button');
    close.className = 'toast__close';
    close.type = 'button';
    close.setAttribute('aria-label', 'Tutup');
    close.innerHTML = '<ui-icon name="close" size="15"></ui-icon>';
    toast.append(icon, text, close);
    close.addEventListener('click', () => toast.remove());
    this.appendChild(toast);
    window.setTimeout(() => toast.remove(), 4200);
  }
}

customElements.define('ui-toast', UiToast);
