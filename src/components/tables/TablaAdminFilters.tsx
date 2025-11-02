import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Table } from '@tanstack/react-table';

// types
import { SelectFilters } from './TablaAdmin';

interface TablaAdminFiltersProps<T extends object> {
  selectFilters?: SelectFilters;
  table: Table<T>;
}

function TablaAdminFilters<T extends object>({ selectFilters, table }: TablaAdminFiltersProps<T>) {
  if (!selectFilters) {
    return null;
  }

  return (
    <>
      {Object.entries(selectFilters).map(([columnId, filterConfig]) => {
        const column = table.getColumn(columnId);
        if (!column) return null;

        return (
          <FormControl key={columnId} sx={{ minWidth: 150 }} size="small">
            <InputLabel shrink id={`${columnId}-select-filter-label`}>
              {filterConfig.placeholder || columnId}
            </InputLabel>
            <Select
              sx={(theme) => ({
                bgcolor: (column.getFilterValue() as string) ? theme.palette.warning.lighter : 'inherit',
                '& .MuiSelect-select': {
                  fontSize: '0.875rem',
                  mt: 0.5
                }
              })}
              displayEmpty
              labelId={`${columnId}-select-filter-label`}
              label={filterConfig.placeholder || columnId}
              value={(column.getFilterValue() as string) ?? ''}
              onChange={(e) => column.setFilterValue(e.target.value || undefined)} // Pasa undefined para limpiar el filtro
            >
              <MenuItem value="">Todos</MenuItem>
              {filterConfig.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      })}
    </>
  );
}

export default TablaAdminFilters;
