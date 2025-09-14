/**
 * Tipos de enumeración para el tipo de unidad operativa.
 */
export type TipoUnidadOperativa = 'departamento' | 'casa' | 'duplex' | 'local' | 'cochera' | 'baulera';

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
  tipo: TipoUnidadOperativa;
  identificador1?: string | null;
  identificador2?: string | null;
  identificador3?: string | null;
  liquidar_a: LiquidarA;
  prorrateo: number;
  Intereses: boolean;
  alquilada: boolean;
  notas?: string | null;
}
