import { Form, FormikProvider, useFormik } from 'formik';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';

// project import
import { PagoLiquidacionUnidadCreateData } from 'types/pagoLiquidacionUnidad';
import Modal from 'components/Modal/ModalBasico';
import { Box, CircularProgress, Typography } from '@mui/material';
import PagoLiquidacionUnidadForm from './PagoLiquidacionUnidadForm';
import { useCreatePagoLiquidacionUnidad } from 'services/api/pagoLiquidacionUnidadapi';
import { useGetLiquidacionUnidadById } from 'services/api/liquidacionUnidadapi';
import useAuth from 'hooks/useAuth';
import useConsorcio from 'hooks/useConsorcio';

// Helper function to get today's date as YYYY-MM-DD string
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ==============================|| PAGO LIQUIDACION UNIDAD MODAL ||============================== //

interface PagoLiquidacionUnidadModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  liquidacionUnidadId: number | null;
}

const PagoLiquidacionUnidadModal = ({ open, modalToggler, liquidacionUnidadId }: PagoLiquidacionUnidadModalProps) => {
  const { user } = useAuth();
  const { selectedConsorcio } = useConsorcio();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const {
    data: liquidacionUnidad,
    isLoading,
    isError
  } = useGetLiquidacionUnidadById(liquidacionUnidadId!, {
    enabled: !!liquidacionUnidadId && open,
    staleTime: 1000 * 60 * 5 // 5 minutos de caché
  });

  const createPagoMutation = useCreatePagoLiquidacionUnidad();

  const interesCalculado = useMemo(() => {
    if (!liquidacionUnidad || !liquidacionUnidad.Liquidacion?.periodo || !selectedConsorcio) return 0;

    const montoExpensa = Number(liquidacionUnidad.monto) || 0;
    const { primer_vencimiento, primer_vencimiento_recargo, segundo_vencimiento, segundo_vencimiento_recargo, periodo } =
      liquidacionUnidad.Liquidacion;
    const tipoInteres = selectedConsorcio.tipo_interes;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const [year, month] = periodo.split('-').map(Number);

    let interes = 0;
    if (primer_vencimiento && today > new Date(Date.UTC(year, month, primer_vencimiento))) {
      const recargo1 = montoExpensa * (Number(primer_vencimiento_recargo) / 100);

      if (segundo_vencimiento && today > new Date(Date.UTC(year, month, segundo_vencimiento))) {
        if (tipoInteres === 'compuesto') {
          // Interés compuesto: el segundo recargo se aplica sobre (monto + primer recargo)
          const montoConPrimerRecargo = montoExpensa + recargo1;
          interes = montoConPrimerRecargo * (Number(segundo_vencimiento_recargo) / 100);
        } else {
          // Interés acumulado (simple): el segundo recargo se aplica sobre el monto original
          interes = montoExpensa * (Number(segundo_vencimiento_recargo) / 100);
        }
      } else {
        // Solo pasó el primer vencimiento
        interes = recargo1;
      }
    }
    return interes;
  }, [liquidacionUnidad, selectedConsorcio]);

  const montoTotalAdeudado = useMemo(() => {
    return (Number(liquidacionUnidad?.monto) || 0) + interesCalculado;
  }, [liquidacionUnidad, interesCalculado]);

  const montoRestante = useMemo(() => {
    const montoYaSaldado = Number(liquidacionUnidad?.saldado) || 0;
    return montoTotalAdeudado - montoYaSaldado;
  }, [montoTotalAdeudado, liquidacionUnidad?.saldado]);

  const validationSchema = Yup.object().shape({
    persona_id: Yup.number().min(1, 'Debe seleccionar la persona que paga').required('La persona es requerida'),
    cuenta_id: Yup.number().min(1, 'La cuenta de ingreso es requerida').required('La cuenta es requerida'),
    monto: Yup.number()
      .min(0.01, 'El monto debe ser mayor a 0')
      .max(montoRestante, `El monto no puede superar la deuda restante de $${montoRestante.toLocaleString('es-AR')}`)
      .required('El monto es requerido'),
    fecha: Yup.date().required('La fecha es requerida'),
    tipo_pago: Yup.string().oneOf(['impaga', 'parcial', 'total']).required('El tipo de pago es requerido'),
    comentario: Yup.string().nullable(),
    interes: Yup.number().min(0).nullable()
  });

  const initialValues = useMemo(() => {
    return {
      liquidacion_unidad_id: liquidacionUnidad?.id || null,
      persona_id: null, // Se setea por defecto en el form
      cuenta_id: liquidacionUnidad?.unidadFuncional?.cuenta_id || null,
      monto: montoRestante > 0 ? montoRestante.toFixed(2) : '',
      interes: 0, // Se calcula dinámicamente en el formulario
      fecha: getTodayDateString(),
      tipo_pago: 'total',
      comentario: ''
    };
  }, [liquidacionUnidad, montoRestante]);

  const formik = useFormik<any>({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (!user?.id) {
          enqueueSnackbar('No se pudo obtener la información del usuario.', { variant: 'error' });
          setSubmitting(false);
          return;
        }

        // Validacion de fecha futura
        const todayString = getTodayDateString();
        if (values.fecha > todayString) {
          enqueueSnackbar('La fecha de pago no puede ser futura.', {
            variant: 'error'
          });
          setSubmitting(false);
          return;
        }

        // Validacion de monto superior al adeudado
        const montoIngresado = parseFloat(values.monto);
        if (montoIngresado > montoRestante) {
          enqueueSnackbar(`El monto a pagar no puede superar la deuda restante ($${montoRestante.toLocaleString('es-AR')}).`, {
            variant: 'error'
          });
          setSubmitting(false);
          return;
        }

        await createPagoMutation.mutateAsync({ pagoData: values as PagoLiquidacionUnidadCreateData, usuario_id: user.id });

        // Invalidar la consulta de liquidaciones de unidades para refrescar la tabla
        queryClient.invalidateQueries({ queryKey: ['liquidacionesUnidades', { liquidacion_id: liquidacionUnidad?.liquidacion_id }] });

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
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </Box>
      );
    }
    if (isError || !liquidacionUnidad) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="error">No se pudieron cargar los datos de la expensa.</Typography>
        </Box>
      );
    }
    return (
      <PagoLiquidacionUnidadForm
        liquidacionUnidad={liquidacionUnidad}
        interesCalculado={interesCalculado}
        montoRestante={montoRestante}
        montoTotalAdeudado={montoTotalAdeudado}
      />
    );
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        modalToggler(false);
        formik.resetForm();
      }}
      title="Registrar Pago de Expensa"
      cancelButtonLabel="Cancelar"
      confirmButtonLabel="Registrar Pago"
      onConfirm={formik.handleSubmit}
      isSubmitting={formik.isSubmitting || isLoading || isError}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          {renderContent()}
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default PagoLiquidacionUnidadModal;
