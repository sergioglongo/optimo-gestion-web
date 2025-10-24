import { Form, FormikProvider, useFormik } from 'formik';
import { useMemo } from 'react';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

// project import
import { PagoProveedor } from 'types/pagoProveedor';
import Modal from 'components/Modal/ModalBasico';
import { useUpdatePagoProveedor } from 'services/api/pagoProveedorapi';
import useAuth from 'hooks/useAuth';
import PagoProveedorEditForm from './PagoProveedorEditForm';

// Helper function to get today's date as YYYY-MM-DD string
const getTodayDateString = () => {
  const today = new Date();
  return new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
};

// ==============================|| PAGO PROVEEDOR EDIT MODAL ||============================== //

interface PagoProveedorEditModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  pago: PagoProveedor; // El pago nunca es nulo aquí
}

const PagoProveedorEditModal = ({ open, modalToggler, pago }: PagoProveedorEditModalProps) => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const updatePagoMutation = useUpdatePagoProveedor();

  const validationSchema = useMemo(() => {
    // La deuda máxima se calcula como la deuda que existía ANTES de este pago.
    const deudaAntesDeEstePago = (Number(pago.Gasto?.monto) || 0) - ((Number(pago.Gasto?.saldado) || 0) - (Number(pago.monto) || 0));

    return Yup.object().shape({
      cuenta_id: Yup.number().min(1, 'La cuenta es requerida').required('La cuenta es requerida'),
      monto: Yup.number()
        .min(0.01, 'El monto debe ser mayor a 0')
        .required('El monto es requerido')
        .max(deudaAntesDeEstePago, `El monto no puede superar la deuda original de $${deudaAntesDeEstePago.toLocaleString('es-AR')}`),
      fecha: Yup.date().required('La fecha es requerida'),
      comentario: Yup.string().nullable()
    });
  }, [pago]);

  const formik = useFormik({
    initialValues: {
      // Los IDs de proveedor y gasto no se cambian, pero se mantienen para la lógica del tipo de pago
      proveedor_id: pago.proveedor_id,
      gasto_id: pago.gasto_id,
      // Campos editables
      cuenta_id: pago.cuenta_id || null,
      monto: pago.monto || '',
      fecha: pago.fecha ? pago.fecha.split('T')[0] : getTodayDateString(),
      tipo_pago: pago.tipo_pago || 'total',
      comentario: pago.comentario || ''
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (!user?.id) {
          enqueueSnackbar('No se pudo obtener la información del usuario.', { variant: 'error' });
          setSubmitting(false);
          return;
        }
        if (values.fecha > getTodayDateString()) {
          enqueueSnackbar('La fecha de pago no puede ser futura.', { variant: 'error' });
          setSubmitting(false);
          return;
        }

        // Prepara los datos para el envío, asegurando la compatibilidad de tipos.
        const submissionData = {
          ...values,
          cuenta_id: values.cuenta_id === null ? undefined : values.cuenta_id, // Convierte null a undefined
          monto: Number(values.monto) // Asegura que el monto sea un número
        };

        await updatePagoMutation.mutateAsync({ pagoId: pago.id, pagoData: submissionData, usuario_id: user.id });

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
      title="Editar Pago"
      cancelButtonLabel="Cancelar"
      confirmButtonLabel="Guardar Cambios"
      onConfirm={formik.handleSubmit}
      isSubmitting={formik.isSubmitting}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
          <PagoProveedorEditForm pago={pago} />
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default PagoProveedorEditModal;
