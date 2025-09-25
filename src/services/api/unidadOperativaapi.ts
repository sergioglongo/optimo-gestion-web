import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// TODO: Create and import setUnidadesOperativas from 'store/slices/unidadOperativa'
// import { setUnidadesOperativas } from 'store/slices/unidadOperativa';

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { UnidadOperativa } from 'types/unidadOperativa';

// API response types
interface ApiSuccessResponse {
  success: true;
  result: UnidadOperativa[];
  count: number;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

interface UnidadOperativaApiSuccessResponse {
  success: true;
  result: UnidadOperativa;
}

type UnidadOperativaCreateData = Omit<UnidadOperativa, 'id'>;

type UnidadOperativaApiResponse = UnidadOperativaApiSuccessResponse | ApiErrorResponse;

// Query keys
export const unidadOperativaQueryKeys = {
  all: ['unidadesOperativas'] as const,
  lists: () => [...unidadOperativaQueryKeys.all, 'list'] as const,
  list: (filters: { consorcio_id: string | number }) => [...unidadOperativaQueryKeys.lists(), filters] as const,
  detail: (id: number | string) => [...unidadOperativaQueryKeys.all, 'detail', id] as const
};

// API functions
export const fetchUnidadesOperativasByConsorcio = async (consorcio_id: string | number) => {
  const { data } = await apiClient.post<ApiResponse>('/unidades/getall', { consorcio_id });
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

export const fetchUnidadOperativaById = async (id: number | string) => {
  const { data } = await apiClient.get<UnidadOperativaApiResponse>(`/unidades/${id}`);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const createUnidadOperativa = async (unidadOperativaData: UnidadOperativaCreateData) => {
  const { data } = await apiClient.post<UnidadOperativaApiResponse>('/unidades/', unidadOperativaData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const updateUnidadOperativa = async (unidadOperativaId: number, unidadOperativaData: Partial<UnidadOperativa>) => {
  const { data } = await apiClient.put<UnidadOperativaApiResponse>(`/unidades/${unidadOperativaId}`, unidadOperativaData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const deleteUnidadOperativa = async (unidadOperativaId: number) => {
  const { data } = await apiClient.delete<{ success: boolean; message?: string }>(`/unidades/${unidadOperativaId}`);
  if (data.success) {
    return true;
  } else {
    throw new Error(data.message || 'Error deleting unidad operativa');
  }
};

// React Query hooks
export function useGetUnidadesOperativas(consorcio_id: string | number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: unidadOperativaQueryKeys.list({ consorcio_id }),
    queryFn: () => fetchUnidadesOperativasByConsorcio(consorcio_id),
    enabled: !!consorcio_id && (options?.enabled ?? true)
  });
}

export function useGetUnidadOperativa(id: number | string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: unidadOperativaQueryKeys.detail(id),
    queryFn: () => fetchUnidadOperativaById(id),
    enabled: !!id && (options?.enabled ?? true)
  });
}

export function useCreateUnidadOperativa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      unidadOperativaData,
      consorcio_id
    }: {
      unidadOperativaData: UnidadOperativaCreateData;
      consorcio_id: string | number;
    }) => createUnidadOperativa(unidadOperativaData),

    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: unidadOperativaQueryKeys.lists() });
      // TODO: Dispatch setUnidadesOperativas once the slice is created
      // const updatedUnidadesOperativas = await fetchUnidadesOperativasByConsorcio(variables.consorcio_id);
      // dispatch(setUnidadesOperativas(updatedUnidadesOperativas));
    }
  });
}

export function useDeleteUnidadOperativa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (unidadOperativaId: number) => deleteUnidadOperativa(unidadOperativaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unidadOperativaQueryKeys.lists() });
      // TODO: Dispatch setUnidadesOperativas once the slice is created
    }
  });
}

export function useUpdateUnidadOperativa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      unidadOperativaId,
      unidadOperativaData
    }: {
      unidadOperativaId: number;
      unidadOperativaData: Partial<UnidadOperativa>;
    }) => updateUnidadOperativa(unidadOperativaId, unidadOperativaData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: unidadOperativaQueryKeys.lists() });
      // TODO: Dispatch setUnidadesOperativas once the slice is created
      // if(variables.unidadOperativaData.consorcio_id){
      //    const updatedUnidadesOperativas = await fetchUnidadesOperativasByConsorcio(USER_ID_HERE); // You need to pass the user_id
      //    dispatch(setUnidadesOperativas(updatedUnidadesOperativas));
      // }
    }
  });
}
