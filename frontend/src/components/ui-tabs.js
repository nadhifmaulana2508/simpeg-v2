class UiTabs extends HTMLElement {
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;

    const content = document.createDocumentFragment();
    while (this.firstChild) content.appendChild(this.firstChild);
    const triggers = [...content.querySelectorAll('[data-tab]')];
    const panels = [...content.querySelectorAll('[data-panel]')];
    const active = this.getAttribute('active') || triggers[0]?.dataset.tab;

    this.classList.add('tabs');
    this.innerHTML = '<div class="tabs__list" role="tablist"></div><div class="tabs__panels"></div>';
    const list = this.querySelector('.tabs__list');
    const panelGroup = this.querySelector('.tabs__panels');

    triggers.forEach((trigger) => {
      const key = trigger.dataset.tab;
      trigger.classList.add('tabs__trigger');
      trigger.setAttribute('type', 'button');
      trigger.setAttribute('role', 'tab');
      trigger.setAttribute('aria-controls', `panel-${key}`);
      trigger.addEventListener('click', () => this.activate(key));
      list.appendChild(trigger);
    });

    panels.forEach((panel) => {
      const key = panel.dataset.panel;
      panel.classList.add('tabs__panel');
      panel.id = `panel-${key}`;
      panel.setAttribute('role', 'tabpanel');
      panelGroup.appendChild(panel);
    });

    this.activate(active);
  }

  activate(key) {
    this.querySelectorAll('[data-tab]').forEach((trigger) => {
      const isActive = trigger.dataset.tab === key;
      trigger.classList.toggle('is-active', isActive);
      trigger.setAttribute('aria-selected', String(isActive));
      trigger.tabIndex = isActive ? 0 : -1;
    });
    this.querySelectorAll('[data-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.panel !== key;
    });
    this.setAttribute('active', key);
    this.dispatchEvent(new CustomEvent('tab-change', { bubbles: true, detail: { key } }));
  }
}

customElements.define('ui-tabs', UiTabs);
