import { useMemo, useState, useEffect } from 'react';

// material-ui
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Box,
  Divider,
  Typography,
  Tooltip
} from '@mui/material';

// third-party
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';

// project-imports
import Modal from 'components/Modal/ModalBasico';
import ScrollX from 'components/ScrollX';
import { IndeterminateCheckbox, TablePagination } from 'components/third-party/react-table';

import { Gasto } from 'types/gasto';
import { toLocaleDateFormat } from 'utils/dateFormat';
import { useGetLiquidacionGastos } from 'services/api/gastosapi';
import { truncateString } from 'utils/textFormat';
import useConsorcio from 'hooks/useConsorcio';

// ==============================|| GASTOS SIN PERIODO - MODAL ||============================== //

interface Props {
  open: boolean;
  onClose: () => void;
  onAddGastos: (gastos: Gasto[]) => void;
  gastosActuales: Gasto[];
}

const GastosSinPeriodoModal = ({ open, onClose, onAddGastos, gastosActuales }: Props) => {
  const { selectedConsorcio } = useConsorcio();
  const [rowSelection, setRowSelection] = useState({});

  const { data: gastosData = [], isLoading } = useGetLiquidacionGastos(
    {
      consorcio_id: selectedConsorcio?.id || 0,
      periodo: null, // null para traer todos los gastos sin liquidar (con y sin período)
      sin_liquidar: true
    },
    { enabled: !!selectedConsorcio?.id && open }
  );

  // Filtrar gastos que ya están en la liquidación actual
  const gastosDisponibles = useMemo(() => {
    const idsActuales = new Set(gastosActuales.map((g) => g.id));
    return gastosData.filter((g) => !idsActuales.has(g.id));
  }, [gastosData, gastosActuales]);

  const columns = useMemo<ColumnDef<Gasto>[]>(
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
      { header: 'Fecha', accessorKey: 'fecha', cell: ({ getValue }) => toLocaleDateFormat(getValue() as string) },
      { header: 'Proveedor', accessorKey: 'Proveedor.nombre' },
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
        header: 'Monto',
        accessorKey: 'monto',
        cell: ({ getValue }) => `$${Number(getValue()).toLocaleString('es-AR')}`,
        meta: { className: 'cell-right' }
      },
      {
        header: 'Estado',
        accessorKey: 'estado',
        cell: ({ getValue }) => {
          const estado = getValue() as Gasto['estado'];
          const color = estado === 'pagado' ? 'success' : estado === 'parcial' ? 'warning' : 'error';
          return <Chip color={color} label={estado} size="small" variant="light" />;
        }
      }
    ],
    []
  );

  const table = useReactTable({
    data: gastosDisponibles,
    columns,
    state: { rowSelection },
    initialState: { pagination: { pageSize: 5 } },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const handleConfirm = () => {
    const selectedGastos = table.getSelectedRowModel().flatRows.map((row) => row.original);
    onAddGastos(selectedGastos);
    setRowSelection({}); // Limpiar selección
    onClose();
  };

  useEffect(() => {
    if (!open) {
      setRowSelection({});
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      cancelButtonLabel={'cerrar'}
      confirmButtonLabel={'Agregar'}
      onConfirm={handleConfirm}
      title="Agregar Gastos"
      isSubmitting={isLoading}
    >
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
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(columns.length)].map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton animation="wave" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography variant="h5">No hay gastos sin período disponibles.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <Box sx={{ p: 2 }}>
          <TablePagination
            {...{
              setPageSize: table.setPageSize,
              setPageIndex: table.setPageIndex,
              getState: table.getState,
              getPageCount: table.getPageCount,
              initialPageSize: 5
            }}
          />
        </Box>
      </ScrollX>
    </Modal>
  );
};

export default GastosSinPeriodoModal;
