import React from 'react';
import { Button, Stack, Tooltip } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import DescriptionIcon from '@mui/icons-material/Description';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportButtonsProps {
  rows: any[];
  columns: { field: string; headerName: string }[];
  fileName?: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ rows, columns, fileName = 'veriler' }) => {
  const exportExcel = () => {
    const data = rows.map(row => {
      const obj: any = {};
      columns.forEach(col => {
        obj[col.headerName] = row[col.field];
      });
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
  };

  const exportCSV = () => {
    const data = rows.map(row => {
      const obj: any = {};
      columns.forEach(col => {
        obj[col.headerName] = row[col.field];
      });
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${fileName}.csv`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = columns.map(col => col.headerName);
    const tableRows = rows.map(row => columns.map(col => row[col.field]));
    autoTable(doc, { head: [tableColumn], body: tableRows });
    doc.save(`${fileName}.pdf`);
  };

  const exportWord = () => {
    let html = `<table border="1" style="border-collapse:collapse;">`;
    html += '<tr>' + columns.map(col => `<th>${col.headerName}</th>`).join('') + '</tr>';
    rows.forEach(row => {
      html += '<tr>' + columns.map(col => `<td>${row[col.field] ?? ''}</td>`).join('') + '</tr>';
    });
    html += '</table>';
    const blob = new Blob([
      `\ufeff<html><head><meta charset='utf-8'></head><body>${html}</body></html>`
    ], { type: 'application/msword' });
    saveAs(blob, `${fileName}.doc`);
  };

  return (
    <Stack direction="row" spacing={1} mb={2}>
      <Tooltip title="Excel'e Aktar">
        <Button
          variant="contained"
          size="small"
          color="success"
          onClick={exportExcel}
          sx={{ minWidth: 32, minHeight: 32, p: 0.5, borderRadius: 2, boxShadow: 1 }}
        >
          <TableChartIcon fontSize="small" />
        </Button>
      </Tooltip>
      <Tooltip title="CSV Olarak Aktar">
        <Button
          variant="contained"
          size="small"
          color="info"
          onClick={exportCSV}
          sx={{ minWidth: 32, minHeight: 32, p: 0.5, borderRadius: 2, boxShadow: 1 }}
        >
          <GetAppIcon fontSize="small" />
        </Button>
      </Tooltip>
      <Tooltip title="PDF Olarak Aktar">
        <Button
          variant="contained"
          size="small"
          color="error"
          onClick={exportPDF}
          sx={{ minWidth: 32, minHeight: 32, p: 0.5, borderRadius: 2, boxShadow: 1 }}
        >
          <PictureAsPdfIcon fontSize="small" />
        </Button>
      </Tooltip>
      <Tooltip title="Word Olarak Aktar">
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={exportWord}
          sx={{ minWidth: 32, minHeight: 32, p: 0.5, borderRadius: 2, boxShadow: 1 }}
        >
          <DescriptionIcon fontSize="small" />
        </Button>
      </Tooltip>
    </Stack>
  );
};

export default ExportButtons;
