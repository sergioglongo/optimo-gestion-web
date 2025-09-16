/**
 * Tipos de enumeración para el rol de usuario.
 */
export type RolUsuario = 'administrador' | 'usuario' | 'visitante';

export const RolUsuarioOptions: RolUsuario[] = ['administrador', 'usuario', 'visitante'];

/**
 * Interfaz que representa la estructura de un usuario.
 */
export interface Usuario {
  id?: number; // Made optional
  password?: string; // Password might not always be present (e.g., when fetching user data)
  email: string;
  usuario?: string | null;
  rol: RolUsuario;
  persona_id?: number | null; // Nullable as it might not be set initially
}
