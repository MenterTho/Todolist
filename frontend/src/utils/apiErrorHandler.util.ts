import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

export class CustomApiError extends Error {
  status?: number;
  details?: string[];

  constructor(options: { status?: number; message: string; details?: string[] }) {
    super(options.message);
    this.status = options.status;
    this.details = options.details;
  }
}

export function handleApiError(error: unknown): CustomApiError {
  if (error instanceof AxiosError && error.response) {
    const status = error.response.status;
    const data = error.response.data as ApiErrorResponse;
    const message = data.errors?.join(', ') || data.message || 'Lỗi không xác định';
    const details = data.errors;
    return new CustomApiError({ status, message, details });
  }

  console.error('Non-Axios error:', error);
  return new CustomApiError({
    message: error instanceof Error ? error.message : 'Lỗi không xác định',
    details: undefined,
  });
}