import axiosInstance from '../../api/axiosInstance';
import { ParametreDto } from './types';

const BASE_URL = '/parametre';

export const getAllParametreler = async (): Promise<ParametreDto[]> => {
  const res = await axiosInstance.get(BASE_URL);
  return res.data;
};

export const getById = async (id: number): Promise<ParametreDto> => {
  const res = await axiosInstance.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const createParametre = async (dto: ParametreDto): Promise<ParametreDto> => {
  const res = await axiosInstance.post(BASE_URL, dto);
  return res.data;
};

export const updateParametre = async (id: number, dto: ParametreDto): Promise<ParametreDto> => {
  const res = await axiosInstance.put(`${BASE_URL}/${id}`, dto);
  return res.data;
};

export const deleteParametre = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${BASE_URL}/${id}`);
};
