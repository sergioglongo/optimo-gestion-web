import { useDeleteTipounidadFuncional } from 'services/api/tipoUnidadFuncionalapi';

// material-ui
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

// ==============================|| TIPO UNIDAD FUNCIONAL - DELETION ||============================== //

interface AlertTipounidadFuncionalDeleteProps {
  id: number;
  title: string;
  open: boolean;
  handleClose: () => void;
}

const AlertTipounidadFuncionalDelete = ({ id, title, open, handleClose }: AlertTipounidadFuncionalDeleteProps) => {
  const deleteTipoMutation = useDeleteTipounidadFuncional();

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

export default AlertTipounidadFuncionalDelete;
