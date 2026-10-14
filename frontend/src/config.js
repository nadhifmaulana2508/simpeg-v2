// Resolve the API from this module instead of from the current browser URL.
// This keeps the FE working when the project is opened from /dummy/frontend/
// or from another Apache virtual host/path.
const apiDirectory = new URL('../../api/', import.meta.url);

export const API_BASE_URL = apiDirectory.href.replace(/\/$/, '');
export const API_INDEX_URL = new URL('index.php', apiDirectory).href;
