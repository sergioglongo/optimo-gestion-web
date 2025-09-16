/**
 * Interfaz para una provincia.
 */
export interface Provincia {
  id: number;
  nombre: string;
}

/**
 * Interfaz para una localidad.
 */
export interface Localidad {
  id: number;
  nombre: string;
  provincia_id: number;
}