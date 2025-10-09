import { UserWorkspace } from './workspace.type';
// import { Task } from './task.type';

export interface Project {
  id: number;
  name: string;
  description?: string;
  workspaceId: number;
  createdAt: string;
  updatedAt: string;
  // tasks?: Task[]; 
  workspace: {
    id: number;
    name: string;
    ownerId: number;
    userWorkspaces: UserWorkspace[];
  };
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  workspaceId: number;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: Project;
}

export interface ProjectsResponse {
  success: boolean;
  message: string;
  data: Project[];
}

export interface DeleteProjectResponse {
  success: boolean;
  message: string;
  data: null;
}