import { ColumnDef } from '@tanstack/react-table';

// project-import
import TablaAdmin from 'components/tables/TablaAdmin';

// types
import { PagoProveedor } from 'types/pagoProveedor';

interface Props {
  data: PagoProveedor[];
  columns: ColumnDef<PagoProveedor>[];
  modalToggler: () => void;
  initialColumnVisibility?: Record<string, boolean>;
}

// ==============================|| PAGOS PROVEEDORES - LIST ||============================== //

function PagosProveedoresList({ data, columns, modalToggler, initialColumnVisibility }: Props) {
  return (
    <TablaAdmin
      data={data}
      columns={columns}
      onAdd={modalToggler}
      addLabel="Nuevo Pago"
      csvFilename="pagos-proveedores-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} pagos...`}
      title="Gestiona los pagos a proveedores"
      initialColumnVisibility={initialColumnVisibility}
    />
  );
}

export default PagosProveedoresList;
