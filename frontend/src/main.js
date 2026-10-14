import './components/index.js';
import './pages/component-showcase.js';
import './pages/pegawai-page.js';
import './pages/rest-api-page.js';

const pageMap = {
  overview: {
    tag: 'component-showcase',
    title: 'FE Component Library',
    description: 'Komponen dasar untuk membangun semua halaman SIMPEG dengan pengalaman yang konsisten.',
  },
  pegawai: {
    tag: 'pegawai-page',
    title: 'Data Pegawai',
    description: 'Data pegawai dari REST API dengan filter, loading state, dan table responsive.',
  },
  'rest-api': {
    tag: 'rest-api-page',
    title: 'REST API Center',
    description: 'Catalog dan tester endpoint untuk memastikan backend siap sebelum page FE dimigrasikan.',
  },
};

function renderApp() {
  const key = window.location.hash.replace('#', '') || 'overview';
  const page = pageMap[key] || pageMap.overview;
  document.querySelector('#app').innerHTML = `
    <simpeg-shell
      app-name="SIMPEG"
      page-title="${page.title}"
      page-description="${page.description}">
      <${page.tag}></${page.tag}>
    </simpeg-shell>
  `;
}

renderApp();
window.addEventListener('hashchange', renderApp);
