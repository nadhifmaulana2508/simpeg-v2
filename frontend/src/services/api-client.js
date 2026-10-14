import { API_BASE_URL, API_INDEX_URL } from '../config.js';

function splitPath(path) {
  const cleanPath = String(path || '').replace(/^\/+/, '');
  const separator = cleanPath.indexOf('?');
  return separator === -1
    ? { route: cleanPath, pathQuery: new URLSearchParams() }
    : {
        route: cleanPath.slice(0, separator),
        pathQuery: new URLSearchParams(cleanPath.slice(separator + 1)),
      };
}

function makeQuery(params, pathQuery) {
  const query = new URLSearchParams(pathQuery);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });
  return query;
}

async function readResponse(response, startedAt) {
  const raw = await response.text();
  const contentType = response.headers.get('content-type') || '';
  let payload;
  let json = true;

  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch (error) {
    json = false;
    const legacyPhpError = /Unsupported declare|Parse error|Fatal error|PHP Warning/i.test(raw);
    payload = {
      success: false,
      message: legacyPhpError
        ? 'Runtime API masih PHP lama. Jalankan project dengan PHP 8.2+ agar REST API dapat mengembalikan JSON.'
        : 'Response API bukan JSON yang valid.',
    };
  }

  return {
    payload,
    status: response.status,
    ok: response.ok && payload.success !== false,
    json,
    contentType,
    duration: Math.round(performance.now() - startedAt),
  };
}

export async function apiRequest(path, options = {}) {
  const { method = 'GET', params = {}, body, headers = {} } = options;
  const { route, pathQuery } = splitPath(path);
  const query = makeQuery(params, pathQuery);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  };
  const request = {
    method,
    credentials: 'same-origin',
    headers: requestHeaders,
  };
  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
    request.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const startedAt = performance.now();
  const response = await fetch(`${API_BASE_URL}/${route}${suffix}`, request);
  let result = await readResponse(response, startedAt);

  // PHP's built-in server does not apply the Apache rewrite rules. Retry
  // read-only requests through the front controller in that environment.
  if ((method === 'GET' || method === 'HEAD') && (!result.json || result.status === 404)) {
    const fallbackQuery = new URLSearchParams(query);
    fallbackQuery.set('path', route);
    const fallbackUrl = `${API_INDEX_URL}?${fallbackQuery.toString()}`;
    const fallbackResponse = await fetch(fallbackUrl, request);
    result = await readResponse(fallbackResponse, startedAt);
  }

  return {
    payload: result.payload,
    status: result.status,
    ok: result.ok,
    duration: result.duration,
  };
}

export async function apiGet(path, params = {}) {
  const result = await apiRequest(path, { params });
  if (!result.ok) {
    throw new Error(result.payload.message || 'Permintaan ke API gagal.');
  }

  return result.payload;
}

export async function apiProbe(path, options = {}) {
  try {
    return await apiRequest(path, options);
  } catch (error) {
    return {
      payload: { success: false, message: error.message || 'API tidak dapat dihubungi.' },
      status: 0,
      ok: false,
      duration: 0,
    };
  }
}
