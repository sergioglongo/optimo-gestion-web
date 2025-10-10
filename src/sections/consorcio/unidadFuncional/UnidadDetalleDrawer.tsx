import { Divider, Typography } from '@mui/material';
import ViewDrawer from 'components/drawers/ViewDrawer';
import { unidadFuncional } from 'types/unidadFuncional';
import UnidadPersonasAsociadas from './UnidadPersonasAsociadas';

interface UnidadDetalleDrawerProps {
  open: boolean;
  onClose: () => void;
  unidad: unidadFuncional | null;
}

const UnidadDetalleDrawer = ({ open, onClose, unidad }: UnidadDetalleDrawerProps) => {
  if (!unidad) {
    return null;
  }

  const items = [
    { label: 'Etiqueta', value: unidad.etiqueta || '-' },
    [
      { label: 'Identificador 1', value: unidad.identificador1 || '-' },
      { label: 'Identificador 2', value: unidad.identificador2 || '-' }
    ],
    [
      { label: 'Prorrateo', value: `${unidad.prorrateo}%` },
      { label: 'Prorrateo Automático', value: unidad.prorrateo_automatico ? 'Sí' : 'No' }
    ],
    [
      { label: 'Liquidar a', value: unidad.liquidar_a },
      { label: '¿Está alquilada?', value: unidad.alquilada ? 'Sí' : 'No' }
    ],
    { label: 'Notas', value: unidad.notas || '-' }
  ] as const;

  return (
    <ViewDrawer open={open} onClose={onClose} title="Detalles de la Unidad" items={items}>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" sx={{ px: 2, mb: 1 }}>
        Personas Asociadas
      </Typography>
      <UnidadPersonasAsociadas unidad={unidad} />
    </ViewDrawer>
  );
};

export default UnidadDetalleDrawer;
