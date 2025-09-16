import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useDispatch } from 'react-redux';
// TODO: Create and import setProveedores from 'store/slices/proveedor';

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { Proveedor } from 'types/proveedor';

// API response types
interface ApiSuccessResponse {
  success: true;
  result: Proveedor[];
  count: number;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

interface ProveedorApiSuccessResponse {
  success: true;
  result: Proveedor;
}

type ProveedorCreateData = Omit<Proveedor, 'id'>;

type ProveedorApiResponse = ProveedorApiSuccessResponse | ApiErrorResponse;

// Query keys
export const proveedorQueryKeys = {
  all: ['proveedores'] as const,
  lists: () => [...proveedorQueryKeys.all, 'list'] as const,
  list: (filters: { consorcio_id: string | number }) => [...proveedorQueryKeys.lists(), filters] as const
};

// API functions
export const fetchProveedoresByUser = async (consorcio_id: string | number) => {
  const { data } = await apiClient.post<ApiResponse>('/proveedores/getall', { consorcio_id });
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

export const createProveedor = async (proveedorData: ProveedorCreateData) => {
  const { data } = await apiClient.post<ProveedorApiResponse>('/proveedores/', proveedorData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const updateProveedor = async (proveedorId: number, proveedorData: Partial<Proveedor>) => {
  const { data } = await apiClient.put<ProveedorApiResponse>(`/proveedores/${proveedorId}`, proveedorData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const deleteProveedor = async (proveedorId: number) => {
  const { data } = await apiClient.delete<{ success: boolean; message?: string }>(`/proveedores/${proveedorId}`);
  if (data.success) {
    return true;
  } else {
    throw new Error(data.message || 'Error deleting proveedor');
  }
};

// React Query hooks
export function useGetProveedores(consorcio_id: string | number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: proveedorQueryKeys.list({ consorcio_id }),
    queryFn: () => fetchProveedoresByUser(consorcio_id),
    enabled: !!consorcio_id && (options?.enabled ?? true)
  });
}

export function useCreateProveedor() {
  const queryClient = useQueryClient();
  // const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({ proveedorData, consorcio_id }: { proveedorData: ProveedorCreateData; consorcio_id: string | number }) =>
      createProveedor(proveedorData),
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: proveedorQueryKeys.lists() });
      // TODO: Dispatch setProveedores once the slice is created
      // const updatedProveedores = await fetchProveedoresByUser(variables.usuario_id);
      // dispatch(setProveedores(updatedProveedores));
    }
  });
}

export function useUpdateProveedor() {
  const queryClient = useQueryClient();
  // const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({ proveedorId, proveedorData }: { proveedorId: number; proveedorData: Partial<Proveedor> }) =>
      updateProveedor(proveedorId, proveedorData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: proveedorQueryKeys.lists() });
      // TODO: Dispatch setProveedores once the slice is created
    }
  });
}

export function useDeleteProveedor() {
  const queryClient = useQueryClient();
  // const dispatch = useDispatch();
  return useMutation({
    mutationFn: (proveedorId: number) => deleteProveedor(proveedorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proveedorQueryKeys.lists() });
      // TODO: Dispatch setProveedores once the slice is created
    }
  });
}
