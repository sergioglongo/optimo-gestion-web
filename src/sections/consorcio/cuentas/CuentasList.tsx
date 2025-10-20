import { ColumnDef } from '@tanstack/react-table';

// project-import
import TablaAdmin, { SummaryField } from 'components/tables/TablaAdmin';

// types
import { Cuenta } from 'types/cuenta';

interface Props {
  data: Cuenta[];
  columns: ColumnDef<Cuenta>[];
  modalToggler: () => void;
  initialColumnVisibility?: Record<string, boolean>;
  summaryData?: SummaryField[];
}

// ==============================|| CONCORCIOS - LIST ||============================== //

function CuentasList({ data, columns, modalToggler, initialColumnVisibility, summaryData }: Props) {
  return (
    <TablaAdmin
      data={data}
      columns={columns}
      onAdd={modalToggler}
      addLabel="Nuevo Cuenta"
      csvFilename="cuentas-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} cuentas...`}
      showColumnSorting={false}
      title="Gestiona las cuentas del consorcio"
      initialColumnVisibility={initialColumnVisibility}
      summaryData={summaryData}
      // renderExpandedRow={(row) => <ExpandingUserDetail data={row.original} />} // Uncomment and implement if needed
    />
  );
}

export default CuentasList;
