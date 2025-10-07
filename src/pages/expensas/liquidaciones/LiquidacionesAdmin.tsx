import { useMemo, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { Box, Chip, Grid, Stack, Tooltip, Typography } from '@mui/material';

// third-party
import { ColumnDef } from '@tanstack/react-table';
import { useIntl } from 'react-intl';
import { useQueryClient } from '@tanstack/react-query';

// project import
import IconButton from 'components/@extended/IconButton';
import TablaAdminCollapse from 'components/tables/TablaAdminCollapse';
import ConfirmationDialog from 'components/Modal/ConfirmationDialog';
import LiquidacionModal from 'sections/expensas/liquidaciones/LiquidacionModal';
import AlertLiquidacionDelete from 'sections/expensas/liquidaciones/AlertLiquidacionDelete';

// API hooks
import useConsorcio from 'hooks/useConsorcio';
import { useGetLiquidaciones } from 'services/api/liquidacionapi';
import { useGetUnidadesOperativas } from 'services/api/unidadOperativaapi';
import { useGenerateLiquidacionesUnidades } from 'services/api/liquidacionUnidadapi';

// types
import { Liquidacion, LiquidacionEstado } from 'types/liquidacion';
import { SnackbarProps } from 'types/snackbar';

// assets
import { EditOutlined, DeleteOutlined, EyeOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { periodoFormat, toLocaleDateFormat } from 'utils/dateFormat';
import { openSnackbar } from 'api/snackbar';

// ==============================|| LIQUIDACIONES - ADMIN ||============================== //

const LiquidacionSubComponent = ({ data }: { data: Liquidacion }) => (
  <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <Stack spacing={0.5}>
          <Typography variant="caption" color="textSecondary">
            Saldo
          </Typography>
          <Typography variant="body2">${Number(data.saldo || 0).toLocaleString('es-AR')}</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Stack spacing={0.5}>
          <Typography variant="caption" color="textSecondary">
            1er Vencimiento
          </Typography>
          <Typography variant="body2">{`Día: ${data.primer_vencimiento ?? '-'} / Recargo: ${
            data.primer_vencimiento_recargo ?? 0
          }%`}</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Stack spacing={0.5}>
          <Typography variant="caption" color="textSecondary">
            2do Vencimiento
          </Typography>
          <Typography variant="body2">{`Día: ${data.segundo_vencimiento ?? '-'} / Recargo: ${
            data.segundo_vencimiento_recargo ?? 0
          }%`}</Typography>
        </Stack>
      </Grid>
    </Grid>
  </Box>
);

const LiquidacionesAdmin = () => {
  const { selectedConsorcio } = useConsorcio();
  const intl = useIntl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Asumiendo que el hook recibe el ID del consorcio
  const { data: liquidacionesData = [] } = useGetLiquidaciones(
    { consorcio_id: selectedConsorcio?.id || 0 },
    { enabled: !!selectedConsorcio?.id }
  );
  const { data: activeUnidadesData } = useGetUnidadesOperativas(
    { consorcio_id: selectedConsorcio?.id || 0, activas: true },
    { enabled: !!selectedConsorcio?.id }
  );
  const generateMutation = useGenerateLiquidacionesUnidades();

  const [liquidacionModal, setLiquidacionModal] = useState<boolean>(false);
  const [selectedLiquidacion, setSelectedLiquidacion] = useState<Liquidacion | null>(null);
  const [liquidacionToDelete, setLiquidacionToDelete] = useState<{ id: number; periodo: string } | null>(null);
  const [liquidacionToGenerate, setLiquidacionToGenerate] = useState<Liquidacion | null>(null);

  const hasBorrador = useMemo(() => liquidacionesData.some((liq) => liq.estado === 'borrador'), [liquidacionesData]);

  const columns = useMemo<ColumnDef<Liquidacion>[]>(
    () => [
      {
        header: 'Período',
        accessorKey: 'periodo',
        cell: ({ getValue }) => <Typography>{periodoFormat(getValue() as string)}</Typography>
      },
      {
        header: 'Fecha Emisión',
        accessorKey: 'fecha_emision',
        cell: ({ getValue }) => <Typography>{toLocaleDateFormat(getValue() as string)}</Typography>
      },
      {
        header: 'Total',
        accessorKey: 'total',
        cell: ({ row }) => {
          const total = row.original.total || 0;
          return <Typography>${Number(total).toLocaleString('es-AR')}</Typography>;
        }
      },
      {
        header: 'Estado',
        accessorKey: 'estado',
        cell: ({ row }) => {
          const estado = row.original.estado as LiquidacionEstado;
          let color: 'primary' | 'warning' | 'success' | 'error' = 'primary';
          if (estado === 'emitida') color = 'success';
          if (estado === 'borrador') color = 'warning';
          if (estado === 'cerrada') color = 'error';
          return <Chip color={color} label={estado} size="small" variant="light" />;
        }
      },
      {
        header: intl.formatMessage({ id: 'table.actions' }),
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => (
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
            {row.original.estado === 'borrador' && (
              <Tooltip title="Generar Liquidaciones de Unidades">
                <IconButton
                  color="success"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setLiquidacionToGenerate(row.original);
                  }}
                >
                  <DollarCircleOutlined />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Ver Detalles">
              <IconButton
                color="secondary"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  navigate(`/expensas/liquidaciones/details/${row.original.id}`);
                }}
              >
                <EyeOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton
                color="primary"
                disabled={row.original.estado !== 'borrador'}
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  setSelectedLiquidacion(row.original);
                  setLiquidacionModal(true);
                }}
              >
                <EditOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                color="error"
                disabled={row.original.estado !== 'borrador'}
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  setLiquidacionToDelete({ id: row.original.id, periodo: row.original.periodo });
                }}
              >
                <DeleteOutlined />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [intl, navigate]
  );

  const handleGenerate = async () => {
    if (!liquidacionToGenerate) return;
    try {
      await generateMutation.mutateAsync(liquidacionToGenerate.id);
      openSnackbar({
        open: true,
        message: 'Liquidaciones por unidad generadas con éxito.',
        variant: 'alert',
        alert: { color: 'success' }
      } as SnackbarProps);
      // Invalidar la consulta de liquidaciones para refrescar la tabla
      queryClient.invalidateQueries({ queryKey: ['liquidaciones', 'list', { consorcio_id: selectedConsorcio?.id }] });
    } catch (error: any) {
      openSnackbar({
        open: true,
        message: error.message || 'Error al generar liquidaciones.',
        variant: 'alert',
        alert: { color: 'error' }
      } as SnackbarProps);
    } finally {
      setLiquidacionToGenerate(null);
    }
  };

  return (
    <>
      <Tooltip
        title={hasBorrador ? 'Ya existe una liquidación en estado borrador. Por favor, finalícela o elimínela para crear una nueva.' : ''}
      >
        <div>
          <TablaAdminCollapse
            data={liquidacionesData}
            columns={columns}
            onAdd={() => navigate('/expensas/liquidaciones/nueva', { replace: true })}
            addLabel="Nueva Liquidación"
            title="Gestiona las Liquidaciones del consorcio"
            isAddDisabled={hasBorrador}
            renderSubComponent={(row) => <LiquidacionSubComponent data={row} />}
          />
        </div>
      </Tooltip>
      <ConfirmationDialog
        open={!!liquidacionToGenerate}
        onClose={() => setLiquidacionToGenerate(null)}
        onConfirm={handleGenerate}
        title="Confirmar Generación"
        content={`Se generarán ${activeUnidadesData?.length || 0} liquidaciones para las unidades activas. ¿Desea continuar?`}
        confirmText="Generar"
      />
      <AlertLiquidacionDelete
        liquidacion={liquidacionToDelete}
        open={!!liquidacionToDelete}
        handleClose={() => setLiquidacionToDelete(null)}
      />
      <LiquidacionModal open={liquidacionModal} modalToggler={setLiquidacionModal} liquidacion={selectedLiquidacion} />
    </>
  );
};

export default LiquidacionesAdmin;
