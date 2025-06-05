import axiosInstance from '../../api/axiosInstance';
import { StokKartDto } from './types';

// Stok kartının aktiflik durumunu güncelle
export const updateStokKartAktifDurum = async (id: number, aktif: boolean): Promise<void> => {
  await axiosInstance.patch(`/stok-kart/${id}/aktif`, { aktif });
};

// Belirli bir stok kartına ait TÜM hareketleri sil
export const deleteAllHareketByStokKartId = async (stokKartId: number): Promise<void> => {
  await axiosInstance.delete(`/stok-hareket/by-stok/${stokKartId}`);
};

const BASE_URL = '/stok-kart';

export const getAllStokKartlar = async (): Promise<StokKartDto[]> => {
  const response = await axiosInstance.get(BASE_URL);
  return response.data;
};

export const getStokKartById = async (id: number): Promise<StokKartDto> => {
  const response = await axiosInstance.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createStokKart = async (data: StokKartDto): Promise<StokKartDto> => {
  const response = await axiosInstance.post(BASE_URL, data);
  return response.data;
};

export const updateStokKart = async (id: number, data: StokKartDto): Promise<StokKartDto> => {
  const response = await axiosInstance.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteStokKart = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${BASE_URL}/${id}`);
};

export const existsByStokKodu = async (stokKodu: string): Promise<boolean> => {
  const response = await axiosInstance.get(`${BASE_URL}/exists/${stokKodu}`);
  return response.data;
};

// Yeni: Stok kartına bağlı hareket var mı kontrolü
export const checkStokHareketExists = async (stokKartId: number): Promise<boolean> => {
  const response = await axiosInstance.get(`/stok-hareket/existsByStokKartId/${stokKartId}`);
  return response.data;
};
