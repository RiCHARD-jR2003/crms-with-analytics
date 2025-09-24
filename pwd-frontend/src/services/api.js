// src/services/api.js

// For React Web, we'll use localStorage and a simple API URL
const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Local development server

async function getStoredToken() {
  try {
    const raw = localStorage.getItem('auth.token');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    localStorage.removeItem('auth.token');
    return null;
  }
}

function isFormData(body) {
  return typeof FormData !== 'undefined' && body instanceof FormData;
}

async function request(path, { method = 'GET', headers = {}, body, auth = true } = {}) {
  const token = auth ? await getStoredToken() : null;

  const finalHeaders = { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers };

  // If sending FormData, let React Native handle the Content-Type
  const usingFormData = isFormData(body);
  if (!usingFormData && !finalHeaders['Content-Type']) {
    finalHeaders['Content-Type'] = 'application/json';
  }
  if (usingFormData && finalHeaders['Content-Type']) {
    // Remove any manually set content type for FormData
    delete finalHeaders['Content-Type'];
  }

  try {
    console.log(`Making request to: ${API_BASE_URL}${path}`);
    console.log('Request details:', { method, headers: finalHeaders, body: body ? JSON.stringify(body) : undefined });
    
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: usingFormData ? body : body ? JSON.stringify(body) : undefined,
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'omit', // Don't send credentials for CORS
    });

    console.log(`Response status: ${res.status} ${res.statusText}`);
    console.log(`Response headers:`, Object.fromEntries(res.headers.entries()));

    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch (_) { data = text; }
    
    if (!res.ok) {
      const error = new Error((data && data.message) || res.statusText);
      error.status = res.status;
      error.data = data;
      throw error;
    }
    
    console.log(`Success with URL: ${API_BASE_URL}${path}`);
    return data;
    
  } catch (error) {
    console.error(`Failed with URL ${API_BASE_URL}${path}:`, error.message);
    console.error('Full error object:', error);
    
    // Provide more specific error messages for common issues
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to connect to the server. Please check if the backend server is running on http://127.0.0.1:8000');
    }
    
    throw error;
  }
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
  setToken: (token) => localStorage.setItem('auth.token', JSON.stringify(token)),
  clearToken: () => localStorage.removeItem('auth.token'),
};

export default api;
