import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

// API hooks
import useConsorcio from 'hooks/useConsorcio';
import { useGetRubros } from 'services/api/rubrosapi';

// project-import
import TablaAdminCollapse from 'components/tables/TablaAdminCollapse';
import GastosAdminRow from './GastosAdminRow';

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
  const { selectedConsorcio } = useConsorcio();
  const { data: rubrosData } = useGetRubros(selectedConsorcio?.id || 0, { enabled: !!selectedConsorcio?.id });

  const selectFilters = useMemo(() => {
    // Generar dinámicamente las opciones para 'tipo'
    const tiposUnicos = new Set<string>();
    data.forEach((gasto) => {
      if (gasto.tipo_gasto) {
        tiposUnicos.add(gasto.tipo_gasto);
      }
    });
    const tipoFilterOptions = Array.from(tiposUnicos).map((tipo) => ({ label: tipo, value: tipo }));

    // Generar opciones para 'rubro'
    const rubroFilterOptions =
      rubrosData?.map((rubro) => ({
        label: rubro.rubro,
        value: rubro.id
      })) || [];

    // Combinar los filtros
    return {
      rubro_gasto_id: {
        placeholder: 'Filtrar por Rubro',
        options: rubroFilterOptions
      },
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
  }, [data, rubrosData]);

  return (
    <TablaAdminCollapse
      renderSubComponent={(row) => <GastosAdminRow data={row} />}
      data={data}
      columns={columns}
      onAdd={modalToggler}
      addLabel="Nuevo Gasto"
      selectFilters={selectFilters}
      csvFilename="gastos-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} gastos...`}
      title="Gestiona los gastos del consorcio"
      initialColumnVisibility={{ ...initialColumnVisibility, rubro_gasto_id: false }}
      showColumnSorting={false}
      showCsvExport={false}
    />
  );
}

export default GastosList;
