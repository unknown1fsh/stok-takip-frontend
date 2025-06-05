import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, IconButton, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getAllStokKartlar } from '../features/stokKart/stokKartService';
import { getAllDepolar } from '../features/depo/depoService';
import { getAllHareketler } from '../features/stokHareket/stokHareketService';
import { getAllParametreler } from '../features/parametre/parametreService';
import { StokHareketDto } from '../features/stokHareket/types';
import { HareketTipi } from '../types/enums';

const DashboardStats: React.FC = () => {
  const [stokKartCount, setStokKartCount] = useState(0);
  const [depoCount, setDepoCount] = useState(0);
  const [parametreCount, setParametreCount] = useState(0);
  const [hareketler, setHareketler] = useState<StokHareketDto[]>([]);
  const [detayOpen, setDetayOpen] = useState(false);

  useEffect(() => {
    getAllStokKartlar().then((data) => setStokKartCount(data.length));
    getAllDepolar().then((data) => setDepoCount(data.length));
    getAllParametreler().then((data) => setParametreCount(data.length));
    getAllHareketler().then((data) => setHareketler(data));
  }, []);

  // Hareket tiplerine göre toplam miktar (artık miktar her zaman tam sayı)
  const hareketTiplerineGore = Object.values(HareketTipi).map((tip) => {
    const toplam = hareketler
      .filter((h) => h.hareketTipi === tip)
      .reduce((acc, h) => acc + (typeof h.miktar === 'number' ? h.miktar : Number(h.miktar) || 0), 0);
    return { tip, toplam: Math.round(toplam) };
  });

  // En çok hareket gören ilk 5 stok kartı
  const topStoklar = Object.entries(
    hareketler.reduce((acc, h) => {
      const key = h.stokAdi || h.stokKodu || 'Bilinmeyen';
      acc[key] = (acc[key] || 0) + (h.miktar || 0);
      return acc;
    }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Son 5 hareket (tarihe göre)
  const last5Hareket = [...hareketler]
    .sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime())
    .slice(0, 5);

  return (
    <Box mb={4}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontFamily: 'Montserrat, Arial, sans-serif',
          fontWeight: 800,
          fontSize: 32,
          letterSpacing: 1,
          color: 'primary.main',
          textShadow: '0 2px 8px #e0e0e0',
        }}
      >
        Özet İstatistikler
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flex: '1 0 200px', minWidth: 200 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1">Stok Kartı</Typography>
            <Typography variant="h4">{stokKartCount}</Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 0 200px', minWidth: 200 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1">Depo</Typography>
            <Typography variant="h4">{depoCount}</Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 0 200px', minWidth: 200 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1">Parametre</Typography>
            <Typography variant="h4">{parametreCount}</Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 0 200px', minWidth: 200 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1">Stok Hareketi</Typography>
            <Typography variant="h4">{hareketler.length}</Typography>
          </Paper>
        </Box>
      </Box>
      <Box mt={4}>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            fontFamily: 'Montserrat, Arial, sans-serif',
            fontWeight: 700,
            fontSize: 22,
            color: '#1976d2',
            letterSpacing: 0.5,
            textShadow: '0 1px 4px #e0e0e0',
          }}
        >
          Hareket Tiplerine Göre Toplam Miktar
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {hareketTiplerineGore.map((item) => (
            <Box key={item.tip} sx={{ flex: '1 0 200px', minWidth: 200 }}>
              <Paper sx={{ p: 2, textAlign: 'center', fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 600, fontSize: 18, letterSpacing: 0.5 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#333', fontFamily: 'Montserrat, Arial, sans-serif' }}>{item.tip}</Typography>
                <Typography sx={{ fontWeight: 900, fontSize: 24, color: '#1976d2', fontFamily: 'Montserrat, Arial, sans-serif' }}>{Number(item.toplam).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</Typography>
              </Paper>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Detay İstatistikler - Ok ile açılır/kapanır */}
      <Box mt={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontWeight: 800,
              fontSize: 28,
              color: '#1976d2',
              letterSpacing: 1,
              textShadow: '0 2px 8px #e0e0e0',
              mr: 1
            }}
          >
            Detay İstatistikler
          </Typography>
          <IconButton
            onClick={() => setDetayOpen((prev) => !prev)}
            sx={{
              transform: detayOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
              bgcolor: '#e3f2fd',
              borderRadius: 2,
              ml: 1
            }}
            size="large"
          >
            <ExpandMoreIcon fontSize="large" />
          </IconButton>
        </Box>
        <Collapse in={detayOpen}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {/* En çok hareket gören ilk 5 stok kartı */}
            <Box sx={{ flex: '1 0 320px', minWidth: 320 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 700, fontSize: 20, color: '#1976d2' }}>En Çok Hareket Gören 5 Stok Kartı</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', fontWeight: 600, mb: 1, px: 1 }}>
                  <span style={{ flex: 1, textAlign: 'center', fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 700 }}>Stok Adı</span>
                  <span style={{ flex: 1, textAlign: 'center', fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 700 }}>İşlem Sayısı</span>
                </Box>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                  {topStoklar.length === 0 ? (
                    <li style={{ textAlign: 'center' }}>Veri yok</li>
                  ) : (
                    topStoklar.map(([ad, toplam]) => (
                      <li key={ad} style={{ display: 'flex', justifyContent: 'center', borderBottom: '1px solid #eee', padding: '2px 8px', fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 500 }}>
                        <span style={{ flex: 1, textAlign: 'center' }}>{ad}</span>
                        <span style={{ flex: 1, textAlign: 'center' }}>{toplam}</span>
                      </li>
                    ))
                  )}
                </ul>
              </Paper>
            </Box>
            {/* Son 5 hareket */}
            <Box sx={{ flex: '1 0 320px', minWidth: 320 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 700, fontSize: 20, color: '#1976d2' }}>Son 5 Hareket</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', fontWeight: 600, mb: 1, px: 1 }}>
                  <span style={{ flex: 2, textAlign: 'center', fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 700 }}>Tarih</span>
                  <span style={{ flex: 2, textAlign: 'center', fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 700 }}>Stok Adı</span>
                  <span style={{ flex: 1, textAlign: 'center', fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 700 }}>Tip</span>
                  <span style={{ flex: 1, textAlign: 'center', fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 700 }}>Miktar</span>
                </Box>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                  {last5Hareket.length === 0 ? (
                    <li style={{ textAlign: 'center' }}>Veri yok</li>
                  ) : (
                    last5Hareket.map((h, i) => (
                      <li key={i} style={{ display: 'flex', justifyContent: 'center', borderBottom: '1px solid #eee', padding: '2px 8px', fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 500 }}>
                        <span style={{ flex: 2, textAlign: 'center' }}>{h.tarih?.toString().slice(0, 19).replace('T', ' ')}</span>
                        <span style={{ flex: 2, textAlign: 'center' }}>{h.stokAdi || h.stokKodu}</span>
                        <span style={{ flex: 1, textAlign: 'center' }}>{h.hareketTipi}</span>
                        <span style={{ flex: 1, textAlign: 'center' }}>{h.miktar}</span>
                      </li>
                    ))
                  )}
                </ul>
              </Paper>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default DashboardStats;
