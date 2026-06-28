import axiosInstance from '@/lib/api/baseService';
import type { User } from '@/types';

export interface LoginPayload  { email: string; password: string; }
export interface SignupPayload { name: string;  email: string; password: string; }

export async function login(data: LoginPayload): Promise<User> {
  const res = await axiosInstance.post<User>('/auth/login', data);
  return res.data;
}

export async function signup(data: SignupPayload): Promise<User> {
  const res = await axiosInstance.post<User>('/auth/register', data);
  return res.data;
}

export async function logout(): Promise<void> {
  await axiosInstance.post('/auth/logout');
}

export async function getMe(): Promise<User> {
  const res = await axiosInstance.get<User>('/auth/me');
  return res.data;
}