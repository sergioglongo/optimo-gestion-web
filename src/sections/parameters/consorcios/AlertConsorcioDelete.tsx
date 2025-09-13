import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

// ==============================|| ALERT - CONSORCIO DELETE ||============================== //

interface AlertConsorcioDeleteProps {
  id: string | number;
  title: string;
  open: boolean;
  handleClose: (status: boolean) => void;
}

const AlertConsorcioDelete = ({ id, title, open, handleClose }: AlertConsorcioDeleteProps) => {
  const handleDelete = () => {
    // Aquí iría la lógica para eliminar el consorcio
    console.log(`Eliminando consorcio con id: ${id}`);
    handleClose(true);
  };

  return (
    <Dialog open={open} onClose={() => handleClose(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">"¿Estás seguro de eliminar?"</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Estás a punto de eliminar el consorcio "{title}". Esta acción es irreversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleDelete} color="error" autoFocus>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertConsorcioDelete;
