import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createComment, getCommentsByTask, getComment, updateComment, deleteComment } from '@/services/comment.service';
import { CreateCommentRequest, UpdateCommentRequest, CommentResponse, CommentsResponse, DeleteCommentResponse } from '@/types/comment.type';
import { CustomApiError } from '@/utils/apiErrorHandler.util';
import { useAuth } from './useAuth.hook';

export function useCommentsByTask(taskId: number) {
  const { isAuthenticated } = useAuth();
  return useQuery<CommentsResponse['data'], CustomApiError>({
    queryKey: ['comments', taskId],
    queryFn: () => getCommentsByTask(taskId),
    enabled: !!taskId && isAuthenticated,
  });
}

export function useComment(commentId: number) {
  const { isAuthenticated } = useAuth();
  return useQuery<CommentResponse['data'], CustomApiError>({
    queryKey: ['comment', commentId],
    queryFn: () => getComment(commentId),
    enabled: !!commentId && isAuthenticated,
  });
}

export function useCommentMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createCommentMutation = useMutation<CommentResponse['data'], CustomApiError, CreateCommentRequest>({
    mutationFn: (data) => createComment(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.taskId] });
      queryClient.invalidateQueries({ queryKey: ['task', data.taskId] });
      toast.success('Thêm bình luận thành công!');
    },
    onError: (error) => {
      toast.error(error.message || 'Thêm bình luận thất bại');
    },
  });

  const updateCommentMutation = useMutation<CommentResponse['data'], CustomApiError, { commentId: number; data: UpdateCommentRequest }>({
    mutationFn: ({ commentId, data }) => updateComment(commentId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.taskId] });
      queryClient.invalidateQueries({ queryKey: ['task', data.taskId] });
      queryClient.invalidateQueries({ queryKey: ['comment', data.id] });
      toast.success('Cập nhật bình luận thành công!');
    },
    onError: (error) => {
      toast.error(error.message || 'Cập nhật bình luận thất bại');
    },
  });

  const deleteCommentMutation = useMutation<DeleteCommentResponse, CustomApiError, { commentId: number; taskId: number }>({
    mutationFn: ({ commentId }) => deleteComment(commentId),
    onSuccess: (response, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      toast.success(response.message || 'Xóa bình luận thành công!');
    },
    onError: (error) => {
      toast.error(error.message || 'Xóa bình luận thất bại');
    },
  });

  return {
    createComment: createCommentMutation.mutate,
    updateComment: updateCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
    isLoading: createCommentMutation.isPending || updateCommentMutation.isPending || deleteCommentMutation.isPending,
  };
}