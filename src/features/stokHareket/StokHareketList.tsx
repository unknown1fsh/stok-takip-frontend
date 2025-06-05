
import * as React from 'react';
import { DataGrid, GridColDef, GridToolbar, GridRenderCellParams, GridRowEditStopReasons } from '@mui/x-data-grid';
import { StokHareketDto } from './types';
import { getAllHareketler, deleteHareket } from './stokHareketService';
import ReusableConfirmDialog from '../../components/ReusableConfirmDialog';
import { Box, Typography, IconButton, Stack, Button } from '@mui/material';
import ExportButtons from '../../components/ExportButtons';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface StokHareketRow extends StokHareketDto {}

// columns'u fonksiyon olarak tanımla ki onDeleteClick erişilebilsin
const getColumns = (onDeleteClick: (row: StokHareketRow) => void): GridColDef[] => [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'hareketTipi', headerName: 'Tip', width: 100 },
  { field: 'stokAdi', headerName: 'Stok', width: 160 },
  { field: 'depoAdi', headerName: 'Depo', width: 140 },
  { field: 'miktar', headerName: 'Miktar', width: 100 },
  { field: 'toplamTutar', headerName: 'Tutar', width: 120 },
  { field: 'tarih', headerName: 'Tarih', width: 120 },
  {
    field: 'actions',
    headerName: 'İşlem',
    width: 120,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<StokHareketRow>) => (
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


const StokHareketList: React.FC = () => {
  const [rows, setRows] = React.useState<StokHareketRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  // DataGrid rowSelectionModel: sadece (string | number)[] olarak tip belirle
  const [rowSelectionModel, setRowSelectionModel] = React.useState<Set<string | number>>(new Set());
  const [detailRow, setDetailRow] = React.useState<StokHareketRow | null>(null);
  // Silme dialog state
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<StokHareketRow | null>(null);

  const fetchData = async () => {
    setLoading(true);
    let data: any = [];
    try {
      data = await getAllHareketler();
      // Konsolda backend'den dönen veri yapısını göster
      // eslint-disable-next-line no-console
      console.log('getAllHareketler response:', data);
    } catch (e) {
      data = [];
    }
    // Eğer data bir array değilse ve content adında bir dizi varsa onu kullan
    const arr = Array.isArray(data)
      ? data
      : (Array.isArray(data?.content) ? data.content : []);
    // rows her zaman array olmalı, undefined/null asla olmamalı
  setRows(
    Array.isArray(arr)
      ? arr.filter(Boolean).map((row, idx): StokHareketRow => {
          let safeId = row && (row.id !== undefined && row.id !== null) ? row.id : idx;
          if (typeof safeId !== 'string' && typeof safeId !== 'number') safeId = String(idx);
          return {
            ...row,
            id: safeId
          };
        })
      : []
  );
    setLoading(false);
  };


  // Sil butonuna tıklanınca dialog aç
  const onDeleteClick = (row: StokHareketRow) => {
    setSelectedRow(row);
    setConfirmOpen(true);
  };

  // Dialog onaylanırsa sil
  const handleConfirmDelete = async () => {
    if (selectedRow?.id) {
      await deleteHareket(selectedRow.id);
      fetchData();
    }
    setConfirmOpen(false);
    setSelectedRow(null);
  };

  const handleBulkDelete = async () => {
    for (const id of rowSelectionModel) {
      await deleteHareket(Number(id));
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
        <Typography variant="h5" sx={{ flex: 1, textAlign: 'center', fontWeight: 700, fontFamily: 'Montserrat, Arial, sans-serif' }}>Stok Hareket Listesi</Typography>
        <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
          <Button variant="contained" color="primary" href="/stok-hareket/yeni">Yeni Hareket</Button>
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
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          checkboxSelection
          rowSelectionModel={{ type: 'include', ids: rowSelectionModel }}
          onRowSelectionModelChange={(model: any) => {
            setRowSelectionModel(model.ids as Set<string | number>);
          }}
          processRowUpdate={(newRow: any) => {
            setRows((prev) => prev.map((r) => (r.id === newRow.id ? { ...r, ...newRow } : r)));
            return newRow;
          }}
          onRowEditStop={handleRowEditStop}
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
          <ExportButtons
            rows={rows}
            columns={getColumns(() => {}).filter(c => c.field !== 'actions').map(({ field, headerName }) => ({ field, headerName: headerName || field }))}
            fileName="StokHareketListesi"
          />
        </Box>
      </Box>

      {/* Silme Onay Dialogu */}
      <ReusableConfirmDialog
        open={confirmOpen}
        message={
          selectedRow
            ? `"${selectedRow.stokKodu ? selectedRow.stokKodu + ' - ' : ''}${selectedRow.stokAdi ?? ''}" hareketi silinecektir. Emin misiniz?`
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
            <Typography variant="h6" mb={2}>Hareket Detayı</Typography>
            <pre style={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>{JSON.stringify(detailRow, null, 2)}</pre>
            <Button variant="contained" onClick={() => setDetailRow(null)} sx={{ mt: 2 }}>Kapat</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default StokHareketList;
