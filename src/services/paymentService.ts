// services/paymentService.ts
import api from './api';
import { Payment } from '@/types';

export const getPayments = async (apartmentId?: string): Promise<Payment[]> => {
  const query = apartmentId ? `?apartmentId=${apartmentId}` : '';
  const res = await api.get<Payment[]>(`/payments${query}`);
  return res.data;
};

export const createPayment = async (
  data: Omit<Payment, 'id' | 'paymentDate'>
): Promise<Payment> => {
  const res = await api.post<Payment>('/payments', data);
  return res.data;
};
