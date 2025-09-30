import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from 'services/api/apiClient';
import { Liquidacion, LiquidacionCreateData, LiquidacionGasto } from 'types/liquidacion';

// API response types
interface ApiSuccessResponse {
  success: true;
  result: Liquidacion;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

/**
 * Fetch all liquidaciones for a consorcio
 * @param consorcioId
 */
const getLiquidaciones = async (consorcioId: number | string): Promise<Liquidacion[]> => {
  // Asumimos que getall devuelve un array directamente, sin el wrapper { success, result }
  const { data } = await apiClient.post<Liquidacion[]>('/liquidaciones/getall', { consorcio_id: consorcioId });
  return data || [];
};

export const useGetLiquidaciones = (
  consorcioId: number | string,
  options?: Omit<UseQueryOptions<Liquidacion[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Liquidacion[]>(['liquidaciones', consorcioId], () => getLiquidaciones(consorcioId), {
    enabled: !!consorcioId,
    ...options
  });
};

/**
 * Fetch a single liquidacion by ID
 * @param id
 */
const getLiquidacionById = async (id: number | string): Promise<Liquidacion> => {
  const { data } = await apiClient.get<ApiResponse>(`/liquidaciones/${id}`);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const useGetLiquidacionById = (id: number | string, options?: Omit<UseQueryOptions<Liquidacion>, 'queryKey' | 'queryFn'>) => {
  return useQuery<Liquidacion>(['liquidaciones', id], () => getLiquidacionById(id), {
    enabled: !!id,
    ...options
  });
};

/**
 * Create a new liquidacion
 * @param liquidacionData
 * @param consorcio_id
 * @param gastos
 */
const createLiquidacion = async ({
  liquidacionData,
  consorcio_id,
  gastos
}: {
  liquidacionData: LiquidacionCreateData; // Base liquidacion data (without 'id')
  consorcio_id: string | number;
  gastos?: Omit<LiquidacionGasto, 'gasto_id' | 'Liquidacion'>[]; // Array de objetos de gastos
}): Promise<Liquidacion> => {
  const { data } = await apiClient.post<ApiResponse>('/liquidaciones', { ...liquidacionData, consorcio_id, gastos });
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const useCreateLiquidacion = (
  options?: UseMutationOptions<Liquidacion, Error, { liquidacionData: LiquidacionCreateData; consorcio_id: string | number }>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    Liquidacion,
    Error,
    { liquidacionData: LiquidacionCreateData; consorcio_id: string | number; gastos?: Omit<LiquidacionGasto, 'gasto_id' | 'Liquidacion'>[] }
  >(createLiquidacion, {
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(['liquidaciones', variables.consorcio_id]);
      options?.onSuccess?.(data, variables, context);
    }
  });
};

/**
 * Update a liquidacion
 * @param liquidacionId
 * @param liquidacionData
 */
const updateLiquidacion = async ({
  liquidacionId,
  liquidacionData
}: {
  liquidacionId: number;
  liquidacionData: Partial<Liquidacion>;
}): Promise<Liquidacion> => {
  const { data } = await apiClient.put<ApiResponse>(`/liquidaciones/${liquidacionId}`, liquidacionData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const useUpdateLiquidacion = (
  options?: UseMutationOptions<Liquidacion, Error, { liquidacionId: number; liquidacionData: Partial<Liquidacion> }>
) => {
  const queryClient = useQueryClient();
  return useMutation<Liquidacion, Error, { liquidacionId: number; liquidacionData: Partial<Liquidacion> }>(updateLiquidacion, {
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['liquidaciones', data.consorcio_id] });
      queryClient.invalidateQueries(['liquidaciones', data.id]);
      options?.onSuccess?.(data, variables, context);
    }
  });
};

/**
 * Delete a liquidacion
 * @param liquidacionId
 */
const deleteLiquidacion = async (liquidacionId: number): Promise<void> => {
  const { data } = await apiClient.delete<{ success: boolean; message?: string }>(`/liquidaciones/${liquidacionId}`);
  if (!data.success) {
    throw new Error(data.message || 'Error al eliminar la liquidación');
  }
};

export const useDeleteLiquidacion = (options?: UseMutationOptions<void, Error, number>) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>(deleteLiquidacion, {
    ...options,
    onSuccess: (data, variables, context) => {
      // Asumimos que necesitamos invalidar la lista general.
      // Se podría pasar consorcio_id si fuera necesario.
      queryClient.invalidateQueries({ queryKey: ['liquidaciones'] });
      options?.onSuccess?.(data, variables, context);
    }
  });
};
