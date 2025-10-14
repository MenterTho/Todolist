import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createProject, getProject, getProjectsByWorkspace, getUserProjects, updateProject, deleteProject } from '@/services/project.service';
import { CreateProjectRequest, UpdateProjectRequest, ProjectResponse, ProjectsResponse,DeleteProjectResponse } from '@/types/project.type';
import { CustomApiError } from '@/utils/apiErrorHandler.util';
import { useAuth } from './useAuth.hook';

export function useProjects(workspaceId: number) {
  const { isAuthenticated } = useAuth();
  return useQuery<ProjectsResponse['data'], CustomApiError>({
    queryKey: ['projects', workspaceId],
    queryFn: () => getProjectsByWorkspace(workspaceId),
    enabled: !!workspaceId && isAuthenticated,
  });
}

export function useUserProjects(skip = 0, take = 10) {
  const { isAuthenticated } = useAuth();
  return useQuery<ProjectsResponse['data'], CustomApiError>({
    queryKey: ['userProjects', skip, take],
    queryFn: () => getUserProjects(skip, take),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData, // holding data when change page
  });
}

export function useProject(projectId: number) {
  const { isAuthenticated } = useAuth();
  return useQuery<ProjectResponse['data'], CustomApiError>({
    queryKey: ['project', projectId],
    queryFn: () => getProject(projectId),
    enabled: !!projectId && isAuthenticated,
  });
}

export function useProjectMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createProjectMutation = useMutation<ProjectResponse['data'], CustomApiError, CreateProjectRequest>({
    mutationFn: createProject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects', data.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
      toast.success('Tạo dự án thành công!');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || 'Tạo dự án thất bại');
    },
  });

  const updateProjectMutation = useMutation<ProjectResponse['data'], CustomApiError, { projectId: number; data: UpdateProjectRequest }>({
    mutationFn: ({ projectId, data }) => updateProject(projectId, data),
    onSuccess: (data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects', data.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
      toast.success('Cập nhật dự án thành công!');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || 'Cập nhật dự án thất bại');
    },
  });

  const deleteProjectMutation = useMutation<DeleteProjectResponse, CustomApiError, number>({
    mutationFn: deleteProject,
    onSuccess: (response, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
      toast.success(response.message || 'Xóa dự án thành công!');
      router.push('/workspace');
    },
    onError: (error) => {
      toast.error(error.message || 'Xóa dự án thất bại');
    },
  });

  return {
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    isLoading: createProjectMutation.isPending || updateProjectMutation.isPending || deleteProjectMutation.isPending,
  };
}