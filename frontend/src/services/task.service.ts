import api from '@/lib/axios.lib';
import { AxiosResponse, AxiosError } from 'axios';
import { CreateTaskRequest, UpdateTaskRequest, TaskResponse, TasksResponse, DeleteTaskResponse } from '@/types/task.type';
import { handleApiError, CustomApiError, ApiErrorResponse } from '@/utils/apiErrorHandler.util';

export async function createTask(data: CreateTaskRequest): Promise<TaskResponse['data']> {
  try {
    const response: AxiosResponse<TaskResponse> = await api.post('/task/create', data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function getTask(taskId: number): Promise<TaskResponse['data']> {
  try {
    const response: AxiosResponse<TaskResponse> = await api.get(`/task/${taskId}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}
export async function getAllTasks(): Promise<TasksResponse['data']> {
  try {
    const response: AxiosResponse<TasksResponse> = await api.get('/task');
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}
export async function getTasksByProject(projectId: number): Promise<TasksResponse['data']> {
  try {
    const response: AxiosResponse<TasksResponse> = await api.get(`/task/project/${projectId}/tasks`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function updateTask(taskId: number, data: UpdateTaskRequest): Promise<TaskResponse['data']> {
  try {
    const response: AxiosResponse<TaskResponse> = await api.put(`/task/${taskId}`, data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function deleteTask(taskId: number): Promise<DeleteTaskResponse> {
  try {
    const response: AxiosResponse<DeleteTaskResponse> = await api.delete(`/task/${taskId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}