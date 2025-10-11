import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// TODO: Create and import setUnidadesFuncionals from 'store/slices/unidadFuncional'
// import { setUnidadesFuncionals } from 'store/slices/unidadFuncional';

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { unidadFuncional } from 'types/unidadFuncional';

// API response types
interface ApiSuccessResponse {
  success: true;
  result: unidadFuncional[];
  count: number;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

interface unidadFuncionalApiSuccessResponse {
  success: true;
  result: unidadFuncional;
}

type unidadFuncionalCreateData = Omit<unidadFuncional, 'id'>;

type unidadFuncionalApiResponse = unidadFuncionalApiSuccessResponse | ApiErrorResponse;

// Query keys
export const unidadFuncionalQueryKeys = {
  all: ['unidadesFuncionals'] as const,
  lists: () => [...unidadFuncionalQueryKeys.all, 'list'] as const,
  list: (filters: { consorcio_id: string | number; activas?: boolean }) => [...unidadFuncionalQueryKeys.lists(), filters] as const,
  detail: (id: number | string) => [...unidadFuncionalQueryKeys.all, 'detail', id] as const
};

// API functions
export const fetchUnidadesFuncionalsByConsorcio = async (params: { consorcio_id: string | number; activas?: boolean }) => {
  const { data } = await apiClient.post<ApiResponse>('/unidades/getall', params);
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

export const fetchunidadFuncionalById = async (id: number | string) => {
  const { data } = await apiClient.get<unidadFuncionalApiResponse>(`/unidades/${id}`);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const createunidadFuncional = async (unidadFuncionalData: unidadFuncionalCreateData) => {
  const { data } = await apiClient.post<unidadFuncionalApiResponse>('/unidades/', unidadFuncionalData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const updateunidadFuncional = async (unidadFuncionalId: number, unidadFuncionalData: Partial<unidadFuncional>) => {
  const { data } = await apiClient.put<unidadFuncionalApiResponse>(`/unidades/${unidadFuncionalId}`, unidadFuncionalData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const deleteunidadFuncional = async (unidadFuncionalId: number) => {
  const { data } = await apiClient.delete<{ success: boolean; message?: string }>(`/unidades/${unidadFuncionalId}`);
  if (data.success) {
    return true;
  } else {
    throw new Error(data.message || 'Error deleting unidad funcional');
  }
};

// React Query hooks
export function useGetUnidadesFuncionals(params: { consorcio_id: string | number; activas?: boolean }, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: unidadFuncionalQueryKeys.list(params),
    queryFn: () => fetchUnidadesFuncionalsByConsorcio(params),
    enabled: !!params.consorcio_id && (options?.enabled ?? true)
  });
}

export function useGetunidadFuncional(id: number | string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: unidadFuncionalQueryKeys.detail(id),
    queryFn: () => fetchunidadFuncionalById(id),
    enabled: !!id && (options?.enabled ?? true)
  });
}

export function useCreateunidadFuncional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      unidadFuncionalData,
      consorcio_id
    }: {
      unidadFuncionalData: unidadFuncionalCreateData;
      consorcio_id: string | number;
    }) => createunidadFuncional(unidadFuncionalData),

    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: unidadFuncionalQueryKeys.lists() });
      // TODO: Dispatch setUnidadesFuncionals once the slice is created
      // const updatedUnidadesFuncionals = await fetchUnidadesFuncionalsByConsorcio(variables.consorcio_id);
      // dispatch(setUnidadesFuncionals(updatedUnidadesFuncionals));
    }
  });
}

export function useDeleteunidadFuncional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (unidadFuncionalId: number) => deleteunidadFuncional(unidadFuncionalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unidadFuncionalQueryKeys.lists() });
      // TODO: Dispatch setUnidadesFuncionals once the slice is created
    }
  });
}

export function useUpdateunidadFuncional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      unidadFuncionalId,
      unidadFuncionalData
    }: {
      unidadFuncionalId: number;
      unidadFuncionalData: Partial<unidadFuncional>;
    }) => updateunidadFuncional(unidadFuncionalId, unidadFuncionalData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: unidadFuncionalQueryKeys.lists() });
      // TODO: Dispatch setUnidadesFuncionals once the slice is created
      // if(variables.unidadFuncionalData.consorcio_id){
      //    const updatedUnidadesFuncionals = await fetchUnidadesFuncionalsByConsorcio(USER_ID_HERE); // You need to pass the user_id
      //    dispatch(setUnidadesFuncionals(updatedUnidadesFuncionals));
      // }
    }
  });
}
