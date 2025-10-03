import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login, logout, register, updateFcmToken, forgotPassword, resetPassword } from '@/services/auth.service';
import { getProfile, deleteAccount } from '@/services/user.service';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { LoginRequest, RegisterRequest, LoginResponse } from '@/types/auth.type';
import type { UserProfile } from '@/types/user.type';
import { CustomApiError } from '@/utils/apiErrorHandler.util';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAuthenticated(!!localStorage.getItem('accessToken'));
    }
  }, []);

  const { data: profile, error: profileError } = useQuery<UserProfile, CustomApiError>({
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
      setIsAuthenticated(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('csrfToken');
      }
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
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      router.push('/dashboard');
    },
    onError: (error) => {
      console.error('Login mutation error:', error);
      throw error;
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ data, file }: { data: RegisterRequest; file?: File }) => register(data, file),
    onSuccess: () => {
      router.push('/login');
    },
    onError: (error: CustomApiError) => {
      console.error('Register mutation error:', error);
      throw error;
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
      router.push('/login');
      throw error;
    },
  });

  const updateFcmTokenMutation = useMutation({
    mutationFn: updateFcmToken,
    onError: (error: CustomApiError) => {
      console.error('Update FCM token mutation error:', error);
      throw error;
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      router.push('/login');
    },
    onError: (error: CustomApiError) => {
      console.error('Forgot password mutation error:', error);
      throw error;
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) => resetPassword(token, password),
    onSuccess: () => {
      router.push('/login');
    },
    onError: (error: CustomApiError) => {
      console.error('Reset password mutation error:', error);
      throw error;
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
      router.push('/login');
      throw error;
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
    error: loginMutation.error || registerMutation.error || logoutMutation.error || forgotPasswordMutation.error || resetPasswordMutation.error || deleteAccountMutation.error,
    setUser,
    setIsAuthenticated,
  };
}