export interface UserProfile {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: 'admin'| 'member';
  isActive: boolean;
  createdAt: string;
}

export interface UpdateProfileDto {
  name?: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

export interface UpdateRoleDto {
  role: 'admin'|'member';
}