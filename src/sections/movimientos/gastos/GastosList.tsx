import { ColumnDef } from '@tanstack/react-table';

// project-import
import TablaAdmin from 'components/tables/TablaAdmin';

// types
import { Gasto } from 'types/gasto';

interface Props {
  data: Gasto[];
  columns: ColumnDef<Gasto>[];
  modalToggler: () => void;
  initialColumnVisibility?: Record<string, boolean>;
}

// ==============================|| GASTOS - LIST ||============================== //

function GastosList({ data, columns, modalToggler, initialColumnVisibility }: Props) {
  return (
    <TablaAdmin
      data={data}
      columns={columns}
      onAdd={modalToggler}
      addLabel="Nuevo Gasto"
      csvFilename="gastos-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} gastos...`}
      title="Gestiona los gastos del consorcio"
      initialColumnVisibility={initialColumnVisibility}
    />
  );
}

export default GastosList;
