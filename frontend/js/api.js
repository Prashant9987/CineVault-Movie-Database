// js/api.js - Centralized API configuration & helper functions

const API_BASE = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('cinevault_token');
const getUser = () => JSON.parse(localStorage.getItem('cinevault_user') || 'null');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// ─── Movie API ────────────────────────────────────────────────────
const MovieAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/movies?${query}`).then(handleResponse);
  },
  getById: (id) => fetch(`${API_BASE}/movies/${id}`).then(handleResponse),
  getGenres: () => fetch(`${API_BASE}/movies/genres/list`).then(handleResponse),
  rate: (id, rating) =>
    fetch(`${API_BASE}/movies/${id}/rate`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ rating }),
    }).then(handleResponse),
  create: (data) =>
    fetch(`${API_BASE}/movies`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  update: (id, data) =>
    fetch(`${API_BASE}/movies/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  delete: (id) =>
    fetch(`${API_BASE}/movies/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(handleResponse),
};

// ─── User API ─────────────────────────────────────────────────────
const UserAPI = {
  register: (data) =>
    fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  login: (data) =>
    fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  getProfile: () =>
    fetch(`${API_BASE}/users/profile`, { headers: authHeaders() }).then(handleResponse),
  updateProfile: (data) =>
    fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
};

// ─── Watchlist API ────────────────────────────────────────────────
const WatchlistAPI = {
  getAll: (status) => {
    const query = status ? `?status=${status}` : '';
    return fetch(`${API_BASE}/watchlist${query}`, { headers: authHeaders() }).then(handleResponse);
  },
  add: (movieId, status = 'want_to_watch', notes = '') =>
    fetch(`${API_BASE}/watchlist`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ movieId, status, notes }),
    }).then(handleResponse),
  update: (id, data) =>
    fetch(`${API_BASE}/watchlist/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  remove: (id) =>
    fetch(`${API_BASE}/watchlist/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(handleResponse),
};

// ─── Auth helpers ─────────────────────────────────────────────────
const Auth = {
  login: (token, user) => {
    localStorage.setItem('cinevault_token', token);
    localStorage.setItem('cinevault_user', JSON.stringify(user));
  },
  logout: () => {
    localStorage.removeItem('cinevault_token');
    localStorage.removeItem('cinevault_user');
    window.location.href = '/index.html';
  },
  isLoggedIn: () => !!getToken(),
  getUser,
};
