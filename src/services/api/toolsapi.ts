import { useQuery } from '@tanstack/react-query';

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { Provincia, Localidad } from 'types/tools';

// API response types for Provincia
interface ProvinciasApiResponse {
  success: boolean;
  result: Provincia[];
  message?: string;
}

// API response types for Localidad
interface LocalidadesApiResponse {
  success: boolean;
  result: Localidad[];
  message?: string;
}

// Query keys
export const toolsQueryKeys = {
  all: ['tools'] as const,
  provincias: () => [...toolsQueryKeys.all, 'provincias'] as const,
  localidades: (provinciaId: number | string) => [...toolsQueryKeys.all, 'localidades', provinciaId] as const
};

// API functions
export const fetchProvincias = async (): Promise<Provincia[]> => {
  const { data } = await apiClient.get<ProvinciasApiResponse>('/domicilio/provincias');
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message || 'Error al obtener las provincias');
  }
};

export const fetchLocalidadesByProvincia = async (provinciaId: number | string): Promise<Localidad[]> => {
  const { data } = await apiClient.get<LocalidadesApiResponse>(`/domicilio/localidades/${provinciaId}`);
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message || 'Error al obtener las localidades');
  }
};

// React Query hooks
export function useGetProvincias(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: toolsQueryKeys.provincias(),
    queryFn: fetchProvincias,
    staleTime: Infinity // Las provincias no cambian a menudo, se pueden cachear indefinidamente
  });
}

export function useGetLocalidades(provinciaId: number | string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: toolsQueryKeys.localidades(provinciaId),
    queryFn: () => fetchLocalidadesByProvincia(provinciaId),
    // La consulta solo se ejecutará si se proporciona un provinciaId.
    enabled: !!provinciaId && (options?.enabled ?? true)
  });
}
