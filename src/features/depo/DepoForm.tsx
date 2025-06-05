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

      <TextField
        label="Depo Kodu"
        name="depoKodu"
        fullWidth
        margin="dense"
        value={form.depoKodu}
        onChange={handleChange}
      />
      <TextField
        label="Depo Adı"
        name="depoAdi"
        fullWidth
        margin="dense"
        value={form.depoAdi}
        onChange={handleChange}
      />
      <TextField
        label="Sorumlu"
        name="sorumlu"
        fullWidth
        margin="dense"
        value={form.sorumlu}
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

export default DepoForm;
