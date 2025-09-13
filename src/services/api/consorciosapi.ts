import { useQuery } from '@tanstack/react-query';

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { Consorcio } from 'types/consorcio';

// Tipos para la respuesta de la API, reflejando los casos de éxito y error.
interface ApiSuccessResponse {
  success: true;
  result: Consorcio[];
  count: number;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// Define los query keys para una gestión centralizada y evitar errores de tipeo.
export const consorcioQueryKeys = {
  all: ['consorcios'] as const,
  lists: () => [...consorcioQueryKeys.all, 'list'] as const,
  list: (filters: { usuario_id: string | number }) => [...consorcioQueryKeys.lists(), filters] as const
};

export const fetchConsorciosByUser = async (usuario_id: string | number) => {
  const { data } = await apiClient.post<ApiResponse>('/consorcios/getall', { usuario_id });
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

/**
 * Hook para obtener la lista de consorcios para un usuario específico.
 * @param usuario_id - El ID del usuario para filtrar los consorcios.
 * @param options - Opciones adicionales para el query, como `enabled` para controlar cuándo se ejecuta.
 */
export function useGetConsorcios(usuario_id: string | number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: consorcioQueryKeys.list({ usuario_id }),
    queryFn: () => fetchConsorciosByUser(usuario_id),
    // La consulta solo se ejecutará si se proporciona un `usuario_id`, evitando llamadas innecesarias.
    enabled: !!usuario_id && (options?.enabled ?? true)
  });
}