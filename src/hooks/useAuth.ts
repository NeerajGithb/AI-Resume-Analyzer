import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login, signup, logout } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import type { LoginData, SignupData } from '@/types';

export function useAuth() {
  const router = useRouter();
  const { setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => login(data),
    onSuccess: (user) => {
      setAuth(user);
      router.push('/analyze');
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: SignupData) => signup(data),
    onSuccess: (user) => {
      setAuth(user);
      router.push('/analyze');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      router.push('/');
    },
  });

  return {
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
  };
}