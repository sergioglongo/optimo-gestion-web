import { useMemo, useEffect } from 'react';

// material-ui
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  TableFooter,
  Typography,
  Stack,
  Button
} from '@mui/material';

// third-party
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useFormikContext } from 'formik';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import IconButton from 'components/@extended/IconButton';
import EmptyReactTable from 'pages/tables/react-table/empty';
import { Gasto } from 'types/gasto';
import { toLocaleDateFormat } from 'utils/dateFormat';
import { truncateString } from 'utils/textFormat';

// assets
import { DeleteOutlined } from '@ant-design/icons';

// ==============================|| GASTOS - LIQUIDACION ||============================== //

interface Props {
  onAddSinPeriodo: () => void;
}

const LiquidacionGastos = ({ onAddSinPeriodo }: Props) => {
  const { values, setFieldValue } = useFormikContext<{ gastos: Gasto[]; total: number }>();

  const handleRemoveGasto = (index: number) => {
    const newGastos = [...values.gastos];
    newGastos.splice(index, 1);
    setFieldValue('gastos', newGastos);
  };

  const handleQuitarImpagos = () => {
    const gastosFiltrados = values.gastos.filter((gasto) => gasto.estado !== 'impago');
    setFieldValue('gastos', gastosFiltrados);
  };

  const handleQuitarParciales = () => {
    const gastosFiltrados = values.gastos.filter((gasto) => gasto.estado !== 'parcial');
    setFieldValue('gastos', gastosFiltrados);
  };

  const totalGastos = useMemo(() => {
    return values.gastos?.reduce((sum, gasto) => sum + Number(gasto.saldado || 0), 0) || 0;
  }, [values.gastos]);

  useEffect(() => {
    setFieldValue('total', totalGastos);
  }, [totalGastos, setFieldValue]);

  const columns = useMemo<ColumnDef<Gasto>[]>(
    () => [
      {
        header: 'Fecha',
        accessorKey: 'fecha',
        cell: ({ getValue }) => toLocaleDateFormat(getValue() as string)
      },
      {
        header: 'Proveedor',
        accessorKey: 'proveedor_id',
        cell: ({ row }) => row.original.Proveedor?.nombre || 'N/A'
      },
      {
        header: 'Descripción',
        accessorKey: 'descripcion',
        cell: ({ getValue }) => {
          const description = getValue() as string;
          return (
            <Tooltip title={description} placement="top">
              <Typography>{truncateString(description, 30)}</Typography>
            </Tooltip>
          );
        }
      },
      {
        header: 'Tipo',
        accessorKey: 'tipo_gasto',
        cell: ({ getValue }) => {
          const tipo = getValue() as string;
          let color: 'primary' | 'secondary' | 'info' = 'primary';
          if (tipo === 'Ordinario') color = 'primary';
          if (tipo === 'Extraordinario') color = 'secondary';
          if (tipo === 'Fondo de Reserva') color = 'info';
          return <Chip color={color} label={tipo} size="small" variant="light" />;
        }
      },
      {
        header: 'Monto',
        accessorKey: 'monto',
        cell: ({ getValue }) => `$${Number(getValue()).toLocaleString('es-AR')}`,
        meta: {
          className: 'cell-right'
        }
      },
      {
        header: 'Saldado',
        accessorKey: 'saldado',
        cell: ({ getValue }) => `$${Number(getValue() || 0).toLocaleString('es-AR')}`,
        meta: {
          className: 'cell-right'
        }
      },
      {
        header: 'Estado',
        accessorKey: 'estado',
        cell: ({ getValue }) => {
          const estado = getValue() as Gasto['estado'];
          const color = estado === 'pagado' ? 'success' : estado === 'parcial' ? 'warning' : 'error';
          const label = estado.charAt(0).toUpperCase() + estado.slice(1);
          return <Chip color={color} label={label} size="small" variant="light" />;
        }
      },
      {
        header: 'Acciones',
        meta: {
          className: 'cell-center'
        },
        cell: ({ row }) => (
          <Tooltip title="Quitar">
            <IconButton color="error" onClick={() => handleRemoveGasto(row.index)}>
              <DeleteOutlined />
            </IconButton>
          </Tooltip>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const table = useReactTable({
    data: values.gastos || [],
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  if (!values.gastos || values.gastos.length === 0) {
    return <EmptyReactTable />;
  }

  return (
    <MainCard content={false}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 2, pb: 1 }}>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          Acciones rápidas:
        </Typography>
        <Button size="small" variant="contained" color="primary" onClick={onAddSinPeriodo}>
          Agregar Gastos
        </Button>
        <Button size="small" variant="outlined" color="error" onClick={handleQuitarImpagos}>
          Quitar Impagos
        </Button>
        <Button size="small" variant="outlined" color="warning" onClick={handleQuitarParciales}>
          Quitar Parciales
        </Button>
        <Button size="small" variant="outlined" color="info" onClick={() => setFieldValue('gastos', [])}>
          Quitar Todos
        </Button>
      </Stack>

      <ScrollX>
        <TableContainer>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} {...header.column.columnDef.meta}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} align="right">
                  <Typography variant="h5">Total:</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h5">${totalGastos.toLocaleString('es-AR')}</Typography>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </ScrollX>
    </MainCard>
  );
};

export default LiquidacionGastos;
