import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

// project-import
import TablaAdmin from 'components/tables/TablaAdmin';

// types
import { PagoProveedor, TiposPagoProveedorOptions } from 'types/pagoProveedor';

interface Props {
  data: PagoProveedor[];
  columns: ColumnDef<PagoProveedor>[];
  modalToggler: () => void;
  initialColumnVisibility?: Record<string, boolean>;
}

// ==============================|| PAGOS PROVEEDORES - LIST ||============================== //

function PagosProveedoresList({ data, columns, modalToggler, initialColumnVisibility }: Props) {
  const selectFilters = useMemo(() => {
    // Generar dinámicamente las opciones para 'cuenta'
    const cuentasUnicas = new Map<number, string>();
    data.forEach((pago) => {
      if (pago.cuenta && pago.cuenta.id && pago.cuenta.descripcion) {
        cuentasUnicas.set(pago.cuenta.id, pago.cuenta.descripcion);
      }
    });
    const cuentaFilterOptions = Array.from(cuentasUnicas, ([id, descripcion]) => ({ label: descripcion, value: id }));

    // Combinar los filtros
    return {
      cuenta: {
        placeholder: 'Filtrar por Cuenta',
        options: cuentaFilterOptions
      },
      tipo_pago: {
        placeholder: 'Filtrar por Tipo',
        options: TiposPagoProveedorOptions
      }
    };
  }, [data]);

  return (
    <TablaAdmin
      data={data}
      columns={columns}
      onAdd={modalToggler}
      addLabel="Nuevo Pago"
      selectFilters={selectFilters}
      csvFilename="pagos-proveedores-lista.csv"
      searchPlaceholder={`Buscar en ${data.length} pagos...`}
      title="Gestiona los pagos a proveedores"
      initialColumnVisibility={initialColumnVisibility}
      showColumnSorting={false}
      showCsvExport={false}
    />
  );
}

export default PagosProveedoresList;
