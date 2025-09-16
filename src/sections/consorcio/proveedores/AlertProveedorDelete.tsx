import ConfirmationDialog from 'components/Modal/ConfirmationDialog';
import { useDeleteProveedor } from 'services/api/proveedoresapi';

// ==============================|| ALERT - PROVEEDOR DELETE ||============================== //

interface AlertDeleteProps {
  id: string | number;
  title: string;
  open: boolean;
  handleClose: (deleted: boolean) => void;
}

const AlertProveedorDelete = ({ id, title, open, handleClose }: AlertDeleteProps) => {
  const deleteProveedorMutation = useDeleteProveedor();

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteProveedorMutation.mutateAsync(Number(id));
      handleClose(true); // Indicate success
    } catch (error) {
      console.error(error);
      handleClose(false); // Indicate failure
    }
  };

  return (
    <ConfirmationDialog
      open={open}
      onClose={() => handleClose(false)}
      onConfirm={handleDelete}
      title="¿Estás seguro de eliminar?"
      content={`Estás a punto de eliminar el proveedor "${title}". Esta acción es irreversible.`}
      confirmText="Delete"
      cancelText="Cancel"
      confirmColor="error"
    />
  );
};

export default AlertProveedorDelete;
