// services/userService.ts
import api from './api';
import { Role, User } from '@/types';

export const inviteUser = async (data: {
  email: string;
  role: Role;
  blockId: string | null;
}, associationId: string): Promise<void> => {
  await api.post(`/associations/${associationId}/invite`, data);
};

export const getUsers = async (associationId: string): Promise<User[]> => {
  const res = await api.get<User[]>(`/associations/users/${associationId}`);
  return res.data;
};
