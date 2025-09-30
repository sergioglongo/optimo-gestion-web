import { useMemo, useState, MouseEvent } from 'react';

// material-ui
import { Chip, Stack, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third-party
import { ColumnDef } from '@tanstack/react-table';
import { useIntl } from 'react-intl'; // Import useIntl

// project import
import ConsorcioList from 'sections/parameters/consorcios/ConsorciosList';
import IconButton from 'components/@extended/IconButton';
import EmptyReactTable from 'pages/tables/react-table/empty';
import ConsorcioModal from 'sections/parameters/consorcios/ConsorcioModal';
import AlertConsorcioDelete from 'sections/parameters/consorcios/AlertConsorcioDelete';
import Avatar from 'components/@extended/Avatar';

// API hooks
import { useGetConsorcios } from 'services/api/consorciosapi';
import useAuth from 'hooks/useAuth';

// types
import { Consorcio, TipoConsorcio } from 'types/consorcio';

// assets
import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined, HomeOutlined } from '@ant-design/icons';

// ==============================|| CONSORCIOS - ADMIN ||============================== //

const ConsorciosAdmin = () => {
  const theme = useTheme();
  const { user, token } = useAuth();
  const intl = useIntl(); // Initialize useIntl

  const { data: consorciosData, isLoading } = useGetConsorcios(user?.id || 0, { enabled: !!user?.id && !!token });

  const [open, setOpen] = useState<boolean>(false);
  const [consorcioModal, setConsorcioModal] = useState<boolean>(false);
  const [selectedConsorcio, setSelectedConsorcio] = useState<Consorcio | null>(null);
  const [consorcioDeleteId, setConsorcioDeleteId] = useState<any>('');

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo<ColumnDef<Consorcio>[]>(
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
        cell: ({ row, getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1">{getValue() as string}</Typography>
            <Typography color="text.secondary">{row.original.Domicilio?.direccion || ''}</Typography>
          </Stack>
        )
      },
      {
        header: 'Tipo',
        accessorKey: 'tipo',
        cell: (cell) => {
          const tipo = cell.getValue() as TipoConsorcio;
          switch (tipo) {
            case 'edificio':
              return <Chip color="primary" label="Edificio" size="small" variant="light" />;
            case 'barrio':
              return <Chip color="success" label="Barrio" size="small" variant="light" />;
            case 'country':
              return <Chip color="info" label="Country" size="small" variant="light" />;
            case 'complejo':
              return <Chip color="warning" label="Complejo" size="small" variant="light" />;
            default:
              return <Chip label={tipo} size="small" variant="light" />;
          }
        }
      },
      {
        header: 'Imagen',
        accessorKey: 'imagen',
        cell: ({ row }) => (
          <Avatar src={row.original.imagen ? row.original.imagen : ''} alt="imagen" size="sm" variant="rounded" type="filled">
            {!row.original.imagen && <HomeOutlined />}
          </Avatar>
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
                    setSelectedConsorcio(row.original);
                    setConsorcioModal(true);
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
                    setConsorcioDeleteId(row.original);
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
      <ConsorcioList
        {...{
          data: consorciosData || [],
          columns,
          initialColumnVisibility: { id: false },
          showSelection: true,
          modalToggler: () => {
            setConsorcioModal(true);
            setSelectedConsorcio(null);
          }
        }}
      />
      <AlertConsorcioDelete id={consorcioDeleteId.id} title={consorcioDeleteId.nombre} open={open} handleClose={handleClose} />
      <ConsorcioModal open={consorcioModal} modalToggler={setConsorcioModal} consorcio={selectedConsorcio} />
    </>
  );
};

export default ConsorciosAdmin;
