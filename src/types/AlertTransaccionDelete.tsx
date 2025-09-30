import ConfirmationDialog from 'components/Modal/ConfirmationDialog';
import { useDeleteTransaccion } from 'services/api/transaccionapi';

// ==============================|| ALERT - TRANSACCION DELETE ||============================== //

interface AlertDeleteProps {
  transaccion: { id: number; descripcion: string | null; monto: number } | null;
  open: boolean;
  handleClose: (deleted?: boolean) => void;
}

const AlertTransaccionDelete = ({ transaccion, open, handleClose }: AlertDeleteProps) => {
  const deleteTransaccionMutation = useDeleteTransaccion();

  const handleDelete = async () => {
    if (!transaccion?.id) return;
    try {
      await deleteTransaccionMutation.mutateAsync(transaccion.id);
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
      title="¿Estás seguro de eliminar la transacción?"
      content={`Estás a punto de eliminar la transacción de $${transaccion?.monto} (${
        transaccion?.descripcion || 'Sin descripción'
      }). Esta acción es irreversible.`}
      confirmText="Eliminar"
      cancelText="Cancelar"
      confirmColor="error"
    />
  );
};

export default AlertTransaccionDelete;
