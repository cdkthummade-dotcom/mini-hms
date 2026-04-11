import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: {
    'Accept-Encoding': 'gzip',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Strip /api prefix if baseURL already ends with /api
api.interceptors.request.use((config) => {
  if (config.baseURL && config.baseURL.endsWith('/api') && config.url?.startsWith('/api/')) {
    config.url = config.url.replace('/api/', '/');
  }
  return config;
});

// Global 401 handler — redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    if (err.response?.status === 401 && window.location.pathname !== `${base}/login`) {
      window.location.href = `${base}/login`;
    }
    return Promise.reject(err);
  },
);

export default api;
