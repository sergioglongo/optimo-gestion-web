import { useNavigate } from 'react-router-dom';

import { useEffect, FC, useState } from 'react';
// material-ui
import { format } from 'date-fns';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

// third party
import * as yup from 'yup';
import { FormikProvider, useFormik, Form, useFormikContext } from 'formik';

// project import
import MainCard from 'components/MainCard';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import LiquidacionForm from './LiquidacionNuevaPrincipal';

import { APP_DEFAULT_PATH } from 'config';
import { openSnackbar } from 'api/snackbar';
import { useCreateLiquidacion } from 'services/api/liquidacionapi';

import useConsorcio from 'hooks/useConsorcio';
import { useTheme } from '@mui/material/styles';

// types
import { SnackbarProps } from 'types/snackbar';
import { Liquidacion } from 'types/liquidacion';
import LiquidacionGastos from './LiquidacionGastos';
import { Gasto } from 'types/gasto';
import { useGetLiquidacionGastos } from 'services/api/gastosapi';
import { useUpdateConsorcio } from 'services/api/consorciosapi';
import useAuth from 'hooks/useAuth';
import GastosSinPeriodoModal from './GastosSinPeriodoModal';

const validationSchema = yup.object({
  periodo: yup.string().required('El período es requerido'),
  fecha_emision: yup.date().required('La fecha de emisión es requerida').nullable(),
  primer_vencimiento: yup.number().required('El día del primer vencimiento es requerido').min(1).max(31).nullable(),
  primer_vencimiento_recargo: yup.number().required('El recargo es requerido').min(0),
  segundo_vencimiento: yup.number().min(1).max(31).nullable(),
  segundo_vencimiento_recargo: yup.number().min(0)
});

// ==============================|| LIQUIDACION - CREATE ||============================== //
const LiquidacionFormWrapper: FC = () => {
  const { selectedConsorcio } = useConsorcio();
  const navigate = useNavigate();
  const theme = useTheme();
  const { values, setFieldValue, isSubmitting, handleSubmit } = useFormikContext<any>();
  const [gastosModalOpen, setGastosModalOpen] = useState(false);

  const { data: gastosData } = useGetLiquidacionGastos(
    {
      consorcio_id: selectedConsorcio?.id || 0,
      periodo: values.periodo,
      sin_liquidar: true
    },
    { enabled: !!selectedConsorcio?.id && !!values.periodo }
  );

  useEffect(() => {
    if (gastosData && values.periodo) {
      setFieldValue('gastos', gastosData);
    }
  }, [gastosData, setFieldValue, values.periodo]);

  const handleAddGastosFromModal = (newGastos: Gasto[]) => {
    // Usar un Set para evitar duplicados si por alguna razón se seleccionara uno ya existente
    const existingGastoIds = new Set(values.gastos.map((g: Gasto) => g.id));
    const uniqueNewGastos = newGastos.filter((g) => !existingGastoIds.has(g.id));

    if (uniqueNewGastos.length > 0) {
      setFieldValue('gastos', [...values.gastos, ...uniqueNewGastos]);
    }
    setGastosModalOpen(false);
  };

  return (
    <>
      <GastosSinPeriodoModal
        open={gastosModalOpen}
        onClose={() => setGastosModalOpen(false)}
        onAddGastos={handleAddGastosFromModal}
        gastosActuales={values.gastos}
      />

      <MainCard>
        {selectedConsorcio && (
          <Grid item xs={12}>
            <Box sx={{ p: 1, borderRadius: 1, textAlign: 'center', color: 'white', backgroundColor: theme.palette.primary.main }}>
              <Typography variant="h3">
                <strong>Liquidación a consorcio {selectedConsorcio.nombre}</strong>
              </Typography>
            </Box>
          </Grid>
        )}
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <MainCard title="Datos Principales">
                <LiquidacionForm />
              </MainCard>
            </Grid>

            <Grid item xs={12}>
              <LiquidacionGastos onAddSinPeriodo={() => setGastosModalOpen(true)} />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={2} sx={{ height: '100%' }}>
                <Button variant="outlined" color="secondary" onClick={() => navigate('/expensas/liquidaciones')}>
                  Cancelar
                </Button>
                <Button color="primary" variant="contained" type="submit" disabled={isSubmitting}>
                  Crear Liquidación
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      </MainCard>
    </>
  );
};

const LiquidacionNueva = () => {
  const { selectedConsorcio, setSelectedConsorcio } = useConsorcio();
  const navigate = useNavigate();
  const createLiquidacionMutation = useCreateLiquidacion();
  const updateConsorcioMutation = useUpdateConsorcio();
  const { user } = useAuth();

  const getInitialValues = () => {
    let periodo = '';
    let fecha_cierre = null;

    if (selectedConsorcio?.ultimo_periodo_liquidado) {
      // Se parsea el string 'YYYY-MM-DD' para evitar problemas de timezone.
      // Se crea la fecha en UTC para evitar problemas de timezone.
      const [year, month, day] = selectedConsorcio.ultimo_periodo_liquidado.split('-').map(Number);
      const periodoDate = new Date(Date.UTC(year, month + 1, day));
      const lastPeriodoDate = new Date(Date.UTC(year, month, day));
      // Se suma un mes en UTC para evitar desfases
      const nextPeriodoDate = new Date(lastPeriodoDate.setUTCMonth(lastPeriodoDate.getUTCMonth()));

      periodo = format(periodoDate, 'yyyy-MM-01');

      if (selectedConsorcio.dia_cierre) {
        const closeDate = new Date(Date.UTC(nextPeriodoDate.getUTCFullYear(), nextPeriodoDate.getUTCMonth(), selectedConsorcio.dia_cierre));
        fecha_cierre = format(closeDate, 'yyyy-MM-dd');
      }
    }
    return { periodo, fecha_cierre };
  };

  const formik = useFormik<Omit<Liquidacion, 'saldo'> & { gastos: Gasto[] }>({
    // 'id' is now included as optional
    initialValues: {
      ...getInitialValues(),
      fecha_emision: new Date().toISOString().split('T')[0],
      total: 0,
      consorcio_id: selectedConsorcio?.id || 0,
      estado: 'borrador',
      primer_vencimiento: selectedConsorcio?.vencimiento1 || null,
      primer_vencimiento_recargo: selectedConsorcio?.vencimiento1valor || 0,
      segundo_vencimiento: selectedConsorcio?.vencimiento2 || null,
      segundo_vencimiento_recargo: selectedConsorcio?.vencimiento2valor || 0,
      gastos: [],
      id: 0 // Explicitly set id, which is number
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!selectedConsorcio?.id) {
          openSnackbar({
            open: true,
            message: 'Error: No se ha seleccionado un consorcio.',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
          return;
        }

        // Extract liquidacion data and gasto IDs
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, gastos, ...liquidacionDataForCreate } = values;
        const gastosPayload = gastos.map((g) => ({ id: g.id, monto: g.saldado || 0, estado: g.estado }));
        const finalLiquidacionData = { ...liquidacionDataForCreate, saldo: values.total };

        await createLiquidacionMutation.mutateAsync({
          liquidacionData: finalLiquidacionData,
          consorcio_id: values.consorcio_id,
          gastos: gastosPayload
        });

        if (selectedConsorcio && user?.id) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { Domicilio, ...restOfConsorcio } = selectedConsorcio;
          const updatedConsorcio = {
            ...restOfConsorcio,
            ultimo_periodo_liquidado: values.periodo,
            domicilio_id: selectedConsorcio.Domicilio?.id
          };

          await updateConsorcioMutation.mutateAsync({
            consorcioId: updatedConsorcio.id,
            consorcioData: updatedConsorcio,
            usuario_id: user.id
          });
          setSelectedConsorcio(updatedConsorcio);
        }

        openSnackbar({
          open: true,
          message: 'Liquidación creada con éxito.',
          variant: 'alert',
          alert: { color: 'success' }
        } as SnackbarProps);

        navigate('/expensas/liquidaciones');
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Liquidaciones', to: '/expensas/liquidaciones', icon: undefined },
    { title: 'Nueva Liquidación' }
  ];

  return (
    <>
      <Breadcrumbs custom heading="Nueva Liquidación" links={breadcrumbLinks} />
      <FormikProvider value={formik}>
        <LiquidacionFormWrapper />
      </FormikProvider>
    </>
  );
};

export default LiquidacionNueva;
