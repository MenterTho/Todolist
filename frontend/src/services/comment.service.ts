import api from '@/lib/axios.lib';
import { AxiosResponse, AxiosError } from 'axios';
import { CreateCommentRequest, UpdateCommentRequest, CommentResponse, CommentsResponse, DeleteCommentResponse } from '@/types/comment.type';
import { handleApiError, CustomApiError, ApiErrorResponse } from '@/utils/apiErrorHandler.util';

export async function createComment(data: CreateCommentRequest): Promise<CommentResponse['data']> {
  try {
    const response: AxiosResponse<CommentResponse> = await api.post(`/comment/task/${data.taskId}/comment`, {
      content: data.content,
      parentId: data.parentId,
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function getCommentsByTask(taskId: number): Promise<CommentsResponse['data']> {
  try {
    const response: AxiosResponse<CommentsResponse> = await api.get(`/comment/task/${taskId}/comments`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function getComment(commentId: number): Promise<CommentResponse['data']> {
  try {
    const response: AxiosResponse<CommentResponse> = await api.get(`/comment/${commentId}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function updateComment(commentId: number, data: UpdateCommentRequest): Promise<CommentResponse['data']> {
  try {
    const response: AxiosResponse<CommentResponse> = await api.put(`/comment/${commentId}`, data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function deleteComment(commentId: number): Promise<DeleteCommentResponse> {
  try {
    const response: AxiosResponse<DeleteCommentResponse> = await api.delete(`/comment/${commentId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}