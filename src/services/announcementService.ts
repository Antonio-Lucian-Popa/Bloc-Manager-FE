// services/announcementService.ts
import api from './api';
import { Announcement } from '@/types';

export const getAnnouncements = async (blockId?: string): Promise<Announcement[]> => {
  const query = blockId ? `?blockId=${blockId}` : '';
  const res = await api.get<Announcement[]>(`/announcements${query}`);
  return res.data;
};

export const createAnnouncement = async (
  data: Omit<Announcement, 'id' | 'createdAt' | 'authorName' | 'blockName'>
): Promise<Announcement> => {
  const res = await api.post<Announcement>('/announcements', data);
  return res.data;
};
