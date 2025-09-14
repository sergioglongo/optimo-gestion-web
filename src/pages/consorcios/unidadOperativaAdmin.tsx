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
import UnidadOperativaModal from 'sections/consorcio/unidadOperativa/UnidadOperativaModal';
import AlertUnidadOperativaDelete from 'sections/consorcio/unidadOperativa/AlertUnidadOperativaDelete';

// API hooks
import useAuth from 'hooks/useAuth';
import useConsorcio from 'hooks/useConsorcio';

// assets
import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useGetUnidadesOperativas } from 'services/api/unidadOperativaapi'; // Assuming a new API hook
import UnidadOperativaList from 'sections/consorcio/unidadOperativa/UnidadOperativaList';
import { UnidadOperativa, TipoUnidadOperativa, LiquidarA } from 'types/unidadOperativa'; // Using new types

// ==============================|| UNIDAD OPERATIVA - ADMIN ||============================== //

const UnidadOperativaAdmin = () => {
  const theme = useTheme();
  const { user, token } = useAuth();
  const { selectedConsorcio } = useConsorcio();
  const intl = useIntl(); // Initialize useIntl

  const { data: unidadesOperativasData, isLoading } = useGetUnidadesOperativas(selectedConsorcio?.id || 0, {
    enabled: !!user?.id && !!token
  });

  const [open, setOpen] = useState<boolean>(false);
  const [unidadOperativaModal, setUnidadOperativaModal] = useState<boolean>(false);
  const [selectedUnidadOperativa, setSelectedUnidadOperativa] = useState<UnidadOperativa | null>(null);
  const [unidadOperativaDeleteId, setUnidadOperativaDeleteId] = useState<any>('');

  const handleClose = () => {
    setOpen(!open);
  };

  // New function to handle modal close and reset selectedUnidadOperativa
  const handleUnidadOperativaModalClose = () => {
    setUnidadOperativaModal(false);
    setSelectedUnidadOperativa(null);
  };

  const columns = useMemo<ColumnDef<UnidadOperativa>[]>(
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
        header: 'Etiqueta',
        accessorKey: 'etiqueta',
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
          const tipo = cell.getValue() as TipoUnidadOperativa;
          switch (tipo) {
            case 'departamento':
              return <Chip color="primary" label="Departamento" size="small" variant="light" />;
            case 'casa':
              return <Chip color="success" label="Casa" size="small" variant="light" />;
            case 'duplex':
              return <Chip color="info" label="Dúplex" size="small" variant="light" />;
            case 'local':
              return <Chip color="warning" label="Local" size="small" variant="light" />;
            case 'cochera':
              return <Chip color="error" label="Cochera" size="small" variant="light" />;
            case 'baulera':
              return <Chip color="secondary" label="Baulera" size="small" variant="light" />;
            default:
              return <Chip label={tipo} size="small" variant="light" />;
          }
        }
      },
      {
        header: 'Identificador 1',
        accessorKey: 'identificador1',
        cell: ({ getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1">{getValue() as string}</Typography>
          </Stack>
        )
      },
      {
        header: 'Liquidar a',
        accessorKey: 'liquidar_a',
        cell: (cell) => {
          const liquidarA = cell.getValue() as LiquidarA;
          switch (liquidarA) {
            case 'propietario':
              return <Chip color="primary" label="Propietario" size="small" variant="light" />;
            case 'inquilino':
              return <Chip color="success" label="Inquilino" size="small" variant="light" />;
            case 'ambos':
              return <Chip color="info" label="Ambos" size="small" variant="light" />;
            default:
              return <Chip label={liquidarA} size="small" variant="light" />;
          }
        }
      },
      {
        header: 'Prorrateo',
        accessorKey: 'prorrateo',
        cell: ({ getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1">{getValue() as string}</Typography>
          </Stack>
        )
      },
      {
        header: 'Alquilada',
        accessorKey: 'alquilada',
        cell: ({ getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1">{getValue() ? 'Sí' : 'No'}</Typography>
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
                    setSelectedUnidadOperativa(row.original);
                    setUnidadOperativaModal(true);
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
                    setUnidadOperativaDeleteId(row.original);
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
      <UnidadOperativaList
        {...{
          data: unidadesOperativasData || [],
          columns,
          initialColumnVisibility: { id: false },
          modalToggler: () => {
            setUnidadOperativaModal(true);
            setSelectedUnidadOperativa(null);
          }
        }}
      />
      <AlertUnidadOperativaDelete
        id={unidadOperativaDeleteId.id}
        title={String(unidadOperativaDeleteId.etiqueta)}
        open={open}
        handleClose={handleClose}
      />
      <UnidadOperativaModal
        open={unidadOperativaModal}
        modalToggler={handleUnidadOperativaModalClose}
        unidadOperativa={selectedUnidadOperativa}
      />
    </>
  );
};

export default UnidadOperativaAdmin;
