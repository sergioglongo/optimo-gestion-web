import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react'; // Import useState

// project import
import { Consorcio } from 'types/consorcio';
import Modal from 'components/Modal/ModalBasico';
import ConsorcioForm from './ConsorcioForm';
import { useCreateConsorcio, useUpdateConsorcio } from 'services/api/consorciosapi';
import useAuth from 'hooks/useAuth'; // Import useAuth

// ==============================|| CONSORCIO MODAL ||============================== //

interface ConsorcioModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  consorcio: Consorcio | null;
}

const ConsorcioModal = ({ open, modalToggler, consorcio }: ConsorcioModalProps) => {
  const isCreating = !consorcio;
  const [imageFile, setImageFile] = useState<File | undefined>(undefined); // State for image file

  const { user } = useAuth(); // Get user from useAuth
  const usuario_id = user?.id || 0; // Get usuario_id

  const createConsorcioMutation = useCreateConsorcio();
  const updateConsorcioMutation = useUpdateConsorcio();

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().max(255).required('El nombre es requerido'),
    Domicilio: Yup.object().shape({
      direccion: Yup.string().max(255).required('La dirección es requerida'),
      provincia_id: Yup.string().nullable(),
      localidad_id: Yup.string().nullable()
    }),
    condicion_fiscal: Yup.string().nullable(),
    identificacion: Yup.string().nullable(),
    notas: Yup.string().nullable(),
    tipo: Yup.string().nullable(),
    tipo_interes: Yup.string().nullable(),
    modalidad: Yup.string().nullable(),
    vencimiento1: Yup.number().nullable().min(1, 'Debe ser un número positivo').max(31, 'Debe ser un día del mes'),
    vencimiento1valor: Yup.number().nullable().min(0, 'Debe ser un número positivo'),
    vencimiento2: Yup.number().nullable().min(1, 'Debe ser un número positivo').max(31, 'Debe ser un día del mes'),
    vencimiento2valor: Yup.number().nullable().min(0, 'Debe ser un número positivo'),
    dia_cierre: Yup.number().required('El día de cierre es requerido').min(1, 'Debe ser un día válido').max(31, 'Debe ser un día válido'),
    identificador1: Yup.string().nullable(),
    identificador2: Yup.string().nullable(),
    identificador3: Yup.string().nullable(),
    imagen: Yup.string().nullable(),
    prorrateo: Yup.string().oneOf(['auto', 'libre']).required('El tipo de prorrateo es requerido')
  });

  const formik = useFormik<Consorcio>({
    initialValues: {
      id: consorcio?.id || 0, // Assuming ID is handled by the backend for new entries
      nombre: consorcio?.nombre || '',
      Domicilio: consorcio?.Domicilio || {
        direccion: null,
        provincia_id: null,
        localidad_id: null
      },
      condicion_fiscal: consorcio?.condicion_fiscal || null,
      identificacion: consorcio?.identificacion || null,
      notas: consorcio?.notas || null,
      tipo: consorcio?.tipo || null,
      tipo_interes: consorcio?.tipo_interes || null,
      modalidad: consorcio?.modalidad || null,
      vencimiento1: consorcio?.vencimiento1 || null,
      vencimiento1valor: consorcio?.vencimiento1valor ?? 0,
      vencimiento2: consorcio?.vencimiento2 || null,
      vencimiento2valor: consorcio?.vencimiento2valor ?? 0,
      dia_cierre: consorcio?.dia_cierre || 25,
      ultimo_periodo_liquidado: consorcio?.ultimo_periodo_liquidado || null,
      identificador1: consorcio?.identificador1 || '',
      identificador2: consorcio?.identificador2 || '',
      identificador3: consorcio?.identificador3 || '',
      imagen: consorcio?.imagen || null,
      prorrateo: consorcio?.prorrateo || 'auto',
      activo: consorcio?.activo || true,
      theme: consorcio?.theme || 'default'
    },
    enableReinitialize: true, // Add this line
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // Transform Domicilio to domicilio for the API
        const { Domicilio, ...rest } = values;
        const apiData = {
          ...rest,
          Domicilio
        };

        if (isCreating) {
          // For creation, omit the 'id' field as it should be assigned by the backend
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id: _id, ...dataToCreate } = apiData;
          await createConsorcioMutation.mutateAsync({ consorcioData: dataToCreate, imageFile, usuario_id });
        } else {
          await updateConsorcioMutation.mutateAsync({ consorcioId: values.id, consorcioData: apiData, imageFile, usuario_id });
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

  const { handleSubmit } = formik;
  const isSubmitting = formik.isSubmitting || createConsorcioMutation.isLoading || updateConsorcioMutation.isLoading;

  return (
    <Modal
      open={open}
      onClose={() => {
        modalToggler(false);
        formik.resetForm(); // Reset Formik state on close
      }}
      title={isCreating ? 'Nuevo Consorcio' : 'Editar Consorcio'}
      cancelButtonLabel="Cancelar"
      confirmButtonLabel={isCreating ? 'Agregar' : 'Guardar'}
      onConfirm={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <ConsorcioForm formik={formik} isCreating={isCreating} setImageFile={setImageFile} />
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default ConsorcioModal;
