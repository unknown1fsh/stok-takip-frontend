
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DashboardStats from './DashboardStats';

const Dashboard: React.FC = () => {
  return (
    <Box p={4}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 900,
          letterSpacing: 2,
          color: 'primary.main',
          fontFamily: 'Montserrat, Arial, sans-serif',
          textAlign: 'center',
          fontSize: 38,
          mb: 4,
        }}
      >
        X STOK TAKİP
      </Typography>
      <DashboardStats />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mt: 4, justifyContent: 'center' }}>
        <Box sx={{ minWidth: 320, maxWidth: 400, flex: '1 1 320px', bgcolor: 'background.paper', borderRadius: 4, boxShadow: 6, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/logo192.png" alt="Logo" style={{ width: 64, height: 64, marginBottom: 16 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>Stok Takip Sistemi</Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Modern, hızlı ve güvenli stok/depo yönetimi. Tüm işlemlere sol menüden ulaşabilirsiniz.
          </Typography>
        </Box>
        <Box sx={{ minWidth: 320, maxWidth: 400, flex: '1 1 320px', bgcolor: 'background.paper', borderRadius: 4, boxShadow: 6, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png" alt="Hızlı" style={{ width: 64, height: 64, marginBottom: 16 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Hızlı ve Kolay</Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Tüm stok, depo ve hareket işlemlerini kolayca yönetin. Gelişmiş arama, filtreleme ve raporlama.
          </Typography>
        </Box>
        <Box sx={{ minWidth: 320, maxWidth: 400, flex: '1 1 320px', bgcolor: 'background.paper', borderRadius: 4, boxShadow: 6, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="https://cdn-icons-png.flaticon.com/512/2099/2099058.png" alt="Güvenli" style={{ width: 64, height: 64, marginBottom: 16 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Güvenli ve Modern</Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Tüm verileriniz güvenli, arayüzler modern ve kullanıcı dostu. Responsive ve mobil uyumlu.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
