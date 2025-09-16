import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  isSubmitting?: boolean; // To disable confirm button during submission
}

const Modal = ({
  open,
  onClose,
  title,
  children,
  cancelButtonLabel,
  confirmButtonLabel = 'Confirmar',
  onCancel,
  onConfirm,
  maxWidth = 'sm',
  fullWidth = true,
  isSubmitting = false
}: ModalProps) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    // onClose(); // The consumer of the modal will decide when to close after confirm
  };

  return (
    <Dialog maxWidth={maxWidth} fullWidth={fullWidth} open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {cancelButtonLabel && (
          <Button color="error" onClick={handleCancel}>
            {cancelButtonLabel}
          </Button>
        )}
        {onConfirm && (
          <Button type="submit" variant="contained" onClick={handleConfirm} disabled={isSubmitting}>
            {confirmButtonLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
