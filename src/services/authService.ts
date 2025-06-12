// services/authService.ts

import { User } from '@/types';
import api from './api';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>('/auth/login', { email, password });
  return res.data;
};

export const register = async (
  userData: Omit<User, 'id' | 'createdAt'> & { password: string }
): Promise<User> => {
  const res = await api.post<User>('/auth/register', userData);
  return res.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const res = await api.get<User>('/auth/me');
  return res.data;
};
