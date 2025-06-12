// services/userService.ts
import api from './api';
import { User } from '@/types';

export const inviteUser = async (data: {
  email: string;
  role: User['role'];
  blockId?: string;
  associationId?: string;
}): Promise<void> => {
  await api.post('/user-roles/invite', data);
};

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get<User[]>('/users');
  return res.data;
};
