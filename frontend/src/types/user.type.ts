export interface UserProfile {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: 'owner' | 'management' | 'member';
  isActive: boolean;
  createdAt: string;
}

export interface UpdateProfileDto {
  name?: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

export interface UpdateRoleDto {
  role: 'owner' | 'management' | 'member';
}