import axiosInstance from '../../api/axiosInstance';
import { StokHareketDto } from './types';
import { HareketTipi } from '../../types/enums';

const BASE_URL = '/stok-hareket';

export const getAllHareketler = async (): Promise<StokHareketDto[]> => {
  const res = await axiosInstance.get(BASE_URL);
  return res.data;
};

export const getById = async (id: number): Promise<StokHareketDto> => {
  const res = await axiosInstance.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const createHareket = async (dto: StokHareketDto): Promise<StokHareketDto> => {
  const res = await axiosInstance.post(BASE_URL, dto);
  return res.data;
};

export const updateHareket = async (id: number, dto: StokHareketDto): Promise<StokHareketDto> => {
  const res = await axiosInstance.put(`${BASE_URL}/${id}`, dto);
  return res.data;
};

export const deleteHareket = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${BASE_URL}/${id}`);
};

export const getByHareketTipi = async (tip: HareketTipi): Promise<StokHareketDto[]> => {
  const res = await axiosInstance.get(`${BASE_URL}/by-tip/${tip}`);
  return res.data;
};
