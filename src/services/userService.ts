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

export const getUsers = async (
  associationId: string,
  page: number,
  size: number,
  search: string
): Promise<{ content: User[]; totalElements: number }> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    search, // trebuie să existe ca RequestParam în backend
  });

const res = await api.get<{ content: User[]; totalElements: number }>(
  `/associations/users/${associationId}?${params.toString()}`
);
  return res.data;
};

