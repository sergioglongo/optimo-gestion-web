import { ColumnDef, SortingState } from '@tanstack/react-table';

// project-import
import TablaAdmin from 'components/tables/TablaAdmin';

// types
import { unidadFuncional } from 'types/unidadFuncional'; // Assuming new type

interface Props {
  data: unidadFuncional[];
  columns: ColumnDef<unidadFuncional>[];
  modalToggler: () => void;
  initialColumnVisibility?: Record<string, boolean>;
  initialSorting?: SortingState;
  showSelection?: boolean;
}

// ==============================|| UNIDAD FUNCIONAL - LIST ||============================== //

function unidadFuncionalList({ data, columns, modalToggler, initialColumnVisibility, initialSorting, showSelection }: Props) {
  return (
    <TablaAdmin
      data={data}
      columns={columns}
      onAdd={modalToggler}
      addLabel="Nueva Unidad Funcional"
      csvFilename="unidades-funcionals-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} unidades funcionals...`}
      title="Gestiona las unidades funcionals del consorcio"
      initialColumnVisibility={initialColumnVisibility}
      initialSorting={initialSorting}
      showSelection={showSelection}
      // renderExpandedRow={(row) => <ExpandingUserDetail data={row.original} />} // Uncomment and implement if needed
    />
  );
}

export default unidadFuncionalList;
