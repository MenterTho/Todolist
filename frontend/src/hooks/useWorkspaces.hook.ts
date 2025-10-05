import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getWorkspaces, getWorkspace, createWorkspace, updateWorkspace, deleteWorkspace, inviteUser, updateMemberRole, removeMember, listMembers } from '@/services/workspace.service';
import { Workspace, CreateWorkspaceRequest, UpdateWorkspaceRequest, InviteUserRequest, UpdateMemberRoleRequest, RemoveMemberRequest, UserWorkspace } from '@/types/workspace.type';
import { CustomApiError } from '@/utils/apiErrorHandler.util';
import { useAuth } from './useAuth.hook';

// Get list workspace
export function useWorkspaces() {
  const { isAuthenticated } = useAuth();
  return useQuery<Workspace[], CustomApiError>({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
    enabled: isAuthenticated,
  });
}

// Get detail workspace
export function useGetWorkspaceQuery(workspaceId: number) {
  const { isAuthenticated } = useAuth();
  return useQuery<Workspace, CustomApiError>({
    queryKey: ['workspace', workspaceId],
    queryFn: () => getWorkspace(workspaceId),
    enabled: !!workspaceId && isAuthenticated,
  });
}

// Get list member into workspace
export function useGetMembersQuery(workspaceId: number) {
  const { isAuthenticated } = useAuth();
  return useQuery<UserWorkspace[], CustomApiError>({
    queryKey: ['workspaceMembers', workspaceId],
    queryFn: () => listMembers(workspaceId),
    enabled: !!workspaceId && isAuthenticated,
  });
}

// Management mutation related to workspace
export function useWorkspaceMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // create
  const createWorkspaceMutation = useMutation<Workspace, CustomApiError, CreateWorkspaceRequest>({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Tạo workspace thành công!');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || 'Tạo workspace thất bại');
    },
  });

  // update workspace
  const updateWorkspaceMutation = useMutation<Workspace, CustomApiError, { id: number; data: UpdateWorkspaceRequest }>({
    mutationFn: ({ id, data }) => updateWorkspace(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', id] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Cập nhật workspace thành công!');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || 'Cập nhật workspace thất bại');
    },
  });

  // Remove workspace
  const deleteWorkspaceMutation = useMutation<{ message: string }, CustomApiError, number>({
    mutationFn: deleteWorkspace,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success(response.message || 'Xóa workspace thành công!');
      router.push('/workspace');
    },
    onError: (error) => {
      toast.error(error.message || 'Xóa workspace thất bại');
    },
  });

  // Invited members
  const inviteUserMutation = useMutation<{ message: string }, CustomApiError, { workspaceId: number; data: InviteUserRequest }>({
    mutationFn: ({ workspaceId, data }) => inviteUser(workspaceId, data),
    onSuccess: (response, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: ['workspaceMembers', workspaceId] });
      toast.success(response.message || 'Mời thành viên thành công!');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || 'Mời thành viên thất bại');
    },
  });

  // Update role members
  const updateMemberRoleMutation = useMutation<UserWorkspace, CustomApiError, { workspaceId: number; data: UpdateMemberRoleRequest }>({
    mutationFn: ({ workspaceId, data }) => updateMemberRole(workspaceId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: ['workspaceMembers', workspaceId] });
      toast.success('Cập nhật vai trò thành công!');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || 'Cập nhật vai trò thất bại');
    },
  });

  // Remove members
  const removeMemberMutation = useMutation<{ message: string }, CustomApiError, RemoveMemberRequest>({
    mutationFn: removeMember,
    onSuccess: (response, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: ['workspaceMembers', workspaceId] });
      toast.success(response.message || 'Xóa thành viên thành công!');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || 'Xóa thành viên thất bại');
    },
  });

  return {
    createWorkspace: createWorkspaceMutation.mutate,
    updateWorkspace: updateWorkspaceMutation.mutate,
    deleteWorkspace: deleteWorkspaceMutation.mutate,
    inviteUser: inviteUserMutation.mutate,
    updateMemberRole: updateMemberRoleMutation.mutate,
    removeMember: removeMemberMutation.mutate,
    isLoading:
      createWorkspaceMutation.isPending ||
      updateWorkspaceMutation.isPending ||
      deleteWorkspaceMutation.isPending ||
      inviteUserMutation.isPending ||
      updateMemberRoleMutation.isPending ||
      removeMemberMutation.isPending,
  };
}