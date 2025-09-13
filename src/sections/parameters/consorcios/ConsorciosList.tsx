import { useMemo, useState, useEffect } from 'react';

// material-ui
import { Chip, Paper, Table, TableBody, TableContainer, TableCell, TableHead, TableRow } from '@mui/material';

// third-party
import { flexRender, useReactTable, ColumnDef, HeaderGroup, getCoreRowModel } from '@tanstack/react-table';

// project import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import { CSVExport } from 'components/third-party/react-table';

// types
import { Consorcio } from 'types/consorcio';
import { LabelKeyObject } from 'react-csv/lib/core';

// API hooks
import { useGetConsorcios } from 'services/api/consorciosapi';
import useAuth from 'hooks/useAuth';
import { Skeleton } from '@mui/material';

interface ReactTableProps {
  columns: ColumnDef<Consorcio>[];
  data: Consorcio[];
  striped?: boolean;
  title?: string;
}

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, striped, title }: ReactTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  let headers: LabelKeyObject[] = [];
  table.getAllColumns().map((columns) =>
    headers.push({
      label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
      // @ts-ignore
      key: columns.columnDef.accessorKey
    })
  );

  return (
    <MainCard
      content={false}
      title={title}
      secondary={<CSVExport {...{ data, headers, filename: striped ? 'striped.csv' : 'basic.csv' }} />}
    >
      <ScrollX>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} {...header.column.columnDef.meta}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...(striped && { className: 'striped' })}>
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
          </Table>
        </TableContainer>
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| CONSORCIOS - LIST ||============================== //

const ConsorciosList = ({ striped, title }: { striped?: boolean; title?: string }) => {
  const { user, token } = useAuth();
  const [consorciosData, setConsorciosData] = useState<Consorcio[]>([]);

  // Usamos el ID del usuario para obtener sus consorcios. Si no hay usuario, pasamos 0 para evitar la llamada.
  const { data: fetchedConsorcios, isLoading, isError } = useGetConsorcios(user?.id || 0, { enabled: !!user?.id && !!token });

  useEffect(() => {
    if (fetchedConsorcios) {
      console.log('Fetched consorcios correcta:', fetchedConsorcios);
      setConsorciosData(fetchedConsorcios);
    }
  }, [fetchedConsorcios]);

  useEffect(() => {
    if (isError) {
      console.error('Error fetching consorcios:', isError);
    }
  }, [isError]);

  const columns = useMemo<ColumnDef<Consorcio>[]>(
    () => [
      {
        header: 'Nombre',
        accessorKey: 'nombre'
      },
      {
        header: 'Dirección',
        accessorKey: 'direccion'
      },
      {
        header: 'Tipo',
        accessorKey: 'tipo',
        cell: (cell) => {
          const tipo = cell.getValue() as string;
          switch (tipo) {
            case 'edificio':
              return <Chip color="primary" label="Edificio" size="small" variant="light" />;
            case 'barrio privado':
              return <Chip color="success" label="Barrio Privado" size="small" variant="light" />;
            case 'centro comercial':
              return <Chip color="info" label="Centro Comercial" size="small" variant="light" />;
            default:
              return <Chip label={tipo} size="small" variant="light" />;
          }
        }
      }
    ],
    []
  );

  if (isLoading) {
    console.log('Loading consorcios...', user?.id);
    return <Skeleton variant="rectangular" width="100%" height={400} />;
  }

  return <ReactTable {...{ data: consorciosData, columns, title, striped }} />;
};

export default ConsorciosList;
