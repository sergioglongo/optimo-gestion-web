// project import
import { unidadFuncional } from 'types/unidadFuncional';
import Modal from 'components/Modal/ModalBasico';
import PersonaUnidadForm from './PersonaUnidadForm';
import useConsorcio from 'hooks/useConsorcio';

// assets

interface PersonaUnidadModalProps {
  open: boolean;
  onClose: () => void;
  unidadFuncional: unidadFuncional | null;
}

const PersonaUnidadModal = ({ open, onClose, unidadFuncional }: PersonaUnidadModalProps) => {
  const { selectedConsorcio } = useConsorcio();

  return (
    <Modal
      open={open}
      onClose={onClose}
      onConfirm={onClose}
      title={`Asociar Personas a: ${
        selectedConsorcio?.identificador1 ? selectedConsorcio?.identificador1 + ' ' + unidadFuncional?.identificador1 : ''
      }
      ${selectedConsorcio?.identificador2 ? selectedConsorcio?.identificador2 + ' ' + unidadFuncional?.identificador2 : ''}
      ${selectedConsorcio?.identificador3 ? selectedConsorcio?.identificador3 + ' ' + unidadFuncional?.identificador3 : ''}
      `}
      confirmButtonLabel="Cerrar"
    >
      {unidadFuncional && <PersonaUnidadForm unidadFuncional={unidadFuncional} open={open} />}
    </Modal>
  );
};

export default PersonaUnidadModal;
