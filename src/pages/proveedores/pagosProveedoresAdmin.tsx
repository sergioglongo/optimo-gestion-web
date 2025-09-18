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
import AlertPagoProveedorDelete from 'sections/proveedores/pagos/AlertPagoProveedorDelete';

// API hooks
import useConsorcio from 'hooks/useConsorcio';
import { useGetPagosProveedores } from 'services/api/pagoProveedorapi';

// types
import { PagoProveedor, TipoPagoProveedor } from 'types/pagoProveedor';
import { Proveedor } from 'types/proveedor';
import { Cuenta } from 'types/cuenta';

// assets
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// ==============================|| PAGOS PROVEEDORES - ADMIN ||============================== //

const PagosProveedoresAdmin = () => {
  const { selectedConsorcio } = useConsorcio();
  const intl = useIntl();

  const { data: pagosData, isLoading } = useGetPagosProveedores(selectedConsorcio?.id || 0, { enabled: !!selectedConsorcio?.id });

  const [pagoModal, setPagoModal] = useState<boolean>(false);
  const [selectedPago, setSelectedPago] = useState<PagoProveedor | null>(null);
  const [pagoDelete, setPagoDelete] = useState<{ id: number; fecha: string; monto: number } | null>(null);

  const columns = useMemo<ColumnDef<PagoProveedor>[]>(
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
        accessorKey: 'Proveedor', // Assuming backend sends nested object
        cell: ({ getValue }) => <Typography>{getValue<Proveedor>()?.nombre || '-'}</Typography>
      },
      {
        header: 'Cuenta',
        accessorKey: 'Cuenta', // Assuming backend sends nested object
        cell: ({ getValue }) => <Typography>{getValue<Cuenta>()?.descripcion || '-'}</Typography>
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
            <Tooltip title="Editar">
              <IconButton
                color="primary"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  setSelectedPago(row.original);
                  setPagoModal(true);
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
          setPagoModal(true);
          setSelectedPago(null);
        }}
      />
      <AlertPagoProveedorDelete pago={pagoDelete} open={!!pagoDelete} handleClose={() => setPagoDelete(null)} />
      <PagoProveedorModal open={pagoModal} modalToggler={setPagoModal} pago={selectedPago} />
    </>
  );
};

export default PagosProveedoresAdmin;
