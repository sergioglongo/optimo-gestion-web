import { TableCell, TableRow, Typography } from '@mui/material';

interface EmptyTableProps {
  colSpan: number;
  message?: string;
}

const EmptyTable = ({ colSpan, message = 'Sin datos para mostrar' }: EmptyTableProps) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center">
        <Typography variant="subtitle2">{message}</Typography>
      </TableCell>
    </TableRow>
  );
};

export default EmptyTable;
