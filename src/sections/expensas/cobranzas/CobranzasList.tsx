import { ColumnDef } from '@tanstack/react-table';

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
  return (
    <TablaAdmin
      data={data}
      columns={columns}
      // onAdd y addLabel se omiten porque no hay creación por ahora
      csvFilename="cobranzas-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} cobranzas...`}
      // El título se maneja en el componente padre
    />
  );
}

export default CobranzasList;
