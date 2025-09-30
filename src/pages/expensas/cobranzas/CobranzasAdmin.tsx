import { useMemo, useState } from 'react';

// material-ui
import { Chip, Typography, Autocomplete, TextField, CircularProgress, Grid, Box } from '@mui/material';

// third-party
import { ColumnDef } from '@tanstack/react-table';
import { useIntl } from 'react-intl';

// project import
import EmptyReactTable from 'pages/tables/react-table/empty';
import CobranzasList from 'sections/expensas/cobranzas/CobranzasList';
import MainCard from 'components/MainCard';

// API hooks
import useConsorcio from 'hooks/useConsorcio';
import { useGetLiquidaciones } from 'services/api/liquidacionapi';
import { useGetLiquidacionUnidades } from 'services/api/liquidacionUnidadapi';

// types
import { Liquidacion, LiquidacionUnidad, LiquidacionUnidadEstado } from 'types/liquidacion';

// utils
import { periodoFormat } from 'utils/dateFormat';

// ==============================|| COBRANZAS - ADMIN ||============================== //

const CobranzasAdmin = () => {
  const { selectedConsorcio } = useConsorcio();
  const intl = useIntl();

  const [selectedLiquidacion, setSelectedLiquidacion] = useState<Liquidacion | null>(null);

  const { data: liquidacionesData = [], isLoading: isLoadingLiquidaciones } = useGetLiquidaciones(selectedConsorcio?.id || 0, {
    enabled: !!selectedConsorcio?.id
  });

  const { data: cobranzasData = [], isLoading: isLoadingCobranzas } = useGetLiquidacionUnidades(
    { liquidacion_id: selectedLiquidacion?.id },
    {
      enabled: !!selectedLiquidacion?.id
    }
  );

  const columns = useMemo<ColumnDef<LiquidacionUnidad>[]>(
    () => [
      {
        header: 'Expensa',
        accessorKey: 'id',
        cell: ({ getValue }) => <Typography sx={{ textAlign: 'center', width: '70px' }}>{Number(getValue())}</Typography>,
        meta: {
          className: 'd-none'
        }
      },
      {
        header: 'Unidad',
        accessorKey: 'UnidadOperativa.etiqueta',
        cell: ({ row }) => {
          return <Typography>{row.original.UnidadOperativa?.etiqueta || '-'}</Typography>;
        }
      },
      {
        header: 'Expensa',
        meta: {
          className: 'cell-center'
        },
        cell: ({ row }) => {
          const totalLiquidacion = selectedLiquidacion?.total || 0;
          const prorrateo = Number(row.original.prorrateo) || 0;
          const montoExpensa = (totalLiquidacion * prorrateo) / 100;

          return <Typography>${montoExpensa.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>;
        }
      },
      {
        header: 'Prorrateo',
        accessorKey: 'prorrateo',
        cell: ({ getValue }) => <Typography sx={{ textAlign: 'center', width: '80px' }}>{Number(getValue()).toFixed(2)}</Typography>
      },
      {
        header: 'Venc.',
        accessorKey: 'Liquidacion',
        cell: ({ row }) => {
          const liquidacion = row.original.Liquidacion;
          if (!liquidacion?.periodo) return <Typography>-</Typography>;

          const today = new Date();
          today.setUTCHours(0, 0, 0, 0); // Normalizar a medianoche UTC para comparar solo fechas

          const [year, month] = liquidacion.periodo.split('-').map(Number);

          if (liquidacion.primer_vencimiento) {
            const primerVencimientoDate = new Date(Date.UTC(year, month, liquidacion.primer_vencimiento));

            if (today > primerVencimientoDate && liquidacion.segundo_vencimiento) {
              const segundoVencimientoDate = new Date(Date.UTC(year, month, liquidacion.segundo_vencimiento));
              return <Typography>{segundoVencimientoDate.toLocaleDateString('es-AR', { timeZone: 'UTC' })}</Typography>;
            }
            return <Typography>{primerVencimientoDate.toLocaleDateString('es-AR', { timeZone: 'UTC' })}</Typography>;
          }
          return <Typography>-</Typography>;
        }
      },
      {
        header: 'Interés',
        accessorKey: 'interes',
        cell: ({ row }) => {
          const liquidacion = row.original.Liquidacion;
          if (!liquidacion?.periodo) return <Typography>$0.00</Typography>;

          const totalLiquidacion = selectedLiquidacion?.total || 0;
          const prorrateo = Number(row.original.prorrateo) || 0;
          const montoExpensa = (totalLiquidacion * prorrateo) / 100;

          const { primer_vencimiento, primer_vencimiento_recargo, segundo_vencimiento, segundo_vencimiento_recargo, periodo } = liquidacion;

          const today = new Date();
          today.setUTCHours(0, 0, 0, 0);

          const [year, month] = periodo.split('-').map(Number);

          let interes = 0;

          if (primer_vencimiento) {
            const primerVencimientoDate = new Date(Date.UTC(year, month, primer_vencimiento));

            if (today > primerVencimientoDate) {
              if (segundo_vencimiento && today > new Date(Date.UTC(year, month, segundo_vencimiento))) {
                interes = montoExpensa * (Number(segundo_vencimiento_recargo) / 100);
              } else {
                interes = montoExpensa * (Number(primer_vencimiento_recargo) / 100);
              }
            }
          }

          return <Typography>${interes.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>;
        }
      },
      {
        header: 'Estado',
        accessorKey: 'estado',
        cell: ({ getValue }) => {
          const estado = getValue() as LiquidacionUnidadEstado;
          let color: 'primary' | 'warning' | 'success' | 'error' = 'primary';
          if (estado === 'pagada') color = 'success';
          if (estado === 'vencida') color = 'error';
          if (estado === 'pendiente') color = 'warning';
          return <Chip color={color} label={estado} size="small" variant="light" />;
        }
      }
      // La columna de acciones se omitirá por ahora
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [intl, selectedLiquidacion]
  );

  const isLoading = isLoadingLiquidaciones || (!!selectedLiquidacion && isLoadingCobranzas);

  return (
    <MainCard
      title={
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="h5">Administración de Cobranzas</Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Autocomplete
              id="liquidacion-selector"
              options={liquidacionesData}
              getOptionLabel={(option) =>
                `Período: ${periodoFormat(option.periodo)} - Total: $${Number(option.total || 0).toLocaleString('es-AR')}`
              }
              value={selectedLiquidacion}
              onChange={(event, newValue) => {
                setSelectedLiquidacion(newValue);
              }}
              loading={isLoadingLiquidaciones}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccione una Liquidación"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingLiquidaciones ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      }
      content={false}
    >
      {isLoading && <EmptyReactTable />}
      {!isLoading && selectedLiquidacion && <CobranzasList data={cobranzasData} columns={columns} />}
      {!selectedLiquidacion && !isLoading && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4">Por favor, seleccione una liquidación para ver las cobranzas.</Typography>
        </Box>
      )}
    </MainCard>
  );
};

export default CobranzasAdmin;
