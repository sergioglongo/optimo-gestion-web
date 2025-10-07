// ==============================|| LIQUIDACION - TYPES ||============================== //

import { Consorcio } from './consorcio';
import { Gasto, GastoEstado } from './gasto';
import { PagoLiquidacionUnidad } from './pagoLiquidacionUnidad';
import { Persona } from './persona';
import { UnidadOperativa } from './unidadOperativa';

/**
 * Interfaz que representa la estructura de una Liquidacion,
 * mapeada desde la tabla `liquidaciones` de la base de datos.
 */

export type LiquidacionEstado = 'borrador' | 'emitida' | 'cerrada' | 'completada';

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
  interes_deuda?: number;
  estado: LiquidacionUnidadEstado;
  fecha: string; // Format: YYYY-MM-DD
  interes: number;
  persona_id?: number;
  UnidadOperativa?: UnidadOperativa;
  Liquidacion?: Liquidacion;
  Pagos: PagoLiquidacionUnidad[];
}

export type LiquidacionUnidadCreateData = Omit<LiquidacionUnidad, 'id'>;

/**
 * Interfaz para el objeto Liquidacion anidado dentro de la respuesta de deudores.
 * Contiene solo un subconjunto de los campos de la interfaz Liquidacion principal.
 */
export interface DeudorLiquidacion {
  periodo: string; // "2025-08-01"
  primer_vencimiento: number;
}

/**
 * Interfaz para los objetos dentro del array LiquidacionUnidads en la respuesta de deudores.
 * Similar a LiquidacionUnidad pero con campos adicionales y anidados.
 */
export interface DeudorLiquidacionUnidad {
  id: number;
  liquidacion_id: number;
  unidad_operativa_id: number;
  prorrateo: string; // "25.00"
  monto: string; // "36492.69"
  monto_final?: number;
  restante: number;
  estado: LiquidacionUnidadEstado;
  fecha: string; // "2025-08-30"
  interes: string; // "3649.27"
  interes_deuda?: string; // "3649.27"
  persona_id: number | null;
  PagoLiquidacionUnidads: any[]; // Asumiendo que puede contener pagos, se deja como any[] por ahora
  Liquidacion: DeudorLiquidacion;
  saldado: number;
  deuda: number;
}

/**
 * Interfaz principal para la estructura de un deudor.
 * Combina datos de UnidadOperativa con sus liquidaciones adeudadas.
 */
export interface LiquidacionUnidadDeudores extends Omit<UnidadOperativa, 'id'> {
  id: number; // El ID de la UnidadOperativa
  LiquidacionUnidads: DeudorLiquidacionUnidad[];
  total_deuda: number;
  Deudor: Persona | null; // Podría ser un tipo Persona si está definido
}
