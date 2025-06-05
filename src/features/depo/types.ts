export interface DepoDto {
  id?: number;
  depoKodu: string;
  depoAdi: string;
  sorumlu?: string;
  aktif?: boolean;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}
