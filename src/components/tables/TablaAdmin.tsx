import { useMemo, useState } from 'react';

// material-ui
import { Box, Button, Divider, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// third-party
import {
  ColumnDef,
  HeaderGroup,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState
} from '@tanstack/react-table';
import { LabelKeyObject } from 'react-csv/lib/core';

// project-import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import EmptyTable from './EmptyTable'; // Importar el nuevo componente

import {
  CSVExport,
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from 'components/third-party/react-table';

// assets
import { PlusOutlined } from '@ant-design/icons';

interface TablaAdminProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  onAdd?: () => void;
  addLabel?: string;
  csvFilename?: string;
  searchPlaceholder?: string;
  renderExpandedRow?: (row: any) => React.ReactNode;
  title?: string;
  initialColumnVisibility?: Record<string, boolean>;
  showSelection?: boolean;
  initialSorting?: SortingState;
  isAddDisabled?: boolean; // Nueva prop
}

function TablaAdmin<T extends object>({
  data,
  columns,
  onAdd,
  addLabel = 'Nuevo',
  csvFilename = 'data.csv',
  searchPlaceholder = 'Buscar...',
  renderExpandedRow,
  title,
  initialColumnVisibility,
  showSelection = false,
  initialSorting = [],
  isAddDisabled = false // Nueva prop
}: TablaAdminProps<T>): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const tableColumns = useMemo(() => {
    const selectionColumn: ColumnDef<T>[] = showSelection
      ? [
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
          }
        ]
      : [];
    return [...selectionColumn, ...columns];
  }, [columns, showSelection]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: { columnFilters, sorting, rowSelection, globalFilter },
    initialState: { columnVisibility: initialColumnVisibility },
    enableRowSelection: showSelection,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getRowCanExpand: () => !!renderExpandedRow,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false
  });

  const headers: LabelKeyObject[] = useMemo(
    () =>
      columns.reduce<LabelKeyObject[]>((acc, col) => {
        if ('accessorKey' in col && col.accessorKey) {
          acc.push({ label: typeof col.header === 'string' ? col.header : String(col.accessorKey), key: String(col.accessorKey) });
        }
        return acc;
      }, []),
    [columns]
  );

  return (
    <MainCard content={false}>
      {title && (
        <Box sx={{ p: 2.5, pb: 1, width: '100%' }}>
          <Typography variant="h5">{title}</Typography>
        </Box>
      )}
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 2.5 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={searchPlaceholder}
        />

        <Stack direction="row" alignItems="center" spacing={2}>
          <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />
          {onAdd && (
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={onAdd} disabled={isAddDisabled}>
              {addLabel}
            </Button>
          )}
          <CSVExport {...{ data: table.getSelectedRowModel().flatRows.map((row) => row.original), headers, filename: csvFilename }} />
        </Stack>
      </Stack>
      <ScrollX>
        {showSelection && <RowSelection selected={Object.keys(rowSelection).length} />}
        <TableContainer>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} {...header.column.columnDef.meta} onClick={header.column.getToggleSortingHandler()}>
                      {header.isPlaceholder ? null : (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                          {header.column.getCanSort() && <HeaderSort column={header.column} />}
                        </Stack>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
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
                <EmptyTable colSpan={table.getAllColumns().length} />
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
              getPageCount: table.getPageCount
            }}
          />
        </Box>
      </ScrollX>
    </MainCard>
  );
}

export default TablaAdmin;
