import ConfirmationDialog from 'components/Modal/ConfirmationDialog';
// TODO: Implement and import useDeleteCuenta from 'services/api/cuentaapi'

// ==============================|| ALERT - CUENTA DELETE ||============================== //

interface AlertDeleteProps {
  id: string | number;
  title: string;
  open: boolean;
  handleClose: (deleted: boolean) => void;
}

const AlertCuentaDelete = ({ id, title, open, handleClose }: AlertDeleteProps) => {
  // const deleteCuentaMutation = useDeleteCuenta();

  const handleDelete = async () => {
    if (!id) return;
    try {
      // await deleteCuentaMutation.mutateAsync(id);
      console.log(`(Placeholder) Deleting cuenta with id: ${id}`);
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
      content={`Estás a punto de eliminar la cuenta "${title}". Esta acción es irreversible.`}
      confirmText="Delete"
      cancelText="Cancel"
      confirmColor="error"
    />
  );
};

export default AlertCuentaDelete;
