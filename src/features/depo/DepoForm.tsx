import React, { useEffect, useState } from 'react';
import { DepoDto } from './types';
import { createDepo, updateDepo, getDepoById } from './depoService';
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

const initialForm: DepoDto = {
  depoKodu: '',
  depoAdi: '',
  sorumlu: '',
  aktif: true
};

const DepoForm: React.FC<Props> = ({ selectedId, onSuccess }) => {
  const [form, setForm] = useState<DepoDto>(initialForm);

  useEffect(() => {
    if (selectedId) {
      getDepoById(selectedId).then((data) => setForm(data));
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
      await updateDepo(selectedId, form);
    } else {
      await createDepo(form);
    }
    setForm(initialForm);
    if (onSuccess) onSuccess();
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        {selectedId ? 'Depo Güncelle' : 'Yeni Depo'}
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={2}>
        <TextField
          label="Depo Kodu"
          name="depoKodu"
          value={form.depoKodu}
          onChange={handleChange}
          sx={{ flex: '1 1 200px', minWidth: 180 }}
        />
        <TextField
          label="Depo Adı"
          name="depoAdi"
          value={form.depoAdi}
          onChange={handleChange}
          sx={{ flex: '2 1 320px', minWidth: 200 }}
        />
        <TextField
          label="Sorumlu"
          name="sorumlu"
          value={form.sorumlu}
          onChange={handleChange}
          sx={{ flex: '1 1 200px', minWidth: 180 }}
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

export default DepoForm;
