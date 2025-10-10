import { UserProfile } from './user.type';
import { Task } from './task.type';
import { GenericResponse, GenericDeleteResponse } from '@/utils/common.type';

export interface Comment {
  id: number;
  content: string;
  taskId: number;
  authorId: number;
  parentId?: number;
  author: UserProfile;
  task: Task;
  parent?: Comment;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface CreateCommentRequest {
  content: string;
  parentId?: number;
  taskId: number;
}

export interface UpdateCommentRequest {
  content: string;
}

export type CommentResponse = GenericResponse<Comment>;
export type CommentsResponse = GenericResponse<Comment[]>;
export type DeleteCommentResponse = GenericDeleteResponse;