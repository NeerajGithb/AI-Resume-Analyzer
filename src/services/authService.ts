import { http } from '@/lib/httpClient';
import { AuthResponse, SignupData, LoginData, User } from '@/types';

export async function signup(data: SignupData): Promise<AuthResponse> {
  return http.postJson<AuthResponse>('/auth/signup', data, undefined as any);
}

export async function login(data: LoginData): Promise<AuthResponse> {
  return http.postJson<AuthResponse>('/auth/login', data, undefined as any);
}

export async function getCurrentUser(): Promise<User> {
  const response = await http.get<{ success: boolean; data: User }>('/auth/me');
  return response.data;
}

export async function logout(): Promise<void> {
  await http.post('/auth/logout');
}

