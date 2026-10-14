class UiDataTable extends HTMLElement {
  constructor() {
    super();
    this._columns = [];
    this._rows = [];
  }

  connectedCallback() {
    this.render();
  }

  set columns(value) {
    this._columns = Array.isArray(value) ? value : [];
    this.render();
  }

  get columns() {
    return this._columns;
  }

  set data(value) {
    this._rows = Array.isArray(value) ? value : [];
    this.render();
  }

  get data() {
    return this._rows;
  }

  render() {
    if (!this.isConnected) return;
    if (this.hasAttribute('loading')) {
      this.innerHTML = '<div class="table-loading"><span class="spinner"></span> Memuat data...</div>';
      return;
    }

    const table = document.createElement('table');
    table.className = 'data-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    this.columns.forEach((column) => {
      const cell = document.createElement('th');
      cell.textContent = column.label;
      headerRow.appendChild(cell);
    });
    thead.appendChild(headerRow);

    const tbody = document.createElement('tbody');
    if (this.data.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = Math.max(this.columns.length, 1);
      cell.className = 'data-table__empty';
      cell.textContent = this.getAttribute('empty-text') || 'Belum ada data untuk ditampilkan.';
      row.appendChild(cell);
      tbody.appendChild(row);
    } else {
      this.data.forEach((item) => {
        const row = document.createElement('tr');
        this.columns.forEach((column) => {
          const cell = document.createElement('td');
          cell.dataset.label = column.label;
          const value = column.render ? column.render(item) : item[column.key];
          if (value instanceof Node) cell.appendChild(value);
          else cell.textContent = value === null || value === undefined || value === '' ? '-' : value;
          row.appendChild(cell);
        });
        tbody.appendChild(row);
      });
    }

    table.append(thead, tbody);
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrap';
    wrapper.appendChild(table);
    this.replaceChildren(wrapper);
  }
}

customElements.define('ui-data-table', UiDataTable);
