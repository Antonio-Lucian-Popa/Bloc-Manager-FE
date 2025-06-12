// services/blockService.ts
import api from './api';
import { Block } from '@/types';

export const getBlocks = async (associationId?: string): Promise<Block[]> => {
  const query = associationId ? `?associationId=${associationId}` : '';
  const res = await api.get<Block[]>(`/blocks${query}`);
  return res.data;
};

export const createBlock = async (
  associationId: string,
  data: Omit<Block, 'id' | 'createdAt' | 'associationName' | 'apartmentsCount'>
): Promise<Block> => {
  const res = await api.post<Block>(`/associations/${associationId}/blocks`, data);
  return res.data;
};

export const getBlock = async (id: string): Promise<Block> => {
  const res = await api.get<Block>(`/blocks/${id}`);
  return res.data;
};
