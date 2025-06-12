// services/repairRequestService.ts
import api from './api';
import { RepairRequest } from '@/types';

export const getRepairRequests = async (
  blockId?: string,
  apartmentId?: string
): Promise<RepairRequest[]> => {
  const params = new URLSearchParams();
  if (blockId) params.append('blockId', blockId);
  if (apartmentId) params.append('apartmentId', apartmentId);
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await api.get<RepairRequest[]>(`/repair-requests${query}`);
  return res.data;
};

export const createRepairRequest = async (
  data: Omit<RepairRequest, 'id' | 'createdAt' | 'tenantName'>
): Promise<RepairRequest> => {
  const res = await api.post<RepairRequest>('/repair-requests', data);
  return res.data;
};

export const updateRepairRequest = async (
  id: string,
  data: Partial<Omit<RepairRequest, 'id' | 'createdAt' | 'tenantName'>>
): Promise<RepairRequest> => {
  const res = await api.put<RepairRequest>(`/repair-requests/${id}`, data);
  return res.data;
};
