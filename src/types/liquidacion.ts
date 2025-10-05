// ==============================|| LIQUIDACION - TYPES ||============================== //

import { Consorcio } from './consorcio';
import { Gasto, GastoEstado } from './gasto';
import { UnidadOperativa } from './unidadOperativa';

/**
 * Interfaz que representa la estructura de una Liquidacion,
 * mapeada desde la tabla `liquidaciones` de la base de datos.
 */

export type LiquidacionEstado = 'borrador' | 'emitida' | 'cerrada';

export interface Liquidacion {
  id: number;
  consorcio_id: number;
  total: number;
  saldo: number;
  primer_vencimiento: number | null; // nro de dia del mes en el que vence en primera instancia
  primer_vencimiento_recargo: number;
  segundo_vencimiento: number | null; // nro de dia del mes en el que vence en segunda instancia
  segundo_vencimiento_recargo: number;
  fecha_emision: string;
  periodo: string; //periodo en formato MM/YYYY
  fecha_cierre: string | null;
  estado: string;
  Consorcio?: Consorcio | null;
  Gastos?: LiquidacionGasto[] | [];
}

export type LiquidacionCreateData = Omit<Liquidacion, 'id'>;

/**
 * Interfaz que representa la relación entre una liquidación y un gasto.
 * Mapeada desde la tabla `liquidaciones_gastos`.
 */
export interface LiquidacionGasto {
  id?: number;
  liquidacion_id?: number;
  Liquidacion?: Liquidacion;
  gasto_id: number;
  Gasto?: Gasto;
  monto: number;
  estado: GastoEstado;
}

/**
 * Tipos de enumeración para el estado de una liquidación de unidad.
 */
export type LiquidacionUnidadEstado = 'pendiente' | 'adeuda' | 'pagada' | 'vencida';

/**
 * Interfaz que representa la liquidación para una unidad operativa específica.
 * Mapeada desde la tabla `liquidaciones_unidades`.
 */
export interface LiquidacionUnidad {
  id: number;
  liquidacion_id: number;
  unidad_operativa_id: number;
  monto: number;
  prorrateo: number;
  saldado?: number; // Monto ya pagado de esta liquidación
  estado: LiquidacionUnidadEstado;
  fecha: string; // Format: YYYY-MM-DD
  interes: number;
  persona_id?: number;
  UnidadOperativa?: UnidadOperativa;
  Liquidacion?: Liquidacion;
}

export type LiquidacionUnidadCreateData = Omit<LiquidacionUnidad, 'id'>;
