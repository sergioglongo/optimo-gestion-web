import { useMemo, useState, useEffect, MouseEvent } from 'react';

// material-ui
import { Chip, Typography, Autocomplete, TextField, CircularProgress, Grid, Box, Stack, Tooltip } from '@mui/material';

// third-party
import { ColumnDef } from '@tanstack/react-table';
import { useIntl } from 'react-intl';

// project import
import IconButton from 'components/@extended/IconButton';
import TablaAdminCollapse from 'components/tables/TablaAdminCollapse';
import MainCard from 'components/MainCard';

// API hooks
import useConsorcio from 'hooks/useConsorcio';
import { useGetLiquidaciones } from 'services/api/liquidacionapi';
import { useGetLiquidacionUnidades } from 'services/api/liquidacionUnidadapi';

// types
import { Liquidacion, LiquidacionUnidad, LiquidacionUnidadEstado } from 'types/liquidacion';

// utils
import { periodoFormat } from 'utils/dateFormat';

// sections
import PagoLiquidacionUnidadModal from 'sections/expensas/cobranzas/PagoLiquidacionUnidadModal';

// assets
import { DollarOutlined } from '@ant-design/icons';

// ==============================|| COBRANZAS - ADMIN ||============================== //

const CobranzaSubComponent = ({ data, interes }: { data: LiquidacionUnidad; interes: number }) => {
  const montoExpensa = Number(data.monto) || 0;
  const montoTotal = montoExpensa + interes;

  return (
    <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <Stack spacing={0.5} alignItems="flex-end">
            <Typography variant="caption" color="textSecondary">
              Expensa
            </Typography>
            <Typography variant="body2">${montoExpensa.toLocaleString('es-AR')}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Stack spacing={0.5} alignItems="flex-end">
            <Typography variant="caption" color="textSecondary">
              Prorrateo
            </Typography>
            <Typography variant="body2">{Number(data.prorrateo).toFixed(2)}%</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Stack spacing={0.5} alignItems="flex-end">
            <Typography variant="caption" color="textSecondary">
              Interés
            </Typography>
            <Typography variant="body2">
              ${interes.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Stack spacing={0.5} alignItems="flex-end">
            <Typography variant="caption" color="textSecondary">
              Monto Total
            </Typography>
            <Typography variant="body2">
              ${montoTotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

  const [selectedLiquidacion, setSelectedLiquidacion] = useState<Liquidacion | null>(null);
  const [pagoModalOpen, setPagoModalOpen] = useState(false);
  const [liquidacionAPagarId, setLiquidacionAPagarId] = useState<number | null>(null);

  const { data: liquidacionesData = [], isLoading: isLoadingLiquidaciones } = useGetLiquidaciones(selectedConsorcio?.id || 0, {
    enabled: !!selectedConsorcio?.id
  });

  useEffect(() => {
    // Si hay liquidaciones y no hay ninguna seleccionada, selecciona la primera por defecto.
    if (liquidacionesData.length > 0 && !selectedLiquidacion) {
      setSelectedLiquidacion(liquidacionesData[0]);
    }
  }, [liquidacionesData, selectedLiquidacion]);

  const { data: cobranzasData = [], isLoading: isLoadingCobranzas } = useGetLiquidacionUnidades(
    { liquidacion_id: selectedLiquidacion?.id },
    {
      enabled: !!selectedLiquidacion?.id
    }
  );

  // Helper function to calculate interest
  const calculateInterest = (row: LiquidacionUnidad) => {
    const liquidacion = row.Liquidacion;
    if (!liquidacion?.periodo) return 0;

    const montoExpensa = Number(row.monto) || 0;
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
    return interes;
  };

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
        header: 'Monto',
        cell: ({ row }) => {
          const liquidacion = row.original.Liquidacion;
          if (!liquidacion?.periodo) return <Typography>$0.00</Typography>;

          const montoExpensa = Number(row.original.monto) || 0;

          // const { primer_vencimiento, primer_vencimiento_recargo, segundo_vencimiento, segundo_vencimiento_recargo, periodo } = liquidacion;

          const interes = calculateInterest(row.original);
          const total = montoExpensa + interes;
          return <Typography>${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>;
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
    [intl, selectedLiquidacion]
  );

  const isLoading = isLoadingLiquidaciones || (!!selectedLiquidacion && isLoadingCobranzas);

  return (
    <>
      <MainCard
        title={
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Typography variant="h5">Administración de Cobranzas</Typography>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Autocomplete
                id="liquidacion-selector"
                options={liquidacionesData || []}
                getOptionLabel={(option) =>
                  `Período: ${periodoFormat(option.periodo)} - ${
                    option.estado.charAt(0).toUpperCase() + option.estado.slice(1)
                  } - Total: $${Number(option.total || 0).toLocaleString('es-AR')}`
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
        {!isLoading && selectedLiquidacion && (
          <TablaAdminCollapse
            data={cobranzasData}
            columns={columns}
            renderSubComponent={(row) => <CobranzaSubComponent data={row} interes={calculateInterest(row)} />}
          />
        )}

        {!selectedLiquidacion && !isLoading && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4">Por favor, seleccione una liquidación para ver las cobranzas.</Typography>
          </Box>
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
