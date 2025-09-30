// ==============================|| TIPOS - TRANSACCION ||============================== //

import { Cuenta } from "./cuenta";

export type TipoMovimiento = 'ingreso' | 'egreso';
export type EstadoTransaccion = 'completado' | 'pendiente' | 'anulado';
export type ReferenciaTabla = 'pagos_proveedores' | 'pagos_liquidaciones_unidades';

export interface Transaccion {
  id: number;
  fecha: string; // O Date, dependiendo de cómo lo manejes en el frontend
  descripcion: string | null;
  tipo_movimiento: TipoMovimiento;
  monto: number;
  cuenta_id: number;
  cuenta: Cuenta;
  consorcio_id: number;
  usuario_id: number | null;
  estado: EstadoTransaccion;
  referencia_id: number | null;
  referencia_tabla: ReferenciaTabla | null;
}
