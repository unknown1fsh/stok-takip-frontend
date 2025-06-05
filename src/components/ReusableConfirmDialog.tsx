import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

interface ReusableConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ReusableConfirmDialog: React.FC<ReusableConfirmDialogProps> = ({
  open,
  title = 'Silme Onayı',
  message,
  onConfirm,
  onCancel,
  confirmText = 'Sil',
  cancelText = 'İptal'
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button onClick={onConfirm} color="error">{confirmText}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReusableConfirmDialog;
