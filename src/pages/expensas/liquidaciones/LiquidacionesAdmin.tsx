import { useMemo, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { Chip, Stack, Tooltip, Typography } from '@mui/material';

// third-party
import { ColumnDef } from '@tanstack/react-table';
import { useIntl } from 'react-intl';

// project import
import IconButton from 'components/@extended/IconButton';
import EmptyReactTable from 'pages/tables/react-table/empty';
import LiquidacionesList from 'sections/expensas/liquidaciones/LiquidacionesList';
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

const LiquidacionesAdmin = () => {
  const { selectedConsorcio } = useConsorcio();
  const intl = useIntl();
  const navigate = useNavigate();

  // Asumiendo que el hook recibe el ID del consorcio
  const { data: liquidacionesData = [], isLoading } = useGetLiquidaciones(selectedConsorcio?.id || 0, { enabled: !!selectedConsorcio?.id });
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
        header: 'Nro',
        accessorKey: 'id',
        meta: {
          className: 'd-none' // Ocultar columna visualmente
        }
      },
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
        header: '1er Venc',
        accessorKey: 'primer_vencimiento',
        cell: ({ getValue }) => <Typography>{getValue() as string}</Typography>
      },
      {
        header: '2do Venc',
        accessorKey: 'segundo_vencimiento',
        cell: ({ getValue }) => <Typography>{getValue() as string}</Typography>
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

  if (isLoading) return <EmptyReactTable />;

  return (
    <>
      <LiquidacionesList
        data={liquidacionesData}
        columns={columns}
        // Navega a la página de creación
        modalToggler={() => navigate('/expensas/liquidaciones/nueva', { replace: true })}
        isAddDisabled={hasBorrador}
        addDisabledTooltip="Ya existe una liquidación en estado borrador. Por favor, finalícela o elimínela para crear una nueva."
      />
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
