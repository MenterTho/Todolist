export interface GenericResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface GenericDeleteResponse {
  success: boolean;
  message: string;
  data: null;
}