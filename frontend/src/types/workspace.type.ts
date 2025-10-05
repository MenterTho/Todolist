import { UserProfile } from './user.type';
import { Project } from './project.type';

export interface Workspace {
  id: number;
  name: string;
  description?: string;
  ownerId: number;
  owner: UserProfile;
  userWorkspaces: UserWorkspace[];
  projects: Project[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface UserWorkspace {
  userId: number;
  workspaceId: number;
  user: UserProfile;
  role: 'owner' | 'management' | 'member';
  isDeleted: boolean;
  joinedAt: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
}

export interface InviteUserRequest {
  email: string;
  role: 'member';
}

export interface UpdateMemberRoleRequest {
  memberId: number;
  role: 'management' | 'member';
}

export interface RemoveMemberRequest {
  workspaceId: number;
  memberId: number;
}