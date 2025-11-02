import { Chip } from '@mui/material';
import ViewDrawer from 'components/drawers/ViewDrawer';
import { Gasto } from 'types/gasto';

interface GastoDetalleDrawerProps {
  open: boolean;
  onClose: () => void;
  gasto: Gasto | null;
}

const GastoDetalleDrawer = ({ open, onClose, gasto }: GastoDetalleDrawerProps) => {
  if (!gasto) {
    return null;
  }

  const monto = Number(gasto.monto) || 0;
  const saldado = Number(gasto.saldado) || 0;
  const adeudado = monto - saldado;

  const items = [
    { label: 'Proveedor', value: gasto.Proveedor?.nombre || 'No especificado' },
    { label: 'Descripción', value: gasto.descripcion },
    { label: 'Fecha', value: new Date(gasto.fecha).toLocaleDateString('es-AR', { timeZone: 'UTC' }) },
    [
      { label: 'Monto Adeudado', value: `$${adeudado.toLocaleString('es-AR')}` },
      { label: 'Monto del Gasto', value: `$${monto.toLocaleString('es-AR')}` }
    ],
    [
      {
        label: 'Tipo',
        value: (
          <Chip color={gasto.tipo_gasto === 'ordinario' ? 'primary' : 'warning'} label={gasto.tipo_gasto} size="small" variant="light" />
        )
      },
      {
        label: 'Estado',
        value: (
          <Chip
            color={gasto.estado === 'pagado' ? 'success' : gasto.estado === 'parcial' ? 'warning' : 'error'}
            label={gasto.estado}
            size="small"
            variant="light"
          />
        )
      }
    ],
    { label: 'Rubro', value: gasto.Rubro?.rubro || 'No especificado' },
    [
      { label: 'Asignado a', value: gasto.unidad_asignada ? gasto.unidad_asignada.etiqueta : 'Consorcio' },
      {
        label: 'Período que aplica',
        value: gasto.periodo_aplica
          ? new Date(gasto.periodo_aplica).toLocaleDateString('default', { month: 'long', year: 'numeric', timeZone: 'UTC' })
          : 'N/A'
      }
    ]
  ] as const;

  return <ViewDrawer open={open} onClose={onClose} title="Detalles del Gasto" items={items} />;
};

export default GastoDetalleDrawer;
