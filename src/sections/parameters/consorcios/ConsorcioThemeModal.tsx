import { useState, useEffect } from 'react';

// material-ui
import { Box } from '@mui/material';

// project import
import Modal from 'components/Modal/ModalBasico';
import ColorScheme from 'layout/Dashboard/Header/HeaderContent/Customization/ColorScheme';
import { useUpdateConsorcio } from 'services/api/consorciosapi';
import useAuth from 'hooks/useAuth';

// types
import { Consorcio } from 'types/consorcio';
import { PresetColor } from 'types/config';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';

interface ConsorcioThemeModalProps {
  open: boolean;
  onClose: () => void;
  consorcio: Consorcio | null;
}

const ConsorcioThemeModal = ({ open, onClose, consorcio }: ConsorcioThemeModalProps) => {
  const { user } = useAuth();
  const updateConsorcioMutation = useUpdateConsorcio();
  const [selectedTheme, setSelectedTheme] = useState<PresetColor>('default');

  useEffect(() => {
    if (consorcio) {
      setSelectedTheme(consorcio.theme);
    }
  }, [consorcio]);

  const handleSave = async () => {
    if (!consorcio || !user?.id) return;

    try {
      await updateConsorcioMutation.mutateAsync({
        consorcioId: consorcio.id,
        consorcioData: { theme: selectedTheme },
        usuario_id: user.id
      });
      openSnackbar({
        open: true,
        message: 'Tema actualizado con éxito.',
        variant: 'alert',
        alert: { color: 'success' }
      } as SnackbarProps);
      onClose();
    } catch (error: any) {
      openSnackbar({
        open: true,
        message: error.message || 'Error al actualizar el tema.',
        variant: 'alert',
        alert: { color: 'error' }
      } as SnackbarProps);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Seleccionar Tema para ${consorcio?.nombre}`}
      confirmButtonLabel="Guardar"
      cancelButtonLabel="Cancelar"
      onConfirm={handleSave}
      isSubmitting={updateConsorcioMutation.isLoading}
    >
      <Box sx={{ p: 2 }}>
        <ColorScheme value={selectedTheme} onChange={setSelectedTheme} />
      </Box>
    </Modal>
  );
};

export default ConsorcioThemeModal;
