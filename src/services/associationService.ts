// services/associationService.ts

import { CreateAssociations } from "@/types";
import api from "./api";


export const getAssociations = async () => {
  const res = await api.get('/associations');
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
