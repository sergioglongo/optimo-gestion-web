import { useMemo } from 'react';

// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Typography, useTheme } from '@mui/material';

// third-party
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';

// ==============================|| CUENTAS - LIQUIDACION ||============================== //

interface CuentaMovimiento {
  resumen: string;
  egresos: number | null;
  ingresos: number | null;
}

interface Props {
  data: CuentaMovimiento[];
}

const LiquidacionCuentas = ({ data }: Props) => {
  const theme = useTheme();

  const saldoFinal = useMemo(() => {
    const totalIngresos = data.reduce((sum, row) => sum + (row.ingresos || 0), 0);
    const totalEgresos = data.reduce((sum, row) => sum + (row.egresos || 0), 0);
    return totalIngresos - totalEgresos;
  }, [data]);

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return '';
    return `$${value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const columns = useMemo<ColumnDef<CuentaMovimiento>[]>(
    () => [
      {
        header: 'Resumen Movimiento',
        accessorKey: 'resumen',
        meta: { headerAlign: 'center' }
      },
      {
        header: 'Egresos',
        accessorKey: 'egresos',
        cell: ({ getValue }) => formatCurrency(getValue() as number | null),
        meta: {
          headerAlign: 'center',
          align: 'right',
          className: 'cell-right',
          sx: { backgroundColor: theme.palette.warning.lighter, width: '30%' }
        }
      },
      {
        header: 'Ingresos',
        accessorKey: 'ingresos',
        cell: ({ getValue }) => formatCurrency(getValue() as number | null),
        meta: {
          headerAlign: 'center',
          align: 'right',
          className: 'cell-right',
          sx: { backgroundColor: theme.palette.success.lighter, width: '30%' }
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <MainCard content={false} title="Resumen de Cuentas">
      <ScrollX>
        <TableContainer>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      align={(header.column.columnDef.meta as any)?.headerAlign || 'inherit'}
                      sx={(header.column.columnDef.meta as any)?.sx}
                    >
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
                    <TableCell
                      key={cell.id}
                      align={(cell.column.columnDef.meta as any)?.align || 'inherit'}
                      sx={(cell.column.columnDef.meta as any)?.sx}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} align="right">
                  <Typography variant="h5">Saldo Final:</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h5">{formatCurrency(saldoFinal)}</Typography>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </ScrollX>
    </MainCard>
  );
};

export default LiquidacionCuentas;
