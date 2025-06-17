// services/expenseService.ts
import api from './api';
import { Expense, ApartmentExpense } from '@/types';

export const getExpenses = async (blockId?: string): Promise<Expense[]> => {
  const query = blockId ? `?blockId=${blockId}` : '';
  const res = await api.get<Expense[]>(`/expenses${query}`);
  return res.data;
};

export const getExpensesByAssociation = async (
  associationId: string,
  page = 0,
  size = 10,
  search = ''
): Promise<{ content: Expense[]; totalElements: number }> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    search,
  });

  const res = await api.get(`/expenses/by-association/${associationId}?${params}`);
  return res.data;
};



export const createExpense = async (
  data: Omit<Expense, 'id' | 'createdAt' | 'blockName' | 'status'>
): Promise<Expense> => {
  const res = await api.post<Expense>('/expenses', data);
  return res.data;
};

export const getApartmentExpenses = async (apartmentId: string): Promise<ApartmentExpense[]> => {
  const res = await api.get<ApartmentExpense[]>(`/apartment-expenses?apartmentId=${apartmentId}`);
  return res.data;
};
