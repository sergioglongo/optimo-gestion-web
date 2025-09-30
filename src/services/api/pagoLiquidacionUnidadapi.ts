import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { PagoLiquidacionUnidad, PagoLiquidacionUnidadCreateData } from 'types/pagoLiquidacionUnidad';

// API response types
interface ApiSuccessResponse {
  success: true;
  result: PagoLiquidacionUnidad[];
  count: number;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

interface PagoLiquidacionUnidadApiSuccessResponse {
  success: true;
  result: PagoLiquidacionUnidad;
}

type PagoLiquidacionUnidadApiResponse = PagoLiquidacionUnidadApiSuccessResponse | ApiErrorResponse;

export interface FetchPagosLiquidacionUnidadFilters {
  consorcio_id?: string | number;
  liquidacion_unidad_id?: string | number;
}

// Query keys
export const pagoLiquidacionUnidadQueryKeys = {
  all: ['pagosLiquidacionUnidad'] as const,
  lists: () => [...pagoLiquidacionUnidadQueryKeys.all, 'list'] as const,
  list: (filters: FetchPagosLiquidacionUnidadFilters) => [...pagoLiquidacionUnidadQueryKeys.lists(), filters] as const,
  detail: (id: number | string) => [...pagoLiquidacionUnidadQueryKeys.all, 'detail', id] as const
};

// API functions
export const fetchPagosLiquidacionUnidad = async (filters: FetchPagosLiquidacionUnidadFilters) => {
  const { data } = await apiClient.post<ApiResponse>('/pagos-liquidaciones-unidades/getall', filters);
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

export const fetchPagoLiquidacionUnidadById = async (pagoId: number | string) => {
  const { data } = await apiClient.get<PagoLiquidacionUnidadApiResponse>(`/pagos-liquidaciones-unidades/${pagoId}`);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const createPagoLiquidacionUnidad = async (pagoData: PagoLiquidacionUnidadCreateData, usuario_id: number | string) => {
  const body = { ...pagoData, usuario_id };
  const { data } = await apiClient.post<PagoLiquidacionUnidadApiResponse>('/pagos-liquidaciones-unidades/', body);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const updatePagoLiquidacionUnidad = async (
  pagoId: number,
  pagoData: Partial<PagoLiquidacionUnidad>,
  usuario_id: number | string
) => {
  const body = { ...pagoData, usuario_id };
  const { data } = await apiClient.put<PagoLiquidacionUnidadApiResponse>(`/pagos-liquidaciones-unidades/${pagoId}`, body);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const deletePagoLiquidacionUnidad = async (pagoId: number) => {
  const { data } = await apiClient.delete<{ success: boolean; message?: string }>(`/pagos-liquidaciones-unidades/${pagoId}`);
  if (data.success) {
    return true;
  } else {
    throw new Error(data.message || 'Error al eliminar el pago');
  }
};

// React Query hooks
export function useGetPagosLiquidacionUnidad(filters: FetchPagosLiquidacionUnidadFilters, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: pagoLiquidacionUnidadQueryKeys.list(filters),
    queryFn: () => fetchPagosLiquidacionUnidad(filters),
    enabled: !!filters.consorcio_id && (options?.enabled ?? true)
  });
}

export function useGetPagoLiquidacionUnidad(pagoId: number | string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: pagoLiquidacionUnidadQueryKeys.detail(pagoId),
    queryFn: () => fetchPagoLiquidacionUnidadById(pagoId),
    enabled: !!pagoId && (options?.enabled ?? true)
  });
}

export function useCreatePagoLiquidacionUnidad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pagoData, usuario_id }: { pagoData: PagoLiquidacionUnidadCreateData; usuario_id: number | string }) =>
      createPagoLiquidacionUnidad(pagoData, usuario_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pagoLiquidacionUnidadQueryKeys.lists() });
    }
  });
}

export function useUpdatePagoLiquidacionUnidad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      pagoId,
      pagoData,
      usuario_id
    }: {
      pagoId: number;
      pagoData: Partial<PagoLiquidacionUnidad>;
      usuario_id: number | string;
    }) => updatePagoLiquidacionUnidad(pagoId, pagoData, usuario_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pagoLiquidacionUnidadQueryKeys.all });
    }
  });
}

export function useDeletePagoLiquidacionUnidad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pagoId: number) => deletePagoLiquidacionUnidad(pagoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pagoLiquidacionUnidadQueryKeys.lists() });
    }
  });
}
