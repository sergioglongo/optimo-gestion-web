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
import UnidadOperativaModal from 'sections/consorcio/unidadOperativa/UnidadOperativaModal';
import AlertUnidadOperativaDelete from 'sections/consorcio/unidadOperativa/AlertUnidadOperativaDelete'; // This seems to have a placeholder implementation
import UnidadDetalleDrawer from 'sections/consorcio/unidadOperativa/UnidadDetalleDrawer';
import PersonaUnidadModal from 'sections/consorcio/unidadOperativa/PersonaUnidadModal';

// API hooks
import useAuth from 'hooks/useAuth';
import useConsorcio from 'hooks/useConsorcio';

// assets
import { EditOutlined, EyeOutlined, DeleteOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useGetUnidadesOperativas } from 'services/api/unidadOperativaapi'; // Assuming a new API hook
import { useGetTiposUnidadOperativa } from 'services/api/tipoUnidadOperativaapi';
import UnidadOperativaList from 'sections/consorcio/unidadOperativa/UnidadOperativaList';
import { UnidadOperativa, LiquidarA } from 'types/unidadOperativa'; // Using new types

// ==============================|| UNIDAD OPERATIVA - ADMIN ||============================== //

const UnidadOperativaAdmin = () => {
  const theme = useTheme();
  const { user, token } = useAuth();
  const { selectedConsorcio } = useConsorcio();
  const intl = useIntl(); // Initialize useIntl

  const { data: unidadesOperativasData, isLoading } = useGetUnidadesOperativas(
    { consorcio_id: selectedConsorcio?.id || 0 },
    {
      enabled: !!user?.id && !!token
    }
  );

  const { data: tiposUnidadOperativaData, isLoading: isLoadingTipos } = useGetTiposUnidadOperativa(selectedConsorcio?.id || 0, {
    enabled: !!selectedConsorcio?.id
  });

  const [unidadOperativaModal, setUnidadOperativaModal] = useState<boolean>(false);
  const [selectedUnidadOperativa, setSelectedUnidadOperativa] = useState<UnidadOperativa | null>(null);
  const [personaUnidadModalOpen, setPersonaUnidadModalOpen] = useState<boolean>(false);
  const [unidadToDelete, setUnidadToDelete] = useState<{ id: number; etiqueta: string } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const handleCloseDelete = (deleted: boolean) => {
    setUnidadToDelete(null);
  };

  // New function to handle modal close and reset selectedUnidadOperativa
  const handleUnidadOperativaModalClose = () => {
    setUnidadOperativaModal(false);
    setSelectedUnidadOperativa(null);
  };

  // Handler for the new modal
  const handlePersonaUnidadModalClose = () => {
    setPersonaUnidadModalOpen(false);
    setSelectedUnidadOperativa(null);
  };

  const columns = useMemo<ColumnDef<UnidadOperativa>[]>(
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
        header: 'Unidad',
        accessorKey: 'etiqueta',
        cell: ({ getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1">{getValue() as string}</Typography>
          </Stack>
        )
      },
      {
        header: 'Tipo',
        accessorKey: 'tipo_unidad_operativa_id',
        cell: (cell) => {
          const tipoId = cell.getValue() as number;
          const tipo = tiposUnidadOperativaData?.find((t) => t.id === tipoId);
          const label = tipo ? tipo.nombre : 'No asignado';
          return <Chip label={label} size="small" variant="light" />;
        }
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
        cell: ({ getValue }) => {
          const value = getValue() as number;
          const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;
          return (
            <Stack spacing={0} alignItems="center">
              <Typography variant="subtitle1" textAlign="center">
                {formattedValue}
              </Typography>
            </Stack>
          );
        }
      },
      {
        header: 'Alquilada',
        accessorKey: 'alquilada',
        cell: ({ getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1" textAlign="center">
              {getValue() ? 'Sí' : 'No'}
            </Typography>
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
                    setSelectedUnidadOperativa(row.original);
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
                    setSelectedUnidadOperativa(row.original);
                    setUnidadOperativaModal(true);
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
                    setUnidadToDelete({ id: row.original.id, etiqueta: row.original.etiqueta || `ID: ${row.original.id}` });
                  }}
                >
                  <DeleteOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Asociar Personas">
                <IconButton
                  color="success"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setSelectedUnidadOperativa(row.original);
                    setPersonaUnidadModalOpen(true);
                  }}
                >
                  <UsergroupAddOutlined />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    // eslint-disable-next-line
    [theme, intl, tiposUnidadOperativaData] // Add intl to dependency array
  );

  if (isLoading || isLoadingTipos) return <EmptyReactTable />;

  return (
    <>
      <UnidadOperativaList
        {...{
          data: unidadesOperativasData || [],
          columns,
          initialSorting: [{ id: 'etiqueta', desc: false }],
          initialColumnVisibility: { id: false },
          showSelection: false,
          modalToggler: () => {
            setUnidadOperativaModal(true);
            setSelectedUnidadOperativa(null);
          }
        }}
      />
      {unidadToDelete && (
        <AlertUnidadOperativaDelete
          id={unidadToDelete.id}
          title={unidadToDelete.etiqueta}
          open={!!unidadToDelete}
          handleClose={handleCloseDelete}
        />
      )}
      <UnidadOperativaModal
        open={unidadOperativaModal}
        modalToggler={handleUnidadOperativaModalClose}
        unidadOperativa={selectedUnidadOperativa}
        tiposUnidadOperativa={tiposUnidadOperativaData || []}
      />
      <PersonaUnidadModal open={personaUnidadModalOpen} onClose={handlePersonaUnidadModalClose} unidadOperativa={selectedUnidadOperativa} />
      <UnidadDetalleDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} unidad={selectedUnidadOperativa} />
    </>
  );
};

export default UnidadOperativaAdmin;
