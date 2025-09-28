import { ColumnDef, SortingState } from '@tanstack/react-table';

// project-import
import TablaAdmin from 'components/tables/TablaAdmin';

// types
import { TipoUnidadOperativa } from 'types/unidadOperativa';

interface Props {
  data: TipoUnidadOperativa[];
  columns: ColumnDef<TipoUnidadOperativa>[];
  modalToggler: () => void;
  initialColumnVisibility?: Record<string, boolean>;
  initialSorting?: SortingState;
}

// ==============================|| TIPOS UNIDAD OPERATIVA - LIST ||============================== //

function TiposUnidadOperativaList({ data, columns, modalToggler, initialColumnVisibility, initialSorting }: Props) {
  return (
    <TablaAdmin
      data={data}
      columns={columns}
      onAdd={modalToggler}
      addLabel="Nuevo Tipo"
      csvFilename="tipos-unidad-operativa-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} tipos...`}
      title="Gestiona los Tipos de Unidades Operativas del consorcio"
      initialColumnVisibility={initialColumnVisibility}
      initialSorting={initialSorting}
    />
  );
}

export default TiposUnidadOperativaList;
