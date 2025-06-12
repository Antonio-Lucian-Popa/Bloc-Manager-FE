// services/dashboardService.ts
import api from './api';
import { DashboardStats } from '@/types';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get<DashboardStats>('/dashboard/stats');
  return res.data;
};
