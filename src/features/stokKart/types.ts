export interface StokKartDto {
  id?: number;
  stokKodu: string;
  stokAdi: string;
  birim?: string;
  tur?: string;
  kdvOrani?: number;
  aciklama?: string;
  aktif?: boolean;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}
