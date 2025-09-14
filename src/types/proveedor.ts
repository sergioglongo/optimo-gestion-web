/**
 * Tipos de enumeración para el tipo de identificación del proveedor.
 */
export type TipoIdentificacionProveedor = 'documento' | 'cuit' | 'cuil' | 'otro';

/**
 * Interfaz que representa la estructura de un Proveedor,
 * mapeada desde la tabla `proveedores` de la base de datos.
 */
export interface Proveedor {
  id: number;
  nombre: string;
  servicio: string;
  consorcio_id: number;
  tipo_identificacion: TipoIdentificacionProveedor;
  identificacion: string | null;
  CBU: string | null;
}
