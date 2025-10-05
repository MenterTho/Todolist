export interface Project {
  id: number;
  name: string;
  description?: string;
  workspaceId: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
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