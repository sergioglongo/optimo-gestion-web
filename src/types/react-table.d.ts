import { SxProps, Theme } from '@mui/material/styles';
import { RowData } from '@tanstack/react-table';

// Augment the module to include 'sx' in ColumnMeta
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
    sx?: SxProps<Theme>;
  }
}