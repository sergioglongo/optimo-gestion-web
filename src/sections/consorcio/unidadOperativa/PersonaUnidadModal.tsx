// project import
import { UnidadOperativa } from 'types/unidadOperativa';
import Modal from 'components/Modal/ModalBasico';
import PersonaUnidadForm from './PersonaUnidadForm';
import useConsorcio from 'hooks/useConsorcio';

// assets

interface PersonaUnidadModalProps {
  open: boolean;
  onClose: () => void;
  unidadOperativa: UnidadOperativa | null;
}

const PersonaUnidadModal = ({ open, onClose, unidadOperativa }: PersonaUnidadModalProps) => {
  const { selectedConsorcio } = useConsorcio();

  return (
    <Modal
      open={open}
      onClose={onClose}
      onConfirm={onClose}
      title={`Asociar Personas a: ${
        selectedConsorcio?.identificador1 ? selectedConsorcio?.identificador1 + ' ' + unidadOperativa?.identificador1 : ''
      }
      ${selectedConsorcio?.identificador2 ? selectedConsorcio?.identificador2 + ' ' + unidadOperativa?.identificador2 : ''}
      ${selectedConsorcio?.identificador3 ? selectedConsorcio?.identificador3 + ' ' + unidadOperativa?.identificador3 : ''}
      `}
      confirmButtonLabel="Cerrar"
    >
      {unidadOperativa && <PersonaUnidadForm unidadOperativa={unidadOperativa} open={open} />}
    </Modal>
  );
};

export default PersonaUnidadModal;
