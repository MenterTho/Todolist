import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('refreshToken='))
        ?.split('=')[1];
      const csrfToken = localStorage.getItem('csrfToken');
      if (refreshToken && csrfToken) {
        try {
          const response = await api.post('/auth/refresh-token', { refreshToken, csrfToken });
          localStorage.setItem('accessToken', response.data.data.accessToken);
          localStorage.setItem('csrfToken', response.data.data.csrfToken);
          error.config.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
          return api(error.config);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('csrfToken');
          document.cookie = 'refreshToken=; Max-Age=0; path=/;';
          window.location.href = '/login';
        }
      }
    }
    throw error;
  }
);

export default api;