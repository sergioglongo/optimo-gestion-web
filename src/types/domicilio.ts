// ==============================|| DOMICILIO - TYPES ||============================== //

/**
 * Interfaz que representa la estructura de un domicilio,
 * mapeada desde la tabla `public.domicilios` de la base de datos.
 */
export interface Domicilio {
  id?: number;
  direccion: string;
  localidad?: string | null;
  provincia?: string | null;
  codigo_postal?: string | null;
}
