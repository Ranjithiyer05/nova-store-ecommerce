import axios from 'axios';

// Create a configured Axios instance
// Uses VITE_API_URL if defined (in production), otherwise falls back to localhost:5000/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Request Interceptor: Automatically attach JWT token to every request if user is logged in
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (err) {
        console.error('Failed to parse userInfo token from localStorage', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
