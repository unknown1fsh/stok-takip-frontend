import React, { useEffect, useState } from 'react';
import { ParametreDto } from './types';
import { createParametre, updateParametre, getById } from './parametreService';
import {
  Box,
  Button,
  TextField,
  Typography,
  Switch,
  FormControlLabel
} from '@mui/material';

type Props = {
  selectedId?: number;
  onSuccess?: () => void;
};

const initialForm: ParametreDto = {
  kategori: '',
  parametreKodu: '',
  parametreAdi: '',
  deger: '',
  aciklama: '',
  aktif: true
};

const ParametreForm: React.FC<Props> = ({ selectedId, onSuccess }) => {
  const [form, setForm] = useState<ParametreDto>(initialForm);

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
      [name]: value
    }));
  };

  const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      aktif: e.target.checked
    }));
  };

  const handleSubmit = async () => {
    if (selectedId) {
      await updateParametre(selectedId, form);
    } else {
      await createParametre(form);
    }
    setForm(initialForm);
    if (onSuccess) onSuccess();
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        {selectedId ? 'Parametre Güncelle' : 'Yeni Parametre'}
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={2}>
        <TextField
          label="Kategori"
          name="kategori"
          value={form.kategori}
          onChange={handleChange}
          sx={{ flex: '1 1 180px', minWidth: 150 }}
        />
        <TextField
          label="Parametre Kodu"
          name="parametreKodu"
          value={form.parametreKodu}
          onChange={handleChange}
          sx={{ flex: '1 1 180px', minWidth: 150 }}
        />
        <TextField
          label="Parametre Adı"
          name="parametreAdi"
          value={form.parametreAdi}
          onChange={handleChange}
          sx={{ flex: '2 1 320px', minWidth: 180 }}
        />
        <TextField
          label="Değer"
          name="deger"
          value={form.deger}
          onChange={handleChange}
          sx={{ flex: '1 1 180px', minWidth: 150 }}
        />
        <TextField
          label="Açıklama"
          name="aciklama"
          value={form.aciklama}
          onChange={handleChange}
          sx={{ flex: '2 1 320px', minWidth: 180 }}
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
    </Box>
  );
};

export default ParametreForm;
