import ConfirmationDialog from 'components/Modal/ConfirmationDialog';
// TODO: Implement and import useDeleteUnidadOperativa from 'services/api/unidadOperativaapi'

// ==============================|| ALERT - UNIDAD OPERATIVA DELETE ||============================== //

interface AlertDeleteProps {
  id: string | number;
  title: string;
  open: boolean;
  handleClose: (deleted: boolean) => void;
}

const AlertUnidadOperativaDelete = ({ id, title, open, handleClose }: AlertDeleteProps) => {
  // const deleteUnidadOperativaMutation = useDeleteUnidadOperativa();

  const handleDelete = async () => {
    if (!id) return;
    try {
      // await deleteUnidadOperativaMutation.mutateAsync(id);
      console.log(`(Placeholder) Deleting unidad operativa with id: ${id}`);
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
      content={`Estás a punto de eliminar la unidad operativa "${title}". Esta acción es irreversible.`}
      confirmText="Delete"
      cancelText="Cancel"
      confirmColor="error"
    />
  );
};

export default AlertUnidadOperativaDelete;
