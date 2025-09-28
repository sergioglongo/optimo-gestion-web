import { useState } from 'react';
import { Chip, Button } from '@mui/material';
import ViewDrawer from 'components/drawers/ViewDrawer';
import { Transaccion } from 'types/transaccion';
import TransaccionPagoProveedorDrawer from './TransaccionPagoProveedorDrawer';
import TransaccionPagoLiquidacionDrawer from './TransaccionPagoLiquidacionDrawer';

interface TransaccionDetalleDrawerProps {
  open: boolean;
  onClose: () => void;
  transaccion: Transaccion | null;
}

const TransaccionDetalleDrawer = ({ open, onClose, transaccion }: TransaccionDetalleDrawerProps) => {
  const [pagoProveedorDrawerOpen, setPagoProveedorDrawerOpen] = useState(false);
  const [pagoLiquidacionDrawerOpen, setPagoLiquidacionDrawerOpen] = useState(false);

  if (!transaccion) {
    return null;
  }

  const items = [
    { label: 'Descripción', value: transaccion.descripcion || '-' },
    [
      { label: 'Fecha', value: new Date(transaccion.fecha).toLocaleDateString() },
      {
        label: 'Estado',
        value: (
          <Chip
            color={transaccion.estado === 'completado' ? 'success' : transaccion.estado === 'pendiente' ? 'warning' : 'error'}
            label={transaccion.estado}
            size="small"
            variant="light"
          />
        )
      }
    ],
    { label: 'Cuenta', value: transaccion.cuenta?.descripcion || '-' },
    [
      {
        label: 'Tipo',
        value: (
          <Chip
            color={transaccion.tipo_movimiento === 'ingreso' ? 'success' : 'error'}
            label={transaccion.tipo_movimiento}
            size="small"
            variant="light"
          />
        )
      },
      { label: 'Monto', value: `$${Number(transaccion.monto).toLocaleString('es-AR')}` }
    ]
  ] as const;

  const referenceItem =
    transaccion.referencia_tabla && transaccion.referencia_id
      ? {
          label: 'Referencia',
          value: (
            <Button
              variant="outlined"
              onClick={() => {
                if (transaccion.referencia_tabla === 'pagos_proveedores') {
                  setPagoProveedorDrawerOpen(true);
                } else if (transaccion.referencia_tabla === 'pagos_liquidaciones_unidades') {
                  setPagoLiquidacionDrawerOpen(true);
                }
              }}
            >
              Ver Pago Asociado
            </Button>
          )
        }
      : null;

  const allItems = referenceItem ? [...items, referenceItem] : items;

  return (
    <>
      <ViewDrawer open={open} onClose={onClose} title="Detalles de la Transacción" items={allItems} />
      {pagoProveedorDrawerOpen && (
        <TransaccionPagoProveedorDrawer
          open={pagoProveedorDrawerOpen}
          onClose={() => setPagoProveedorDrawerOpen(false)}
          pagoId={transaccion.referencia_id}
        />
      )}
      {pagoLiquidacionDrawerOpen && (
        <TransaccionPagoLiquidacionDrawer
          open={pagoLiquidacionDrawerOpen}
          onClose={() => setPagoLiquidacionDrawerOpen(false)}
          pagoId={transaccion.referencia_id}
        />
      )}
    </>
  );
};

export default TransaccionDetalleDrawer;
