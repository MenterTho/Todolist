import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login, logout, register, updateFcmToken } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { LoginRequest, RegisterRequest, LoginResponse } from '@/types/auth.type';
import { AxiosError } from 'axios';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<LoginResponse['data']['user'] | null>(
    localStorage.getItem('accessToken')
      ? { id: 0, email: '', name: '', role: '', avatarUrl: '' }
      : null
  );

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data.data.user);
      router.push('/dashboard');
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }>;
      throw new Error(err.response?.data?.message || 'Đăng nhập thất bại');
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ data, file }: { data: RegisterRequest; file?: File }) => register(data, file),
    onSuccess: () => {
      router.push('/login');
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }>;
      throw new Error(err.response?.data?.message || 'Đăng ký thất bại');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
      router.push('/login');
    },
  });

  const updateFcmTokenMutation = useMutation({
    mutationFn: updateFcmToken,
    onError: (error: unknown) => {
      const err = error as AxiosError;
      console.error('Error updating FCM token:', err);
    },
  });

  return {
    user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    updateFcmToken: updateFcmTokenMutation.mutate,
    isLoading: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    error: loginMutation.error || registerMutation.error || logoutMutation.error,
  };
}