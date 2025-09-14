import { ColumnDef } from '@tanstack/react-table';

// project-import
import TablaAdmin from 'components/TablaAdmin';

// types
import { UnidadOperativa } from 'types/unidadOperativa'; // Assuming new type

interface Props {
  data: UnidadOperativa[];
  columns: ColumnDef<UnidadOperativa>[];
  modalToggler: () => void;
  initialColumnVisibility?: Record<string, boolean>;
}

// ==============================|| UNIDAD OPERATIVA - LIST ||============================== //

function UnidadOperativaList({ data, columns, modalToggler, initialColumnVisibility }: Props) {
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
      // renderExpandedRow={(row) => <ExpandingUserDetail data={row.original} />} // Uncomment and implement if needed
    />
  );
}

export default UnidadOperativaList;
