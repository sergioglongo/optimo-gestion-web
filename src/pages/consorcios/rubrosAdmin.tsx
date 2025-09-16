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
import { IndeterminateCheckbox } from 'components/third-party/react-table';
import RubrosModal from 'sections/consorcio/rubros/RubrosModal';
import AlertRubroDelete from 'sections/consorcio/rubros/AlertRubroDelete';

// API hooks
import useAuth from 'hooks/useAuth';
import useConsorcio from 'hooks/useConsorcio';

// assets
import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useGetRubros } from 'services/api/rubrosapi';
import RubrosList from 'sections/consorcio/rubros/RubrosList';
import { Rubro } from 'types/rubro';

// ==============================|| RUBROS - ADMIN ||============================== //

const RubrosAdmin = () => {
  const theme = useTheme();
  const { user, token } = useAuth();
  const { selectedConsorcio } = useConsorcio();
  const intl = useIntl();

  const { data: rubrosData, isLoading } = useGetRubros(selectedConsorcio?.id || 0, { enabled: !!user?.id && !!token });

  const [open, setOpen] = useState<boolean>(false);
  const [rubroModal, setRubroModal] = useState<boolean>(false);
  const [selectedRubro, setSelectedRubro] = useState<Rubro | null>(null);
  const [rubroDeleteId, setRubroDeleteId] = useState<any>('');

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo<ColumnDef<Rubro>[]>(
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
        meta: {
          className: 'd-none'
        }
      },
      {
        header: 'Rubro',
        accessorKey: 'rubro',
        cell: ({ getValue }) => (
          <Stack spacing={0}>
            <Typography variant="subtitle1">{getValue() as string}</Typography>
          </Stack>
        )
      },
      {
        header: 'Orden',
        accessorKey: 'orden',
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
                    setSelectedRubro(row.original);
                    setRubroModal(true);
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
                    setRubroDeleteId(row.original);
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
      <RubrosList
        {...{
          data: rubrosData || [],
          columns,
          initialSorting: [{ id: 'orden', desc: false }],
          initialColumnVisibility: { id: false },
          modalToggler: () => {
            setRubroModal(true);
            setSelectedRubro(null);
          }
        }}
      />
      <AlertRubroDelete id={rubroDeleteId.id} title={String(rubroDeleteId.rubro)} open={open} handleClose={handleClose} />
      <RubrosModal open={rubroModal} modalToggler={setRubroModal} rubro={selectedRubro} />
    </>
  );
};

export default RubrosAdmin;
