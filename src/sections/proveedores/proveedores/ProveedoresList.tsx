import { ColumnDef } from '@tanstack/react-table';

// project-import
import TablaAdmin from 'components/tables/TablaAdmin';

// types
import { Proveedor } from 'types/proveedor';

interface Props {
  data: Proveedor[];
  columns: ColumnDef<Proveedor>[];
  modalToggler: () => void;
  initialColumnVisibility?: Record<string, boolean>;
  showSelection?: boolean;
}

// ==============================|| CONCORCIOS - LIST ||============================== //

function ProveedoresList({ data, columns, modalToggler, initialColumnVisibility, showSelection }: Props) {
  return (
    <TablaAdmin
      data={data}
      columns={columns}
      onAdd={modalToggler}
      addLabel="Nuevo Proveedor"
      csvFilename="proveedor-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} proveedor...`}
      title="Gestiona las proveedores del consorcio"
      initialColumnVisibility={initialColumnVisibility}
      showSelection={showSelection}
      // renderExpandedRow={(row) => <ExpandingUserDetail data={row.original} />} // Uncomment and implement if needed
    />
  );
}

export default ProveedoresList;
