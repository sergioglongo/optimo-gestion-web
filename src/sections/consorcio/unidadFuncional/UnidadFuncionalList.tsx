import { ColumnDef, SortingState, Row } from '@tanstack/react-table';
import { useMemo } from 'react';

// project-import
import TablaAdmin from 'components/tables/TablaAdmin';

// types
import { unidadFuncional } from 'types/unidadFuncional'; // Assuming new type
import { SummaryField, SelectFilters } from 'components/tables/TablaAdmin';
import { TipoUnidadFuncional } from 'types/unidadFuncional';
import { Consorcio } from 'types/consorcio';

interface Props {
  data: unidadFuncional[];
  columns: ColumnDef<unidadFuncional>[];
  modalToggler: () => void;
  initialColumnVisibility?: Record<string, boolean>;
  initialSorting?: SortingState;
  showSelection?: boolean;
  onFilteredRowsChange?: (rows: Row<unidadFuncional>[]) => void;
  summaryData?: SummaryField[];
  tiposunidadFuncional: TipoUnidadFuncional[];
  consorcio: Consorcio | null;
}

// ==============================|| UNIDAD FUNCIONAL - LIST ||============================== //

function UnidadFuncionalList({
  data,
  columns,
  modalToggler,
  initialColumnVisibility,
  initialSorting,
  showSelection,
  onFilteredRowsChange,
  summaryData,
  tiposunidadFuncional,
  consorcio
}: Props) {
  const selectFilters = useMemo<SelectFilters>(() => {
    // 0. Filtro por Identificador 1 (nuevo)
    const uniqueIdentificadores = Array.from(new Set(data.map((uf) => uf.identificador1).filter((id): id is string => !!id)));

    const identificador1Options = uniqueIdentificadores.map((id1) => ({
      label: id1,
      value: `${id1}-` // Se agrega el guion para mayor precisión en el filtro 'includesString'
    }));

    // 1. Filtro por Tipo de Unidad
    const tipoFilterOptions = tiposunidadFuncional.map((tipo) => ({
      label: tipo.nombre,
      value: tipo.nombre // El valor debe coincidir con lo que devuelve el accessorFn de la columna
    }));

    // 2. Filtro por 'Liquidar a'
    const liquidarAFilterOptions = [
      { label: 'Propietario', value: 'propietario' },
      { label: 'Inquilino', value: 'inquilino' },
      { label: 'Ambos', value: 'ambos' }
    ];

    // 3. Filtro por 'Alquilada'
    const alquiladaFilterOptions = [
      { label: 'Sí', value: true },
      { label: 'No', value: false }
    ];

    return {
      etiqueta: {
        placeholder: `Filtrar por ${consorcio?.identificador1 || 'Identificador'}`,
        options: identificador1Options
      },
      tipo_unidad_funcional_nombre: {
        placeholder: 'Filtrar por Tipo',
        options: tipoFilterOptions
      },
      liquidar_a: {
        placeholder: 'Filtrar por Liquidar a',
        options: liquidarAFilterOptions
      },
      alquilada: {
        placeholder: 'Filtrar por Alquilada',
        options: alquiladaFilterOptions
      }
    };
  }, [tiposunidadFuncional, data, consorcio]);
  return (
    <TablaAdmin
      data={data}
      columns={columns}
      onAdd={modalToggler}
      addLabel="Nueva Unidad Funcional"
      csvFilename="unidades-funcionals-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} unidades funcionales...`}
      title="Gestiona las unidades funcionales del consorcio"
      initialColumnVisibility={initialColumnVisibility}
      initialSorting={initialSorting}
      showSelection={showSelection}
      showColumnSorting={false}
      onFilteredRowsChange={onFilteredRowsChange}
      selectFilters={selectFilters}
      summaryData={summaryData}
      // renderExpandedRow={(row) => <ExpandingUserDetail data={row.original} />} // Uncomment and implement if needed
    />
  );
}

export default UnidadFuncionalList;
