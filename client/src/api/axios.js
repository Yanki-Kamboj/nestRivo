import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Response interceptor for 401 handling
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const isAuthEndpoint = /\/auth\/(?:login|refresh)(?:$|\?)/.test(originalRequest?.url || '');
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        await api.post('/auth/refresh');
        // Update cookie is handled by server; just retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login via context could be handled elsewhere
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
