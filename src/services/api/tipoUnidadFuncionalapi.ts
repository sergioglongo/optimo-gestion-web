import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { TipoUnidadFuncional } from 'types/unidadFuncional';

// API response types
interface ApiSuccessResponse {
  success: true;
  result: TipoUnidadFuncional[];
  count: number;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

interface TipounidadFuncionalApiSuccessResponse {
  success: true;
  result: TipoUnidadFuncional;
}

type TipounidadFuncionalCreateData = Omit<TipoUnidadFuncional, 'id'>;

type TipounidadFuncionalApiResponse = TipounidadFuncionalApiSuccessResponse | ApiErrorResponse;

// Query keys
export const tipounidadFuncionalQueryKeys = {
  all: ['tiposunidadFuncional'] as const,
  lists: () => [...tipounidadFuncionalQueryKeys.all, 'list'] as const,
  list: (filters: { consorcio_id: string | number }) => [...tipounidadFuncionalQueryKeys.lists(), filters] as const
};

// API functions
export const fetchTiposunidadFuncionalByConsorcio = async (consorcio_id: string | number) => {
  const { data } = await apiClient.post<ApiResponse>('/unidades/tipos/getall', { consorcio_id });
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

export const createTipounidadFuncional = async (tipounidadFuncionalData: TipounidadFuncionalCreateData) => {
  const { data } = await apiClient.post<TipounidadFuncionalApiResponse>('/unidades/tipos', tipounidadFuncionalData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const updateTipounidadFuncional = async (tipounidadFuncionalId: number, tipounidadFuncionalData: Partial<TipoUnidadFuncional>) => {
  const { data } = await apiClient.put<TipounidadFuncionalApiResponse>(`/unidades/tipos/${tipounidadFuncionalId}`, tipounidadFuncionalData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const deleteTipounidadFuncional = async (tipounidadFuncionalId: number) => {
  const { data } = await apiClient.delete<{ success: boolean; message?: string }>(`/unidades/tipos/${tipounidadFuncionalId}`);
  if (data.success) {
    return true;
  } else {
    throw new Error(data.message || 'Error deleting tipo de unidad funcional');
  }
};

// React Query hooks
export function useGetTiposunidadFuncional(consorcio_id: string | number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: tipounidadFuncionalQueryKeys.list({ consorcio_id }),
    queryFn: () => fetchTiposunidadFuncionalByConsorcio(consorcio_id),
    enabled: !!consorcio_id && (options?.enabled ?? true)
  });
}

export function useCreateTipounidadFuncional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tipounidadFuncionalData: TipounidadFuncionalCreateData) => createTipounidadFuncional(tipounidadFuncionalData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: tipounidadFuncionalQueryKeys.list({ consorcio_id: data.consorcio_id }) });
    }
  });
}

export function useUpdateTipounidadFuncional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tipounidadFuncionalId,
      tipounidadFuncionalData
    }: {
      tipounidadFuncionalId: number;
      tipounidadFuncionalData: Partial<TipoUnidadFuncional>;
    }) => updateTipounidadFuncional(tipounidadFuncionalId, tipounidadFuncionalData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: tipounidadFuncionalQueryKeys.list({ consorcio_id: data.consorcio_id }) });
    }
  });
}

export function useDeleteTipounidadFuncional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tipounidadFuncionalId: number) => deleteTipounidadFuncional(tipounidadFuncionalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tipounidadFuncionalQueryKeys.lists() });
    }
  });
}
