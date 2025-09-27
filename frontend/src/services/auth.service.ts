import api from '@/lib/axios.lib';
import { AxiosResponse , AxiosError } from 'axios';
import { LoginRequest, RegisterRequest, RegisterResponse } from '@/types/auth.type';
import { UserProfile } from './user.service';
import { handleApiError, CustomApiError, ApiErrorResponse } from '@/utils/apiErrorHandler.util';

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    csrfToken: string;
    user: UserProfile;
  };
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response: AxiosResponse<LoginResponse> = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError<ApiErrorResponse>).message);
  }
}

export async function register(data: RegisterRequest, avatar?: File): Promise<RegisterResponse> {
  try {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('name', data.name);
    formData.append('password', data.password);
    if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
    if (avatar) formData.append('avatar', avatar);
    const response: AxiosResponse<RegisterResponse> = await api.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError<ApiErrorResponse>).message);
  }
}

export async function logout(): Promise<{ message: string }> {
  try {
    const response: AxiosResponse<{ success: boolean; message: string; data: null }> = await api.post('/auth/logout', {
      csrfToken: localStorage.getItem('csrfToken'),
    });
    return { message: response.data.message };
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError<ApiErrorResponse>).message);
  }
}

export async function updateFcmToken(fcmToken: string): Promise<{ message: string }> {
  try {
    const response: AxiosResponse<{ success: boolean; message: string }> = await api.put('/auth/fcm-token', { fcmToken });
    return { message: response.data.message };
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError<ApiErrorResponse>).message);
  }
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  try {
    const response: AxiosResponse<{ success: boolean; message: string; data: null }> = await api.post('/auth/forgot-password', { email });
    return { message: response.data.message };
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError<ApiErrorResponse>).message);
  }
}

export async function resetPassword(token: string, password: string): Promise<{ message: string }> {
  try {
    const response: AxiosResponse<{ success: boolean; message: string; data: null }> = await api.post('/auth/reset-password', { token, password });
    return { message: response.data.message };
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError<ApiErrorResponse>).message);
  }
}