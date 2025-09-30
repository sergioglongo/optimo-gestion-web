import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';

// project import
import { Transaccion } from 'types/transaccion';
import Modal from 'components/Modal/ModalBasico';
import TransaccionForm from './TransaccionForm';
import { useCreateTransaccion, useUpdateTransaccion } from 'services/api/transaccionapi';
import useConsorcio from 'hooks/useConsorcio';

// Helper
const getTodayDateString = () => new Date().toISOString().split('T')[0];

// ==============================|| TRANSACCION MODAL ||============================== //

interface TransaccionModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  transaccion: Transaccion | null;
}

const TransaccionModal = ({ open, modalToggler, transaccion }: TransaccionModalProps) => {
  const isCreating = !transaccion;
  const { selectedConsorcio } = useConsorcio();

  const createTransaccionMutation = useCreateTransaccion();
  const updateTransaccionMutation = useUpdateTransaccion();

  const validationSchema = Yup.object().shape({
    cuenta_id: Yup.number().min(1, 'La cuenta es requerida').required('La cuenta es requerida'),
    monto: Yup.number().min(0.01, 'El monto debe ser mayor a 0').required('El monto es requerido'),
    fecha: Yup.date().required('La fecha es requerida'),
    tipo_movimiento: Yup.string().oneOf(['ingreso', 'egreso']).required('El tipo de movimiento es requerido'),
    estado: Yup.string().oneOf(['completado', 'pendiente', 'anulado']).required('El estado es requerido'),
    descripcion: Yup.string().nullable()
  });

  const formik = useFormik<any>({
    initialValues: {
      consorcio_id: selectedConsorcio?.id || null,
      cuenta_id: transaccion?.cuenta_id || null,
      monto: transaccion?.monto || '',
      fecha: transaccion?.fecha ? transaccion.fecha.split('T')[0] : getTodayDateString(),
      tipo_movimiento: transaccion?.tipo_movimiento || 'egreso',
      estado: transaccion?.estado || 'completado',
      descripcion: transaccion?.descripcion || ''
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (isCreating) {
          await createTransaccionMutation.mutateAsync(values);
        } else {
          await updateTransaccionMutation.mutateAsync({ transaccionId: transaccion!.id, transaccionData: values });
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

  return (
    <Modal
      open={open}
      onClose={() => {
        modalToggler(false);
        formik.resetForm();
      }}
      title={isCreating ? 'Nueva Transacción Manual' : 'Editar Transacción'}
      cancelButtonLabel="Cancelar"
      confirmButtonLabel={isCreating ? 'Agregar' : 'Guardar'}
      onConfirm={formik.handleSubmit}
      isSubmitting={formik.isSubmitting || !selectedConsorcio}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <TransaccionForm isCreating={isCreating} />
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default TransaccionModal;
