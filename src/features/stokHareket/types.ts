import { HareketTipi } from '../../types/enums';

export interface StokHareketDto {
  id?: number;
  hareketTipi: HareketTipi;
  stokKartId: number;
  stokKodu?: string;
  stokAdi?: string;
  depoId: number;
  depoAdi?: string;
  miktar: number;
  birimFiyat?: number;
  toplamTutar?: number;
  tarih: string;
  aciklama?: string;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}
