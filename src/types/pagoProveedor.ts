/**
 * Tipos de enumeración para el tipo de pago a un proveedor.
 */
export type TipoPagoProveedor = 'impago' | 'parcial' | 'total';

/**
 * Interfaz que representa un pago realizado a un proveedor por un gasto.
 * Mapeada desde la tabla `pagos_proveedores`.
 */
export interface PagoProveedor {
  id: number;
  gasto_id: number;
  cuenta_id: number;
  proveedor_id: number;
  monto: number | null;
  fecha: string; // Format: YYYY-MM-DD
  tipo_pago: TipoPagoProveedor;
  comentario?: string | null;
}

export type PagoProveedorCreateData = Omit<PagoProveedor, 'id'>;
