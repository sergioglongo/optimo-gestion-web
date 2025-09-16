import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { ProveedorRubro } from 'types/proveedor';

// API response types
interface ApiSuccessResponse {
  success: true;
  result: ProveedorRubro[];
  count: number;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

interface ProveedorRubroApiSuccessResponse {
  success: true;
  result: ProveedorRubro;
}

type ProveedorRubroCreateData = Omit<ProveedorRubro, 'id'>;

type ProveedorRubroApiResponse = ProveedorRubroApiSuccessResponse | ApiErrorResponse;

// Query keys
export const proveedorRubroQueryKeys = {
  all: ['proveedorRubros'] as const,
  lists: () => [...proveedorRubroQueryKeys.all, 'list'] as const,
  list: (filters: FetchFilters) => [...proveedorRubroQueryKeys.lists(), filters] as const
};

// API functions
export interface FetchFilters {
  proveedor_id?: number;
  rubro_id?: number;
}

export const fetchProveedorRubros = async (filters: FetchFilters) => {
  const { data } = await apiClient.get<ApiResponse>('/proveedor-rubros', { params: filters });
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

export const createProveedorRubro = async (proveedorRubroData: ProveedorRubroCreateData) => {
  const { data } = await apiClient.post<ProveedorRubroApiResponse>('/proveedor-rubros', proveedorRubroData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const deleteProveedorRubro = async (id: number) => {
  const { data } = await apiClient.delete<{ success: boolean; message?: string }>(`/proveedor-rubros/${id}`);
  if (data.success) {
    return true;
  } else {
    throw new Error(data.message || 'Error deleting proveedor-rubro association');
  }
};

// React Query hooks
/**
 * Hook para obtener las asociaciones entre proveedores y rubros.
 * Permite filtrar por `proveedor_id` y `rubro_id`. Los filtros se pueden combinar.
 *
 * @example
 * // Obtener todos los rubros asociados a un proveedor.
 * // GET /api/proveedor-rubros?proveedor_id=1
 * useGetProveedorRubros({ proveedor_id: 1 });
 *
 * @example
 * // Obtener todos los proveedores asociados a un rubro.
 * // GET /api/proveedor-rubros?rubro_id=5
 * useGetProveedorRubros({ rubro_id: 5 });
 *
 * @param filters - Objeto con los filtros a aplicar (`proveedor_id`, `rubro_id`).
 * @param options - Opciones adicionales para el query, como `enabled`.
 */
export function useGetProveedorRubros(filters: FetchFilters, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: proveedorRubroQueryKeys.list(filters),
    queryFn: () => fetchProveedorRubros(filters),
    enabled: options?.enabled ?? true
  });
}

export function useCreateProveedorRubro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (proveedorRubroData: ProveedorRubroCreateData) => createProveedorRubro(proveedorRubroData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proveedorRubroQueryKeys.lists() });
    }
  });
}

export function useDeleteProveedorRubro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProveedorRubro(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proveedorRubroQueryKeys.lists() });
    }
  });
}
