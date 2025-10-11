import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { Gasto, GastoAsignacion, GastoAsignacionCreateData, GastoCreateData, GastoPagoCreateData } from 'types/gasto';

// API response types
interface ApiSuccessResponse {
  success: true;
  result: Gasto[];
  count: number;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

interface GastoApiSuccessResponse {
  success: true;
  result: Gasto;
}

type GastoApiResponse = GastoApiSuccessResponse | ApiErrorResponse;

export interface FetchGastosFilters {
  consorcio_id: string | number;
  liquidacion_id?: number;
  proveedor_id?: number;
  adeudada?: boolean; // Gastos impagos o con deuda
  no_asignado?: boolean; // Gastos que aún no tienen liquidacion_id
}

// Query keys
export const gastoQueryKeys = {
  all: ['gastos'] as const,
  lists: () => [...gastoQueryKeys.all, 'list'] as const,
  list: (filters: FetchGastosFilters) => [...gastoQueryKeys.lists(), filters] as const,
  byLiquidacion: (liquidacionId: number | string) => [...gastoQueryKeys.all, 'byLiquidacion', liquidacionId] as const,
  liquidacionGastos: (filters: FetchLiquidacionGastosFilters) => [...gastoQueryKeys.all, 'liquidacion', filters] as const
};

// API functions
export const fetchGastos = async (filters: FetchGastosFilters) => {
  const { data } = await apiClient.post<ApiResponse>('/gastos/getall', filters);
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

export interface FetchLiquidacionGastosFilters {
  consorcio_id: string | number;
  periodo?: string | null;
  sin_liquidar?: boolean;
}

/**
 * Fetch all gastos for a liquidacion
 * @param filters
 */
export const getLiquidacionGastos = async (filters: FetchLiquidacionGastosFilters) => {
  const { data } = await apiClient.post<ApiResponse>('/gastos/liquidacion', filters);
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

/**
 * Fetch all gastos for a specific liquidacion
 * @param liquidacionId
 */
export const fetchGastosByLiquidacion = async (liquidacionId: number | string) => {
  // Asumimos que la API responde en /api/gastos?liquidacion_id=X
  // y que la respuesta tiene el formato { success: true, result: Gasto[] }
  const { data } = await apiClient.get<ApiResponse>('/gastos', { params: { liquidacion_id: liquidacionId } });
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

export const createGasto = async (gastoData: GastoCreateData) => {
  const { data } = await apiClient.post<GastoApiResponse>('/gastos/', gastoData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const updateGasto = async (gastoId: number, gastoData: Partial<Gasto>) => {
  const { data } = await apiClient.put<GastoApiResponse>(`/gastos/${gastoId}`, gastoData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const deleteGasto = async (gastoId: number) => {
  const { data } = await apiClient.delete<{ success: boolean; message?: string }>(`/gastos/${gastoId}`);
  if (data.success) {
    return true;
  } else {
    throw new Error(data.message || 'Error al eliminar el gasto');
  }
};

// React Query hooks
export function useGetGastos(filters: FetchGastosFilters, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: gastoQueryKeys.list(filters),
    queryFn: () => fetchGastos(filters),
    enabled: !!filters.consorcio_id && (options?.enabled ?? true)
  });
}

export function useGetLiquidacionGastos(filters: FetchLiquidacionGastosFilters, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: gastoQueryKeys.liquidacionGastos(filters),
    queryFn: () => getLiquidacionGastos(filters),
    enabled: !!filters.consorcio_id && (options?.enabled ?? true)
  });
}

export function useGetGastosByLiquidacion(liquidacionId: number | string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: gastoQueryKeys.byLiquidacion(liquidacionId),
    queryFn: () => fetchGastosByLiquidacion(liquidacionId),
    enabled: !!liquidacionId && (options?.enabled ?? true)
  });
}

export function useCreateGasto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gastoData: GastoCreateData) => createGasto(gastoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gastoQueryKeys.lists() });
    }
  });
}

// ==============================|| GASTO ASIGNACION ||============================== //

// API response types for GastoAsignacion
interface GastoAsignacionesApiSuccessResponse {
  success: true;
  result: GastoAsignacion[];
  count: number;
}

type GastoAsignacionesApiResponse = GastoAsignacionesApiSuccessResponse | ApiErrorResponse;

interface GastoAsignacionApiSuccessResponse {
  success: true;
  result: GastoAsignacion;
}

type GastoAsignacionApiResponse = GastoAsignacionApiSuccessResponse | ApiErrorResponse;

// Query keys for GastoAsignacion
export const gastoAsignacionQueryKeys = {
  all: ['gastoAsignaciones'] as const,
  lists: () => [...gastoAsignacionQueryKeys.all, 'list'] as const,
  list: (filters: FetchGastoAsignacionesFilters) => [...gastoAsignacionQueryKeys.lists(), filters] as const
};

// API functions for GastoAsignacion
export interface FetchGastoAsignacionesFilters {
  gasto_id?: number;
  unidad_funcional_id?: number;
}

export interface GastoAsignacionBulkData {
  gasto_id: number;
  consorcio_id: number;
  unidades_ids: number[];
}

export const fetchGastoAsignaciones = async (filters: FetchGastoAsignacionesFilters) => {
  const { data } = await apiClient.get<GastoAsignacionesApiResponse>('/gasto-asignaciones', { params: filters });
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

export const createGastoAsignacion = async (gastoAsignacionData: GastoAsignacionCreateData) => {
  const { data } = await apiClient.post<GastoAsignacionApiResponse>('/gasto-asignaciones', gastoAsignacionData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

/**
 * Asigna un gasto a múltiples unidades funcionals.
 * Crea nuevas asignaciones y/o actualiza las existentes para un gasto determinado.
 * @param data - Contiene el gasto_id, consorcio_id y un array de unidades_ids.
 */
export const assignGastoToUnidades = async (data: GastoAsignacionBulkData) => {
  // Asumimos un nuevo endpoint en el backend que maneja esta lógica de asignación en lote.
  const { data: responseData } = await apiClient.post<GastoAsignacionesApiResponse>('/gasto-asignaciones/createUpdateBulk', data);
  if (responseData.success) {
    return responseData.result || [];
  } else {
    throw new Error(responseData.message);
  }
};

export const createGastoPago = async ({ pagoData, usuario_id }: { pagoData: GastoPagoCreateData; usuario_id: number }) => {
  const payload = { ...pagoData, usuario_id };
  const { data } = await apiClient.post<GastoApiResponse>('/gastos/pagar', payload);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const deleteGastoAsignacion = async (id: number) => {
  const { data } = await apiClient.delete<{ success: boolean; message?: string }>(`/gasto-asignaciones/${id}`);
  if (data.success) {
    return true;
  } else {
    throw new Error(data.message || 'Error al eliminar la asignación del gasto');
  }
};

// React Query hooks for GastoAsignacion
export function useGetGastoAsignaciones(filters: FetchGastoAsignacionesFilters, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: gastoAsignacionQueryKeys.list(filters),
    queryFn: () => fetchGastoAsignaciones(filters),
    enabled: options?.enabled ?? true
  });
}

export function useCreateGastoAsignacion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gastoAsignacionData: GastoAsignacionCreateData) => createGastoAsignacion(gastoAsignacionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gastoAsignacionQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: gastoQueryKeys.lists() });
    }
  });
}

export function useAssignGastoToUnidades() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GastoAsignacionBulkData) => assignGastoToUnidades(data),
    onSuccess: (data, variables) => {
      // Invalida las queries de asignaciones y de gastos para refrescar los datos.
      queryClient.invalidateQueries({ queryKey: gastoAsignacionQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: gastoQueryKeys.lists() });
    }
  });
}

export function useCreateGastoPago() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { pagoData: GastoPagoCreateData; usuario_id: number }) => createGastoPago(data),
    onSuccess: () => {
      // Invalida la lista de gastos para que se actualice el estado y el monto saldado.
      queryClient.invalidateQueries({ queryKey: gastoQueryKeys.lists() });
    }
  });
}

export function useDeleteGastoAsignacion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteGastoAsignacion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gastoAsignacionQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: gastoQueryKeys.lists() });
    }
  });
}

export function useUpdateGasto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gastoId, gastoData }: { gastoId: number; gastoData: Partial<Gasto> }) => updateGasto(gastoId, gastoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gastoQueryKeys.lists() });
    }
  });
}

export function useDeleteGasto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gastoId: number) => deleteGasto(gastoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gastoQueryKeys.lists() });
    }
  });
}
