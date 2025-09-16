import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

// project import
import { Cuenta } from 'types/cuenta';
import Modal from 'components/Modal/ModalBasico';
import CuentaForm from './CuentaForm';
import { useCreateCuenta, useUpdateCuenta } from 'services/api/cuentasapi';
import { RootState } from 'store';

// ==============================|| CUENTA MODAL ||============================== //

interface CuentasModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  cuenta: Cuenta | null;
}

const CuentasModal = ({ open, modalToggler, cuenta }: CuentasModalProps) => {
  const isCreating = !cuenta;
  const { selectedConsorcio } = useSelector((state: RootState) => state.consorcio);

  const createCuentaMutation = useCreateCuenta();
  const updateCuentaMutation = useUpdateCuenta();

  const validationSchema = Yup.object().shape({
    descripcion: Yup.string().max(255).required('La descripción es requerida'),
    tipo: Yup.string().oneOf(['corriente', 'ahorro', 'caja', 'otro']).required('El tipo es requerido')
  });

  const formik = useFormik<Omit<Cuenta, 'id' | 'consorcio_id'> & { id?: number; consorcio_id: number | null }>({
    initialValues: {
      id: cuenta?.id,
      descripcion: cuenta?.descripcion || '',
      tipo: cuenta?.tipo || 'corriente',
      consorcio_id: selectedConsorcio?.id || null
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (!selectedConsorcio?.id) {
          throw new Error('No hay un consorcio seleccionado.');
        }
        const finalValues = { ...values, consorcio_id: selectedConsorcio.id };

        if (isCreating) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...dataToCreate } = finalValues;
          await createCuentaMutation.mutateAsync({ cuentaData: dataToCreate, consorcio_id: selectedConsorcio?.id });
        } else {
          await updateCuentaMutation.mutateAsync({ cuentaId: cuenta!.id, cuentaData: finalValues });
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
        formik.resetForm(); // Reset Formik state on close
      }}
      title={isCreating ? 'Nueva Cuenta' : 'Editar Cuenta'}
      cancelButtonLabel="Cancelar"
      confirmButtonLabel={isCreating ? 'Agregar' : 'Guardar'}
      onConfirm={handleSubmit}
      isSubmitting={isSubmitting || !selectedConsorcio}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <CuentaForm />
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default CuentasModal;
