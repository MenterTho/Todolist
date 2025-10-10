import { UserWorkspace } from './workspace.type';
import { Task } from './task.type';
import { GenericResponse, GenericDeleteResponse } from '@/utils/common.type';

export interface Project {
  id: number;
  name: string;
  description?: string;
  workspaceId: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  workspace: {
    id: number;
    name: string;
    ownerId: number;
    userWorkspaces: UserWorkspace[];
  };
  tasks: Task[];
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

export type ProjectResponse = GenericResponse<Project>;
export type ProjectsResponse = GenericResponse<Project[]>;
export type DeleteProjectResponse = GenericDeleteResponse;