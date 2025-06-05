import axiosInstance from '../../api/axiosInstance';
import { DepoDto } from './types';

const BASE_URL = '/depo';

export const getAllDepolar = async (): Promise<DepoDto[]> => {
  const response = await axiosInstance.get(BASE_URL);
  return response.data;
};

export const getDepoById = async (id: number): Promise<DepoDto> => {
  const response = await axiosInstance.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createDepo = async (data: DepoDto): Promise<DepoDto> => {
  const response = await axiosInstance.post(BASE_URL, data);
  return response.data;
};

export const updateDepo = async (id: number, data: DepoDto): Promise<DepoDto> => {
  const response = await axiosInstance.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteDepo = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${BASE_URL}/${id}`);
};

export const existsByDepoKodu = async (depoKodu: string): Promise<boolean> => {
  const response = await axiosInstance.get(`${BASE_URL}/exists/${depoKodu}`);
  return response.data;
};
