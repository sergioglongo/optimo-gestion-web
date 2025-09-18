import ConfirmationDialog from 'components/Modal/ConfirmationDialog';
import { useDeleteGasto } from 'services/api/gastosapi';

// ==============================|| ALERT - GASTO DELETE ||============================== //

interface AlertDeleteProps {
  id: string | number | undefined;
  title: string | undefined;
  open: boolean;
  handleClose: (deleted: boolean) => void;
}

const AlertGastoDelete = ({ id, title, open, handleClose }: AlertDeleteProps) => {
  const deleteGastoMutation = useDeleteGasto();

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteGastoMutation.mutateAsync(id as number);
      handleClose(true);
    } catch (error) {
      console.error(error);
      handleClose(false);
    }
  };

  return (
    <ConfirmationDialog
      open={open}
      onClose={() => handleClose(false)}
      onConfirm={handleDelete}
      title={`¿Estás seguro de eliminar el gasto?`}
      content={`Estás a punto de eliminar "${title}". Esta acción es irreversible.`}
      confirmText="delete"
      cancelText="cancel"
      confirmColor="error"
    />
  );
};

export default AlertGastoDelete;
