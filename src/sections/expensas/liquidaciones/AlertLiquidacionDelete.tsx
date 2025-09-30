import ConfirmationDialog from 'components/Modal/ConfirmationDialog';
import { useDeleteLiquidacion } from 'services/api/liquidacionapi'; // Asumiendo que existe

// ==============================|| ALERT - LIQUIDACION DELETE ||============================== //

interface AlertDeleteProps {
  liquidacion: { id: number; periodo: string } | null;
  open: boolean;
  handleClose: (deleted: boolean) => void;
}

const AlertLiquidacionDelete = ({ liquidacion, open, handleClose }: AlertDeleteProps) => {
  const deleteLiquidacionMutation = useDeleteLiquidacion();

  const handleDelete = async () => {
    if (!liquidacion?.id) return;
    try {
      await deleteLiquidacionMutation.mutateAsync(liquidacion.id);
      handleClose(true); // Indicar éxito
    } catch (error) {
      console.error(error);
      handleClose(false); // Indicar fallo
    }
  };

  return (
    <ConfirmationDialog
      open={open}
      onClose={() => handleClose(false)}
      onConfirm={handleDelete}
      title="¿Estás seguro de eliminar?"
      content={`Estás a punto de eliminar la liquidación del período "${liquidacion?.periodo}". Esta acción es irreversible.`}
      confirmText="delete"
      cancelText="cancel"
      confirmColor="error"
    />
  );
};

export default AlertLiquidacionDelete;
