/**
 * Tipos de enumeración para el tipo de persona.
 */
export type TipoPersona = 'propietario' | 'inquilino' | 'administrador' | 'otro'; // Adjust as needed

/**
 * Interfaz que representa la estructura de una persona.
 */
export interface Persona {
  id: number;
  consorcio_id: number;
  nombre: string;
  apellido: string;
  dni: string;
  tipo: TipoPersona;
}
