import { ColumnDef } from '@tanstack/react-table';

// project-import
import TablaAdmin from 'components/TablaAdmin';

// types
import { Cuenta } from 'types/cuenta';

interface Props {
  data: Cuenta[];
  columns: ColumnDef<Cuenta>[];
  modalToggler: () => void;
  initialColumnVisibility?: Record<string, boolean>;
}

// ==============================|| CONCORCIOS - LIST ||============================== //

function CuentasList({ data, columns, modalToggler, initialColumnVisibility }: Props) {
  return (
    <TablaAdmin
      data={data}
      columns={columns}
      onAdd={modalToggler}
      addLabel="Nuevo Cuenta"
      csvFilename="cuentas-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} cuentas...`}
      title="Gestiona las cuentas del consorcio"
      initialColumnVisibility={initialColumnVisibility}
      // renderExpandedRow={(row) => <ExpandingUserDetail data={row.original} />} // Uncomment and implement if needed
    />
  );
}

export default CuentasList;
