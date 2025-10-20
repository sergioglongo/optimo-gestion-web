/**
 * Tipos de enumeración para el tipo de cuenta.
 * Basado en `public.enum_cuentas_tipo`.
 */
export type TipoCuenta = 'corriente' | 'ahorro' | 'efectivo' | 'virtual' | 'otro'; // Assuming other types, adjust as needed

/**
 * Interfaz que representa la estructura de una cuenta,
 * mapeada desde la tabla `public.cuentas` de la base de datos.
 */
export interface Cuenta {
  id: number;
  consorcio_id: number;
  tipo: TipoCuenta;
  descripcion: string;
  numero?: string;
  cbu?: string;
  alias?: string;
  titular?: string;
  balance: number;
  activa: boolean;
  pagos: boolean;
  cobranzas: boolean;
  fecha_ultima_conciliacion?: string;
}

export const tiposDeCuenta = [
  { id: 'corriente', label: 'Corriente' },
  { id: 'ahorro', label: 'Ahorro' },
  { id: 'efectivo', label: 'Efectivo' },
  { id: 'virtual', label: 'Virtual' },
  { id: 'otro', label: 'Otro' }
];
