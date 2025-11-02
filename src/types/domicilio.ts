export interface Provincia {
  id: string;
  nombre: string;
}

export interface Localidad {
  id: string;
  nombre: string;
  provincia_id: string;
}

export interface Domicilio {
  id?: number;
  direccion: string | null;
  provincia_id: string | null;
  localidad_id: string | null;
  Provincia?: Provincia;
  Localidad?: Localidad;
}
