import { useMemo, useState, MouseEvent } from 'react';

// material-ui
import { Chip, Stack, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third-party
import { ColumnDef } from '@tanstack/react-table';
import { useIntl } from 'react-intl';

// project import
import IconButton from 'components/@extended/IconButton';
import EmptyReactTable from 'pages/tables/react-table/empty';
import GastosModal from 'sections/movimientos/gastos/GastosModal';
import AlertGastoDelete from 'sections/movimientos/gastos/AlertGastoDelete';
import GastoAsignacionModal from 'sections/movimientos/gastos/GastoAsignacionModal';
import GastosList from 'sections/movimientos/gastos/GastosList';
import PagoGastoModal from 'sections/movimientos/gastos/PagoGastoModal';
import GastoDetalleDrawer from 'sections/movimientos/gastos/GastosDetalleDrawer';

// API hooks
import useAuth from 'hooks/useAuth';
import useConsorcio from 'hooks/useConsorcio';
import { useGetGastos } from 'services/api/gastosapi';

// types
import { Gasto, GastoEstado, GastoTipo } from 'types/gasto';
import { UnidadOperativa } from 'types/unidadOperativa';
import { truncateString } from 'utils/textFormat';

// assets
import { EditOutlined, DeleteOutlined, UsergroupAddOutlined, EyeOutlined, DollarCircleOutlined } from '@ant-design/icons';

// ==============================|| GASTOS - ADMIN ||============================== //

const GastosAdmin = () => {
  const theme = useTheme();
  const { user, token } = useAuth();
  const { selectedConsorcio } = useConsorcio();
  const intl = useIntl();

  const { data: gastosData, isLoading } = useGetGastos({ consorcio_id: selectedConsorcio?.id || 0 }, { enabled: !!user?.id && !!token });

  const [open, setOpen] = useState<boolean>(false);
  const [gastoModal, setGastoModal] = useState<boolean>(false);
  const [selectedGasto, setSelectedGasto] = useState<Gasto | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [asignacionModalOpen, setAsignacionModalOpen] = useState<boolean>(false);
  const [pagoModalOpen, setPagoModalOpen] = useState<boolean>(false);

  const [gastoDelete, setGastoDelete] = useState<{ id: number; descripcion: string } | null>(null);

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo<ColumnDef<Gasto>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        meta: {
          className: 'd-none'
        }
      },
      {
        header: 'Fecha',
        accessorKey: 'fecha',
        cell: ({ getValue }) => <Typography>{new Date(getValue() as string).toLocaleDateString()}</Typography>
      },
      {
        header: 'Proveedor',
        accessorKey: 'Proveedor',
        cell: ({ row }) => {
          return <Typography>{row.original.Proveedor?.nombre || '-'}</Typography>;
        }
      },
      {
        header: 'Descripción',
        accessorKey: 'descripcion',
        cell: ({ getValue }) => {
          const description = getValue() as string;
          return (
            <Tooltip title={description} placement="top">
              <Typography>{truncateString(description, 30)}</Typography>
            </Tooltip>
          );
        }
      },
      {
        header: 'Tipo',
        accessorKey: 'tipo_gasto',
        cell: ({ getValue }) => {
          const tipo = getValue() as GastoTipo;
          return <Chip color={tipo === 'ordinario' ? 'primary' : 'warning'} label={tipo} size="small" variant="light" />;
        }
      },
      {
        header: 'Asignado a',
        accessorKey: 'unidad_asignada',
        cell: ({ getValue }) => {
          const unidad = getValue() as UnidadOperativa | undefined;
          return <Typography textAlign={'center'}>{unidad ? unidad.etiqueta : 'Consorcio'}</Typography>;
        }
      },
      {
        header: 'Estado',
        accessorKey: 'estado',
        cell: ({ getValue }) => {
          const estado = getValue() as GastoEstado;
          let color: 'primary' | 'warning' | 'success' | 'error' = 'primary';
          if (estado === 'pagado') color = 'success';
          if (estado === 'parcial') color = 'warning';
          if (estado === 'impago') color = 'error';
          return <Chip color={color} label={estado} size="small" variant="light" />;
        }
      },
      {
        header: 'Monto',
        accessorKey: 'monto',
        cell: ({ getValue }) => <Typography>${Number(getValue()).toLocaleString('es-AR')}</Typography>
      },
      {
        header: 'Saldado',
        accessorKey: 'saldado',
        cell: ({ getValue }) => <Typography>${Number(getValue()).toLocaleString('es-AR')}</Typography>
      },
      {
        header: intl.formatMessage({ id: 'table.actions' }),
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => {
          const isLiquidado = !!row.original.LiquidacionGastos && row.original.LiquidacionGastos.length > 0;
          const isPagado = row.original.estado === 'pagado';
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="Ver Detalles">
                <IconButton
                  color="secondary"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setSelectedGasto(row.original);
                    setDrawerOpen(true);
                  }}
                >
                  <EyeOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title={isLiquidado ? 'El gasto ya fue liquidado' : 'Editar'}>
                <span>
                  <IconButton
                    color="primary"
                    disabled={isLiquidado}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      setSelectedGasto(row.original);
                      setGastoModal(true);
                    }}
                  >
                    <EditOutlined />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={isLiquidado ? 'El gasto ya fue liquidado' : 'Eliminar'}>
                <span>
                  <IconButton
                    color="error"
                    disabled={isLiquidado}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      handleClose();
                      setGastoDelete({ id: row.original.id, descripcion: row.original.descripcion });
                    }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={isLiquidado ? 'El gasto ya fue liquidado' : 'Asignar a una Unidad'}>
                <span>
                  <IconButton
                    color="warning"
                    disabled={isLiquidado}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      setSelectedGasto(row.original);
                      setAsignacionModalOpen(true);
                    }}
                  >
                    <UsergroupAddOutlined />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={isPagado ? 'El gasto ya fue saldado' : 'Registrar Pago'}>
                <span>
                  <IconButton
                    color="success"
                    disabled={isPagado}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      setSelectedGasto(row.original);
                      setPagoModalOpen(true);
                    }}
                  >
                    <DollarCircleOutlined />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    // eslint-disable-next-line
    [theme, intl]
  );

  if (isLoading) return <EmptyReactTable />;

  return (
    <>
      <GastosList
        {...{
          data: gastosData || [],
          columns,
          initialColumnVisibility: { id: false },
          modalToggler: () => {
            setGastoModal(true);
            setSelectedGasto(null);
          }
        }}
      />
      <AlertGastoDelete
        id={gastoDelete?.id}
        title={gastoDelete?.descripcion}
        open={open}
        handleClose={() => {
          handleClose();
          setGastoDelete(null);
        }}
      />
      <GastosModal open={gastoModal} modalToggler={setGastoModal} gasto={selectedGasto} />
      <GastoAsignacionModal open={asignacionModalOpen} modalToggler={setAsignacionModalOpen} gasto={selectedGasto} />
      <PagoGastoModal open={pagoModalOpen} modalToggler={setPagoModalOpen} gasto={selectedGasto} />
      <GastoDetalleDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} gasto={selectedGasto} />
    </>
  );
};

export default GastosAdmin;
