import { Form, FormikProvider, useFormik } from 'formik';
import { useMemo, useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';

// project import
import { PagoProveedorCreateData } from 'types/pagoProveedor';
import { Gasto } from 'types/gasto';
import Modal from 'components/Modal/ModalBasico';
import PagoProveedorForm from './PagoProveedorForm';
import { useCreatePagoProveedor } from 'services/api/pagoProveedorapi';
import { useGetGastos } from 'services/api/gastosapi';
import * as Yup from 'yup';
import useConsorcio from 'hooks/useConsorcio';
import useAuth from 'hooks/useAuth';

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
}

const PagoProveedorModal = ({ open, modalToggler }: PagoProveedorModalProps) => {
  const { selectedConsorcio } = useConsorcio();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const createPagoMutation = useCreatePagoProveedor();

  // Estado local para manejar el proveedor_id y romper la dependencia circular
  const [currentProveedorId, setCurrentProveedorId] = useState<number | null>(null);

  const { data: gastosDelProveedor = [], isLoading: isLoadingGastos } = useGetGastos(
    {
      consorcio_id: selectedConsorcio?.id || 0,
      proveedor_id: currentProveedorId === null ? undefined : currentProveedorId, // Convertir null a undefined
      // Al crear, solo traemos los gastos con deuda.
      adeudada: true
    },
    {
      enabled: !!selectedConsorcio?.id && !!currentProveedorId
    }
  );

  // Definir el validationSchema usando useMemo para que se re-evalúe cuando gastosDelProveedor cambie
  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      proveedor_id: Yup.number().min(1, 'El proveedor es requerido').required('El proveedor es requerido'),
      gasto_id: Yup.number().min(1, 'Debe seleccionar un gasto a pagar').required('Debe seleccionar un gasto a pagar'),
      cuenta_id: Yup.number().min(1, 'La cuenta es requerida').required('La cuenta es requerida'),
      monto: Yup.number()
        .min(0.01, 'El monto debe ser mayor a 0')
        .required('El monto es requerido')
        .test('max-monto', 'El monto no puede superar la deuda pendiente', function (value) {
          const { gasto_id } = this.parent;
          const gastoSeleccionado = gastosDelProveedor.find((g: Gasto) => g.id === gasto_id);
          if (!gastoSeleccionado || value === undefined) return true; // Pasa si no hay gasto seleccionado o no hay valor

          // Calcular la deuda actual del gasto seleccionado
          const currentDeuda = (Number(gastoSeleccionado.monto) || 0) - (Number(gastoSeleccionado.saldado) || 0);
          const maxAmount = currentDeuda > 0 ? currentDeuda : Number(gastoSeleccionado.monto) || 0;
          return value <= maxAmount;
        }),
      fecha: Yup.date().required('La fecha es requerida'),
      tipo_pago: Yup.string().oneOf(['impago', 'parcial', 'total']).required('El tipo de pago es requerido'),
      comentario: Yup.string().nullable()
    });
  }, [gastosDelProveedor]);

  const formik = useFormik<any>({
    initialValues: {
      gasto_id: null,
      proveedor_id: null,
      cuenta_id: null,
      monto: '',
      fecha: getTodayDateString(),
      tipo_pago: 'total',
      comentario: ''
    },
    enableReinitialize: true,
    validationSchema, // Ahora validationSchema está disponible y se pasa aquí
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (!user?.id) {
          enqueueSnackbar('No se pudo obtener la información del usuario. Por favor, inicie sesión nuevamente.', {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'center' }
          });
          setSubmitting(false);
          return;
        }
        if (values.fecha > getTodayDateString()) {
          enqueueSnackbar('La fecha de pago no puede ser futura.', {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'center' }
          });
          setSubmitting(false);
          return;
        }

        await createPagoMutation.mutateAsync({ pagoData: values as PagoProveedorCreateData, usuario_id: user.id });

        resetForm();
        modalToggler(false);
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  // Sincronizar el proveedor_id del formulario con el estado local para el hook de gastos
  useEffect(() => {
    // Solo actualiza si el proveedor en el formulario es diferente al proveedor actual
    // y el proveedor del formulario no es nulo (evita reseteos en la carga inicial).
    if (formik.values.proveedor_id && formik.values.proveedor_id !== currentProveedorId) {
      setCurrentProveedorId(formik.values.proveedor_id);
      // También limpiar el gasto_id y monto si el proveedor cambia
      formik.setFieldValue('gasto_id', null);
      formik.setFieldValue('monto', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.proveedor_id, currentProveedorId, formik.setFieldValue]);

  return (
    <Modal
      open={open}
      onClose={() => {
        modalToggler(false);
        formik.resetForm();
      }}
      title="Nuevo Pago a Proveedor"
      cancelButtonLabel="Cancelar"
      confirmButtonLabel="Agregar"
      onConfirm={formik.handleSubmit}
      isSubmitting={formik.isSubmitting || !selectedConsorcio}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
          <PagoProveedorForm gastosDelProveedor={gastosDelProveedor} isLoadingGastos={isLoadingGastos} />
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default PagoProveedorModal;
