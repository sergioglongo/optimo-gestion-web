import ConfirmationDialog from 'components/Modal/ConfirmationDialog';

// ==============================|| ALERT - CONSORCIO DELETE ||============================== //

interface AlertDeleteProps {
  id: string | number;
  title: string;
  open: boolean;
  handleClose: (status: boolean) => void;
}

const AlertConsorcioDelete = ({ id, title, open, handleClose }: AlertDeleteProps) => {
  const handleDelete = () => {
    // Aquí iría la lógica para eliminar el consorcio
    console.log(`Eliminando consorcio con id: ${id}`);
    handleClose(true);
  };

  return (
    <ConfirmationDialog
      open={open}
      onClose={() => handleClose(false)}
      onConfirm={handleDelete}
      title="¿Estás seguro de eliminar?"
      content={`Estás a punto de eliminar el consorcio "${title}". Esta acción es irreversible.`}
      confirmText="Delete"
      cancelText="Cancel"
      confirmColor="error"
    />
  );
};

export default AlertConsorcioDelete;
