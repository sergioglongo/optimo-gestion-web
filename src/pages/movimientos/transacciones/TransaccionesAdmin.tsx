import { useMemo, useState, MouseEvent } from 'react';

// material-ui
import { Chip, Stack, Tooltip, Typography } from '@mui/material';

// third-party
import { ColumnDef } from '@tanstack/react-table';
import { useIntl } from 'react-intl';

// project import
import IconButton from 'components/@extended/IconButton';
import EmptyReactTable from 'pages/tables/react-table/empty';
import TransaccionesList from 'sections/movimientos/TransaccionesList';
import TransaccionModal from 'sections/movimientos/TransaccionModal';
import TransaccionDetalleDrawer from 'sections/movimientos/TransaccionDetalleDrawer';
import TransaccionPagoProveedorDrawer from 'sections/movimientos/TransaccionPagoProveedorDrawer';
import TransaccionPagoLiquidacionDrawer from 'sections/movimientos/TransaccionPagoLiquidacionDrawer';

// API hooks
import useConsorcio from 'hooks/useConsorcio';
import { useGetTransacciones } from 'services/api/transaccionapi';

// types
import { Transaccion, EstadoTransaccion } from 'types/transaccion';
import { Cuenta } from 'types/cuenta';

// assets
import { EditOutlined, EyeOutlined, LinkOutlined } from '@ant-design/icons';

// ==============================|| TRANSACCIONES - ADMIN ||============================== //

const TransaccionesAdmin = () => {
  const { selectedConsorcio } = useConsorcio();
  const intl = useIntl();

  const { data: transaccionesData, isLoading } = useGetTransacciones(
    { consorcio_id: selectedConsorcio?.id || 0 },
    { enabled: !!selectedConsorcio?.id }
  );

  const [transaccionModal, setTransaccionModal] = useState<boolean>(false);
  const [selectedTransaccion, setSelectedTransaccion] = useState<Transaccion | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [pagoProveedorDrawerOpen, setPagoProveedorDrawerOpen] = useState(false);
  const [pagoLiquidacionDrawerOpen, setPagoLiquidacionDrawerOpen] = useState(false);

  const columns = useMemo<ColumnDef<Transaccion>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id'
      },
      {
        header: 'Fecha',
        accessorKey: 'fecha',
        cell: ({ getValue }) => <Typography>{new Date(getValue() as string).toLocaleDateString()}</Typography>
      },
      {
        header: 'Descripción',
        accessorKey: 'descripcion',
        cell: ({ getValue }) => <Typography>{(getValue() as string) || '-'}</Typography>
      },
      {
        header: 'Cuenta',
        accessorKey: 'cuenta', // Assuming backend sends nested object
        cell: ({ getValue }) => <Typography>{getValue<Cuenta>()?.descripcion || '-'}</Typography>
      },
      {
        header: 'Tipo',
        accessorKey: 'tipo_movimiento',
        cell: ({ getValue }) => {
          const tipo = getValue() as 'ingreso' | 'egreso';
          const color = tipo === 'ingreso' ? 'success' : 'error';
          const label = tipo.charAt(0).toUpperCase() + tipo.slice(1);
          return <Chip color={color} label={label} size="small" variant="light" />;
        }
      },
      {
        header: 'Monto',
        accessorKey: 'monto',
        cell: ({ getValue, row }) => {
          const tipo = row.original.tipo_movimiento;
          const color = tipo === 'ingreso' ? 'success.main' : 'error.main';
          return <Typography color={color}>${Number(getValue()).toLocaleString('es-AR')}</Typography>;
        }
      },
      {
        header: 'Estado',
        accessorKey: 'estado',
        cell: ({ getValue }) => {
          const estado = getValue() as EstadoTransaccion;
          let color: 'primary' | 'warning' | 'success' | 'error' = 'primary';
          if (estado === 'completado') color = 'success';
          if (estado === 'pendiente') color = 'warning';
          if (estado === 'anulado') color = 'error';
          return <Chip color={color} label={estado} size="small" variant="light" />;
        }
      },
      {
        header: intl.formatMessage({ id: 'table.actions' }),
        meta: { className: 'cell-center' },
        disableSortBy: true,
        cell: ({ row }) => (
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
            {row.original.referencia_tabla && row.original.referencia_id && (
              <Tooltip title="Ver Pago Asociado">
                <IconButton
                  color="info"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setSelectedTransaccion(row.original);
                    if (row.original.referencia_tabla === 'pagos_proveedores') {
                      setPagoProveedorDrawerOpen(true);
                    } else if (row.original.referencia_tabla === 'pagos_liquidaciones_unidades') {
                      setPagoLiquidacionDrawerOpen(true);
                    }
                  }}
                >
                  <LinkOutlined />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Ver Detalles">
              <IconButton
                color="secondary"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  setSelectedTransaccion(row.original);
                  setDrawerOpen(true);
                }}
              >
                <EyeOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton
                color="primary"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  setSelectedTransaccion(row.original);
                  setTransaccionModal(true);
                }}
              >
                <EditOutlined />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [intl, selectedConsorcio]
  );

  if (isLoading) return <EmptyReactTable />;

  return (
    <>
      <TransaccionesList
        data={transaccionesData || []}
        columns={columns}
        modalToggler={() => {
          setTransaccionModal(true);
          setSelectedTransaccion(null);
        }}
        initialColumnVisibility={{ id: false }}
      />
      <TransaccionModal open={transaccionModal} modalToggler={setTransaccionModal} transaccion={selectedTransaccion} />
      <TransaccionDetalleDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} transaccion={selectedTransaccion} />
      {pagoProveedorDrawerOpen && (
        <TransaccionPagoProveedorDrawer
          open={pagoProveedorDrawerOpen}
          onClose={() => setPagoProveedorDrawerOpen(false)}
          pagoId={selectedTransaccion?.referencia_id || null}
        />
      )}
      {pagoLiquidacionDrawerOpen && (
        <TransaccionPagoLiquidacionDrawer
          open={pagoLiquidacionDrawerOpen}
          onClose={() => setPagoLiquidacionDrawerOpen(false)}
          pagoId={selectedTransaccion?.referencia_id || null}
        />
      )}
    </>
  );
};

export default TransaccionesAdmin;
