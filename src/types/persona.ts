import { Usuario } from './usuario';
import { Domicilio } from './domicilio';

/**
 * Tipos de enumeración para el tipo de persona.
 */
export type TipoPersona = 'persona fisica' | 'persona juridica'; // Adjust as needed

export const TipoPersonaOptions: TipoPersona[] = ['persona fisica', 'persona juridica'];

/**
 * Tipos de enumeración para el tipo de identificación de la persona.
 */
export type TipoIdentificacionPersona = 'documento' | 'cuit' | 'cuil' | 'otro';

export const TipoIdentificacionPersonaOptions: TipoIdentificacionPersona[] = ['documento', 'cuit', 'cuil', 'otro'];

/**
 * Interfaz que representa un tipo de persona en relación a una unidad (propietario, inquilino, etc.).
 * Corresponde a la tabla `persona_tipos`.
 */
export interface PersonaTipo {
  id: number;
  nombre: string;
}

// Ya no se necesita RolPersonaOptions, ya que los tipos se obtendrán de la tabla `persona_tipos`.
// export const RolPersonaOptions: RolPersona[] = ['propietario', 'inquilino', 'habitante', 'gestion'];
/**
 * Interfaz que representa la estructura de una persona.
 */
export interface Persona {
  id?: number;
  consorcio_id: number;
  nombre: string;
  apellido: string;
  tipo_persona: TipoPersona;
  tipo_identificacion?: TipoIdentificacionPersona | null;
  identificacion?: string | null;
  Domicilio?: Domicilio | null;
  telefono?: string | null;
  email?: string | null;
  activa?: boolean;
  Usuario?: Usuario;
}

/**
 * Interfaz que combina los datos de Persona y Usuario para formularios de creación/actualización conjunta.
 */
export interface PersonaUsuario extends Persona {
  usuario?: string;
  rol?: string; // Consider using a specific type like RolUsuario if you have one
}
