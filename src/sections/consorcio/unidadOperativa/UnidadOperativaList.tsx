import { ColumnDef, SortingState } from '@tanstack/react-table';

// project-import
import TablaAdmin from 'components/tables/TablaAdmin';

// types
import { UnidadOperativa } from 'types/unidadOperativa'; // Assuming new type

interface Props {
  data: UnidadOperativa[];
  columns: ColumnDef<UnidadOperativa>[];
  modalToggler: () => void;
  initialColumnVisibility?: Record<string, boolean>;
  initialSorting?: SortingState;
  showSelection?: boolean;
}

// ==============================|| UNIDAD OPERATIVA - LIST ||============================== //

function UnidadOperativaList({ data, columns, modalToggler, initialColumnVisibility, initialSorting, showSelection }: Props) {
  return (
    <TablaAdmin
      data={data}
      columns={columns}
      onAdd={modalToggler}
      addLabel="Nueva Unidad Operativa"
      csvFilename="unidades-operativas-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} unidades operativas...`}
      title="Gestiona las unidades operativas del consorcio"
      initialColumnVisibility={initialColumnVisibility}
      initialSorting={initialSorting}
      showSelection={showSelection}
      // renderExpandedRow={(row) => <ExpandingUserDetail data={row.original} />} // Uncomment and implement if needed
    />
  );
}

export default UnidadOperativaList;
