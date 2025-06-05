// src/features/stokKart/stokKartConstants.ts

export const SNACKBAR_MESSAGES = {
  invalidId: 'Geçersiz stok kartı.',
  hareketCheckError: 'Hareket kontrolü sırasında hata oluştu.',
  hareketDeleteError: 'Stok hareketleri silinirken hata oluştu.',
  deleteSuccess: 'Stok kartı ve ilişkili hareketler başarıyla silindi.',
  deleteError: 'Silme işlemi sırasında bir hata oluştu.',
  fetchError: 'Stok kartları yüklenirken bir hata oluştu.',
};

export const DIALOG_MESSAGES = {
  confirmDelete: (row: { stokKodu?: string; stokAdi?: string }) =>
    `"${row.stokKodu ? row.stokKodu + ' - ' : ''}${row.stokAdi ?? ''}" stok kartı silinecektir. Emin misiniz?`,
  confirmDeleteDefault: 'Bu kayıt silinecektir. Emin misiniz?',
  forceDelete: (row: { stokKodu?: string; stokAdi?: string }) =>
    `Bu karta ait hareketler bulunmaktadır. Silmek istediğinizden emin misiniz?\n\n"${row.stokKodu ? row.stokKodu + ' - ' : ''}${row.stokAdi ?? ''}"`,
  forceDeleteDefault: 'Bu karta ait hareketler bulunmaktadır. Silmek istediğinizden emin misiniz?',
};
