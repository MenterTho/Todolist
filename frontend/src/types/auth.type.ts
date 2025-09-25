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
      role: string;
      avatarUrl?: string;
      phoneNumber?: string;
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
    role: string;
    avatarUrl?: string;
    phoneNumber?: string;
    createdAt: string;
  };
}