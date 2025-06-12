// services/meterReadingService.ts
import api from './api';
import { MeterReading } from '@/types';

export const getMeterReadings = async (apartmentId?: string): Promise<MeterReading[]> => {
  const query = apartmentId ? `?apartmentId=${apartmentId}` : '';
  const res = await api.get<MeterReading[]>(`/meter-readings${query}`);
  return res.data;
};

export const createMeterReading = async (
  data: Omit<MeterReading, 'id' | 'consumption'>
): Promise<MeterReading> => {
  const res = await api.post<MeterReading>('/meter-readings', data);
  return res.data;
};
