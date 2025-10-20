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
import UnidadFuncionalModal from 'sections/consorcio/unidadFuncional/UnidadFuncionalModal';
import AlertunidadFuncionalDelete from 'sections/consorcio/unidadFuncional/AlertUnidadFuncionalDelete';
import UnidadDetalleDrawer from 'sections/consorcio/unidadFuncional/UnidadDetalleDrawer';

// API hooks
import useAuth from 'hooks/useAuth';
import useConsorcio from 'hooks/useConsorcio';

// assets
import { EditOutlined, EyeOutlined, DeleteOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useGetUnidadesFuncionals } from 'services/api/unidadFuncionalapi';
import { useGetTiposunidadFuncional } from 'services/api/tipoUnidadFuncionalapi'; // Assuming a new API hook
import UnidadFuncionalList from 'sections/consorcio/unidadFuncional/UnidadFuncionalList';
import { unidadFuncional, LiquidarA } from 'types/unidadFuncional'; // Using new types
import { SummaryField } from 'components/tables/TablaAdmin';
import PersonaUnidadModal from 'sections/consorcio/unidadFuncional/PersonaUnidadModal';

// ==============================|| UNIDAD FUNCIONAL - ADMIN ||============================== //

const UnidadFuncionalAdmin = () => {
  const theme = useTheme();
  const { user, token } = useAuth();
  const { selectedConsorcio } = useConsorcio();
  const intl = useIntl(); // Initialize useIntl

  const { data: unidadesFuncionalsData, isLoading } = useGetUnidadesFuncionals(
    { consorcio_id: selectedConsorcio?.id || 0 },
    {
      enabled: !!user?.id && !!token
    }
  );

  const { data: tiposunidadFuncionalData, isLoading: isLoadingTipos } = useGetTiposunidadFuncional(selectedConsorcio?.id || 0, {
    enabled: !!selectedConsorcio?.id
  });

  const [unidadFuncionalModal, setunidadFuncionalModal] = useState<boolean>(false);
  const [selectedunidadFuncional, setSelectedunidadFuncional] = useState<unidadFuncional | null>(null);
  const [personaUnidadModalOpen, setPersonaUnidadModalOpen] = useState<boolean>(false);
  const [unidadToDelete, setUnidadToDelete] = useState<{ id: number; etiqueta: string } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<SummaryField[]>([]);

  const handleCloseDelete = (deleted: boolean) => {
    setUnidadToDelete(null);
  };

  // New function to handle modal close and reset selectedunidadFuncional
  const handleunidadFuncionalModalClose = () => {
    setunidadFuncionalModal(false);
    setSelectedunidadFuncional(null);
  };

  // Handler for the new modal
  const handlePersonaUnidadModalClose = () => {
    setPersonaUnidadModalOpen(false);
    setSelectedunidadFuncional(null);
  };

  const handleFilteredRowsChange = (filteredRows: any[]) => {
    // 1. Calcular el total de prorrateo
    const totalProrrateo = filteredRows.reduce((sum, row) => {
      const prorrateo = parseFloat(row.original.prorrateo);
      return sum + (isNaN(prorrateo) ? 0 : prorrateo);
    }, 0);

    const newSummaryData: SummaryField[] = [{ label: 'Total Prorrateo', value: `${totalProrrateo.toFixed(3)}%` }];

    // 2. Contar unidades por tipo
    if (tiposunidadFuncionalData) {
      const typeCounts = tiposunidadFuncionalData.reduce(
        (acc, tipo) => {
          acc[tipo.id] = { name: tipo.nombre, count: 0 };
          return acc;
        },
        {} as Record<number, { name: string; count: number }>
      );

      filteredRows.forEach((row) => {
        const typeId = row.original.tipo_unidad_funcional_id;
        if (typeId && typeCounts[typeId]) {
          typeCounts[typeId].count++;
        }
      });

      Object.values(typeCounts).forEach((typeInfo) => {
        if (typeInfo.count > 0) {
          newSummaryData.push({ label: `${typeInfo.name}`, value: typeInfo.count });
        }
      });
    }

    setSummaryData(newSummaryData);
  };

  const columns = useMemo<ColumnDef<unidadFuncional>[]>(
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
        filterFn: 'includesString',
        cell: ({ getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1">{getValue() as string}</Typography>
          </Stack>
        )
      },
      {
        header: 'Tipo',
        id: 'tipo_unidad_funcional_nombre', // Se necesita un ID único cuando se usa accessorFn
        accessorFn: (row) => {
          // Esta función devuelve el valor sobre el que se buscará y ordenará
          const tipoId = row.tipo_unidad_funcional_id;
          const tipo = tiposunidadFuncionalData?.find((t) => t.id === tipoId);
          return tipo ? tipo.nombre : 'No asignado';
        },
        cell: (cell) => {
          // La celda ahora solo renderiza el valor que ya es el nombre
          return <Chip label={cell.getValue() as string} size="small" variant="light" />;
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
                    setSelectedunidadFuncional(row.original);
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
                    setSelectedunidadFuncional(row.original);
                    setunidadFuncionalModal(true);
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
                    setSelectedunidadFuncional(row.original);
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
    [theme, intl, tiposunidadFuncionalData] // Add intl to dependency array
  );

  if (isLoading || isLoadingTipos) return <EmptyReactTable />;

  return (
    <>
      <UnidadFuncionalList
        {...{
          data: unidadesFuncionalsData || [],
          columns,
          initialSorting: [{ id: 'etiqueta', desc: false }],
          initialColumnVisibility: { id: false },
          showSelection: false,
          modalToggler: () => {
            setunidadFuncionalModal(true);
            setSelectedunidadFuncional(null);
          },
          onFilteredRowsChange: handleFilteredRowsChange,
          summaryData: summaryData,
          tiposunidadFuncional: tiposunidadFuncionalData || [],
          consorcio: selectedConsorcio
        }}
      />
      {unidadToDelete && (
        <AlertunidadFuncionalDelete
          id={unidadToDelete.id}
          title={unidadToDelete.etiqueta}
          open={!!unidadToDelete}
          handleClose={handleCloseDelete}
        />
      )}
      <UnidadFuncionalModal
        open={unidadFuncionalModal}
        modalToggler={handleunidadFuncionalModalClose}
        unidadFuncional={selectedunidadFuncional}
        tiposunidadFuncional={tiposunidadFuncionalData || []}
      />
      <PersonaUnidadModal open={personaUnidadModalOpen} onClose={handlePersonaUnidadModalClose} unidadFuncional={selectedunidadFuncional} />
      <UnidadDetalleDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} unidad={selectedunidadFuncional} />
    </>
  );
};

export default UnidadFuncionalAdmin;
