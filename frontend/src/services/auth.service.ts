import api from '@/lib/axios.lib';
import type { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '@/types/auth.type';

export async function login(data: LoginRequest) {
  const response = await api.post<LoginResponse>('/auth/login', data);
  localStorage.setItem('accessToken', response.data.data.accessToken);
  localStorage.setItem('csrfToken', response.data.data.csrfToken);
  return response.data;
}

export async function register(data: RegisterRequest, file?: File) {
  const formData = new FormData();
  formData.append('email', data.email);
  formData.append('name', data.name);
  formData.append('password', data.password);
  if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
  if (file) formData.append('avatar', file);

  const response = await api.post<RegisterResponse>('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function logout() {
  const refreshToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('refreshToken='))
    ?.split('=')[1];
  const csrfToken = localStorage.getItem('csrfToken');
  if (refreshToken && csrfToken) {
    await api.post('/auth/logout', { refreshToken, csrfToken }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    });
  }
  localStorage.removeItem('accessToken');
  localStorage.removeItem('csrfToken');
  document.cookie = 'refreshToken=; Max-Age=0; path=/;';
}

export async function updateFcmToken(fcmToken: string) {
  const response = await api.put('/auth/fcm-token', { fcmToken }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
  });
  return response.data;
}