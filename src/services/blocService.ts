// services/blockService.ts
import api from './api';
import { Block } from '@/types';

interface BlockPage {
  content: Block[];
  totalElements: number;
}

export const getBlocks = async (
  associationId: string,
  page = 0,
  size = 10,
  search = ''
): Promise<BlockPage> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    search,
  });

  const res = await api.get<BlockPage>(`/blocks/association/${associationId}?${params.toString()}`);
  return res.data;
};

export const getBlocksList = async (
  associationId: string
): Promise<Block[]> => {

  const res = await api.get<Block[]>(`/blocks/associationList/${associationId}`);
  return res.data;
};


export const createBlock = async (
  associationId: string,
  data: Omit<Block, 'id' | 'createdAt' | 'associationName' | 'apartmentsCount'>
): Promise<Block> => {
  const res = await api.post<Block>(`/blocks/association/${associationId}`, data);
  return res.data;
};

export const getBlock = async (id: string): Promise<Block> => {
  const res = await api.get<Block>(`/blocks/${id}`);
  return res.data;
};
