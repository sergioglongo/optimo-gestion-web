import { Cuenta } from './cuenta';
import { Rubro } from './rubro';
import { Domicilio } from './domicilio';

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
  cuenta_id: number | null;
  domicilio_id?: number | null;
  Domicilio?: Domicilio | null;
  telefono?: string | null;
  email?: string | null; // El array de rubros siempre será de objetos Rubro en el frontend. La transformación a number[] se hace antes de enviar.
  Rubros?: Rubro[];
  cuenta?: Cuenta;
  activo: boolean;
}

/**
 * Interfaz para los datos que se envían a la API, donde Rubros es un array de IDs.
 */
export type ProveedorSubmitData = Omit<Proveedor, 'Rubros'> & {
  Rubros?: number[];
};
/**
 * Interfaz que representa la relación entre un proveedor y un rubro.
 * Mapeada desde la tabla `proveedores_rubros`.
 */
export interface ProveedorRubro {
  id: number;
  proveedor_id: number;
  rubro_id: number;
  principal: boolean;
}
