import { Usuario, RolUsuario } from './usuario';
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
 * Tipos de enumeración para el rol de la persona en el consorcio.
 */
export type RolPersona = 'propietario' | 'inquilino' | 'habitante' | 'gestion';

export const RolPersonaOptions: RolPersona[] = ['propietario', 'inquilino', 'habitante', 'gestion'];

/**
 * Interfaz que representa la estructura de una persona.
 */
export interface Persona {
  id: number;
  consorcio_id: number;
  nombre: string;
  apellido: string;
  tipo_persona: TipoPersona;
  tipo_identificacion?: TipoIdentificacionPersona | null;
  identificacion?: string | null;
  Domicilio?: Domicilio | null;
  telefono?: string | null;
  activa: boolean;
  Usuario?: Usuario;
}

export interface PersonaUsuario {
  id?: number; // Made optional
  consorcio_id: number;
  nombre: string;
  apellido: string;
  tipo_persona: TipoPersona;
  tipo_identificacion?: TipoIdentificacionPersona | null;
  identificacion?: string | null;
  Domicilio?: Domicilio | null;
  telefono?: string | null;
  email: string;
  usuario?: string;
  rol?: RolUsuario;
  persona_id?: number;
  activa?: boolean;
}
