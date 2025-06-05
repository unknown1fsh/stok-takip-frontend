
import * as React from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { DepoDto } from './types';
import { getAllDepolar, deleteDepo } from './depoService';
import { Box, Typography, IconButton, Stack, Button, Snackbar, Alert } from '@mui/material';
import ExportButtons from '../../components/ExportButtons';
import ReusableConfirmDialog from '../../components/ReusableConfirmDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


const getColumns = (onDeleteClick: (row: any) => void): GridColDef[] => [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'depoKodu', headerName: 'Depo Kodu', width: 130 },
  { field: 'depoAdi', headerName: 'Depo Adı', width: 180 },
  { field: 'sorumlu', headerName: 'Sorumlu', width: 150 },
  { field: 'aktif', headerName: 'Durum', width: 100, valueGetter: (params: any) => params.row && params.row.aktif ? 'Aktif' : 'Pasif' },
  {
    field: 'actions',
    headerName: 'İşlem',
    width: 120,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Stack direction="row" spacing={1}>
        <IconButton size="small" color="primary">
          <EditIcon />
        </IconButton>
        <IconButton size="small" color="error" onClick={() => onDeleteClick(params.row)}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    ),
  },
];

const DepoList: React.FC = () => {
  const [rows, setRows] = React.useState<DepoDto[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    const data = await getAllDepolar();
    setRows(data);
    setLoading(false);
  };

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('');

  // Sil butonuna tıklanınca dialog aç
  const onDeleteClick = (row: any) => {
    setSelectedRow(row);
    setConfirmOpen(true);
  };

  // Dialog onaylanırsa sil
  const handleConfirmDelete = async () => {
    if (selectedRow?.id) {
      try {
        await deleteDepo(selectedRow.id);
        fetchData();
      } catch (error: any) {
        let msg = 'Silme işlemi sırasında bir hata oluştu.';
        if (error?.response?.data?.message) {
          msg = error.response.data.message;
        } else if (error?.message) {
          msg = error.message;
        }
        setSnackbarMsg(msg);
        setSnackbarOpen(true);
      }
    }
    setConfirmOpen(false);
    setSelectedRow(null);
  };

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      p={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        width: '100%',
      }}
    >
      <Stack direction="row" justifyContent="center" alignItems="center" mb={2} sx={{ width: '100%' }}>
        <Typography variant="h5" sx={{ flex: 1, textAlign: 'center', fontWeight: 700, fontFamily: 'Montserrat, Arial, sans-serif' }}>Depo Listesi</Typography>
        <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
          <Button variant="contained" color="primary" href="/depo/yeni">Yeni Depo</Button>
        </Stack>
      </Stack>
      <Box sx={{ width: '100%', minWidth: 600, maxWidth: 1100, display: 'block' }}>
        <DataGrid
          rows={rows}
          columns={getColumns(onDeleteClick)}
          autoHeight
          pageSizeOptions={[10, 20, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
          sx={{
            width: '100%',
            maxWidth: 1100,
            background: '#fff',
            borderRadius: 3,
            boxShadow: 3,
            m: '0 auto',
          }}
        />
        {/* Export butonları sağ alt */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, width: '100%' }}>
          <ExportButtons
            rows={rows}
            columns={getColumns(() => {}).filter(c => c.field !== 'actions').map(({ field, headerName }) => ({ field, headerName: headerName || field }))}
            fileName="DepoListesi"
          />
        </Box>
      </Box>

      {/* Silme Onay Dialogu */}
      <ReusableConfirmDialog
        open={confirmOpen}
        message={
          selectedRow
            ? `"${selectedRow.depoKodu ? selectedRow.depoKodu + ' - ' : ''}${selectedRow.depoAdi ?? ''}" deposu silinecektir. Emin misiniz?`
            : 'Bu kayıt silinecektir. Emin misiniz?'
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedRow(null);
        }}
      />
      {/* Hata Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setSnackbarOpen(false)} sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DepoList;
