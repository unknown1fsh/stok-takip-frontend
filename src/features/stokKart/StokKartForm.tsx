import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StokKartDto } from './types';
import {
  createStokKart,
  updateStokKart,
  getStokKartById,
  checkStokHareketExists,
  deleteAllHareketByStokKartId
} from './stokKartService';
import {
  Box,
  Button,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert
} from '@mui/material';
import ReusableConfirmDialog from '../../components/ReusableConfirmDialog';

type Props = {
  selectedId?: number;
  onSuccess?: () => void;
};

const initialForm: StokKartDto = {
  stokKodu: '',
  stokAdi: '',
  birim: '',
  tur: '',
  kdvOrani: 0,
  aciklama: '',
  aktif: true
};


const StokKartForm: React.FC<Props> = ({ selectedId: propSelectedId, onSuccess }) => {
  const [form, setForm] = useState<StokKartDto>(initialForm);
  const [pendingAktif, setPendingAktif] = useState<boolean | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();
  const params = useParams();
  const selectedId = propSelectedId ?? (params.id ? Number(params.id) : undefined);

  useEffect(() => {
    if (selectedId) {
      getStokKartById(selectedId).then((data) => setForm(data));
    } else {
      setForm(initialForm);
    }
  }, [selectedId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'kdvOrani' ? parseFloat(value) : value
    }));
  };

  const handleSwitch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAktif = e.target.checked;
    // Aktif -> Pasif'e geçişte kontrol
    if (form.aktif && !newAktif && selectedId) {
      try {
        const hasHareket = await checkStokHareketExists(selectedId);
        if (hasHareket) {
          setPendingAktif(newAktif);
          setConfirmOpen(true);
          return;
        }
      } catch (err) {
        setSnackbarMsg('Hareket kontrolü sırasında hata oluştu.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
    }
    setForm((prev) => ({
      ...prev,
      aktif: newAktif
    }));
  };

  // Dialog onaylanırsa hareketleri sil ve pasif yap
  const handleConfirmPassive = async () => {
    if (!selectedId) {
      setConfirmOpen(false);
      setPendingAktif(null);
      return;
    }
    try {
      await deleteAllHareketByStokKartId(selectedId);
      setForm((prev) => ({ ...prev, aktif: false }));
      setSnackbarMsg('Tüm hareketler silindi ve kart pasif yapıldı.');
      setSnackbarSeverity('success');
    } catch (err: any) {
      let msg = 'Hareketler silinirken hata oluştu.';
      if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err?.message) {
        msg = err.message;
      }
      setSnackbarMsg(msg);
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
    setConfirmOpen(false);
    setPendingAktif(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedId) {
        await updateStokKart(selectedId, form);
        setSnackbarMsg('Stok kartı başarıyla güncellendi.');
        setSnackbarSeverity('success');
        navigate('/stok-kart');
      } else {
        await createStokKart(form);
        setSnackbarMsg('Stok kartı başarıyla oluşturuldu.');
        setSnackbarSeverity('success');
        navigate('/stok-kart');
      }
      setForm(initialForm);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      let msg = 'Kayıt işlemi sırasında bir hata oluştu.';
      if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err?.message) {
        msg = err.message;
      }
      setSnackbarMsg(msg);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        {selectedId ? 'Stok Kart Güncelle' : 'Yeni Stok Kart'}
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={2}>
        <TextField
          label="Stok Kodu"
          name="stokKodu"
          value={form.stokKodu}
          onChange={handleChange}
          sx={{ flex: '1 1 220px', minWidth: 200 }}
        />
        <TextField
          label="Stok Adı"
          name="stokAdi"
          value={form.stokAdi}
          onChange={handleChange}
          sx={{ flex: '2 1 320px', minWidth: 220 }}
        />
        <TextField
          label="Birim"
          name="birim"
          value={form.birim}
          onChange={handleChange}
          sx={{ flex: '1 1 120px', minWidth: 120 }}
        />
        <TextField
          label="Tür"
          name="tur"
          value={form.tur}
          onChange={handleChange}
          sx={{ flex: '1 1 120px', minWidth: 120 }}
        />
        <TextField
          label="KDV Oranı"
          name="kdvOrani"
          type="number"
          value={form.kdvOrani}
          onChange={handleChange}
          sx={{ flex: '1 1 120px', minWidth: 120 }}
        />
        <TextField
          label="Açıklama"
          name="aciklama"
          value={form.aciklama}
          onChange={handleChange}
          sx={{ flex: '2 1 320px', minWidth: 220 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.aktif ?? true}
              onChange={handleSwitch}
              color="primary"
            />
          }
          label="Aktif"
          sx={{ flex: '1 1 120px', minWidth: 120, alignSelf: 'center' }}
        />
      </Box>
      <Box mt={3}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Kaydet
        </Button>
      </Box>

      {/* Hareket varsa pasif yapma onay dialogu */}
      <ReusableConfirmDialog
        open={confirmOpen}
        message={
          'Bu stok kartına ait hareketler bulunmaktadır. Pasif yapmak için önce tüm hareketler silinecek. Devam etmek istiyor musunuz?'
        }
        title="Pasif Yapma Onayı"
        confirmText="Evet, Hareketleri Sil ve Pasif Yap"
        cancelText="Vazgeç"
        onConfirm={handleConfirmPassive}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingAktif(null);
        }}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StokKartForm;
