/**
 * Tipos de enumeración para el tipo de cuenta.
 * Basado en `public.enum_cuentas_tipo`.
 */
export type TipoCuenta = 'corriente' | 'ahorro' | 'caja' | 'otro'; // Assuming other types, adjust as needed

/**
 * Interfaz que representa la estructura de una cuenta,
 * mapeada desde la tabla `public.cuentas` de la base de datos.
 */
export interface Cuenta {
  id: number;
  consorcio_id: number;
  tipo: TipoCuenta;
  descripcion: string;
  balance: number;
  activa: boolean;
}
