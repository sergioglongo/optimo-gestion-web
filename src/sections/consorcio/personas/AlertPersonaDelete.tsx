import ConfirmationDialog from 'components/Modal/ConfirmationDialog';
// TODO: Implement and import useDeletePersona from 'services/api/personasapi'

// ==============================|| ALERT - PERSONA DELETE ||============================== //

interface AlertDeleteProps {
  id: string | number;
  title: string;
  open: boolean;
  handleClose: (deleted: boolean) => void;
}

const AlertPersonaDelete = ({ id, title, open, handleClose }: AlertDeleteProps) => {
  // const deletePersonaMutation = useDeletePersona();

  const handleDelete = async () => {
    if (!id) return;
    try {
      // await deletePersonaMutation.mutateAsync(id);
      console.log(`(Placeholder) Deleting persona with id: ${id}`);
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
      content={`Estás a punto de eliminar la persona "${title}". Esta acción es irreversible.`}
      confirmText="Delete"
      cancelText="Cancel"
      confirmColor="error"
    />
  );
};

export default AlertPersonaDelete;
