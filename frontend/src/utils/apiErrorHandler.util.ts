import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

export interface CustomApiError {
  status?: number;
  message: string;
  details?: string[];
}

export function handleApiError(error: AxiosError<ApiErrorResponse>): CustomApiError {
  console.error('API error:', error);
  const status = error.response?.status;
  const message = error.response?.data?.message || error.response?.data?.errors?.join(', ') || 'Lỗi không xác định';
  const details = error.response?.data?.errors;
  return { status, message, details };
}