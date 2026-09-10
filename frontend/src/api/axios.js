import axios from 'axios';

// Use live Render URL in production, fallback to localhost in dev
const api = axios.create({
  baseURL: import.meta.env.PROD ? 'https://pg-backend-urxd.onrender.com/api' : 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
