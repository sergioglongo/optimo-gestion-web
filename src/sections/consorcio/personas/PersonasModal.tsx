import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

// project import
import { Persona, PersonaUsuario } from 'types/persona'; // Import PersonaUsuario
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
    tipo_persona: Yup.string().oneOf(['persona fisica', 'persona juridica']).required('El tipo es requerido'),
    tipo_identificacion: Yup.string().nullable(),
    identificacion: Yup.string().nullable().max(50, 'La identificación es muy larga'),
    Domicilio: Yup.object().shape({
      direccion: Yup.string().max(255, 'La dirección es muy larga').nullable(),
      localidad: Yup.string().nullable(),
      provincia: Yup.string().nullable()
    }),
    telefono: Yup.string().nullable(),
    email: Yup.string().email('Debe ser un email válido').required('El email es requerido'),
    usuario: Yup.string().nullable(),
    rol: Yup.string().oneOf(['administrador', 'usuario', 'visitante']).required('El rol es requerido')
  });

  const initialValues: PersonaUsuario = {
    id: persona?.id,
    nombre: persona?.nombre || '',
    apellido: persona?.apellido || '',
    tipo_persona: persona?.tipo_persona || 'persona fisica',
    consorcio_id: persona?.consorcio_id || selectedConsorcio?.id || 0,
    tipo_identificacion: persona?.tipo_identificacion || 'documento',
    identificacion: persona?.identificacion || '',
    Domicilio: isCreating
      ? {
          // id: 0, // No se envía el id al crear un nuevo domicilio
          direccion: selectedConsorcio?.Domicilio?.direccion || '',
          provincia: selectedConsorcio?.Domicilio?.provincia || '',
          localidad: selectedConsorcio?.Domicilio?.localidad || ''
        }
      : persona?.Domicilio || null,
    telefono: persona?.telefono || '',
    email: persona?.Usuario?.email || '',
    usuario: persona?.Usuario?.usuario || '',
    activa: persona?.activa ?? true,
    rol: 'usuario'
  };

  const formik = useFormik<PersonaUsuario>({
    initialValues: initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (!selectedConsorcio?.id) {
          throw new Error('No hay un consorcio seleccionado.');
        }

        // Generate username if creating, otherwise use the existing one.
        const finalUsuario = isCreating
          ? `${values.nombre.trim()}.${values.apellido.trim()}`.toLowerCase().replace(/\s+/g, '')
          : values.usuario;

        const { email, rol, ...rest } = values;

        const personausuario: PersonaUsuario = {
          ...rest,
          email,
          usuario: finalUsuario,
          rol, // El rol del usuario (siempre 'usuario' en este caso)
          consorcio_id: selectedConsorcio.id
        };

        if (isCreating) {
          await createPersonaMutation.mutateAsync({ personausuario });
        } else {
          await updatePersonaMutation.mutateAsync({ personausuario });
        }
        resetForm();
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
        formik.resetForm();
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
