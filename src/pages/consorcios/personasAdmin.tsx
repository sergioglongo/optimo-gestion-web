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
import PersonasModal from 'sections/consorcio/personas/PersonasModal';
import AlertPersonaDelete from 'sections/consorcio/personas/AlertPersonaDelete'; // This seems to have a placeholder implementation
import PersonaDetalleDrawer from 'sections/consorcio/personas/PersonaDetalleDrawer';

// API hooks
import useAuth from 'hooks/useAuth';
import useConsorcio from 'hooks/useConsorcio';

// assets
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useGetPersonas } from 'services/api/personasapi'; // Assuming a new API hook
import PersonasList from 'sections/consorcio/personas/PersonasList';
import { Persona } from 'types/persona'; // Assuming new types

// ==============================|| PERSONAS - ADMIN ||============================== //

const PersonasAdmin = () => {
  const theme = useTheme();
  const { user, token } = useAuth();
  const { selectedConsorcio } = useConsorcio();
  const intl = useIntl(); // Initialize useIntl

  const { data: personasData, isLoading } = useGetPersonas(selectedConsorcio?.id || 0, { enabled: !!user?.id && !!token });

  const [personaModal, setPersonaModal] = useState<boolean>(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [personaToDelete, setPersonaToDelete] = useState<{ id: number; nombre: string } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const handleCloseDelete = (deleted: boolean) => {
    setPersonaToDelete(null);
  };

  const columns = useMemo<ColumnDef<Persona>[]>(
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
        header: 'Apellido', // Added 'Apellido' for Persona
        accessorKey: 'apellido', // Assuming 'apellido' for Persona
        cell: ({ getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1">{getValue() as string}</Typography>
          </Stack>
        )
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
      // {
      //   header: 'Tipo',
      //   accessorKey: 'tipo_persona',
      //   cell: ({ getValue }) => {
      //     const tipo_persona = getValue() as TipoPersona; // Using TipoPersona
      //     switch (tipo_persona) {
      //       case 'persona juridica': // Example types for Persona
      //         return <Chip color="primary" label="Persona Jurdíca" size="small" variant="light" />;
      //       case 'persona fisica':
      //         return <Chip color="success" label="Persona Física" size="small" variant="light" />;
      //       default:
      //         return <Chip label={tipo_persona} size="small" variant="light" />;
      //     }
      //   }
      // },
      {
        header: 'Telefono', // Added 'DNI' for Persona
        accessorKey: 'telefono', // Assuming 'dni' for Persona
        cell: ({ getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1">{getValue() as string}</Typography>
          </Stack>
        )
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
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="Ver Detalles">
                <IconButton
                  color="secondary"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setSelectedPersona(row.original);
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
                    setSelectedPersona(row.original);
                    setPersonaModal(true);
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
                    setPersonaToDelete({ id: row.original.id, nombre: `${row.original.nombre} ${row.original.apellido}` });
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
          showSelection: true,
          initialColumnVisibility: { id: false },
          modalToggler: () => {
            setPersonaModal(true);
            setSelectedPersona(null);
          }
        }}
      />
      {personaToDelete && (
        <AlertPersonaDelete
          id={personaToDelete.id}
          title={personaToDelete.nombre}
          open={!!personaToDelete}
          handleClose={handleCloseDelete}
        />
      )}
      <PersonasModal open={personaModal} modalToggler={setPersonaModal} persona={selectedPersona} />
      <PersonaDetalleDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} persona={selectedPersona} />
    </>
  );
};

export default PersonasAdmin;
