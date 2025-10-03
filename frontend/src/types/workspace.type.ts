import { UserProfile } from './user.type';

export interface Workspace {
  id: number;
  name: string;
  description?: string;
  users: UserWorkspace[];
  createdAt: string;
}

export interface UserWorkspace {
  userId: number;
  user: UserProfile;
  role: 'owner' | 'management' | 'member';
  joinedAt: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceRequest {
  id?: number;
  name?: string;
  description?: string;
}

export interface InviteUserRequest {
  email: string;
  role: 'management' | 'member';
}

export interface UpdateMemberRoleRequest {
  memberId: number;
  role: 'management' | 'member';
}

export interface RemoveMemberRequest {
  workspaceId: number;
  memberId: number;
}