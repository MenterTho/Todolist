import api from '@/lib/axios.lib';
import { AxiosResponse, AxiosError } from 'axios';
import {
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  LoginResponse,
  LogoutResponse,
  UpdateFcmTokenRequest,
  UpdateFcmTokenResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@/types/auth.type';
import { handleApiError, CustomApiError, ApiErrorResponse } from '@/utils/apiErrorHandler.util';

export async function login(data: LoginRequest): Promise<LoginResponse['data']> {
  try {
    const response: AxiosResponse<LoginResponse> = await api.post('/auth/login', data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
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
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function logout(): Promise<LogoutResponse> {
  try {
    const response: AxiosResponse<LogoutResponse> = await api.post('/auth/logout', {
      csrfToken: localStorage.getItem('csrfToken'),
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function updateFcmToken(data: UpdateFcmTokenRequest): Promise<UpdateFcmTokenResponse> {
  try {
    const response: AxiosResponse<UpdateFcmTokenResponse> = await api.put('/auth/fcm-token', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  try {
    const response: AxiosResponse<ForgotPasswordResponse> = await api.post('/auth/forgot-password', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  try {
    const response: AxiosResponse<ResetPasswordResponse> = await api.post('/auth/reset-password', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}