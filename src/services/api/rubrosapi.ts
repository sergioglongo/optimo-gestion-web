import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// TODO: Create and import setRubros from 'store/slices/rubro'
// import { setRubros } from 'store/slices/rubro';

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { Rubro } from 'types/rubro';

// API response types
interface ApiSuccessResponse {
  success: true;
  result: Rubro[];
  count: number;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

interface RubroApiSuccessResponse {
  success: true;
  result: Rubro;
}

type RubroCreateData = Omit<Rubro, 'id'>;

type RubroApiResponse = RubroApiSuccessResponse | ApiErrorResponse;

// Query keys
export const rubroQueryKeys = {
  all: ['rubros'] as const,
  lists: () => [...rubroQueryKeys.all, 'list'] as const,
  list: (filters: { consorcio_id: string | number }) => [...rubroQueryKeys.lists(), filters] as const
};

// API functions
export const fetchRubrosByConsorcio = async (consorcio_id: string | number) => {
  const { data } = await apiClient.post<ApiResponse>('/rubros/getall', { consorcio_id });
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

export const createRubro = async (rubroData: RubroCreateData) => {
  const { data } = await apiClient.post<RubroApiResponse>('/rubros/', rubroData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const updateRubro = async (rubroId: number, rubroData: Partial<Rubro>) => {
  const { data } = await apiClient.put<RubroApiResponse>(`/rubros/${rubroId}`, rubroData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const deleteRubro = async (rubroId: number) => {
  const { data } = await apiClient.delete<{ success: boolean; message?: string }>(`/rubros/${rubroId}`);
  if (data.success) {
    return true;
  } else {
    throw new Error(data.message || 'Error deleting rubro');
  }
};

// React Query hooks
export function useGetRubros(consorcio_id: string | number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: rubroQueryKeys.list({ consorcio_id }),
    queryFn: () => fetchRubrosByConsorcio(consorcio_id),
    enabled: !!consorcio_id && (options?.enabled ?? true)
  });
}

export function useCreateRubro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ rubroData, consorcio_id }: { rubroData: RubroCreateData; consorcio_id: string | number }) => createRubro(rubroData),
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: rubroQueryKeys.lists() });
      // TODO: Dispatch setRubros once the slice is created
      // const updatedRubros = await fetchRubrosByConsorcio(variables.consorcio_id);
      // dispatch(setRubros(updatedRubros));
    }
  });
}

export function useUpdateRubro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ rubroId, rubroData }: { rubroId: number; rubroData: Partial<Rubro> }) => updateRubro(rubroId, rubroData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: rubroQueryKeys.lists() });
      // TODO: Dispatch setRubros once the slice is created
    }
  });
}

export function useDeleteRubro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rubroId: number) => deleteRubro(rubroId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rubroQueryKeys.lists() });
    }
  });
}
