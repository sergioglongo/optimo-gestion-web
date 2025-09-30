export function firstCapitalized(message: string): string {
  if (!message) return '';
  return message.charAt(0).toUpperCase() + message.slice(1);
}

/**
 * Trunca un string a una longitud máxima y añade '...' al final.
 * @param str El string a truncar.
 * @param num La longitud máxima del string antes de añadir '...'.
 * @returns El string truncado.
 */
export function truncateString(str: string, num: number): string {
  if (!str || str.length <= num) {
    return str || '';
  }
  return str.slice(0, num) + '...';
}
