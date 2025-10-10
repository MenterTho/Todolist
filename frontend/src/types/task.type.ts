import { UserProfile } from './user.type';
import { Project } from './project.type';
import { Comment } from './comment.type';
import { GenericResponse, GenericDeleteResponse } from '@/utils/common.type';

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  priority?: TaskPriority;
  projectId: number;
  assigneeId?: number;
  creatorId: number;
  assignee?: UserProfile;
  creator: UserProfile;
  project: Project;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  priority?: TaskPriority;
  assigneeId?: number;
  projectId: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  priority?: TaskPriority;
  assigneeId?: number;
}

export type TaskResponse = GenericResponse<Task>;
export type TasksResponse = GenericResponse<Task[]>;
export type DeleteTaskResponse = GenericDeleteResponse;