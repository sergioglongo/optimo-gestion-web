import { useDeleteRubro } from 'services/api/rubrosapi';

// material-ui
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

// ==============================|| RUBRO - DELETION ||============================== //

interface AlertRubroDeleteProps {
  id: number;
  title: string;
  open: boolean;
  handleClose: () => void;
}

const AlertRubroDelete = ({ id, title, open, handleClose }: AlertRubroDeleteProps) => {
  const deleteRubroMutation = useDeleteRubro();

  const handleDelete = async () => {
    try {
      await deleteRubroMutation.mutateAsync(id);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">¿Estás seguro de eliminar el rubro "{title}"?</DialogTitle>
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

export default AlertRubroDelete;
