import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from 'services/api/apiClient';
import { LiquidacionUnidad, LiquidacionUnidadCreateData } from 'types/liquidacion';

// ==============================|| API - LIQUIDACIONES UNIDADES ||============================== //

export interface FetchLiquidacionUnidadesFilters {
  liquidacion_id?: number | string;
  unidad_operativa_id?: number | string;
  persona_id?: number | string;
}

/**
 * Fetch liquidaciones de unidades based on filters
 * @param filters
 */
const getLiquidacionUnidades = async (filters: FetchLiquidacionUnidadesFilters): Promise<LiquidacionUnidad[]> => {
  const { data } = await apiClient.post<LiquidacionUnidad[]>('/liquidaciones-unidades/getall', filters);
  return data;
};

export const useGetLiquidacionUnidades = (
  filters: FetchLiquidacionUnidadesFilters,
  options?: Omit<UseQueryOptions<LiquidacionUnidad[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<LiquidacionUnidad[]>(['liquidacionUnidades', filters], () => getLiquidacionUnidades(filters), {
    enabled: !!(filters.liquidacion_id || filters.unidad_operativa_id || filters.persona_id),
    ...options
  });
};

/**
 * Fetch a single liquidacion de unidad by ID
 * @param id
 */
const getLiquidacionUnidadById = async (id: number | string): Promise<LiquidacionUnidad> => {
  const { data } = await apiClient.get<{ success: boolean; result: LiquidacionUnidad; message?: string }>(`/liquidaciones-unidades/${id}`);
  if (data.success) {
    return data.result;
  } else {
    // Lanza un error si la API indica que la operación no fue exitosa.
    throw new Error(data.message || 'Error al obtener la liquidación de la unidad.');
  }
};

export const useGetLiquidacionUnidadById = (
  id: number | string,
  options?: Omit<UseQueryOptions<LiquidacionUnidad>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<LiquidacionUnidad>(['liquidacionUnidades', id], () => getLiquidacionUnidadById(id), {
    enabled: !!id,
    ...options
  });
};

/**
 * Create a new liquidacion de unidad
 * @param liquidacionUnidadData
 */
const createLiquidacionUnidad = async (liquidacionUnidadData: LiquidacionUnidadCreateData): Promise<LiquidacionUnidad> => {
  const { data } = await apiClient.post('/liquidaciones-unidades', liquidacionUnidadData);
  return data;
};

export const useCreateLiquidacionUnidad = (options?: UseMutationOptions<LiquidacionUnidad, Error, LiquidacionUnidadCreateData>) => {
  const queryClient = useQueryClient();
  return useMutation<LiquidacionUnidad, Error, LiquidacionUnidadCreateData>(createLiquidacionUnidad, {
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(['liquidacionUnidades', { liquidacion_id: data.liquidacion_id }]);
      options?.onSuccess?.(data, variables, context);
    }
  });
};

/**
 * Generate liquidaciones de unidades for a given liquidacion
 * @param liquidacion_id
 */
const generateLiquidacionesUnidades = async (liquidacion_id: number | string): Promise<{ success: boolean; message: string }> => {
  const { data } = await apiClient.post('/liquidaciones-unidades/generate-liquidaciones-unidades', { liquidacion_id });
  return data;
};

export const useGenerateLiquidacionesUnidades = (
  options?: UseMutationOptions<{ success: boolean; message: string }, Error, number | string>
) => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean; message: string }, Error, number | string>(generateLiquidacionesUnidades, {
    ...options,
    onSuccess: (data, liquidacion_id, context) => {
      // Invalida las queries de liquidaciones de unidades para esa liquidacion_id para refrescar la lista.
      queryClient.invalidateQueries(['liquidacionUnidades', { liquidacion_id }]);
      options?.onSuccess?.(data, liquidacion_id, context);
    }
  });
};

/**
 * Update a liquidacion de unidad
 * @param liquidacionUnidadId
 * @param liquidacionUnidadData
 */
const updateLiquidacionUnidad = async ({ id, data }: { id: number; data: Partial<LiquidacionUnidad> }): Promise<LiquidacionUnidad> => {
  const response = await apiClient.put(`/liquidaciones-unidades/${id}`, data);
  return response.data;
};

export const useUpdateLiquidacionUnidad = (
  options?: UseMutationOptions<LiquidacionUnidad, Error, { id: number; data: Partial<LiquidacionUnidad> }>
) => {
  const queryClient = useQueryClient();
  return useMutation<LiquidacionUnidad, Error, { id: number; data: Partial<LiquidacionUnidad> }>(updateLiquidacionUnidad, {
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(['liquidacionUnidades', { liquidacion_id: data.liquidacion_id }]);
      queryClient.invalidateQueries(['liquidacionUnidades', data.id]);
      options?.onSuccess?.(data, variables, context);
    }
  });
};

/**
 * Delete a liquidacion de unidad
 * @param id
 */
const deleteLiquidacionUnidad = async (id: number): Promise<void> => {
  await apiClient.delete(`/liquidaciones-unidades/${id}`);
};

export const useDeleteLiquidacionUnidad = (options?: UseMutationOptions<void, Error, number>) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>(deleteLiquidacionUnidad, {
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(['liquidacionUnidades']);
      options?.onSuccess?.(data, variables, context);
    }
  });
};
