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
      <TextField
        label="Kategori"
        name="kategori"
        fullWidth
        margin="dense"
        value={form.kategori}
        onChange={handleChange}
      />
      <TextField
        label="Parametre Kodu"
        name="parametreKodu"
        fullWidth
        margin="dense"
        value={form.parametreKodu}
        onChange={handleChange}
      />
      <TextField
        label="Parametre Adı"
        name="parametreAdi"
        fullWidth
        margin="dense"
        value={form.parametreAdi}
        onChange={handleChange}
      />
      <TextField
        label="Değer"
        name="deger"
        fullWidth
        margin="dense"
        value={form.deger}
        onChange={handleChange}
      />
      <TextField
        label="Açıklama"
        name="aciklama"
        fullWidth
        margin="dense"
        value={form.aciklama}
        onChange={handleChange}
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
      />
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Kaydet
        </Button>
      </Box>
    </Box>
  );
};

export default ParametreForm;
