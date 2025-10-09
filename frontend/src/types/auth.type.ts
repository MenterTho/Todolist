export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    csrfToken: string;
    user: {
      id: number;
      email: string;
      name: string;
      role: 'owner' | 'management' | 'member';
    };
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    email: string;
    name: string;
    role: 'owner' | 'management' | 'member';
    avatarUrl?: string;
    phoneNumber?: string;
    createdAt: string;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    csrfToken: string;
    user: {
      id: number;
      email: string;
      name: string;
      role: 'owner' | 'management' | 'member';
    };
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface UpdateFcmTokenRequest {
  fcmToken: string;
}

export interface UpdateFcmTokenResponse {
  success: boolean;
  message: string;
}