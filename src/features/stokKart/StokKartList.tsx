import * as React from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { StokKartDto } from './types';
import { getAllStokKartlar, deleteStokKart, checkStokHareketExists, deleteAllHareketByStokKartId, updateStokKartAktifDurum } from './stokKartService';
import { Box, Typography, IconButton, Stack, Button, Snackbar, Alert, Tooltip, Switch } from '@mui/material';
import ExportButtons from '../../components/ExportButtons';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ReusableConfirmDialog from '../../components/ReusableConfirmDialog';
import { useNavigate } from 'react-router-dom';
import { SNACKBAR_MESSAGES, DIALOG_MESSAGES } from './stokKartConstants';

const getColumns = (
  onDeleteClick: (row: StokKartDto) => void,
  onEditClick: (row: StokKartDto) => void,
  onAktifToggle: (row: StokKartDto) => void
): GridColDef[] => [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'stokKodu', headerName: 'Stok Kodu', width: 130 },
  { field: 'stokAdi', headerName: 'Stok Adı', width: 180 },
  { field: 'birim', headerName: 'Birim', width: 100 },
  { field: 'tur', headerName: 'Tür', width: 120 },
  { field: 'kdvOrani', headerName: 'KDV (%)', width: 100 },
  { field: 'aciklama', headerName: 'Açıklama', width: 200 },
  {
    field: 'aktif',
    headerName: 'Durum',
    width: 120,
    renderCell: (params: any) => {
      const val = params.row?.aktif;
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <Switch
            checked={val === true}
            color={val ? 'success' : 'default'}
            size="small"
            onChange={() => onAktifToggle(params.row)}
            inputProps={{ 'aria-label': 'Aktif/Pasif' }}
          />
          <Typography variant="body2" color={val ? 'success.main' : 'text.secondary'}>
            {val ? 'Aktif' : 'Pasif'}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: 'actions',
    headerName: 'İşlem',
    width: 120,
    sortable: false,
    filterable: false,
    renderCell: (params: any) => (
      <Stack direction="row" spacing={1}>
        <Tooltip title="Düzenle" arrow>
          <IconButton size="small" color="primary" aria-label="Düzenle" onClick={() => onEditClick(params.row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Sil" arrow>
          <IconButton size="small" color="error" aria-label="Sil" onClick={() => onDeleteClick(params.row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    ),
  },
];


const StokKartList: React.FC = () => {
  const [aktifConfirmOpen, setAktifConfirmOpen] = React.useState(false);
  const [pendingAktifRow, setPendingAktifRow] = React.useState<StokKartDto | null>(null);
  // Aktif/Pasif toggle handler
  const onAktifToggle = async (row: StokKartDto) => {
    if (!row.id) return;
    // Pasif yapılıyorsa hareket kontrolü
    if (row.aktif) {
      try {
        const hasHareket = await checkStokHareketExists(row.id);
        if (hasHareket) {
          setPendingAktifRow(row);
          setAktifConfirmOpen(true);
          return;
        }
      } catch (e) {
        setSnackbarMsg('Hareket kontrolü sırasında hata oluştu.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
    }
    // Direkt aktif/pasif değiştir
    try {
      await updateStokKartAktifDurum(row.id, !row.aktif);
      fetchData();
      setSnackbarMsg('Stok kartı durumu güncellendi.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err: any) {
      setSnackbarMsg('Durum güncellenirken hata oluştu.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Pasif yaparken hareket varsa onaylandıysa hareketleri sil ve pasif yap
  const handleAktifConfirm = async () => {
    if (!pendingAktifRow?.id) return;
    try {
      await deleteAllHareketByStokKartId(pendingAktifRow.id);
      await updateStokKartAktifDurum(pendingAktifRow.id, false);
      fetchData();
      setSnackbarMsg('Tüm hareketler silindi ve stok kartı pasif yapıldı.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err: any) {
      setSnackbarMsg('Hareketler silinirken veya pasif yapılırken hata oluştu.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    setAktifConfirmOpen(false);
    setPendingAktifRow(null);
  };
  const navigate = useNavigate();
  const [rows, setRows] = React.useState<StokKartDto[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<StokKartDto | null>(null);
  const [forceDeleteDialogOpen, setForceDeleteDialogOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const onEditClick = React.useCallback((row: StokKartDto) => {
    if (row.id) {
      navigate(`/stok-kart/duzenle/${row.id}`);
    }
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await getAllStokKartlar();
      setRows(data);
    } catch (err: any) {
      let msg = SNACKBAR_MESSAGES.fetchError;
      if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err?.message) {
        msg = err.message;
      }
      setFetchError(msg);
      setRows([]);
      setSnackbarMsg(msg);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteClick = async (row: StokKartDto) => {
    setSelectedRow(row);
    if (!row.id) {
      setSnackbarMsg(SNACKBAR_MESSAGES.invalidId);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    try {
      const hasHareket = await checkStokHareketExists(row.id);
      if (hasHareket) {
        setForceDeleteDialogOpen(true);
      } else {
        setConfirmOpen(true);
      }
    } catch (e) {
      setSnackbarMsg(SNACKBAR_MESSAGES.hareketCheckError);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async () => {
    if (selectedRow?.id) {
      try {
        // Önce hareket var mı kontrol et
        const hasHareket = await checkStokHareketExists(selectedRow.id);
        if (hasHareket) {
          // Tüm hareketleri sil
          try {
            await deleteAllHareketByStokKartId(selectedRow.id);
          } catch (hareketErr: any) {
            setSnackbarMsg(SNACKBAR_MESSAGES.hareketDeleteError);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setConfirmOpen(false);
            setForceDeleteDialogOpen(false);
            setSelectedRow(null);
            return;
          }
        }
        // Sonra kartı sil
        await deleteStokKart(selectedRow.id);
        fetchData();
        setSnackbarMsg(SNACKBAR_MESSAGES.deleteSuccess);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (err: any) {
      let msg = SNACKBAR_MESSAGES.deleteError;
      if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err?.message) {
        msg = err.message;
      }
      setSnackbarMsg(msg);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      }
    }
    setConfirmOpen(false);
    setForceDeleteDialogOpen(false);
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
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="center"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        mb={2}
        spacing={2}
        sx={{ width: '100%' }}
      >
        <Typography
          variant="h5"
          sx={{
            flex: 1,
            textAlign: 'center',
            fontWeight: 700,
            fontFamily: 'Montserrat, Arial, sans-serif',
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            mb: { xs: 1, sm: 0 },
          }}
        >
          Stok Kart Listesi
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/stok-kart/yeni')}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Yeni Stok Kart
        </Button>
      </Stack>
      {/* Export butonları */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 1100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflowX: 'auto',
        }}
      >
        {/* Hata mesajı ve tekrar dene butonu */}
        {fetchError && (
          <Box sx={{ width: '100%', mb: 2, p: 2, background: '#fff3f3', border: '1px solid #f44336', borderRadius: 2, textAlign: 'center' }}>
            <Typography color="error" sx={{ fontWeight: 600, mb: 1 }}>{fetchError}</Typography>
            <Button variant="outlined" color="error" onClick={fetchData}>Tekrar Dene</Button>
          </Box>
        )}
        {/* Loading göstergesi */}
        {loading && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 10 }}>
            <Box sx={{ width: '100%' }}>
              <div style={{ height: 4, width: '100%' }}>
                <svg width="100%" height="4" viewBox="0 0 100 4" preserveAspectRatio="none">
                  <rect x="0" y="0" width="100" height="4" fill="#1976d2">
                    <animate attributeName="width" from="0" to="100" dur="1s" repeatCount="indefinite" />
                  </rect>
                </svg>
              </div>
            </Box>
          </Box>
        )}
        <Box sx={{ width: '100%', minWidth: { xs: 600, sm: 0 } }}>
          <DataGrid
            rows={rows}
            columns={React.useMemo(() => getColumns(onDeleteClick, onEditClick, onAktifToggle), [onDeleteClick, onEditClick, onAktifToggle])}
            autoHeight
            pageSizeOptions={[10, 20, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
            loading={loading}
            slots={{ toolbar: GridToolbar }}
            disableRowSelectionOnClick
            sx={{
              width: '100%',
              minWidth: 600,
              maxWidth: 1100,
              background: '#fff',
              borderRadius: 3,
              boxShadow: 3,
              m: '0 auto',
              opacity: loading ? 0.5 : 1,
              pointerEvents: loading ? 'none' : 'auto',
              fontSize: { xs: '0.85rem', sm: '1rem' },
            }}
            slotProps={{
              noRowsOverlay: {
                children: (
                  <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary', fontFamily: 'Montserrat, Arial, sans-serif' }}>
                    Kayıt bulunamadı.
                  </Box>
                ),
              },
            }}
          />
          {/* Export butonları sağ alt */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <ExportButtons
              rows={rows}
              columns={getColumns(() => {}, () => {}, () => {}).filter(c => c.field !== 'actions').map(({ field, headerName }) => ({ field, headerName: headerName || field }))}
              fileName="StokKartListesi"
            />
          </Box>
          {/* Aktif/Pasif yaparken hareket varsa ekstra onay */}
          <ReusableConfirmDialog
            open={aktifConfirmOpen}
            message={
              pendingAktifRow
                ? `Bu stok kartı pasif yapılacak ve ilişkili tüm hareketler silinecek. Emin misiniz?\n\n"${pendingAktifRow.stokKodu ? pendingAktifRow.stokKodu + ' - ' : ''}${pendingAktifRow.stokAdi ?? ''}"`
                : 'Bu stok kartı pasif yapılacak ve ilişkili tüm hareketler silinecek. Emin misiniz?'
            }
            onConfirm={handleAktifConfirm}
            onCancel={() => {
              setAktifConfirmOpen(false);
              setPendingAktifRow(null);
            }}
          />
        </Box>
      </Box>

      {/* Silme Onay Dialogu */}

      {/* Standart silme onayı */}
      <ReusableConfirmDialog
        open={confirmOpen}
        message={
          selectedRow
            ? DIALOG_MESSAGES.confirmDelete(selectedRow)
            : DIALOG_MESSAGES.confirmDeleteDefault
        }
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedRow(null);
        }}
      />

      {/* Hareket varsa ekstra uyarı */}
      <ReusableConfirmDialog
        open={forceDeleteDialogOpen}
        message={
          selectedRow
            ? DIALOG_MESSAGES.forceDelete(selectedRow)
            : DIALOG_MESSAGES.forceDeleteDefault
        }
        onConfirm={handleDelete}
        onCancel={() => {
          setForceDeleteDialogOpen(false);
          setSelectedRow(null);
        }}
      />

      {/* Bilgi/Hata Snackbar */}
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

export default StokKartList;