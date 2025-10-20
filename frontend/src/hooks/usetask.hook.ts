import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createTask, getAllTasks, getTasksByProject, updateTask, deleteTask } from '@/services/task.service';
import { CreateTaskRequest, UpdateTaskRequest, TaskResponse, TasksResponse,DeleteTaskResponse } from '@/types/task.type';
import { CustomApiError } from '@/utils/apiErrorHandler.util';
import { useAuth } from './useAuth.hook';

export function useTasks() {
  const { isAuthenticated } = useAuth();
  return useQuery<TasksResponse['data'], CustomApiError>({
    queryKey: ['tasks'],
    queryFn: getAllTasks,
    enabled: isAuthenticated,
  });
}
export function useTasksByProject(projectId: number) {
  const { isAuthenticated } = useAuth();
  return useQuery<TasksResponse['data'], CustomApiError>({
    queryKey: ['tasks', projectId],
    queryFn: () => getTasksByProject(projectId),
    enabled: !!projectId && isAuthenticated,
  });
}

export function useTaskMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createTaskMutation = useMutation<TaskResponse['data'], CustomApiError, CreateTaskRequest>({
    mutationFn: createTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', data.projectId] });
      toast.success('Tạo nhiệm vụ thành công!');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || 'Tạo nhiệm vụ thất bại');
    },
  });

  const updateTaskMutation = useMutation<TaskResponse['data'], CustomApiError, { taskId: number; data: UpdateTaskRequest }>({
    mutationFn: ({ taskId, data }) => updateTask(taskId, data),
    onSuccess: (data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', data.projectId] });
      toast.success('Cập nhật nhiệm vụ thành công!');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || 'Cập nhật nhiệm vụ thất bại');
    },
  });

  const deleteTaskMutation = useMutation<DeleteTaskResponse, CustomApiError, number>({
    mutationFn: deleteTask,
    onSuccess: (response, taskId) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(response.message || 'Xóa nhiệm vụ thành công!');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || 'Xóa nhiệm vụ thất bại');
    },
  });

  return {
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    isLoading: createTaskMutation.isPending || updateTaskMutation.isPending || deleteTaskMutation.isPending,
  };
}