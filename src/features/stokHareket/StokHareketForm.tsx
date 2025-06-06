import React, { useEffect, useState } from 'react';
import { StokHareketDto } from './types';
import { createHareket, updateHareket, getById } from './stokHareketService';
import { HareketTipi } from '../../types/enums';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem
} from '@mui/material';

type Props = {
  selectedId?: number;
  onSuccess?: () => void;
};

const initialForm: StokHareketDto = {
  hareketTipi: HareketTipi.GIRIS,
  stokKartId: 0,
  depoId: 0,
  miktar: 0,
  birimFiyat: 0,
  toplamTutar: 0,
  tarih: '',
  aciklama: ''
};

const StokHareketForm: React.FC<Props> = ({ selectedId, onSuccess }) => {
  const [form, setForm] = useState<StokHareketDto>(initialForm);

  useEffect(() => {
    if (selectedId) {
      getById(selectedId).then((data) => setForm(data));
    }
  }, [selectedId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'miktar' || name === 'birimFiyat' ? parseFloat(value) : value
    }));
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      hareketTipi: e.target.value as HareketTipi
    }));
  };

  const handleSubmit = async () => {
    if (selectedId) {
      await updateHareket(selectedId, form);
    } else {
      await createHareket(form);
    }
    setForm(initialForm);
    if (onSuccess) onSuccess();
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        {selectedId ? 'Stok Hareket Güncelle' : 'Yeni Stok Hareket'}
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={2}>
        <TextField
          select
          label="Hareket Tipi"
          name="hareketTipi"
          value={form.hareketTipi}
          onChange={handleSelect}
          sx={{ flex: '1 1 180px', minWidth: 150 }}
        >
          {Object.values(HareketTipi).map((tip) => (
            <MenuItem key={tip} value={tip}>{tip}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Stok Kart ID"
          name="stokKartId"
          type="number"
          value={form.stokKartId}
          onChange={handleChange}
          sx={{ flex: '1 1 150px', minWidth: 120 }}
        />
        <TextField
          label="Depo ID"
          name="depoId"
          type="number"
          value={form.depoId}
          onChange={handleChange}
          sx={{ flex: '1 1 150px', minWidth: 120 }}
        />
        <TextField
          label="Miktar"
          name="miktar"
          type="number"
          value={form.miktar}
          onChange={handleChange}
          sx={{ flex: '1 1 120px', minWidth: 100 }}
        />
        <TextField
          label="Birim Fiyat"
          name="birimFiyat"
          type="number"
          value={form.birimFiyat}
          onChange={handleChange}
          sx={{ flex: '1 1 120px', minWidth: 100 }}
        />
        <TextField
          label="Toplam Tutar"
          name="toplamTutar"
          type="number"
          value={form.toplamTutar}
          onChange={handleChange}
          sx={{ flex: '1 1 120px', minWidth: 100 }}
        />
        <TextField
          label="Tarih"
          name="tarih"
          type="date"
          value={form.tarih}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: '1 1 160px', minWidth: 120 }}
        />
        <TextField
          label="Açıklama"
          name="aciklama"
          value={form.aciklama}
          onChange={handleChange}
          sx={{ flex: '2 1 320px', minWidth: 180 }}
        />
      </Box>
      <Box mt={3}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Kaydet
        </Button>
      </Box>
    </Box>
  );
};

export default StokHareketForm;
