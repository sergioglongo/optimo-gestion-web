import { useDeleteTipoUnidadOperativa } from 'services/api/tipoUnidadOperativaapi';

// material-ui
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

// ==============================|| TIPO UNIDAD OPERATIVA - DELETION ||============================== //

interface AlertTipoUnidadOperativaDeleteProps {
  id: number;
  title: string;
  open: boolean;
  handleClose: () => void;
}

const AlertTipoUnidadOperativaDelete = ({ id, title, open, handleClose }: AlertTipoUnidadOperativaDeleteProps) => {
  const deleteTipoMutation = useDeleteTipoUnidadOperativa();

  const handleDelete = async () => {
    try {
      await deleteTipoMutation.mutateAsync(id);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">¿Estás seguro de eliminar el tipo "{title}"?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">Esta acción no se puede deshacer.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleDelete} color="error" autoFocus>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertTipoUnidadOperativaDelete;
