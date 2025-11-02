import { useNavigate } from 'react-router-dom';

import { useEffect, FC, useState } from 'react';
// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

// third party
import { useFormikContext, Form } from 'formik';

// project import
import MainCard from 'components/MainCard';
import LiquidacionNuevaEncabezado from 'sections/expensas/liquidaciones/nueva/LiquidacionNuevaEncabezado';

import { useGetLiquidacionGastos } from 'services/api/gastosapi';

import useConsorcio from 'hooks/useConsorcio';
import { useTheme } from '@mui/material/styles';

// types
import { Gasto } from 'types/gasto';
import LiquidacionGastos from 'sections/expensas/liquidaciones/nueva/LiquidacionGastos';
import GastosSinPeriodoModal from 'sections/expensas/liquidaciones/nueva/GastosSinPeriodoModal';
import LiquidacionCuentas from './LiquidacionCuentas';

const LiquidacionContenedor: FC = () => {
  const { selectedConsorcio } = useConsorcio();
  const navigate = useNavigate();
  const theme = useTheme();
  const { values, setFieldValue, isSubmitting, handleSubmit } = useFormikContext<any>();
  const [gastosModalOpen, setGastosModalOpen] = useState(false);

  // Datos de muestra para el resumen de cuentas (sin la columna saldo y usando null)
  const datosCuentas = [
    { resumen: 'Saldo Anterior', egresos: null, ingresos: 1515939.14 },
    { resumen: 'Cobranzas del Período', egresos: null, ingresos: 3780960 },
    { resumen: 'Cobranzas del Período con Mora', egresos: 3985906.93, ingresos: null },
    { resumen: 'Total erogaciones', egresos: null, ingresos: 200000 }
  ];

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
                <LiquidacionNuevaEncabezado />
              </MainCard>
            </Grid>

            <Grid item xs={12}>
              <LiquidacionGastos onAddSinPeriodo={() => setGastosModalOpen(true)} />
            </Grid>

            <Grid item xs={12}>
              <LiquidacionCuentas data={datosCuentas} />
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

export default LiquidacionContenedor;
