import { ColumnDef } from '@tanstack/react-table';

// project-import
import TablaAdmin from 'components/tables/TablaAdmin';

// types
import { Transaccion } from 'types/transaccion';

interface Props {
  data: Transaccion[];
  columns: ColumnDef<Transaccion>[];
  modalToggler: () => void;
  initialColumnVisibility?: Record<string, boolean>;
}

// ==============================|| TRANSACCIONES - LIST ||============================== //

function TransaccionesList({ data, columns, modalToggler, initialColumnVisibility }: Props) {
  return (
    <TablaAdmin
      data={data}
      columns={columns}
      onAdd={modalToggler}
      addLabel="Nueva Transacción"
      csvFilename="transacciones-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} transacciones...`}
      title="Gestiona las transacciones de las cuentas"
      initialColumnVisibility={initialColumnVisibility}
    />
  );
}

export default TransaccionesList;
