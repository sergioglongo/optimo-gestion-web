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
import PersonasModal from 'sections/consorcio/personas/PersonasModal';
import AlertPersonaDelete from 'sections/consorcio/personas/AlertPersonaDelete';

// API hooks
import useAuth from 'hooks/useAuth';
import useConsorcio from 'hooks/useConsorcio';

// assets
import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useGetPersonas } from 'services/api/personasapi'; // Assuming a new API hook
import PersonasList from 'sections/consorcio/personas/PersonasList';
import { Persona, TipoPersona } from 'types/persona'; // Assuming new types

// ==============================|| PERSONAS - ADMIN ||============================== //

const PersonasAdmin = () => {
  const theme = useTheme();
  const { user, token } = useAuth();
  const { selectedConsorcio } = useConsorcio();
  const intl = useIntl(); // Initialize useIntl

  const { data: personasData, isLoading } = useGetPersonas(selectedConsorcio?.id || 0, { enabled: !!user?.id && !!token });

  const [open, setOpen] = useState<boolean>(false);
  const [personaModal, setPersonaModal] = useState<boolean>(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [personaDeleteId, setPersonaDeleteId] = useState<any>('');

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo<ColumnDef<Persona>[]>(
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
        header: 'Nombre', // Changed from 'Descripción'
        accessorKey: 'nombre', // Assuming 'nombre' for Persona
        cell: ({ getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1">{getValue() as string}</Typography>
          </Stack>
        )
      },
      {
        header: 'Apellido', // Added 'Apellido' for Persona
        accessorKey: 'apellido', // Assuming 'apellido' for Persona
        cell: ({ getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1">{getValue() as string}</Typography>
          </Stack>
        )
      },
      {
        header: 'Tipo',
        accessorKey: 'tipo_persona',
        cell: (cell) => {
          const tipo = cell.getValue() as TipoPersona; // Using TipoPersona
          switch (tipo) {
            case 'persona juridica': // Example types for Persona
              return <Chip color="primary" label="Persona Jurdíca" size="small" variant="light" />;
            case 'persona fisica':
              return <Chip color="success" label="Persona Física" size="small" variant="light" />;
            default:
              return <Chip label={tipo} size="small" variant="light" />;
          }
        }
      },
      {
        header: 'Indentificación', // Added 'DNI' for Persona
        accessorKey: 'identificacion', // Assuming 'dni' for Persona
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
                    setSelectedPersona(row.original);
                    setPersonaModal(true);
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
                    setPersonaDeleteId(row.original);
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
      <PersonasList
        {...{
          data: personasData || [],
          columns,
          initialColumnVisibility: { id: false },
          modalToggler: () => {
            setPersonaModal(true);
            setSelectedPersona(null);
          }
        }}
      />
      <AlertPersonaDelete id={personaDeleteId.id} title={String(personaDeleteId.nombre)} open={open} handleClose={handleClose} />
      <PersonasModal open={personaModal} modalToggler={setPersonaModal} persona={selectedPersona} />
    </>
  );
};

export default PersonasAdmin;
