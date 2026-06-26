import axiosInstance from '@/lib/api/baseService';
import { SignupData, LoginData, User } from '@/types';

interface AuthResponse {
  success: boolean;
  data: { user: User };
}

export async function signup(data: SignupData): Promise<User> {
  const res = await axiosInstance.post<AuthResponse>('/auth/register', data);
  return res.data.data.user;
}

export async function login(data: LoginData): Promise<User> {
  const res = await axiosInstance.post<AuthResponse>('/auth/login', data);
  return res.data.data.user;
}

export async function getCurrentUser(): Promise<User> {
  const res = await axiosInstance.get<AuthResponse>('/auth/me');
  return res.data.data.user;
}

export async function logout(): Promise<void> {
  await axiosInstance.post('/auth/logout');
}