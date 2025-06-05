export interface ParametreDto {
  id?: number;
  kategori: string;
  parametreKodu: string;
  parametreAdi: string;
  deger: string;
  aciklama?: string;
  aktif?: boolean;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}
