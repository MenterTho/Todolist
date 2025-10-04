import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login, logout, register, updateFcmToken, forgotPassword, resetPassword } from '@/services/auth.service';
import { getProfile, deleteAccount } from '@/services/user.service';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { LoginRequest, RegisterRequest, LoginResponse } from '@/types/auth.type';
import type { UserProfile } from '@/types/user.type';
import { CustomApiError } from '@/utils/apiErrorHandler.util';
import toast from 'react-hot-toast';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    typeof window !== 'undefined' && !!localStorage.getItem('accessToken')
  );

  const { data: profile, error: profileError, isLoading: isProfileLoading } = useQuery<UserProfile, CustomApiError>({
    queryKey: ['userProfile'],
    queryFn: getProfile,
    enabled: isAuthenticated,
    retry: 1,
  });

  useEffect(() => {
    if (profile) {
      setUser(profile);
      setIsAuthenticated(true);
    } else if (profileError) {
      setUser(null);
      console.error('Profile error:', {
        status: profileError.status,
        message: profileError.message,
        details: profileError.details,
      });
      toast.error(profileError.details?.join(', ') || profileError.message || 'Lỗi lấy thông tin người dùng');
    }
  }, [profile, profileError]);

  const loginMutation = useMutation<LoginResponse['data'], CustomApiError, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('csrfToken', data.csrfToken);
      }
      setUser(data.user);
      setIsAuthenticated(true);
      console.log('Login success, isAuthenticated:', true);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success("Đăng nhập thành công!");
      router.push('/dashboard');
    },
    onError: (error) => {
      console.error('Login mutation error:', error);
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ data, file }: { data: RegisterRequest; file?: File }) => register(data, file),
    onSuccess: () => {
      toast.success("Đăng ký thành công!");
      router.push('/login');
    },
    onError: (error: CustomApiError) => {
      console.error('Register mutation error:', error);
      toast.error(error.details?.join(', ') || error.message || 'Đăng ký thất bại');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setUser(null);
      setIsAuthenticated(false);
      queryClient.clear();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('csrfToken');
      }
      toast.success("Đăng xuất thành công!");
      router.push('/login');
    },
    onError: (error: CustomApiError) => {
      console.error('Logout mutation error:', error);
      setUser(null);
      setIsAuthenticated(false);
      queryClient.clear();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('csrfToken');
      }
      toast.error(error.details?.join(', ') || error.message || 'Đăng xuất thất bại');
      router.push('/login');
    },
  });

  const updateFcmTokenMutation = useMutation({
    mutationFn: updateFcmToken,
    onError: (error: CustomApiError) => {
      console.error('Update FCM token mutation error:', error);
      toast.error(error.details?.join(', ') || error.message || 'Cập nhật FCM token thất bại');
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("Gửi yêu cầu đặt lại mật khẩu thành công!");
      router.push('/login');
    },
    onError: (error: CustomApiError) => {
      console.error('Forgot password mutation error:', error);
      toast.error(error.details?.join(', ') || error.message || 'Gửi yêu cầu đặt lại mật khẩu thất bại');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) => resetPassword(token, password),
    onSuccess: () => {
      toast.success("Đặt lại mật khẩu thành công!");
      router.push('/login');
    },
    onError: (error: CustomApiError) => {
      console.error('Reset password mutation error:', error);
      toast.error(error.details?.join(', ') || error.message || 'Đặt lại mật khẩu thất bại');
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      setUser(null);
      setIsAuthenticated(false);
      queryClient.clear();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('csrfToken');
      }
      toast.success("Xóa tài khoản thành công!");
      router.push('/login');
    },
    onError: (error: CustomApiError) => {
      console.error('Delete account mutation error:', error);
      setUser(null);
      setIsAuthenticated(false);
      queryClient.clear();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('csrfToken');
      }
      toast.error(error.details?.join(', ') || error.message || 'Xóa tài khoản thất bại');
      router.push('/login');
    },
  });

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    updateFcmToken: updateFcmTokenMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    deleteAccount: deleteAccountMutation.mutate,
    isLoading: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending || forgotPasswordMutation.isPending || resetPasswordMutation.isPending || deleteAccountMutation.isPending,
    isProfileLoading,
    error: loginMutation.error || registerMutation.error || logoutMutation.error || forgotPasswordMutation.error || resetPasswordMutation.error || deleteAccountMutation.error,
    setUser,
    setIsAuthenticated,
  };
}