import { useMemo, useState, MouseEvent } from 'react';

// material-ui
import { Chip, Stack, Tooltip, Typography } from '@mui/material';

// third-party
import { ColumnDef } from '@tanstack/react-table';
import { useIntl } from 'react-intl';

// project import
import IconButton from 'components/@extended/IconButton';
import EmptyReactTable from 'pages/tables/react-table/empty';
import PagosProveedoresList from 'sections/proveedores/pagos/PagosProveedoresList';
import PagoProveedorModal from 'sections/proveedores/pagos/PagoProveedorModal';
import PagoProveedorEditModal from 'sections/proveedores/pagos/PagoProveedorEditModal';
import ViewDrawer from 'components/drawers/ViewDrawer';
import AlertPagoProveedorDelete from 'sections/proveedores/pagos/AlertPagoProveedorDelete';

// API hooks
import useConsorcio from 'hooks/useConsorcio';
import { useGetPagosProveedores } from 'services/api/pagoProveedorapi';

// types
import { PagoProveedor, TipoPagoProveedor } from 'types/pagoProveedor';

// assets
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { formatDateOnly } from 'utils/dateFormat';

// ==============================|| PAGOS PROVEEDORES - ADMIN ||============================== //

const PagosProveedoresAdmin = () => {
  const { selectedConsorcio } = useConsorcio();
  const intl = useIntl();

  const { data: pagosData, isLoading } = useGetPagosProveedores(selectedConsorcio?.id || 0, { enabled: !!selectedConsorcio?.id });

  const [pagoCreateModal, setPagoCreateModal] = useState<boolean>(false);
  const [pagoEditModal, setPagoEditModal] = useState<boolean>(false);
  const [selectedPago, setSelectedPago] = useState<PagoProveedor | null>(null);
  const [pagoDelete, setPagoDelete] = useState<{ id: number; fecha: string; monto: number } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const columns = useMemo<ColumnDef<PagoProveedor>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        meta: {
          className: 'd-none' // Hide the column visually
        }
      },
      {
        header: 'Fecha',
        accessorKey: 'fecha',
        cell: ({ getValue }) => <Typography>{formatDateOnly(getValue() as string)}</Typography>
      },
      {
        header: 'Proveedor',
        accessorKey: 'Proveedor.nombre',
        cell: ({ row }) => <Typography>{row.original.Proveedor?.nombre || '-'}</Typography>
      },
      {
        header: 'Cuenta',
        accessorFn: (row) => row.cuenta?.descripcion || '', // Para que la búsqueda global funcione con el nombre.
        id: 'cuenta', // Para que el filtro desplegable sepa a qué columna aplicarse.
        cell: ({ getValue }) => <Typography>{(getValue() as string) || '-'}</Typography>,
        // Función de filtro personalizada:
        // Compara el ID de la cuenta seleccionada en el filtro con el ID de la cuenta en la fila.
        filterFn: (row, columnId, filterValue) => {
          // filterValue es el ID de la cuenta que viene del filtro desplegable.
          return row.original.cuenta?.id === filterValue;
        }
      },
      {
        header: 'Monto',
        accessorKey: 'monto',
        cell: ({ getValue }) => <Typography>${Number(getValue()).toLocaleString('es-AR')}</Typography>
      },
      {
        header: 'Tipo de Pago',
        accessorKey: 'tipo_pago',
        cell: ({ getValue }) => {
          const tipo = getValue() as TipoPagoProveedor;
          let color: 'primary' | 'warning' | 'success' | 'error' = 'primary';
          if (tipo === 'total') color = 'success';
          if (tipo === 'parcial') color = 'warning';
          if (tipo === 'impago') color = 'error';
          return <Chip color={color} label={tipo} size="small" variant="light" />;
        }
      },
      {
        header: intl.formatMessage({ id: 'table.actions' }),
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => (
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
            <Tooltip title="Ver Detalles">
              <IconButton
                color="secondary"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  setSelectedPago(row.original);
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
                  setSelectedPago(row.original);
                  setPagoEditModal(true);
                }}
              >
                <EditOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                color="error"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  setPagoDelete({ id: row.original.id, fecha: row.original.fecha, monto: row.original.monto || 0 });
                }}
              >
                <DeleteOutlined />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      }
    ],
    [intl]
  );

  if (isLoading) return <EmptyReactTable />;

  return (
    <>
      <PagosProveedoresList
        data={pagosData || []}
        columns={columns}
        modalToggler={() => {
          setPagoCreateModal(true);
          setSelectedPago(null);
        }}
      />
      <AlertPagoProveedorDelete pago={pagoDelete} open={!!pagoDelete} handleClose={() => setPagoDelete(null)} />
      {/* Modal para CREAR un pago */}
      <PagoProveedorModal open={pagoCreateModal} modalToggler={setPagoCreateModal} />
      {/* Modal para EDITAR un pago. Solo se renderiza si hay un pago seleccionado */}
      {selectedPago && <PagoProveedorEditModal open={pagoEditModal} modalToggler={setPagoEditModal} pago={selectedPago} />}

      {selectedPago && (
        <ViewDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Detalles del Pago"
          items={[
            [
              { label: 'Fecha de Pago', value: new Date(selectedPago.fecha).toLocaleDateString() },
              { label: 'Fecha del Gasto', value: selectedPago.Gasto ? new Date(selectedPago.Gasto.fecha).toLocaleDateString() : '-' }
            ],
            { label: 'Proveedor', value: selectedPago.Proveedor?.nombre || '-' },
            { label: 'Gasto Asociado', value: selectedPago.Gasto?.descripcion || '-' },
            { label: 'Cuenta de Pago', value: selectedPago.cuenta?.descripcion || '-' },
            [
              { label: 'Monto Pagado', value: `$${Number(selectedPago.monto).toLocaleString('es-AR')}` },
              { label: 'Tipo de Pago', value: selectedPago.tipo_pago }
            ],
            {
              label: 'Monto del Gasto',
              value: selectedPago.Gasto ? `$${Number(selectedPago.Gasto.monto).toLocaleString('es-AR')}` : '-'
            },
            { label: 'Comentario', value: selectedPago.comentario || '-' }
          ]}
        />
      )}
    </>
  );
};

export default PagosProveedoresAdmin;
