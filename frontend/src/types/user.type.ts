export interface UpdateProfileDto {
  name?: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

export interface UpdateRoleDto {
  role: 'owner' | 'management' | 'member';
}