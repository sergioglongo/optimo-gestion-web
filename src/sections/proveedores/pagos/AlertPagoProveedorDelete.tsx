import ConfirmationDialog from 'components/Modal/ConfirmationDialog';
import { useDeletePagoProveedor } from 'services/api/pagoProveedorapi';

// ==============================|| ALERT - PAGO PROVEEDOR DELETE ||============================== //

interface AlertDeleteProps {
  pago: { id: number; fecha: string; monto: number } | null;
  open: boolean;
  handleClose: (deleted?: boolean) => void;
}

const AlertPagoProveedorDelete = ({ pago, open, handleClose }: AlertDeleteProps) => {
  const deletePagoMutation = useDeletePagoProveedor();

  const handleDelete = async () => {
    if (!pago?.id) return;
    try {
      await deletePagoMutation.mutateAsync(pago.id);
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
      title="¿Estás seguro de eliminar el pago?"
      content={`Estás a punto de eliminar el pago de $${pago?.monto} del ${pago?.fecha}. Esta acción es irreversible.`}
      confirmText="delete"
      cancelText="cancel"
      confirmColor="error"
    />
  );
};

export default AlertPagoProveedorDelete;
