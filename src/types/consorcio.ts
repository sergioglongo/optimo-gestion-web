// ==============================|| CONSORCIO - TYPES ||============================== //

/**
 * Tipos de enumeración para la condición fiscal del consorcio.
 * Basado en `public.enum_consorcios_condicion_fiscal`.
 */
export type CondicionFiscal = 'consumidor final' | 'responsable inscripto' | 'monotributista' | 'exento';

/**
 * Tipos de enumeración para el tipo de consorcio.
 * Basado en `public.enum_consorcios_tipo`.
 */
export type TipoConsorcio = 'edificio' | 'barrio privado' | 'centro comercial';

/**
 * Tipos de enumeración para el tipo de interés.
 * Basado en `public.enum_consorcios_tipo_interes`.
 */
export type TipoInteres = 'compuesto' | 'simple';

/**
 * Tipos de enumeración para la modalidad de pago.
 * Basado en `public.enum_consorcios_modalidad`.
 */
export type Modalidad = 'vencido' | 'adelantado';

/**
 * Interfaz que representa la estructura de un consorcio,
 * mapeada desde la tabla `public.consorcios` de la base de datos.
 */
export interface Consorcio {
  id: number;
  nombre: string;
  direccion: string;
  condicion_fiscal?: CondicionFiscal | null;
  identificacion?: string | null;
  notas?: string | null;
  tipo?: TipoConsorcio | null;
  tipo_interes?: TipoInteres | null;
  modalidad?: Modalidad | null;
  vencimiento1?: number | null;
  vencimiento2?: number | null;
  identificador1?: string | null;
  identificador2?: string | null;
  identificador3?: string | null;
  imagen: string | null;
}
