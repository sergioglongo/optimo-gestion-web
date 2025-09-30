import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setConsorcios } from 'store/slices/consorcio'; // Import setConsorcios

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { Consorcio } from 'types/consorcio';

// Tipos para la respuesta de la API, reflejando los casos de éxito y error.
interface ApiSuccessResponse {
  success: true;
  result: Consorcio[];
  count: number;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

interface ConsorcioApiSuccessResponse {
  success: true;
  result: Consorcio;
}
type ConsorcioCreateData = Omit<Consorcio, 'id'>;

type ConsorcioApiResponse = ConsorcioApiSuccessResponse | ApiErrorResponse;

// Define los query keys para una gestión centralizada y evitar errores de tipeo.
export const consorcioQueryKeys = {
  all: ['consorcios'] as const,
  lists: () => [...consorcioQueryKeys.all, 'list'] as const,
  list: (filters: { usuario_id: string | number }) => [...consorcioQueryKeys.lists(), filters] as const
};

export const fetchConsorciosByUser = async (usuario_id: string | number) => {
  const { data } = await apiClient.post<ApiResponse>('/consorcios/getall', { usuario_id });
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

export const createConsorcio = async (consorcioData: ConsorcioCreateData, imageFile?: File) => {
  const formData = new FormData();

  Object.entries(consorcioData).forEach(([key, value]) => {
    if (key === 'imagen' && imageFile) return;

    if (value === null || value === undefined) return;

    if (key === 'domicilio' && typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      // @ts-ignore
      formData.append(key, value);
    }
  });

  if (imageFile) {
    console.log('Appending imageFile in createConsorcio:', imageFile);
    formData.append('image', imageFile);
  }

  const { data } = await apiClient.post<ConsorcioApiResponse>('/consorcios/', formData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const updateConsorcio = async (consorcioId: number, consorcioData: Consorcio, imageFile?: File) => {
  const formData = new FormData();

  Object.entries(consorcioData).forEach(([key, value]) => {
    if (key === 'imagen' && imageFile) return;

    if (value === null || value === undefined) {
      // For updates, we might want to send null to clear a value.
      // The backend should handle "null" string if necessary.
      // Let's stick to not appending null/undefined for now.
      return;
    }

    if (key === 'domicilio' && typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      // @ts-ignore
      formData.append(key, value);
    }
  });

  if (imageFile) {
    console.log('Appending imageFile in updateConsorcio:', imageFile);
    formData.append('image', imageFile);
  }

  const { data } = await apiClient.put<ConsorcioApiResponse>(`/consorcios/${consorcioId}`, formData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

/**
 * Hook para obtener la lista de consorcios para un usuario específico.
 * @param usuario_id - El ID del usuario para filtrar los consorcios.
 * @param options - Opciones adicionales para el query, como `enabled` para controlar cuándo se ejecuta.
 */
export function useGetConsorcios(usuario_id: string | number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: consorcioQueryKeys.list({ usuario_id }),
    queryFn: () => fetchConsorciosByUser(usuario_id),
    // La consulta solo se ejecutará si se proporciona un `usuario_id`, evitando llamadas innecesarias.
    enabled: !!usuario_id && (options?.enabled ?? true)
  });
}

export function useCreateConsorcio() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({
      consorcioData,
      imageFile,
      usuario_id
    }: {
      consorcioData: ConsorcioCreateData;
      imageFile?: File;
      usuario_id: string | number;
    }) => createConsorcio(consorcioData, imageFile),
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: consorcioQueryKeys.lists() });
      // Fetch the updated list of consorcios using the provided usuario_id
      const updatedConsorcios = await fetchConsorciosByUser(variables.usuario_id);
      // Dispatch the updated list to the Redux store
      dispatch(setConsorcios(updatedConsorcios));
    }
  });
}

export function useUpdateConsorcio() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({
      consorcioId,
      consorcioData,
      imageFile,
      usuario_id
    }: {
      consorcioId: number;
      consorcioData: Consorcio;
      imageFile?: File;
      usuario_id: string | number;
    }) => updateConsorcio(consorcioId, consorcioData, imageFile),
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: consorcioQueryKeys.lists() });
      // Fetch the updated list of consorcios using the provided usuario_id
      const updatedConsorcios = await fetchConsorciosByUser(variables.usuario_id);
      // Dispatch the updated list to the Redux store
      dispatch(setConsorcios(updatedConsorcios));
    }
  });
}
