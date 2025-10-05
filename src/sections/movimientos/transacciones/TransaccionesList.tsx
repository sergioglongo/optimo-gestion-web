import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

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
  const selectFilters = useMemo(() => {
    // Generar dinámicamente las opciones para 'cuenta'
    const cuentasUnicas = new Map<number, string>();
    data.forEach((transaccion) => {
      if (transaccion.cuenta && transaccion.cuenta.id && transaccion.cuenta.descripcion) {
        cuentasUnicas.set(transaccion.cuenta.id, transaccion.cuenta.descripcion);
      }
    });

    const cuentaFilterOptions = Array.from(cuentasUnicas, ([id, descripcion]) => ({ label: descripcion, value: id }));

    // Combinar los filtros
    return {
      cuenta: {
        placeholder: 'Filtrar por Cuenta',
        options: cuentaFilterOptions
      },
      tipo_movimiento: {
        placeholder: 'Filtrar por Tipo',
        options: [
          { label: 'Ingreso', value: 'ingreso' },
          { label: 'Egreso', value: 'egreso' }
        ]
      }
    };
  }, [data]);

  return (
    <TablaAdmin
      data={data}
      columns={columns}
      onAdd={modalToggler}
      addLabel="Nuevo Ajuste"
      selectFilters={selectFilters} // Pasamos la configuración combinada de filtros
      csvFilename="transacciones-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} transacciones...`}
      title="Gestiona las transacciones de las cuentas"
      initialColumnVisibility={initialColumnVisibility}
      showColumnSorting={false}
      showCsvExport={false}
    />
  );
}

export default TransaccionesList;
