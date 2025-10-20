import { ColumnDef, SortingState } from '@tanstack/react-table';

// project-import
import TablaAdmin from 'components/tables/TablaAdmin';

// types
import { TipoUnidadFuncional } from 'types/unidadFuncional';

interface Props {
  data: TipoUnidadFuncional[];
  columns: ColumnDef<TipoUnidadFuncional>[];
  modalToggler: () => void;
  initialColumnVisibility?: Record<string, boolean>;
  initialSorting?: SortingState;
}

// ==============================|| TIPOS UNIDAD FUNCIONAL - LIST ||============================== //

function TiposunidadFuncionalList({ data, columns, modalToggler, initialColumnVisibility, initialSorting }: Props) {
  return (
    <TablaAdmin
      data={data}
      columns={columns}
      onAdd={modalToggler}
      addLabel="Nuevo Tipo"
      csvFilename="tipos-unidad-funcional-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} tipos...`}
      title="Gestiona los Tipos de Unidades Funcionals del consorcio"
      initialColumnVisibility={initialColumnVisibility}
      initialSorting={initialSorting}
    />
  );
}

export default TiposunidadFuncionalList;
