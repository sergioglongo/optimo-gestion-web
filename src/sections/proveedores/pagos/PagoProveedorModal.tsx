import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

// project import
import { PagoProveedor, PagoProveedorCreateData } from 'types/pagoProveedor';
import { Gasto } from 'types/gasto';
import Modal from 'components/Modal/ModalBasico';
import PagoProveedorForm from './PagoProveedorForm';
import { useCreatePagoProveedor, useUpdatePagoProveedor } from 'services/api/pagoProveedorapi';
import { useGetGastos } from 'services/api/gastosapi';
import useConsorcio from 'hooks/useConsorcio';

// Helper function to get today's date as YYYY-MM-DD string, avoiding timezone issues from toISOString()
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ==============================|| PAGO PROVEEDOR MODAL ||============================== //

interface PagoProveedorModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  pago: PagoProveedor | null;
}

const PagoProveedorModal = ({ open, modalToggler, pago }: PagoProveedorModalProps) => {
  const isCreating = !pago;
  const { selectedConsorcio } = useConsorcio();
  const { enqueueSnackbar } = useSnackbar();

  const createPagoMutation = useCreatePagoProveedor();
  const updatePagoMutation = useUpdatePagoProveedor();

  const validationSchema = Yup.object().shape({
    proveedor_id: Yup.number().min(1, 'El proveedor es requerido').required('El proveedor es requerido'),
    gasto_id: Yup.number().min(1, 'Debe seleccionar un gasto a pagar').required('Debe seleccionar un gasto a pagar'),
    cuenta_id: Yup.number().min(1, 'La cuenta es requerida').required('La cuenta es requerida'),
    monto: Yup.number().min(0.01, 'El monto debe ser mayor a 0').required('El monto es requerido'),
    fecha: Yup.date().required('La fecha es requerida'),
    tipo_pago: Yup.string().oneOf(['impago', 'parcial', 'total']).required('El tipo de pago es requerido'),
    comentario: Yup.string().nullable()
  });

  const formik = useFormik<any>({
    initialValues: {
      gasto_id: pago?.gasto_id || null,
      proveedor_id: pago?.proveedor_id || null,
      cuenta_id: pago?.cuenta_id || null,
      monto: pago?.monto || '',
      fecha: pago?.fecha ? pago.fecha.split('T')[0] : getTodayDateString(),
      tipo_pago: pago?.tipo_pago || 'total',
      comentario: pago?.comentario || ''
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const todayString = getTodayDateString();
        if (values.fecha > todayString) {
          enqueueSnackbar('La fecha de pago no puede ser futura.', {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center'
            }
          });
          setSubmitting(false);
          return;
        }
        const gastoSeleccionado = gastosDelProveedor.find((g: Gasto) => g.id === values.gasto_id);

        if (gastoSeleccionado) {
          const maxAmount = gastoSeleccionado.deuda && gastoSeleccionado.deuda > 0 ? gastoSeleccionado.deuda : gastoSeleccionado.monto;
          const montoIngresado = parseFloat(values.monto);

          if (montoIngresado > maxAmount) {
            enqueueSnackbar(`El monto a pagar no puede superar el monto adeudado ($${maxAmount.toLocaleString('es-AR')}).`, {
              variant: 'error',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center'
              }
            });
            setSubmitting(false);
            return;
          }
        }

        if (isCreating) {
          await createPagoMutation.mutateAsync(values as PagoProveedorCreateData);
        } else {
          await updatePagoMutation.mutateAsync({ pagoId: pago!.id, pagoData: values });
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

  const { data: gastosDelProveedor = [], isLoading: isLoadingGastos } = useGetGastos(
    {
      consorcio_id: selectedConsorcio?.id || 0,
      proveedor_id: formik.values.proveedor_id,
      adeudada: true
    },
    {
      enabled: !!selectedConsorcio?.id && !!formik.values.proveedor_id
    }
  );

  return (
    <Modal
      open={open}
      onClose={() => {
        modalToggler(false);
        formik.resetForm();
      }}
      title={isCreating ? 'Nuevo Pago a Proveedor' : 'Editar Pago'}
      cancelButtonLabel="Cancelar"
      confirmButtonLabel={isCreating ? 'Agregar' : 'Guardar'}
      onConfirm={formik.handleSubmit}
      isSubmitting={formik.isSubmitting || !selectedConsorcio}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <PagoProveedorForm gastosDelProveedor={gastosDelProveedor} isLoadingGastos={isLoadingGastos} />
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default PagoProveedorModal;
