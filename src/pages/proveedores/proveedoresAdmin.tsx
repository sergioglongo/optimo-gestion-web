import { useMemo, useState, MouseEvent } from 'react';

// material-ui
import { Stack, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third-party
import { ColumnDef } from '@tanstack/react-table';
import { useIntl } from 'react-intl'; // Import useIntl

// project import
import IconButton from 'components/@extended/IconButton';
import EmptyReactTable from 'pages/tables/react-table/empty';

// API hooks
import useAuth from 'hooks/useAuth';
import useConsorcio from 'hooks/useConsorcio';

// assets
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useGetProveedores } from 'services/api/proveedoresapi';
import { Proveedor } from 'types/proveedor';
import ProveedoresList from 'sections/proveedores/proveedores/ProveedoresList';
import ProveedorModal from 'sections/proveedores/proveedores/ProveedorModal';
import ViewDrawer from 'components/drawers/ViewDrawer';
import AlertProveedorDelete from 'sections/proveedores/proveedores/AlertProveedorDelete';

// ==============================|| CUENTAS - ADMIN ||============================== //

const ProveedoresAdmin = () => {
  const theme = useTheme();
  const { user, token } = useAuth();
  const { selectedConsorcio } = useConsorcio();
  const intl = useIntl(); // Initialize useIntl

  const { data: proveedoresData, isLoading } = useGetProveedores(selectedConsorcio?.id || 0, { enabled: !!user?.id && !!token });

  const [proveedorModal, setProveedorModal] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [proveedorToDelete, setProveedorToDelete] = useState<{ id: number; nombre: string } | null>(null);

  const columns = useMemo<ColumnDef<Proveedor>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        enableColumnFilter: false,
        enableSorting: true,
        meta: {
          className: 'd-none' // Hide the column visually
        }
      },
      {
        header: 'Nombre',
        accessorKey: 'nombre',
        cell: ({ getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1">{getValue() as string}</Typography>
          </Stack>
        )
      },
      {
        header: 'Servicio',
        accessorKey: 'servicio',
        cell: ({ getValue }) => (
          <Stack spacing={0}>
            <Typography variant="inherit">{getValue() as string}</Typography>
          </Stack>
        )
      },
      {
        header: 'Tipo Identificación',
        accessorKey: 'tipo_identificacion',
        cell: ({ getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1">{(getValue() as string)?.toUpperCase()}</Typography>
          </Stack>
        )
      },
      {
        header: 'Identificación',
        accessorKey: 'identificacion',
        cell: ({ getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1">{getValue() as string}</Typography>
          </Stack>
        )
      },
      {
        header: intl.formatMessage({ id: 'table.actions' }), // Translated 'Actions'
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="Ver Detalles">
                <IconButton
                  color="secondary"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setSelectedProveedor(row.original);
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
                    setSelectedProveedor(row.original);
                    setProveedorModal(true);
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
                    setProveedorToDelete({ id: row.original.id, nombre: row.original.nombre });
                  }}
                >
                  <DeleteOutlined />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    // eslint-disable-next-line
    [theme, intl] // Add intl to dependency array
  );

  if (isLoading) return <EmptyReactTable />;

  return (
    <>
      <ProveedoresList
        {...{
          data: proveedoresData || [],
          columns,
          initialColumnVisibility: { id: false },
          showSelection: false,
          modalToggler: () => {
            setProveedorModal(true);
            setSelectedProveedor(null);
          }
        }}
      />
      {proveedorToDelete && (
        <AlertProveedorDelete
          id={proveedorToDelete.id}
          title={proveedorToDelete.nombre}
          open={!!proveedorToDelete}
          handleClose={() => setProveedorToDelete(null)}
        />
      )}
      <ProveedorModal open={proveedorModal} modalToggler={setProveedorModal} proveedor={selectedProveedor} />
      {selectedProveedor && (
        <ViewDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Detalles del Proveedor"
          items={[
            { label: 'Nombre', value: selectedProveedor.nombre }, // Fila 1, 1 columna
            { label: 'Servicio', value: selectedProveedor.servicio }, // Fila 2, 1 columna
            [
              { label: 'Tipo Identificación', value: selectedProveedor.tipo_identificacion }, // Fila 3, columna 1
              { label: 'Identificación', value: selectedProveedor.identificacion || '-' } // Fila 3, columna 2
            ],
            [
              { label: 'Teléfono', value: selectedProveedor.telefono || '-' },
              { label: 'Email', value: selectedProveedor.email || '-' }
            ],
            { label: 'CBU/Alias', value: selectedProveedor.CBU || '-' }, // Fila 4, 1 columna
            { label: 'Cuenta Asociada', value: selectedProveedor.cuenta?.descripcion || 'Ninguna' },
            {
              label: 'Rubros',
              value: selectedProveedor.Rubros?.map((r) => r.rubro) || []
            }
          ]}
        />
      )}
    </>
  );
};

export default ProveedoresAdmin;
