import { Fragment, useMemo, useState } from 'react';

// material-ui
// import { SxProps, Theme } from '@mui/material/styles';
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
  ColumnFiltersState,
  getExpandedRowModel
} from '@tanstack/react-table';
import { LabelKeyObject } from 'react-csv/lib/core';

// project-import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import EmptyTable from './EmptyTable';
import IconButton from 'components/@extended/IconButton';

import {
  CSVExport,
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from 'components/third-party/react-table';
import TablaAdminFilters from './TablaAdminFilters';

// assets
import { PlusOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';

// types
import { SelectFilters } from './TablaAdmin';

interface TablaAdminCollapseProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  onAdd?: () => void;
  addLabel?: string;
  csvFilename?: string;
  searchPlaceholder?: string;
  renderSubComponent: (row: T) => React.ReactNode;
  title?: string;
  initialColumnVisibility?: Record<string, boolean>;
  showSelection?: boolean;
  initialSorting?: SortingState;
  isAddDisabled?: boolean;
  expanderColor?: 'inherit' | 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning';
  selectFilters?: SelectFilters;
  showColumnSorting?: boolean;
  showCsvExport?: boolean;
}

function TablaAdminCollapse<T extends object>({
  data,
  columns,
  onAdd,
  addLabel = 'Nuevo',
  csvFilename = 'data.csv',
  searchPlaceholder = 'Buscar...',
  renderSubComponent,
  title,
  initialColumnVisibility,
  showSelection = false,
  initialSorting = [],
  isAddDisabled = false,
  expanderColor = 'secondary',
  selectFilters,
  showColumnSorting = true,
  showCsvExport = true
}: TablaAdminCollapseProps<T>): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const filterCount = selectFilters ? Object.keys(selectFilters).length : 0;
  const showFiltersInline = filterCount > 0 && filterCount <= 3;

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

    const expanderColumn: ColumnDef<T>[] = [
      {
        id: 'expander',
        header: () => null,
        cell: ({ row }) =>
          row.getCanExpand() ? (
            <IconButton
              color={expanderColor}
              size="small"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation?.();
                row.getToggleExpandedHandler()();
              }}
            >
              {row.getIsExpanded() ? <UpOutlined /> : <DownOutlined />}
            </IconButton>
          ) : null,
        meta: {
          sx: {
            width: '40px', // Ancho fijo y pequeño
            p: 0.5 // Padding reducido
          }
        }
      }
    ];

    return [...selectionColumn, ...columns, ...expanderColumn];
  }, [columns, showSelection, expanderColor]);

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
    getRowCanExpand: () => true,
    getExpandedRowModel: getExpandedRowModel(),
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
      <Stack spacing={2} sx={{ p: 2.5 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} rowGap={2} spacing={2} alignItems="center" justifyContent="space-between">
          <DebouncedInput
            value={globalFilter ?? ''}
            onFilterChange={(value) => setGlobalFilter(String(value))}
            placeholder={searchPlaceholder}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          />
          <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: 'flex-end' }}>
            {selectFilters && showFiltersInline && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                <TablaAdminFilters table={table} selectFilters={selectFilters} />
              </Stack>
            )}
            {showColumnSorting && <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />}
            {onAdd && (
              <Button variant="contained" startIcon={<PlusOutlined />} onClick={onAdd} disabled={isAddDisabled}>
                {addLabel}
              </Button>
            )}
            {showCsvExport && (
              <CSVExport {...{ data: table.getSelectedRowModel().flatRows.map((row) => row.original), headers, filename: csvFilename }} />
            )}
          </Stack>
        </Stack>
        {selectFilters && !showFiltersInline && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
            <TablaAdminFilters table={table} selectFilters={selectFilters} />
          </Stack>
        )}
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
                  <Fragment key={row.id}>
                    <TableRow onClick={() => row.getToggleExpandedHandler()()} sx={{ cursor: 'pointer' }}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && (
                      <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
                        <TableCell colSpan={row.getVisibleCells().length}>{renderSubComponent(row.original as T)}</TableCell>
                      </TableRow>
                    )}
                  </Fragment>
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

export default TablaAdminCollapse;
