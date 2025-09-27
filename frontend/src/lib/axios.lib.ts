import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from 'axios';
import { RefreshTokenResponse } from '@/types/auth.type';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ===== Refresh Token Queue =====
let isRefreshing = false;
let failedQueue: Array<(token?: string) => void> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(cb => cb(token || undefined));
  failedQueue = [];
};

// ===== Request Interceptor =====
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Extend AxiosRequestConfig để thêm _retry flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ===== Response Interceptor =====
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError): Promise<AxiosResponse | never> => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh-token'
    ) {
      originalRequest._retry = true;
      const csrfToken = localStorage.getItem('csrfToken');

      if (!csrfToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('csrfToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(resolve => {
          failedQueue.push((token?: string) => {
            if (token && originalRequest) {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            }
          });
        });
      }

      isRefreshing = true;
      try {
        const response: AxiosResponse<RefreshTokenResponse> = await api.post(
          '/auth/refresh-token',
          { csrfToken }
        );

        const { accessToken, csrfToken: newCsrf } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('csrfToken', newCsrf);

        processQueue(null, accessToken);
        isRefreshing = false;

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        localStorage.removeItem('accessToken');
        localStorage.removeItem('csrfToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;