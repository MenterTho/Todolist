import api from '@/lib/axios.lib';
import { AxiosResponse, AxiosError } from 'axios';
import { UpdateProfileDto, UpdateRoleDto } from '@/types/user.type';
import { handleApiError, CustomApiError, ApiErrorResponse } from '@/utils/apiErrorHandler.util';

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: string;
  createdAt?: string; // Giữ tùy chọn để tương thích nếu backend không trả createdAt
}

export interface GetAllUsersResponse {
  users: UserProfile[];
  total: number;
  page: number;
  limit: number;
}

export async function getAllUsers(params: {
  page?: number;
  limit?: number;
  role?: string;
  isActive?: boolean;
  search?: string;
  exact?: boolean;
}): Promise<GetAllUsersResponse> {
  try {
    const response: AxiosResponse<{ success: boolean; message: string; data: GetAllUsersResponse }> = await api.get('/user/getAll', { params });
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError<ApiErrorResponse>).message);
  }
}

export async function getProfile(): Promise<UserProfile> {
  try {
    const response: AxiosResponse<{ success: boolean; message: string; data: UserProfile }> = await api.get('/user/profile');
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError<ApiErrorResponse>).message);
  }
}

export async function updateProfile(data: UpdateProfileDto, avatar?: File): Promise<UserProfile> {
  try {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
    if (avatar) formData.append('avatar', avatar);
    else if (data.avatarUrl) formData.append('avatarUrl', data.avatarUrl);
    const response: AxiosResponse<{ success: boolean; message: string; data: UserProfile }> = await api.put('/user/update-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError<ApiErrorResponse>).message);
  }
}

export async function deleteAccount(): Promise<{ message: string }> {
  try {
    const response: AxiosResponse<{ success: boolean; message: string; data: null }> = await api.delete('/user/delete-account');
    return { message: response.data.message };
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError<ApiErrorResponse>).message);
  }
}

export async function updateRole(userId: number, data: UpdateRoleDto): Promise<UserProfile> {
  try {
    const response: AxiosResponse<{ success: boolean; message: string; data: UserProfile }> = await api.patch(`/user/update-role/${userId}`, data);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError<ApiErrorResponse>).message);
  }
}