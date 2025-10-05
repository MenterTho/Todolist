import api from '@/lib/axios.lib';
import { AxiosResponse, AxiosError } from 'axios';
import { Workspace, CreateWorkspaceRequest, UpdateWorkspaceRequest, InviteUserRequest, UpdateMemberRoleRequest, RemoveMemberRequest, UserWorkspace } from '@/types/workspace.type';
import { handleApiError, CustomApiError, ApiErrorResponse } from '@/utils/apiErrorHandler.util';

export async function getWorkspaces(): Promise<Workspace[]> {
  try {
    const response: AxiosResponse<{ success: boolean; message: string; data: Workspace[] }> = await api.get('/workspace/list');
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function getWorkspace(id: number): Promise<Workspace> {
  try {
    const response: AxiosResponse<{ success: boolean; message: string; data: Workspace }> = await api.get(`/workspace/${id}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function createWorkspace(data: CreateWorkspaceRequest): Promise<Workspace> {
  try {
    const response: AxiosResponse<{ success: boolean; message: string; data: Workspace }> = await api.post('/workspace/create', data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function updateWorkspace(id: number, data: UpdateWorkspaceRequest): Promise<Workspace> {
  try {
    const response: AxiosResponse<{ success: boolean; message: string; data: Workspace }> = await api.put(`/workspace/${id}`, data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function deleteWorkspace(id: number): Promise<{ message: string }> {
  try {
    const response: AxiosResponse<{ success: boolean; message: string; data: null }> = await api.delete(`/workspace/${id}`);
    return { message: response.data.message };
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function inviteUser(workspaceId: number, data: InviteUserRequest): Promise<{ message: string }> {
  try {
    const response: AxiosResponse<{ success: boolean; message: string; data: null }> = await api.post(`/userworkspace/${workspaceId}/invite`, data);
    return { message: response.data.message };
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function updateMemberRole(workspaceId: number, data: UpdateMemberRoleRequest): Promise<UserWorkspace> {
  try {
    const response: AxiosResponse<{ success: boolean; message: string; data: UserWorkspace }> = await api.patch(`/userworkspace/${workspaceId}/update-member-role`, data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function removeMember({ workspaceId, memberId }: RemoveMemberRequest): Promise<{ message: string }> {
  try {
    const response: AxiosResponse<{ success: boolean; message: string; data: null }> = await api.delete(`/userworkspace/${workspaceId}/remove-member/${memberId}`);
    return { message: response.data.message };
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}

export async function listMembers(workspaceId: number): Promise<UserWorkspace[]> {
  try {
    const response: AxiosResponse<{ success: boolean; message: string; data: UserWorkspace[] }> = await api.get(`/userworkspace/${workspaceId}/members`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
}