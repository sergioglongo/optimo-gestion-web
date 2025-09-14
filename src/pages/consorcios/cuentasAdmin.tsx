import { useMemo, useState, MouseEvent } from 'react';

// material-ui
import { Chip, Stack, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third-party
import { ColumnDef } from '@tanstack/react-table';
import { useIntl } from 'react-intl'; // Import useIntl

// project import
import IconButton from 'components/@extended/IconButton';
import EmptyReactTable from 'pages/tables/react-table/empty';
import { IndeterminateCheckbox } from 'components/third-party/react-table';
import CuentasModal from 'sections/consorcio/cuentas/CuentasModal';
import AlertCuentaDelete from 'sections/consorcio/cuentas/AlertCuentaDelete';

// API hooks
import useAuth from 'hooks/useAuth';
import useConsorcio from 'hooks/useConsorcio';

// assets
import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useGetCuentas } from 'services/api/cuentasapi';
import CuentasList from 'sections/consorcio/cuentas/CuentasList';
import { Cuenta, TipoCuenta } from 'types/cuenta';

// ==============================|| CUENTAS - ADMIN ||============================== //

const CuentasAdmin = () => {
  const theme = useTheme();
  const { user, token } = useAuth();
  const { selectedConsorcio } = useConsorcio();
  const intl = useIntl(); // Initialize useIntl

  const { data: cuentasData, isLoading } = useGetCuentas(selectedConsorcio?.id || 0, { enabled: !!user?.id && !!token });

  const [open, setOpen] = useState<boolean>(false);
  const [cuentaModal, setCuentaModal] = useState<boolean>(false);
  const [selectedCuenta, setSelectedCuenta] = useState<Cuenta | null>(null);
  const [cuentaDeleteId, setCuentaDeleteId] = useState<any>('');

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo<ColumnDef<Cuenta>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
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
        header: 'Descripción',
        accessorKey: 'descripcion',
        cell: ({ getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1">{getValue() as string}</Typography>
          </Stack>
        )
      },
      {
        header: 'Tipo',
        accessorKey: 'tipo',
        cell: (cell) => {
          const tipo = cell.getValue() as TipoCuenta;
          switch (tipo) {
            case 'corriente':
              return <Chip color="primary" label="Corriente" size="small" variant="light" />;
            case 'ahorro':
              return <Chip color="success" label="Ahorro" size="small" variant="light" />;
            case 'caja':
              return <Chip color="info" label="Caja" size="small" variant="light" />;
            default:
              return <Chip label={tipo} size="small" variant="light" />;
          }
        }
      },
      {
        header: intl.formatMessage({ id: 'table.actions' }), // Translated 'Actions'
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => {
          const collapseIcon =
            row.getCanExpand() && row.getIsExpanded() ? (
              <PlusOutlined style={{ color: theme.palette.error.main, transform: 'rotate(45deg)' }} />
            ) : (
              <EyeOutlined />
            );
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="View">
                <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
                  {collapseIcon}
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setSelectedCuenta(row.original);
                    setCuentaModal(true);
                  }}
                >
                  <EditOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    handleClose();
                    setCuentaDeleteId(row.original);
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
      <CuentasList
        {...{
          data: cuentasData || [],
          columns,
          initialColumnVisibility: { id: false },
          modalToggler: () => {
            setCuentaModal(true);
            setSelectedCuenta(null);
          }
        }}
      />
      <AlertCuentaDelete id={cuentaDeleteId.id} title={String(cuentaDeleteId.descripcion)} open={open} handleClose={handleClose} />
      <CuentasModal open={cuentaModal} modalToggler={setCuentaModal} cuenta={selectedCuenta} />
    </>
  );
};

export default CuentasAdmin;
