import { useNavigate } from 'react-router-dom';

// material-ui
import { format } from 'date-fns';

// third party
import * as yup from 'yup';
import { FormikProvider, useFormik } from 'formik';

// project import
import Breadcrumbs from 'components/@extended/Breadcrumbs';

import { APP_DEFAULT_PATH } from 'config';
import { openSnackbar } from 'api/snackbar';
import { useCreateLiquidacion } from 'services/api/liquidacionapi';

import useConsorcio from 'hooks/useConsorcio';

// types
import { SnackbarProps } from 'types/snackbar';
import { Liquidacion } from 'types/liquidacion';
import { Gasto } from 'types/gasto';
import { useUpdateConsorcio } from 'services/api/consorciosapi';
import useAuth from 'hooks/useAuth';
import LiquidacionContenedor from 'sections/expensas/liquidaciones/nueva/LiquidacionContenedor';

const validationSchema = yup.object({
  periodo: yup.string().required('El período es requerido'),
  fecha_emision: yup.date().required('La fecha de emisión es requerida').nullable(),
  primer_vencimiento: yup.number().required('El día del primer vencimiento es requerido').min(1).max(31).nullable(),
  primer_vencimiento_recargo: yup.number().required('El recargo es requerido').min(0),
  segundo_vencimiento: yup.number().min(1).max(31).nullable(),
  segundo_vencimiento_recargo: yup.number().min(0)
});

// ==============================|| LIQUIDACION - CREATE ||============================== //

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
      const [year, month] = selectedConsorcio.ultimo_periodo_liquidado.split('-').map(Number);
      // Se crea la fecha del último período en UTC (mes es 0-indexado) usando el día 2 para evitar problemas de timezone.
      const lastPeriodoDate = new Date(Date.UTC(year, month, 2));
      // Se suma un mes para obtener el período siguiente.
      const periodoDate = new Date(lastPeriodoDate.setUTCMonth(lastPeriodoDate.getUTCMonth() + 1));

      periodo = format(periodoDate, 'yyyy-MM-01');

      if (selectedConsorcio.dia_cierre) {
        const closeDate = new Date(Date.UTC(periodoDate.getUTCFullYear(), periodoDate.getUTCMonth(), selectedConsorcio.dia_cierre));
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
        const gastosPayload = gastos.map((g) => ({ id: g.id, monto: g.monto_expensa || 0, estado: g.estado }));
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
    { title: 'Liquidaciones', to: '/expensas/liquidaciones' },
    { title: 'Nueva Liquidación' }
  ];

  return (
    <>
      <Breadcrumbs custom heading="Nueva Liquidación" links={breadcrumbLinks} />
      <FormikProvider value={formik}>
        <LiquidacionContenedor />
      </FormikProvider>
    </>
  );
};

export default LiquidacionNueva;
