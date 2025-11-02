import { Form, FormikProvider, useFormik } from 'formik';
import { useMemo, useEffect } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';

// project import
import { Gasto } from 'types/gasto';
import { GastoPagoCreateData } from 'types/gasto';
import Modal from 'components/Modal/ModalBasico';
import { Box, CircularProgress, Typography, Grid, TextField, Autocomplete, IconButton, Stack } from '@mui/material';
// import { useCreateGastoPago } from 'services/api/gastosapi';
import useAuth from 'hooks/useAuth';
import useConsorcio from 'hooks/useConsorcio';
import { useGetCuentas } from 'services/api/cuentasapi';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useCreatePagoProveedor } from 'services/api/pagoProveedorapi';

// Helper function to get today's date as YYYY-MM-DD string
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ==============================|| PAGO GASTO MODAL ||============================== //

interface PagoGastoModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  gasto: Gasto | null;
}

const PagoGastoModal = ({ open, modalToggler, gasto }: PagoGastoModalProps) => {
  const { user } = useAuth();
  const { selectedConsorcio } = useConsorcio();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const createPagoMutation = useCreatePagoProveedor();
  const { data: cuentas, isLoading: isLoadingCuentas } = useGetCuentas(selectedConsorcio?.id || 0, { enabled: !!selectedConsorcio });

  const montoAdeudado = useMemo(() => {
    if (!gasto) return 0;
    return (Number(gasto.monto) || 0) - (Number(gasto.saldado) || 0);
  }, [gasto]);

  const validationSchema = Yup.object().shape({
    cuenta_id: Yup.number().min(1, 'La cuenta de egreso es requerida').required('La cuenta es requerida'),
    monto: Yup.number()
      .min(0.01, 'El monto debe ser mayor a 0')
      .max(montoAdeudado, `El monto no puede superar la deuda de $${montoAdeudado.toLocaleString('es-AR')}`)
      .required('El monto es requerido'),
    fecha: Yup.date().required('La fecha es requerida'),
    tipo_pago: Yup.string().oneOf(['parcial', 'total']).required('El tipo de pago es requerido'),
    comentario: Yup.string().nullable()
  });

  const initialValues = useMemo(() => {
    return {
      gasto_id: gasto?.id || null,
      proveedor_id: gasto?.proveedor_id || null,
      cuenta_id: gasto?.Proveedor?.cuenta_id || null,
      monto: montoAdeudado > 0 ? montoAdeudado.toFixed(2) : '',
      fecha: (() => {
        if (gasto?.fecha) {
          // Corrige el problema de la zona horaria.
          // Crea una fecha en UTC para evitar que el navegador la ajuste a la zona horaria local.
          const date = new Date(gasto.fecha);
          return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()).toISOString().split('T')[0];
        }
        return getTodayDateString();
      })(),
      tipo_pago: 'total',
      comentario: ''
    };
  }, [gasto, montoAdeudado]);

  const formik = useFormik<any>({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (!user?.id) {
          enqueueSnackbar('No se pudo obtener la información del usuario.', { variant: 'error' });
          return;
        }
        if (values.fecha > getTodayDateString()) {
          enqueueSnackbar('La fecha de pago no puede ser futura.', { variant: 'error' });
          return;
        }

        await createPagoMutation.mutateAsync({ pagoData: values as GastoPagoCreateData, usuario_id: Number(user.id) });

        resetForm();
        modalToggler(false);
        queryClient.invalidateQueries(['gastos']);
        enqueueSnackbar('Pago registrado con éxito.', { variant: 'success' });
      } catch (error: any) {
        enqueueSnackbar(error.message || 'Error al registrar el pago.', { variant: 'error' });
      } finally {
        setSubmitting(false);
      }
    }
  });

  const { values, touched, errors, getFieldProps, setFieldValue, handleBlur } = formik;

  useEffect(() => {
    let newTipoPago = 'parcial';
    const montoIngresado = parseFloat(values.monto);

    if (!isNaN(montoIngresado) && montoIngresado > 0) {
      const montoIngresadoRounded = Math.round(montoIngresado * 100) / 100;
      const montoTotalGastoRounded = Math.round(Number(gasto?.monto) * 100) / 100;

      // Se considera 'total' si el monto pagado es igual al monto original del gasto.
      if (montoIngresadoRounded === montoTotalGastoRounded) {
        newTipoPago = 'total';
      }
    }
    if (values.tipo_pago !== newTipoPago) {
      setFieldValue('tipo_pago', newTipoPago);
    }
  }, [values.monto, values.tipo_pago, gasto, setFieldValue]);

  const handleDateChange = (days: number) => {
    const [year, month, day] = values.fecha.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);
    setFieldValue('fecha', date.toISOString().split('T')[0]);
  };

  return (
    <Modal
      open={open}
      onClose={() => modalToggler(false)}
      title="Registrar Pago de Gasto"
      confirmButtonLabel="Registrar Pago"
      onConfirm={formik.handleSubmit}
      isSubmitting={formik.isSubmitting || isLoadingCuentas}
      cancelButtonLabel="Cancelar"
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          {!gasto ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ pt: 1 }}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    bgcolor: 'grey.50',
                    display: { sm: 'flex' },
                    justifyContent: { sm: 'space-between' },
                    alignItems: { sm: 'center' }
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ mb: { xs: 1, sm: 0 } }}>
                      Pagando a: {gasto.Proveedor?.nombre}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {gasto.descripcion}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mt: 0.5 }}>
                      <Typography variant="body1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                        Total: ${Number(gasto.monto).toLocaleString('es-AR')}
                      </Typography>
                      <Typography variant="body1" color="success.dark" sx={{ fontWeight: 'medium' }}>
                        (Saldado: ${Number(gasto.saldado || 0).toLocaleString('es-AR')})
                      </Typography>
                    </Stack>
                  </Box>
                  <Stack direction="column" spacing={0} alignItems="flex-end">
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" display="block">
                        Monto Adeudado
                      </Typography>
                      <Typography variant="h5" color="error.main" sx={{ fontWeight: 'bold' }}>
                        ${montoAdeudado.toLocaleString('es-AR')}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} sm={5}>
                <Autocomplete
                  id="cuenta-id-autocomplete"
                  options={cuentas || []}
                  getOptionLabel={(option) => `${option.descripcion} (${option.tipo})`}
                  value={cuentas?.find((c) => c.id === values.cuenta_id) || null}
                  onChange={(event, newValue) => setFieldValue('cuenta_id', newValue ? newValue.id : null)}
                  loading={isLoadingCuentas}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cuenta de Egreso"
                      error={Boolean(touched.cuenta_id && errors.cuenta_id)}
                      helperText={touched.cuenta_id && typeof errors.cuenta_id === 'string' ? errors.cuenta_id : ''}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={7} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Monto a Pagar"
                  {...getFieldProps('monto')}
                  onBlur={(e) => {
                    handleBlur(e);
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) setFieldValue('monto', value.toFixed(2));
                  }}
                  error={Boolean(touched.monto && errors.monto)}
                  helperText={touched.monto && typeof errors.monto === 'string' ? errors.monto : ''}
                />
              </Grid>
              <Grid item xs={5} sm={3}>
                <TextField
                  fullWidth
                  label="Tipo"
                  value={values.tipo_pago === 'total' ? 'Total' : 'Parcial'}
                  InputProps={{ readOnly: true }}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: values.tipo_pago === 'total' ? '#d4edda' : values.tipo_pago === 'parcial' ? '#fff3cd' : 'transparent'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ position: 'relative', width: '100%' }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Fecha de Pago"
                    {...getFieldProps('fecha')}
                    error={Boolean(touched.fecha && errors.fecha)}
                    helperText={touched.fecha && typeof errors.fecha === 'string' ? errors.fecha : ''}
                    inputProps={{ max: getTodayDateString() }}
                    sx={{ '& .MuiInputBase-input': { pr: '80px' } }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 5,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      height: '60%',
                      borderLeft: '1px solid lightgray',
                      pl: 0.5
                    }}
                  >
                    <IconButton size="small" sx={{ p: 0.2 }} onClick={() => handleDateChange(-1)}>
                      <MinusOutlined style={{ fontSize: '0.7rem' }} />
                    </IconButton>
                    <IconButton size="small" sx={{ p: 0.2 }} onClick={() => handleDateChange(1)}>
                      <PlusOutlined style={{ fontSize: '0.7rem' }} />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField fullWidth multiline rows={2} label="Comentario (Opcional)" {...getFieldProps('comentario')} />
              </Grid>
            </Grid>
          )}
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default PagoGastoModal;
