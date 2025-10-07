import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

// project-import
import TablaAdmin from 'components/tables/TablaAdmin';

// types
import { LiquidacionUnidad } from 'types/liquidacion';

interface Props {
  data: LiquidacionUnidad[];
  columns: ColumnDef<LiquidacionUnidad>[];
}

// ==============================|| COBRANZAS - LIST ||============================== //

function CobranzasList({ data, columns }: Props) {
  const selectFilters = useMemo(() => {
    return {
      estado: {
        placeholder: 'Filtrar por Estado',
        options: [
          { label: 'Pendiente', value: 'pendiente' },
          { label: 'Vencida', value: 'vencida' },
          { label: 'Pagada', value: 'pagada' },
          { label: 'Adeuda', value: 'adeuda' }
        ]
      }
    };
  }, []);

  return (
    <TablaAdmin
      data={data}
      columns={columns}
      selectFilters={selectFilters}
      // onAdd y addLabel se omiten porque no hay creación por ahora
      csvFilename="cobranzas-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} cobranzas...`}
      // El título se maneja en el componente padre
    />
  );
}

export default CobranzasList;
