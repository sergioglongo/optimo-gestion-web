import { Proveedor } from './proveedor';
import { Rubro } from './rubro';
import { UnidadOperativa } from './unidadOperativa';

export type GastoEstado = 'impago' | 'parcial' | 'pagado';
export type GastoTipo = 'ordinario' | 'extraordinario';

export interface Gasto {
  id: number;
  consorcio_id: number;
  rubro_gasto_id: number;
  descripcion: string;
  monto: number;
  saldado?: number | null;
  deuda?: number | null;
  fecha: string; // Format: YYYY-MM-DD
  proveedor_id: number | null;
  Proveedor?: Proveedor;
  Rubro?: Rubro;
  estado: GastoEstado;
  fecha_carga: string | null; // Format: YYYY-MM-DD
  tipo_gasto: GastoTipo;
  periodo_aplica: string | null; // Format: YYYY-MM-DD
  liquidacion_id?: number | null;
  unidad_asignada?: UnidadOperativa;
}

export type GastoCreateData = Omit<Gasto, 'id'>;

/**
 * Interfaz que representa la asignación de un gasto a una unidad operativa.
 * Mapeada desde la tabla `gastos_asignaciones`.
 */
export interface GastoAsignacion {
  id: number;
  gasto_id: number;
  consorcio_id: number;
  unidad_operativa_id: number;
}

export type GastoAsignacionCreateData = Omit<GastoAsignacion, 'id'>;
