import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

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
  const selectFilters = useMemo(() => {
    // Generar dinámicamente las opciones para 'tipo'
    const tiposUnicos = new Set<string>();
    data.forEach((gasto) => {
      if (gasto.tipo_gasto) {
        tiposUnicos.add(gasto.tipo_gasto);
      }
    });
    const tipoFilterOptions = Array.from(tiposUnicos).map((tipo) => ({ label: tipo, value: tipo }));

    // Combinar los filtros
    return {
      tipo_gasto: {
        placeholder: 'Filtrar por Tipo',
        options: tipoFilterOptions
      },
      estado: {
        placeholder: 'Filtrar por Estado',
        options: [
          { label: 'Impago', value: 'impago' },
          { label: 'Parcial', value: 'parcial' },
          { label: 'Pagado', value: 'pagado' }
        ]
      }
    };
  }, [data]);

  return (
    <TablaAdmin
      data={data}
      columns={columns}
      onAdd={modalToggler}
      addLabel="Nuevo Gasto"
      selectFilters={selectFilters}
      csvFilename="gastos-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} gastos...`}
      title="Gestiona los gastos del consorcio"
      initialColumnVisibility={initialColumnVisibility}
      showColumnSorting={false}
      showCsvExport={false}
    />
  );
}

export default GastosList;
