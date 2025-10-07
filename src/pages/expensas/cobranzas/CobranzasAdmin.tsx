import { useMemo, useState, MouseEvent } from 'react';

// material-ui
import { Chip, Typography, Grid, Box, Stack, Tooltip } from '@mui/material';

// third-party
import { ColumnDef } from '@tanstack/react-table';
import { useIntl } from 'react-intl';

// project import
import Loader from 'components/Loader';
import IconButton from 'components/@extended/IconButton';
import TablaAdminCollapse from 'components/tables/TablaAdminCollapse';
import MainCard from 'components/MainCard';

// API hooks
import useConsorcio from 'hooks/useConsorcio';
import { useGetLiquidacionUnidades } from 'services/api/liquidacionUnidadapi';

// types
import { LiquidacionUnidad, LiquidacionUnidadEstado } from 'types/liquidacion';

// sections
import PagoLiquidacionUnidadModal from 'sections/expensas/cobranzas/PagoLiquidacionUnidadModal';

// assets
import { DollarOutlined } from '@ant-design/icons';

// ==============================|| COBRANZAS - ADMIN ||============================== //

const CobranzaSubComponent = ({ data }: { data: LiquidacionUnidad }) => {
  const monto = Number(data.monto) || 0;
  const saldado = Number(data.saldado) || 0;
  const restante = monto - saldado;
  const intereses = Number(data.interes_deuda) || 0;
  const montoAPagar = restante + intereses;
  const montoFinal = monto + intereses;

  return (
    <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
      <Grid container spacing={2}>
        {/* Fila 1 */}
        <Grid item xs={6} sm={2}>
          <Stack spacing={0.5} alignItems="flex-end">
            <Typography variant="caption" color="textSecondary">
              Expensa
            </Typography>
            <Typography variant="body2">${monto.toLocaleString('es-AR')}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={6} sm={2}>
          <Stack spacing={0.5} alignItems="flex-end">
            <Typography variant="caption" color="textSecondary">
              Saldado
            </Typography>
            <Typography variant="body2" color="success.dark">
              ${saldado.toLocaleString('es-AR')}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={6} sm={2}>
          <Stack spacing={0.5} alignItems="flex-end">
            <Typography variant="caption" color="textSecondary">
              Restante
            </Typography>
            <Typography variant="body2">${restante.toLocaleString('es-AR')}</Typography>
          </Stack>
        </Grid>

        {/* Fila 2 */}
        <Grid item xs={6} sm={2}>
          <Stack spacing={0.5} alignItems="flex-end">
            <Typography variant="caption" color="textSecondary">
              Intereses
            </Typography>
            <Typography variant="body2">${intereses.toLocaleString('es-AR')}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={6} sm={2}>
          <Stack spacing={0.5} alignItems="flex-end">
            <Typography variant="caption" color="textSecondary">
              Monto a Pagar
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              ${montoAPagar.toLocaleString('es-AR')}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={6} sm={2}>
          <Stack spacing={0.5} alignItems="flex-end">
            <Typography variant="caption" color="textSecondary">
              Monto Final
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              ${montoFinal.toLocaleString('es-AR')}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

const CobranzasAdmin = () => {
  const { selectedConsorcio } = useConsorcio();
  const intl = useIntl();

  const [pagoModalOpen, setPagoModalOpen] = useState(false);
  const [liquidacionAPagarId, setLiquidacionAPagarId] = useState<number | null>(null);

  const { data: cobranzasData = [], isLoading: isLoadingCobranzas } = useGetLiquidacionUnidades(
    { consorcio_id: selectedConsorcio?.id, liquidacion_actual: true },
    {
      // Se activa cuando hay un consorcio seleccionado
      enabled: !!selectedConsorcio?.id
    }
  );

  const columns = useMemo<ColumnDef<LiquidacionUnidad>[]>(
    () => [
      {
        header: 'Nro Expensa',
        accessorKey: 'id'
      },
      {
        header: 'Unidad',
        accessorKey: 'UnidadOperativa.etiqueta',
        cell: ({ row }) => <Typography>{row.original.UnidadOperativa?.etiqueta || '-'}</Typography>
      },
      {
        header: 'Vencimiento',
        accessorKey: 'Liquidacion',
        cell: ({ row }) => {
          const liquidacion = row.original.Liquidacion;
          if (!liquidacion?.periodo) return <Typography>-</Typography>;

          const today = new Date();
          today.setUTCHours(0, 0, 0, 0);

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
        header: 'A Pagar',
        cell: ({ row }) => {
          const monto = Number(row.original.monto) || 0;
          const saldado = Number(row.original.saldado) || 0;
          const restante = monto - saldado;
          const intereses = Number(row.original.interes_deuda) || 0;
          const montoAPagar = restante + intereses;

          return <Typography>${montoAPagar.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>;
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
      },
      {
        header: 'Acciones',
        disableSortBy: true,
        cell: ({ row }) => (
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
            <Tooltip title={row.original.estado === 'pagada' ? 'Esta expensa ya fue pagada' : 'Registrar Pago'}>
              <span>
                <IconButton
                  color="success"
                  disabled={row.original.estado === 'pagada'}
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setLiquidacionAPagarId(row.original.id);
                    setPagoModalOpen(true);
                  }}
                >
                  <DollarOutlined />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [intl]
  );

  const selectFilters = useMemo(() => {
    return {
      estado: {
        placeholder: 'Filtrar por Estado',
        options: [
          { label: 'Pendiente', value: 'pendiente' },
          { label: 'Vencida', value: 'vencida' },
          { label: 'Pagada', value: 'pagada' },
          { label: 'Adeuda', value: 'adeuda' }
        ]
      }
    };
  }, []);

  return (
    <>
      <MainCard
        title={
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h5">Administración de Cobranzas</Typography>
            </Grid>
          </Grid>
        }
        content={false}
      >
        {isLoadingCobranzas ? (
          <Loader />
        ) : (
          <TablaAdminCollapse
            data={cobranzasData}
            columns={columns}
            renderSubComponent={(row) => <CobranzaSubComponent data={row} />}
            selectFilters={selectFilters}
          />
        )}
      </MainCard>
      <PagoLiquidacionUnidadModal
        open={pagoModalOpen}
        modalToggler={(isOpen) => setPagoModalOpen(isOpen)}
        liquidacionUnidadId={liquidacionAPagarId}
      />
    </>
  );
};

export default CobranzasAdmin;
