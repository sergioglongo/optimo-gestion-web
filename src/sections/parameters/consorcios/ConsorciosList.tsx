import { ColumnDef } from '@tanstack/react-table';

// project-import
import TablaAdmin from 'components/tables/TablaAdmin';

// types
import { Consorcio } from 'types/consorcio';

interface Props {
  data: Consorcio[];
  columns: ColumnDef<Consorcio>[];
  modalToggler: () => void;
  initialColumnVisibility?: Record<string, boolean>;
}

// ==============================|| CONCORCIOS - LIST ||============================== //

function ConsorciosList({ data, columns, modalToggler, initialColumnVisibility }: Props) {
  return (
    <TablaAdmin
      data={data}
      columns={columns}
      onAdd={modalToggler}
      addLabel="Nuevo Consorcio"
      csvFilename="consorcio-lista.csv"
      initialColumnVisibility={initialColumnVisibility}
      searchPlaceholder={`Buscar en ${data.length} consorcios...`}
      title="Gestiona tus Consorcios"
      // renderExpandedRow={(row) => <ExpandingUserDetail data={row.original} />} // Uncomment and implement if needed
    />
  );
}

export default ConsorciosList;
