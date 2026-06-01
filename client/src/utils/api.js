/**
 * Reads the saved JWT token from localStorage.
 *
 * @returns {string|null} Saved token or null.
 */
export function getToken() {
  return localStorage.getItem('resumeai_token');
}

/**
 * Saves the JWT token and user name in localStorage.
 *
 * @param {string} token - JWT token from the backend.
 * @param {string} name - Logged-in user's display name.
 * @returns {void}
 */
export function saveSession(token, name) {
  localStorage.setItem('resumeai_token', token);
  localStorage.setItem('resumeai_name', name);
}

/**
 * Clears the saved authentication session.
 *
 * @returns {void}
 */
export function clearSession() {
  localStorage.removeItem('resumeai_token');
  localStorage.removeItem('resumeai_name');
}

/**
 * Performs a JSON API request with optional JWT authorization.
 *
 * @param {string} path - API route path.
 * @param {object} options - Fetch options.
 * @returns {Promise<object>} Parsed response JSON.
 */
export async function apiRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(path, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed. Please try again.');
  }

  return data;
}

