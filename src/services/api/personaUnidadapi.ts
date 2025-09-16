import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { PersonaUnidad, TipoPersonaUnidad } from 'types/unidadOperativa';

// API response types
interface ApiSuccessResponse {
  success: true;
  result: PersonaUnidad[];
  count: number;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

interface PersonaUnidadApiSuccessResponse {
  success: true;
  result: PersonaUnidad;
}

type PersonaUnidadCreateData = Omit<PersonaUnidad, 'id'>;

type PersonaUnidadApiResponse = PersonaUnidadApiSuccessResponse | ApiErrorResponse;

// Query keys
export const personaUnidadQueryKeys = {
  all: ['personaUnidades'] as const,
  lists: () => [...personaUnidadQueryKeys.all, 'list'] as const,
  list: (filters: FetchFilters) => [...personaUnidadQueryKeys.lists(), filters] as const
};

// API functions
export interface FetchFilters {
  persona_id?: number;
  unidad_operativa_id?: number;
  tipo?: TipoPersonaUnidad;
}

export const fetchPersonaUnidades = async (filters: FetchFilters) => {
  const { data } = await apiClient.get<ApiResponse>('/persona-unidades', { params: filters });
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

export const createPersonaUnidad = async (personaUnidadData: PersonaUnidadCreateData) => {
  const { data } = await apiClient.post<PersonaUnidadApiResponse>('/persona-unidades', personaUnidadData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const deletePersonaUnidad = async (id: number) => {
  const { data } = await apiClient.delete<{ success: boolean; message?: string }>(`/persona-unidades/${id}`);
  if (data.success) {
    return true;
  } else {
    throw new Error(data.message || 'Error deleting persona-unidad association');
  }
};

// React Query hooks
/**
 * Hook para obtener las asociaciones entre personas y unidades operativas.
 * Permite filtrar por `persona_id`, `unidad_operativa_id` y `tipo`. Los filtros se pueden combinar.
 *
 * @example
 * // Obtener todas las unidades asociadas a una persona específica.
 * // GET /api/persona-unidades?persona_id=1
 * useGetPersonaUnidades({ persona_id: 1 });
 *
 * @example
 * // Obtener todas las personas asociadas a una unidad operativa específica.
 * // GET /api/persona-unidades?unidad_operativa_id=5
 * useGetPersonaUnidades({ unidad_operativa_id: 5 });
 *
 * @example
 * // Obtener una asociación específica, por ejemplo, para verificar un rol.
 * // GET /api/persona-unidades?persona_id=1&unidad_operativa_id=5&tipo=propietario
 * useGetPersonaUnidades({ persona_id: 1, unidad_operativa_id: 5, tipo: 'propietario' });
 *
 * @param filters - Objeto con los filtros a aplicar (`persona_id`, `unidad_operativa_id`, `tipo`).
 * @param options - Opciones adicionales para el query, como `enabled`.
 */
export function useGetPersonaUnidades(filters: FetchFilters, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: personaUnidadQueryKeys.list(filters),
    queryFn: () => fetchPersonaUnidades(filters),
    enabled: options?.enabled ?? true
  });
}

export function useCreatePersonaUnidad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (personaUnidadData: PersonaUnidadCreateData) => createPersonaUnidad(personaUnidadData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personaUnidadQueryKeys.lists() });
    }
  });
}

export function useDeletePersonaUnidad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePersonaUnidad(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personaUnidadQueryKeys.lists() });
    }
  });
}
