import { UserProfile } from './user.type';

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
    user: UserProfile;
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
    user: UserProfile;
  };
}