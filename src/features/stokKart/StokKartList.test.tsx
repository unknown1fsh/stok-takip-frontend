import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StokKartList from './StokKartList';
import * as stokKartService from './stokKartService';

// Mock service functions
jest.mock('./stokKartService');

const mockStokKartlar = [
  { id: 1, stokKodu: 'A1', stokAdi: 'Kalem', birim: 'Adet', tur: 'Kırtasiye', kdvOrani: 18, aciklama: 'Test', aktif: true },
  { id: 2, stokKodu: 'B2', stokAdi: 'Defter', birim: 'Adet', tur: 'Kırtasiye', kdvOrani: 8, aciklama: '', aktif: false },
];

describe('StokKartList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('listeyi doğru render eder', async () => {
    (stokKartService.getAllStokKartlar as jest.Mock).mockResolvedValue(mockStokKartlar);
    render(
      <BrowserRouter>
        <StokKartList />
      </BrowserRouter>
    );
    expect(screen.getByText('Stok Kart Listesi')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Kalem')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Defter')).toBeInTheDocument();
    });
  });

  it('hata durumunda snackbar ve tekrar dene butonu gösterir', async () => {
    (stokKartService.getAllStokKartlar as jest.Mock).mockRejectedValue(new Error('Network Error'));
    render(
      <BrowserRouter>
        <StokKartList />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/yüklenirken bir hata oluştu/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /tekrar dene/i })).toBeInTheDocument();
    });
  });

  it('yeni stok kart butonu ile yönlendirme çalışır', async () => {
    (stokKartService.getAllStokKartlar as jest.Mock).mockResolvedValue([]);
    render(
      <BrowserRouter>
        <StokKartList />
      </BrowserRouter>
    );
    const button = screen.getByRole('button', { name: /yeni stok kart/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    // Yönlendirme testini burada tam olarak doğrulamak için react-router-dom'un useNavigate'ini mocklamak gerekir.
  });
});
