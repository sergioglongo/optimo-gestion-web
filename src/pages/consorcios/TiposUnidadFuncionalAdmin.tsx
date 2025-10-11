import { useMemo, useState, MouseEvent } from 'react';

// material-ui
import { Stack, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third-party
import { ColumnDef } from '@tanstack/react-table';
import { useIntl } from 'react-intl';

// project import
import IconButton from 'components/@extended/IconButton';
import EmptyReactTable from 'pages/tables/react-table/empty';
import TiposunidadFuncionalModal from './TiposUnidadFuncionalModal';
import AlertTipounidadFuncionalDelete from './AlertTipoUnidadFuncionalDelete';
import TiposunidadFuncionalList from './TiposUnidadFuncionalList';

// API hooks
import useAuth from 'hooks/useAuth';
import useConsorcio from 'hooks/useConsorcio';
import { useGetTiposunidadFuncional } from 'services/api/tipoUnidadFuncionalapi';

// assets
import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

// types
import { TipounidadFuncional } from 'types/unidadFuncional';

// ==============================|| TIPOS UNIDAD FUNCIONAL - ADMIN ||============================== //

const TiposunidadFuncionalAdmin = () => {
  const theme = useTheme();
  const { user, token } = useAuth();
  const { selectedConsorcio } = useConsorcio();
  const intl = useIntl();

  const { data: tiposData, isLoading } = useGetTiposunidadFuncional(selectedConsorcio?.id || 0, { enabled: !!user?.id && !!token });

  const [open, setOpen] = useState<boolean>(false);
  const [tipoModal, setTipoModal] = useState<boolean>(false);
  const [selectedTipo, setSelectedTipo] = useState<TipounidadFuncional | null>(null);
  const [tipoDeleteId, setTipoDeleteId] = useState<any>('');

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo<ColumnDef<TipounidadFuncional>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        meta: {
          className: 'd-none'
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
        header: 'Índice',
        accessorKey: 'indice',
        cell: ({ getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1">{getValue() as string}</Typography>
          </Stack>
        )
      },
      {
        header: intl.formatMessage({ id: 'table.actions' }),
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
                    setSelectedTipo(row.original);
                    setTipoModal(true);
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
                    setTipoDeleteId(row.original);
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
    [theme, intl]
  );

  if (isLoading) return <EmptyReactTable />;

  return (
    <>
      <TiposunidadFuncionalList
        {...{
          data: tiposData || [],
          columns,
          initialSorting: [{ id: 'nombre', desc: false }],
          showSelection: true,
          initialColumnVisibility: { id: false },
          modalToggler: () => {
            setTipoModal(true);
            setSelectedTipo(null);
          }
        }}
      />
      <AlertTipounidadFuncionalDelete id={tipoDeleteId.id} title={String(tipoDeleteId.nombre)} open={open} handleClose={handleClose} />
      <TiposunidadFuncionalModal open={tipoModal} modalToggler={setTipoModal} tipo={selectedTipo} />
    </>
  );
};

export default TiposunidadFuncionalAdmin;
