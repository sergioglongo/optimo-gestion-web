import { Persona } from './persona';

/**
 * Interfaz que representa la estructura de un Tipo de Prorrateo.
 * Mapeada desde la tabla `tipos_prorrateo`.
 */
export interface TipoProrrateo {
  id: number;
  nombre: string;
  indice: number;
  consorcio_id: number;
}

/**
 * Interfaz que representa la estructura de un Tipo de Unidad Operativa.
 */
export interface TipoUnidadOperativa {
  id: number;
  nombre: string;
  indice: number;
  consorcio_id: number;
}

/**
 * Tipos de enumeración para a quién liquidar.
 */
export type LiquidarA = 'propietario' | 'inquilino' | 'ambos';

/**
 * Interfaz que representa la estructura de una unidad operativa.
 */
export interface UnidadOperativa {
  id: number;
  consorcio_id: number;
  etiqueta?: string | null;
  identificador1?: string | null;
  identificador2?: string | null;
  identificador3?: string | null;
  liquidar_a: LiquidarA;
  prorrateo: number;
  prorrateo_automatico: boolean;
  tipo_unidad_operativa_id?: number | null;
  Intereses: boolean;
  alquilada: boolean;
  notas?: string | null;
  propietario?: Persona | null;
  inquilino?: Persona | null;
  habitantes?: Persona[] | null;
}

/**
 * Tipos de enumeración para el rol de una persona en una unidad.
 */
export type TipoPersonaUnidad = 'propietario' | 'inquilino' | 'habitante';

/**
 * Interfaz que representa la relación entre una persona y una unidad operativa.
 * Mapeada desde la tabla `personas_unidades`.
 */
export interface PersonaUnidad {
  id: number;
  persona_id: number;
  unidad_operativa_id: number;
  tipo: TipoPersonaUnidad;
  Persona?: Persona;
  UnidadOperativa?: UnidadOperativa;
}
