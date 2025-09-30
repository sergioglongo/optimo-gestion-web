import { Box, CircularProgress } from '@mui/material';
import ViewDrawer from 'components/drawers/ViewDrawer';
import { useGetPagoProveedor } from 'services/api/pagoProveedorapi';

interface Props {
  open: boolean;
  onClose: () => void;
  pagoId: number | null;
}

const TransaccionPagoProveedorDrawer = ({ open, onClose, pagoId }: Props) => {
  const { data: pago, isLoading } = useGetPagoProveedor(pagoId!, { enabled: !!pagoId && open });

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
    { label: 'Proveedor', value: pago.Proveedor?.nombre || '-' },
    { label: 'Gasto Asociado', value: pago.Gasto?.descripcion || '-' },
    { label: 'Cuenta de Pago', value: pago.cuenta?.descripcion || '-' },
    [
      { label: 'Monto Pagado', value: `$${Number(pago.monto).toLocaleString('es-AR')}` },
      {
        label: 'Monto del Gasto',
        value: pago.Gasto ? `$${Number(pago.Gasto.monto).toLocaleString('es-AR')}` : '-'
      }
    ],
    { label: 'Comentario', value: pago.comentario || '-' }
  ] as const;

  return <ViewDrawer open={open} onClose={onClose} title="Detalles del Pago a Proveedor" items={items} />;
};

export default TransaccionPagoProveedorDrawer;
