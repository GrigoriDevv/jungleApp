import axios from 'axios';
import { useAuthStore } from '../stores/authStore.ts';
import { useToast } from '@/components/ui/sonner';

const api = axios.create({
  baseURL: '/api', // Assuming gateway is proxied or same origin
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post('/auth/refresh', { refreshToken: useAuthStore.getState().refreshToken });
        useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        useToast({ title: 'Session expired', description: 'Please login again.', variant: 'destructive' });
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;