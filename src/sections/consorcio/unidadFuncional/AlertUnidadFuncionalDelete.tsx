import ConfirmationDialog from 'components/Modal/ConfirmationDialog';
// TODO: Implement and import useDeleteunidadFuncional from 'services/api/unidadFuncionalapi'

// ==============================|| ALERT - UNIDAD FUNCIONAL DELETE ||============================== //

interface AlertDeleteProps {
  id: string | number;
  title: string;
  open: boolean;
  handleClose: (deleted: boolean) => void;
}

const AlertunidadFuncionalDelete = ({ id, title, open, handleClose }: AlertDeleteProps) => {
  // const deleteunidadFuncionalMutation = useDeleteunidadFuncional();

  const handleDelete = async () => {
    if (!id) return;
    try {
      // await deleteunidadFuncionalMutation.mutateAsync(id);
      console.log(`(Placeholder) Deleting unidad funcional with id: ${id}`);
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
      content={`Estás a punto de eliminar la unidad funcional "${title}". Esta acción es irreversible.`}
      confirmText="Delete"
      cancelText="Cancel"
      confirmColor="error"
    />
  );
};

export default AlertunidadFuncionalDelete;
