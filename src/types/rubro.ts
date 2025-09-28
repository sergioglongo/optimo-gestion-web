/**
 * Interfaz que representa la estructura de un Rubro,
 * mapeada desde la tabla `rubros` de la base de datos.
 */
export interface Rubro {
  id: number;
  rubro: string;
  consorcio_id: number;
  orden: number;
  activo: boolean;
}
