import { ColumnDef } from '@tanstack/react-table';

// project-import
import TablaAdmin from 'components/tables/TablaAdmin';

// types
import { Persona } from 'types/persona'; // Assuming new type

interface Props {
  data: Persona[];
  columns: ColumnDef<Persona>[];
  modalToggler: () => void;
  initialColumnVisibility?: Record<string, boolean>;
}

// ==============================|| PERSONAS - LIST ||============================== //

function PersonasList({ data, columns, modalToggler, initialColumnVisibility }: Props) {
  return (
    <TablaAdmin
      data={data}
      columns={columns}
      onAdd={modalToggler}
      addLabel="Nueva Persona"
      csvFilename="personas-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} personas...`}
      showColumnSorting={false}
      title="Gestiona las personas del consorcio"
      initialColumnVisibility={initialColumnVisibility}
      // renderExpandedRow={(row) => <ExpandingUserDetail data={row.original} />} // Uncomment and implement if needed
    />
  );
}

export default PersonasList;
