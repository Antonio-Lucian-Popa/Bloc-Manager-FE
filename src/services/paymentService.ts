// services/paymentService.ts
import api from './api';
import { Payment } from '@/types';

export const getPayments = async ({
  page = 0,
  size = 10,
  search = '',
  associationId,
}: {
  page?: number;
  size?: number;
  search?: string;
  associationId: string;
}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  if (search) params.append('search', search);

  const res = await api.get(`/payments/association/${associationId}?${params.toString()}`);
  return res.data; // returnează obiectul Page<PaymentDto>
};


export const createPayment = async (
  data: Omit<Payment, 'id' | 'paymentDate'>
): Promise<Payment> => {
  const res = await api.post<Payment>('/payments', data);
  return res.data;
};
