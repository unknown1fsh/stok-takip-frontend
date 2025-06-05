
import * as React from 'react';
import { DataGrid, GridColDef, GridToolbar, GridRenderCellParams, GridRowEditStopReasons } from '@mui/x-data-grid';
import { ParametreDto } from './types';
import { getAllParametreler, deleteParametre } from './parametreService';
import { Box, Typography, IconButton, Stack, Button } from '@mui/material';
import ExportButtons from '../../components/ExportButtons';
import ReusableConfirmDialog from '../../components/ReusableConfirmDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface ParametreRow extends ParametreDto {}

const getColumns = (onDeleteClick: (row: ParametreRow) => void): GridColDef[] => [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'kategori', headerName: 'Kategori', width: 120 },
  { field: 'parametreKodu', headerName: 'Kod', width: 120 },
  { field: 'parametreAdi', headerName: 'Ad', width: 160 },
  { field: 'deger', headerName: 'Değer', width: 120 },
  { field: 'aktif', headerName: 'Durum', width: 100, valueGetter: (params: any) => params.row && params.row.aktif ? 'Aktif' : 'Pasif' },
  {
    field: 'actions',
    headerName: 'İşlem',
    width: 120,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<ParametreRow>) => (
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


const ParametreList: React.FC = () => {
  const [rows, setRows] = React.useState<ParametreRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [rowSelectionModel, setRowSelectionModel] = React.useState<Set<string | number>>(new Set());
  const [detailRow, setDetailRow] = React.useState<ParametreRow | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<ParametreRow | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const data = await getAllParametreler();
    setRows(data);
    setLoading(false);
  };

  // Sil butonuna tıklanınca dialog aç
  const onDeleteClick = (row: ParametreRow) => {
    setSelectedRow(row);
    setConfirmOpen(true);
  };

  // Dialog onaylanırsa sil
  const handleConfirmDelete = async () => {
    if (selectedRow?.id) {
      await deleteParametre(selectedRow.id);
      fetchData();
    }
    setConfirmOpen(false);
    setSelectedRow(null);
  };

  const handleBulkDelete = async () => {
    for (const id of rowSelectionModel) {
      await deleteParametre(Number(id));
    }
    fetchData();
  };

  const handleRowEditStop = (params: any, event: any) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      // Save logic can be added here
    }
  };

  const handleRowDoubleClick = (params: any) => {
    setDetailRow(params.row);
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
        <Typography variant="h5" sx={{ flex: 1, textAlign: 'center', fontWeight: 700, fontFamily: 'Montserrat, Arial, sans-serif' }}>Parametre Listesi</Typography>
        <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
          <Button variant="contained" color="primary" href="/parametre/yeni">Yeni Parametre</Button>
          {rowSelectionModel.size > 0 && (
            <Button variant="outlined" color="error" onClick={handleBulkDelete}>
              Seçiliyi Sil ({rowSelectionModel.size})
            </Button>
          )}
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
          checkboxSelection
          rowSelectionModel={{ type: 'include', ids: rowSelectionModel }}
          onRowSelectionModelChange={(model) => {
            setRowSelectionModel(model.ids as Set<string | number>);
          }}
          processRowUpdate={(newRow) => {
            setRows((prev) => prev.map((r) => (r.id === newRow.id ? { ...r, ...newRow } : r)));
            return newRow;
          }}
          onRowEditStop={handleRowEditStop}
          // experimentalFeatures={{ newEditingApi: true }}
          onRowDoubleClick={handleRowDoubleClick}
          disableRowSelectionOnClick={false}
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
          {/* ExportButtons sadece DataGrid altında olacak */}
          <ExportButtons
            rows={rows}
            columns={getColumns(() => {}).filter(c => c.field !== 'actions').map(({ field, headerName }) => ({ field, headerName: headerName || field }))}
            fileName="ParametreListesi"
          />
        </Box>
      </Box>

      {/* Silme Onay Dialogu */}
      <ReusableConfirmDialog
        open={confirmOpen}
        message={
          selectedRow
            ? `"${selectedRow.parametreKodu ? selectedRow.parametreKodu + ' - ' : ''}${selectedRow.parametreAdi ?? ''}" parametresi silinecektir. Emin misiniz?`
            : 'Bu kayıt silinecektir. Emin misiniz?'
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedRow(null);
        }}
      />

      {/* Detay Modalı */}
      {detailRow && (
        <Box sx={{ position: 'fixed', top: 80, left: 0, right: 0, zIndex: 2000, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 4, minWidth: 400 }}>
            <Typography variant="h6" mb={2}>Parametre Detayı</Typography>
            <pre style={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>{JSON.stringify(detailRow, null, 2)}</pre>
            <Button variant="contained" onClick={() => setDetailRow(null)} sx={{ mt: 2 }}>Kapat</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ParametreList;
