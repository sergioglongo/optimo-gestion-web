import { Form, FormikProvider, useFormik } from 'formik';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';

// project import
import { PagoLiquidacionUnidadCreateData } from 'types/pagoLiquidacionUnidad';
import Modal from 'components/Modal/ModalBasico';
import { Box, Typography } from '@mui/material';
import DeudorPagoForm from './DeudorPagoForm';
import { useCreatePagoLiquidacionUnidad } from 'services/api/pagoLiquidacionUnidadapi';
import useAuth from 'hooks/useAuth';
import useConsorcio from 'hooks/useConsorcio';
import { DeudorLiquidacionUnidad } from 'types/liquidacion';

// Helper function to get today's date as YYYY-MM-DD string
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ==============================|| PAGO DEUDOR MODAL ||============================== //

interface DeudorPagoModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  deuda: DeudorLiquidacionUnidad | null;
  unidadFuncionalId: number | null;
}

const DeudorPagoModal = ({ open, modalToggler, deuda, unidadFuncionalId }: DeudorPagoModalProps) => {
  const { user } = useAuth();
  const { selectedConsorcio } = useConsorcio();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const createPagoMutation = useCreatePagoLiquidacionUnidad();

  const montoRestante = useMemo(() => {
    return Number(deuda?.deuda) || 0;
  }, [deuda]);

  const validationSchema = Yup.object().shape({
    persona_id: Yup.number().min(1, 'Debe seleccionar la persona que paga').required('La persona es requerida'),
    cuenta_id: Yup.number().min(1, 'La cuenta de ingreso es requerida').required('La cuenta es requerida'),
    monto: Yup.number()
      .min(0.01, 'El monto debe ser mayor a 0')
      .max(montoRestante, `El monto no puede superar la deuda restante de $${montoRestante.toLocaleString('es-AR')}`)
      .required('El monto es requerido'),
    fecha: Yup.date().required('La fecha es requerida'),
    tipo_pago: Yup.string().oneOf(['impaga', 'parcial', 'total']).required('El tipo de pago es requerido'),
    comentario: Yup.string().nullable()
  });

  const initialValues = useMemo(() => {
    return {
      liquidacion_unidad_id: deuda?.id || null,
      persona_id: null,
      cuenta_id: null,
      monto: montoRestante > 0 ? montoRestante.toFixed(2) : '',
      fecha: getTodayDateString(),
      tipo_pago: 'total',
      comentario: ''
    };
  }, [deuda, montoRestante]);

  const formik = useFormik<any>({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (!user?.id || !selectedConsorcio?.id) {
          enqueueSnackbar('No se pudo obtener la información del usuario o consorcio.', { variant: 'error' });
          setSubmitting(false);
          return;
        }

        await createPagoMutation.mutateAsync({ pagoData: values as PagoLiquidacionUnidadCreateData, usuario_id: user.id });

        // Invalidar la query de deudores para refrescar la tabla
        queryClient.invalidateQueries({ queryKey: ['deudores', { consorcio_id: selectedConsorcio.id }] });

        resetForm();
        modalToggler(false);
        enqueueSnackbar('Pago registrado con éxito.', { variant: 'success' });
      } catch (error: any) {
        enqueueSnackbar(error.message || 'Error al registrar el pago.', { variant: 'error' });
      } finally {
        setSubmitting(false);
      }
    }
  });

  const renderContent = () => {
    if (!deuda || !unidadFuncionalId) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="error">No se pudieron cargar los datos de la deuda.</Typography>
        </Box>
      );
    }
    return <DeudorPagoForm deuda={deuda} montoRestante={montoRestante} unidadFuncionalId={unidadFuncionalId} />;
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        modalToggler(false);
        formik.resetForm();
      }}
      title="Registrar Pago de Deuda"
      cancelButtonLabel="Cancelar"
      confirmButtonLabel="Registrar Pago"
      onConfirm={formik.handleSubmit}
      isSubmitting={formik.isSubmitting}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          {renderContent()}
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default DeudorPagoModal;
