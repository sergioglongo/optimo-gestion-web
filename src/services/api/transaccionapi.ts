import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { Transaccion, TipoMovimiento, EstadoTransaccion, ReferenciaTabla } from 'types/transaccion';

// API response types
interface ApiSuccessResponse {
  success: true;
  result: Transaccion[];
  count: number;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

interface TransaccionApiSuccessResponse {
  success: true;
  result: Transaccion;
}

type TransaccionCreateData = Omit<Transaccion, 'id'>;

type TransaccionApiResponse = TransaccionApiSuccessResponse | ApiErrorResponse;

// Query keys
export const transaccionQueryKeys = {
  all: ['transacciones'] as const,
  lists: () => [...transaccionQueryKeys.all, 'list'] as const,
  list: (filters: FetchTransaccionesFilters) => [...transaccionQueryKeys.lists(), filters] as const,
  detail: (id: number | string) => [...transaccionQueryKeys.all, 'detail', id] as const
};

// API functions
export interface FetchTransaccionesFilters {
  consorcio_id: string | number;
  tipo_movimiento?: TipoMovimiento;
  cuenta_id?: number;
  usuario_id?: number;
  estado?: EstadoTransaccion;
  fecha_desde?: string; // ISO date string
  fecha_hasta?: string; // ISO date string
  referencia_id?: number;
  referencia_tabla?: ReferenciaTabla;
}

export const fetchTransacciones = async (filters: FetchTransaccionesFilters) => {
  // Assuming an endpoint similar to others, e.g., /transacciones/getall
  const { data } = await apiClient.post<ApiResponse>('/transacciones/getall', filters);
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

export const fetchTransaccionById = async (id: number | string) => {
  const { data } = await apiClient.get<TransaccionApiResponse>(`/transacciones/${id}`);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const createTransaccion = async (transaccionData: TransaccionCreateData) => {
  const { data } = await apiClient.post<TransaccionApiResponse>('/transacciones/', transaccionData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const updateTransaccion = async (transaccionId: number, transaccionData: Partial<Transaccion>) => {
  const { data } = await apiClient.put<TransaccionApiResponse>(`/transacciones/${transaccionId}`, transaccionData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const deleteTransaccion = async (transaccionId: number) => {
  const { data } = await apiClient.delete<{ success: boolean; message?: string }>(`/transacciones/${transaccionId}`);
  if (data.success) {
    return true;
  } else {
    throw new Error(data.message || 'Error al eliminar la transacción');
  }
};

// React Query hooks
export function useGetTransacciones(filters: FetchTransaccionesFilters, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: transaccionQueryKeys.list(filters),
    queryFn: () => fetchTransacciones(filters),
    enabled: !!filters.consorcio_id && (options?.enabled ?? true)
  });
}

export function useGetTransaccion(id: number | string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: transaccionQueryKeys.detail(id),
    queryFn: () => fetchTransaccionById(id),
    enabled: !!id && (options?.enabled ?? true)
  });
}

export function useCreateTransaccion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transaccionData: TransaccionCreateData) => createTransaccion(transaccionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transaccionQueryKeys.lists() });
    }
  });
}

export function useUpdateTransaccion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ transaccionId, transaccionData }: { transaccionId: number; transaccionData: Partial<Transaccion> }) =>
      updateTransaccion(transaccionId, transaccionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transaccionQueryKeys.lists() });
    }
  });
}

export function useDeleteTransaccion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transaccionId: number) => deleteTransaccion(transaccionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transaccionQueryKeys.lists() });
    }
  });
}
