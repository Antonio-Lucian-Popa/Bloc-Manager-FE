// services/apartmentService.ts
import api from './api';
import { Apartment } from '@/types';

export const getApartments = async (blockId?: string): Promise<Apartment[]> => {
  const query = blockId ? `?blockId=${blockId}` : '';
  const res = await api.get<Apartment[]>(`/apartments${query}`);
  return res.data;
};

export const createApartment = async (
  blockId: string,
  data: Omit<Apartment, 'id' | 'createdAt' | 'blockName' | 'ownerName'>
): Promise<Apartment> => {
  const res = await api.post<Apartment>(`/blocks/${blockId}/apartments`, data);
  return res.data;
};

export const getApartment = async (id: string): Promise<Apartment> => {
  const res = await api.get<Apartment>(`/apartments/${id}`);
  return res.data;
};
