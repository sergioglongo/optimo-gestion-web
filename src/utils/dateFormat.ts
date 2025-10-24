/**
 * Formatea una fecha en formato 'YYYY-MM-DD' a 'MM/YYYY'.
 * @param dateString - La fecha en formato de texto.
 * @returns La fecha formateada como 'MM/YYYY' o un string vacío si la entrada no es válida.
 */
export const periodoFormat = (dateString: string): string => {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}/.test(dateString)) return '';
  const [year, month] = dateString.split('-');
  return `${month}/${year}`;
};

/**
 * Formatea una fecha de texto a un formato local (ej. 'DD/MM/YYYY').
 * @param dateString - La fecha en formato de texto (ej. '2025-05-25' o una fecha ISO).
 * @returns La fecha formateada según la configuración regional o un string vacío si la entrada no es válida.
 */
export const toLocaleDateFormat = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Verifica si la fecha es válida. `new Date('texto-invalido')` resulta en un objeto de fecha inválido.
  if (isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString();
};

/**
 * Formatea una fecha de texto a un formato local (ej. 'DD/MM/YYYY') tratando la fecha como UTC para evitar desajustes de zona horaria.
 * @param dateString - La fecha en formato de texto (ej. '2025-05-25' o una fecha ISO).
 * @returns La fecha formateada según la configuración regional o un string vacío si la entrada no es válida.
 */
export const formatDateOnly = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString('es-AR', { timeZone: 'UTC' });
};
