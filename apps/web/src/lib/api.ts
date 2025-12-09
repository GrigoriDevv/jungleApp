import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

export const api = axios.create({
  baseURL: import.meta.env['VITE_API_URL'] || 'http://localhost:3001/api',
  withCredentials: true,
});

/// Interceptor de request: adiciona Bearer token
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Interceptor de response: refresh token automático em 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      await useAuthStore.getState().refresh()
      return api(originalRequest)
    }

    return Promise.reject(error)
  },
)

export default api 