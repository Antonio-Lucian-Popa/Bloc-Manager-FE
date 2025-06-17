// services/associationService.ts

import { Association, CreateAssociations } from "@/types";
import api from "./api";


export const getAssociations = async (
  page = 0,
  size = 10,
  search = ''
): Promise<{ content: Association[]; totalElements: number }> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    search,
  });

const res = await api.get<{ content: Association[]; totalElements: number }>(
  `/associations/my?${params.toString()}`
);
  return res.data;
};



export const createAssociation = async (data: CreateAssociations) => {
  const res = await api.post('/associations', data);
  return res.data;
};

export const getAssociation = async (id: string) => {
  const res = await api.get(`/associations/${id}`);
  return res.data;
};
