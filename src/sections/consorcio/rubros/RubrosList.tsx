import { ColumnDef, SortingState } from '@tanstack/react-table';

// project-import
import TablaAdmin from 'components/tables/TablaAdmin';

// types
import { Rubro } from 'types/rubro';

interface Props {
  data: Rubro[];
  columns: ColumnDef<Rubro>[];
  modalToggler: () => void;
  initialColumnVisibility?: Record<string, boolean>;
  initialSorting?: SortingState;
}

// ==============================|| RUBROS - LIST ||============================== //

function RubrosList({ data, columns, modalToggler, initialColumnVisibility, initialSorting }: Props) {
  return (
    <TablaAdmin
      data={data}
      columns={columns}
      onAdd={modalToggler}
      addLabel="Nuevo Rubro"
      csvFilename="rubros-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} rubros...`}
      title="Gestiona los rubros del consorcio"
      initialColumnVisibility={initialColumnVisibility}
      initialSorting={initialSorting}
    />
  );
}

export default RubrosList;
