import api from '@/lib/axios.lib';
import { AxiosResponse, AxiosError } from 'axios';
import { CreateProjectRequest, UpdateProjectRequest, ProjectResponse, ProjectsResponse, DeleteProjectResponse } from '@/types/project.type';
import { handleApiError, CustomApiError, ApiErrorResponse } from '@/utils/apiErrorHandler.util';

export async function createProject(data: CreateProjectRequest): Promise<ProjectResponse['data']> {
  try {
    const response: AxiosResponse<ProjectResponse> = await api.post('/projects/create', data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function getProject(projectId: number): Promise<ProjectResponse['data']> {
  try {
    const response: AxiosResponse<ProjectResponse> = await api.get(`/projects/${projectId}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function getProjectsByWorkspace(workspaceId: number): Promise<ProjectsResponse['data']> {
  try {
    const response: AxiosResponse<ProjectsResponse> = await api.get(`/projects/workspace/${workspaceId}/projects`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function updateProject(projectId: number, data: UpdateProjectRequest): Promise<ProjectResponse['data']> {
  try {
    const response: AxiosResponse<ProjectResponse> = await api.put(`/projects/${projectId}`, data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function deleteProject(projectId: number): Promise<DeleteProjectResponse> {
  try {
    const response: AxiosResponse<DeleteProjectResponse> = await api.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}