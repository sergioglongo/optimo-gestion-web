import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { PagoProveedor, PagoProveedorCreateData } from 'types/pagoProveedor';

// API response types
interface ApiSuccessResponse {
  success: true;
  result: PagoProveedor[];
  count: number;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

interface PagoProveedorApiSuccessResponse {
  success: true;
  result: PagoProveedor;
}

type PagoProveedorApiResponse = PagoProveedorApiSuccessResponse | ApiErrorResponse;

// Query keys
export const pagoProveedorQueryKeys = {
  all: ['pagosProveedores'] as const,
  lists: () => [...pagoProveedorQueryKeys.all, 'list'] as const,
  list: (filters: { consorcio_id: string | number }) => [...pagoProveedorQueryKeys.lists(), filters] as const,
  detail: (id: number | string) => [...pagoProveedorQueryKeys.all, 'detail', id] as const
};

// API functions
export const fetchPagosProveedores = async (consorcio_id: string | number) => {
  // Assuming an endpoint similar to others, e.g., /pagos-proveedores/getall
  const { data } = await apiClient.post<ApiResponse>('/pagos-proveedores/getall', { consorcio_id });
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

export const fetchPagoProveedorById = async (pagoId: number | string) => {
  const { data } = await apiClient.get<PagoProveedorApiResponse>(`/pagos-proveedores/${pagoId}`);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const createPagoProveedor = async (pagoData: PagoProveedorCreateData, usuario_id: number | string) => {
  const body = { ...pagoData, usuario_id };
  const { data } = await apiClient.post<PagoProveedorApiResponse>('/pagos-proveedores/', body);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const updatePagoProveedor = async (pagoId: number, pagoData: Partial<PagoProveedor>, usuario_id: number | string) => {
  const body = { ...pagoData, usuario_id };
  const { data } = await apiClient.put<PagoProveedorApiResponse>(`/pagos-proveedores/${pagoId}`, body);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const deletePagoProveedor = async (pagoId: number) => {
  const { data } = await apiClient.delete<{ success: boolean; message?: string }>(`/pagos-proveedores/${pagoId}`);
  if (data.success) {
    return true;
  } else {
    throw new Error(data.message || 'Error al eliminar el pago al proveedor');
  }
};

// React Query hooks
export function useGetPagosProveedores(consorcio_id: string | number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: pagoProveedorQueryKeys.list({ consorcio_id }),
    queryFn: () => fetchPagosProveedores(consorcio_id),
    enabled: !!consorcio_id && (options?.enabled ?? true)
  });
}

export function useGetPagoProveedor(pagoId: number | string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: pagoProveedorQueryKeys.detail(pagoId),
    queryFn: () => fetchPagoProveedorById(pagoId),
    enabled: !!pagoId && (options?.enabled ?? true)
  });
}

export function useCreatePagoProveedor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pagoData, usuario_id }: { pagoData: PagoProveedorCreateData; usuario_id: number | string }) =>
      createPagoProveedor(pagoData, usuario_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pagoProveedorQueryKeys.lists() });
    }
  });
}

export function useUpdatePagoProveedor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pagoId, pagoData, usuario_id }: { pagoId: number; pagoData: Partial<PagoProveedor>; usuario_id: number | string }) =>
      updatePagoProveedor(pagoId, pagoData, usuario_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pagoProveedorQueryKeys.lists() });
    }
  });
}

export function useDeletePagoProveedor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pagoId: number) => deletePagoProveedor(pagoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pagoProveedorQueryKeys.lists() });
    }
  });
}
