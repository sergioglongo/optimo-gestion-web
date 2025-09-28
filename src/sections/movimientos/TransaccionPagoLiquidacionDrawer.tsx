import { Box, CircularProgress } from '@mui/material';
import ViewDrawer from 'components/drawers/ViewDrawer';
import { useGetPagoLiquidacionUnidad } from 'services/api/pagoLiquidacionUnidadapi';

interface Props {
  open: boolean;
  onClose: () => void;
  pagoId: number | null;
}

const TransaccionPagoLiquidacionDrawer = ({ open, onClose, pagoId }: Props) => {
  const { data: pago, isLoading } = useGetPagoLiquidacionUnidad(pagoId!, { enabled: !!pagoId && open });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!pago) {
    return (
      <ViewDrawer
        open={open}
        onClose={onClose}
        title="Detalles del Pago"
        items={[{ label: 'Error', value: 'No se pudo cargar el pago.' }]}
      />
    );
  }

  const items = [
    [
      { label: 'Fecha de Pago', value: new Date(pago.fecha).toLocaleDateString() },
      { label: 'Tipo de Pago', value: pago.tipo_pago }
    ],
    { label: 'Pagado por', value: pago.persona?.nombre || '-' },
    { label: 'Cuenta Destino', value: pago.cuenta?.descripcion || '-' },
    { label: 'Monto Pagado', value: `$${Number(pago.monto).toLocaleString('es-AR')}` },
    { label: 'Comentario', value: pago.comentario || '-' }
  ] as const;

  return <ViewDrawer open={open} onClose={onClose} title="Detalles del Pago de Expensa" items={items} />;
};

export default TransaccionPagoLiquidacionDrawer;
