import { Cuenta } from './cuenta';
import { LiquidacionUnidad } from './liquidacion';
import { Persona } from './persona';

/**
 * Tipos de enumeración para el tipo de pago de una liquidación de unidad.
 */
export type TipoPagoLiquidacionUnidad = 'impaga' | 'parcial' | 'total';

/**
 * Interfaz que representa un pago de una liquidación de unidad.
 * Mapeada desde la tabla `pagos_liquidaciones_unidades`.
 */
export interface PagoLiquidacionUnidad {
  id: number;
  liquidacion_unidad_id: number;
  cuenta_id: number;
  monto: number;
  interes?: number;
  fecha: string; // Format: YYYY-MM-DD
  tipo_pago: TipoPagoLiquidacionUnidad;
  persona_id: number;
  comentario?: string | null;

  // Relaciones (si se incluyen en las respuestas de la API)
  cuenta?: Cuenta;
  persona?: Persona;
  liquidacionUnidad?: LiquidacionUnidad; // Asumiendo que existe un tipo LiquidacionUnidad
}

export type PagoLiquidacionUnidadCreateData = Omit<PagoLiquidacionUnidad, 'id'>;
