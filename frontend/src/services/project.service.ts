import api from '@/lib/axios.lib';
import { AxiosResponse, AxiosError } from 'axios';
import { CreateProjectRequest, UpdateProjectRequest, ProjectResponse, ProjectsResponse, DeleteProjectResponse } from '@/types/project.type';
import { handleApiError, CustomApiError, ApiErrorResponse } from '@/utils/apiErrorHandler.util';

export async function createProject(data: CreateProjectRequest): Promise<ProjectResponse['data']> {
  try {
    const response: AxiosResponse<ProjectResponse> = await api.post('/project/create', data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function getProject(projectId: number): Promise<ProjectResponse['data']> {
  try {
    const response: AxiosResponse<ProjectResponse> = await api.get(`/project/${projectId}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}
export async function getUserProjects(skip = 0, take = 10): Promise<ProjectsResponse['data']> {
  try {
    const response: AxiosResponse<ProjectsResponse> = await api.get(`/project/user`, {
      params: { skip, take },
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}
export async function getProjectsByWorkspace(workspaceId: number): Promise<ProjectsResponse['data']> {
  try {
    const response: AxiosResponse<ProjectsResponse> = await api.get(`/project/workspace/${workspaceId}/projects`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function updateProject(projectId: number, data: UpdateProjectRequest): Promise<ProjectResponse['data']> {
  try {
    const response: AxiosResponse<ProjectResponse> = await api.put(`/project/${projectId}`, data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function deleteProject(projectId: number): Promise<DeleteProjectResponse> {
  try {
    const response: AxiosResponse<DeleteProjectResponse> = await api.delete(`/project/${projectId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}