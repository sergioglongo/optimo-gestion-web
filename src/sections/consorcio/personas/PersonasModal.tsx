import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

// project import
import { Persona, PersonaUsuario, TipoIdentificacionPersona } from 'types/persona'; // Import PersonaUsuario
import { RolUsuario } from 'types/usuario'; // Import Usuario, RolUsuario, and RolUsuarioOptions
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

// Define a combined type for Formik values
type FormValues = Omit<Persona, 'id' | 'consorcio_id' | 'Usuario' | 'rol'> & {
  id?: number;
  consorcio_id: number | null;
  tipo_identificacion: TipoIdentificacionPersona | '';
  identificacion: string;
  domicilio: string;
  localidad: string;
  provincia: string;
  telefono: string;
  email: string;
  usuario: string;
  rol: RolUsuario;
};

const PersonasModal = ({ open, modalToggler, persona }: PersonasModalProps) => {
  const isCreating = !persona;
  const { selectedConsorcio } = useSelector((state: RootState) => state.consorcio);

  const createPersonaMutation = useCreatePersona();
  const updatePersonaMutation = useUpdatePersona();

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().max(255).required('El nombre es requerido'),
    apellido: Yup.string().max(255).required('El apellido es requerido'),
    tipo: Yup.string().oneOf(['persona fisica', 'persona juridica']).required('El tipo es requerido'),
    tipo_identificacion: Yup.string().nullable(),
    identificacion: Yup.string().nullable(),
    domicilio: Yup.string().nullable(),
    localidad: Yup.string().nullable(),
    provincia: Yup.string().nullable(),
    telefono: Yup.string().nullable(),
    email: Yup.string().email('Debe ser un email válido').required('El email es requerido'),
    usuario: Yup.string().nullable(),
    rol: Yup.string().oneOf(['administrador', 'usuario', 'visitante']).required('El rol es requerido')
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      id: persona?.id,
      nombre: persona?.nombre || '',
      apellido: persona?.apellido || '',
      tipo: persona?.tipo || 'persona fisica',
      consorcio_id: selectedConsorcio?.id || null,
      tipo_identificacion: persona?.tipo_identificacion || 'documento',
      identificacion: persona?.identificacion || '',
      domicilio: persona?.domicilio || '',
      localidad: persona?.localidad || '',
      provincia: persona?.provincia || '',
      telefono: persona?.telefono || '',
      email: persona?.Usuario?.email || '',
      usuario: persona?.Usuario?.usuario || '',
      rol: 'usuario'
    },
    enableReinitialize: true,
    validationSchema,
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
