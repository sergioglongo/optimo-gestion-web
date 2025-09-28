import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { TipoUnidadOperativa } from 'types/unidadOperativa';

// API response types
interface ApiSuccessResponse {
  success: true;
  result: TipoUnidadOperativa[];
  count: number;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

interface TipoUnidadOperativaApiSuccessResponse {
  success: true;
  result: TipoUnidadOperativa;
}

type TipoUnidadOperativaCreateData = Omit<TipoUnidadOperativa, 'id'>;

type TipoUnidadOperativaApiResponse = TipoUnidadOperativaApiSuccessResponse | ApiErrorResponse;

// Query keys
export const tipoUnidadOperativaQueryKeys = {
  all: ['tiposUnidadOperativa'] as const,
  lists: () => [...tipoUnidadOperativaQueryKeys.all, 'list'] as const,
  list: (filters: { consorcio_id: string | number }) => [...tipoUnidadOperativaQueryKeys.lists(), filters] as const
};

// API functions
export const fetchTiposUnidadOperativaByConsorcio = async (consorcio_id: string | number) => {
  const { data } = await apiClient.post<ApiResponse>('/unidades/tipos/getall', { consorcio_id });
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

export const createTipoUnidadOperativa = async (tipoUnidadOperativaData: TipoUnidadOperativaCreateData) => {
  const { data } = await apiClient.post<TipoUnidadOperativaApiResponse>('/unidades/tipos', tipoUnidadOperativaData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const updateTipoUnidadOperativa = async (tipoUnidadOperativaId: number, tipoUnidadOperativaData: Partial<TipoUnidadOperativa>) => {
  const { data } = await apiClient.put<TipoUnidadOperativaApiResponse>(`/unidades/tipos/${tipoUnidadOperativaId}`, tipoUnidadOperativaData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const deleteTipoUnidadOperativa = async (tipoUnidadOperativaId: number) => {
  const { data } = await apiClient.delete<{ success: boolean; message?: string }>(`/unidades/tipos/${tipoUnidadOperativaId}`);
  if (data.success) {
    return true;
  } else {
    throw new Error(data.message || 'Error deleting tipo de unidad operativa');
  }
};

// React Query hooks
export function useGetTiposUnidadOperativa(consorcio_id: string | number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: tipoUnidadOperativaQueryKeys.list({ consorcio_id }),
    queryFn: () => fetchTiposUnidadOperativaByConsorcio(consorcio_id),
    enabled: !!consorcio_id && (options?.enabled ?? true)
  });
}

export function useCreateTipoUnidadOperativa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tipoUnidadOperativaData: TipoUnidadOperativaCreateData) => createTipoUnidadOperativa(tipoUnidadOperativaData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: tipoUnidadOperativaQueryKeys.list({ consorcio_id: data.consorcio_id }) });
    }
  });
}

export function useUpdateTipoUnidadOperativa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tipoUnidadOperativaId,
      tipoUnidadOperativaData
    }: {
      tipoUnidadOperativaId: number;
      tipoUnidadOperativaData: Partial<TipoUnidadOperativa>;
    }) => updateTipoUnidadOperativa(tipoUnidadOperativaId, tipoUnidadOperativaData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: tipoUnidadOperativaQueryKeys.list({ consorcio_id: data.consorcio_id }) });
    }
  });
}

export function useDeleteTipoUnidadOperativa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tipoUnidadOperativaId: number) => deleteTipoUnidadOperativa(tipoUnidadOperativaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tipoUnidadOperativaQueryKeys.lists() });
    }
  });
}