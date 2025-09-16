import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// TODO: Create and import setCuentas from 'store/slices/cuenta'
// import { setCuentas } from 'store/slices/cuenta';

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { Cuenta } from 'types/cuenta';

// API response types
interface ApiSuccessResponse {
  success: true;
  result: Cuenta[];
  count: number;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

interface CuentaApiSuccessResponse {
  success: true;
  result: Cuenta;
}

type CuentaCreateData = Omit<Cuenta, 'id'>;

type CuentaApiResponse = CuentaApiSuccessResponse | ApiErrorResponse;

// Query keys
export const cuentaQueryKeys = {
  all: ['cuentas'] as const,
  lists: () => [...cuentaQueryKeys.all, 'list'] as const,
  list: (filters: { consorcio_id: string | number }) => [...cuentaQueryKeys.lists(), filters] as const
};

// API functions
export const fetchCuentasByUser = async (consorcio_id: string | number) => {
  const { data } = await apiClient.post<ApiResponse>('/cuentas/getall', { consorcio_id });
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

export const createCuenta = async (cuentaData: CuentaCreateData) => {
  const { data } = await apiClient.post<CuentaApiResponse>('/cuentas/', cuentaData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const updateCuenta = async (cuentaId: number, cuentaData: Partial<Cuenta>) => {
  const { data } = await apiClient.put<CuentaApiResponse>(`/cuentas/${cuentaId}`, cuentaData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

// React Query hooks
export function useGetCuentas(consorcio_id: string | number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: cuentaQueryKeys.list({ consorcio_id }),
    queryFn: () => fetchCuentasByUser(consorcio_id),
    enabled: !!consorcio_id && (options?.enabled ?? true)
  });
}

export function useCreateCuenta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cuentaData, consorcio_id }: { cuentaData: CuentaCreateData; consorcio_id: string | number }) => createCuenta(cuentaData),
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: cuentaQueryKeys.lists() });
      // TODO: Dispatch setCuentas once the slice is created
      // const updatedCuentas = await fetchCuentasByUser(variables.consorcio_id);
      // dispatch(setCuentas(updatedCuentas));
    }
  });
}

export function useUpdateCuenta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cuentaId, cuentaData }: { cuentaId: number; cuentaData: Partial<Cuenta> }) => updateCuenta(cuentaId, cuentaData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: cuentaQueryKeys.lists() });
      // TODO: Dispatch setCuentas once the slice is created
      // if(variables.cuentaData.consorcio_id){
      //    const updatedCuentas = await fetchCuentasByUser(USER_ID_HERE); // You need to pass the user_id
      //    dispatch(setCuentas(updatedCuentas));
      // }
    }
  });
}
