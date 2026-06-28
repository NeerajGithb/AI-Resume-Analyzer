import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login, signup, logout, getMe } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { queryKeys } from '@/lib/api/queryKeys';
import type { User } from '@/types';

// ─── Current user query ───────────────────────────────────────────────────────
// Used to hydrate authStore on page load and validate the session.

export function useMeQuery() {
  const { setAuth, clearAuth } = useAuthStore();
  return useQuery<User>({
    queryKey: queryKeys.me(),
    queryFn:  async () => {
      const user = await getMe();
      setAuth(user);
      return user;
    },
    retry:     false,
    staleTime: 5 * 60 * 1000, // 5 min — session doesn't change often
  });
}

// ─── Auth mutations ───────────────────────────────────────────────────────────

export function useAuth() {
  const router       = useRouter();
  const qc           = useQueryClient();
  const { setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      setAuth(user);
      qc.setQueryData(queryKeys.me(), user);
      const params = new URLSearchParams(window.location.search);
      router.push(params.get('next') ?? '/analyze');
    },
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (user) => {
      setAuth(user);
      qc.setQueryData(queryKeys.me(), user);
      router.push('/analyze');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      qc.clear(); // Clear all cached server data on logout
      router.push('/');
    },
  });

  return {
    login:         loginMutation.mutate,
    signup:        signupMutation.mutate,
    logout:        logoutMutation.mutate,
    isLoggingIn:   loginMutation.isPending,
    isSigningUp:   signupMutation.isPending,
    isLoggingOut:  logoutMutation.isPending,
    loginError:    loginMutation.error,
    signupError:   signupMutation.error,
  };
}