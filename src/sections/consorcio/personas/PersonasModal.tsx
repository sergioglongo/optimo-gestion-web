import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

// project import
import { Persona } from 'types/persona';
import Modal from 'components/Modal/ModalBasico';
import PersonaForm from './PersonaForm';
import { useCreatePersona, useUpdatePersona } from 'services/api/personasapi'; // Assuming new API hooks
import { RootState } from 'store';

// ==============================|| PERSONA MODAL ||============================== //

interface PersonasModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  persona: Persona | null;
}

const PersonasModal = ({ open, modalToggler, persona }: PersonasModalProps) => {
  const isCreating = !persona;
  const { selectedConsorcio } = useSelector((state: RootState) => state.consorcio);

  const createPersonaMutation = useCreatePersona();
  const updatePersonaMutation = useUpdatePersona();

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().max(255).required('El nombre es requerido'),
    apellido: Yup.string().max(255).required('El apellido es requerido'),
    dni: Yup.string().max(20).required('El DNI es requerido'),
    tipo: Yup.string().oneOf(['propietario', 'inquilino', 'administrador', 'otro']).required('El tipo es requerido')
  });

  const formik = useFormik<Omit<Persona, 'id' | 'consorcio_id'> & { id?: number; consorcio_id: number | null }>({
    initialValues: {
      id: persona?.id,
      nombre: persona?.nombre || '',
      apellido: persona?.apellido || '',
      dni: persona?.dni || '',
      tipo: persona?.tipo || 'propietario',
      consorcio_id: selectedConsorcio?.id || null
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!selectedConsorcio?.id) {
          throw new Error('No hay un consorcio seleccionado.');
        }
        const finalValues = { ...values, consorcio_id: selectedConsorcio.id };

        if (isCreating) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...dataToCreate } = finalValues;
          await createPersonaMutation.mutateAsync({ personaData: dataToCreate, consorcio_id: selectedConsorcio?.id });
        } else {
          await updatePersonaMutation.mutateAsync({ personaId: persona!.id, personaData: finalValues });
        }
        modalToggler(false);
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const { handleSubmit, isSubmitting } = formik;

  return (
    <Modal
      open={open}
      onClose={() => {
        modalToggler(false);
        formik.resetForm(); // Reset Formik state on close
      }}
      title={isCreating ? 'Nueva Persona' : 'Editar Persona'}
      cancelButtonLabel="Cancelar"
      confirmButtonLabel={isCreating ? 'Agregar' : 'Guardar'}
      onConfirm={handleSubmit}
      isSubmitting={isSubmitting || !selectedConsorcio}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <PersonaForm />
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default PersonasModal;