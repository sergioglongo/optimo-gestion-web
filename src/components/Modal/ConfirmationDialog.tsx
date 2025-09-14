import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

// ==============================|| CONFIRMATION DIALOG ||============================== //

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
  confirmText,
  cancelText,
  confirmColor = 'primary'
}: ConfirmationDialogProps) => {
  const intl = useIntl();

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText component={'div'} id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {intl.formatMessage({ id: cancelText || 'dialog.cancel', defaultMessage: cancelText || 'Cancel' })}
        </Button>
        <Button onClick={onConfirm} color={confirmColor} autoFocus>
          {intl.formatMessage({ id: confirmText || 'dialog.confirm', defaultMessage: confirmText || 'Confirm' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
