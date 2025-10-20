import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// TODO: Create and import setPersonas from 'store/slices/persona'
// import { setPersonas } from 'store/slices/persona';

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { Persona, PersonaTipo } from 'types/persona';

// API response types
interface ApiSuccessResponse {
  success: true;
  result: Persona[];
  count: number;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

interface PersonaApiSuccessResponse {
  success: true;
  result: Persona;
}

type PersonaCreateData = Omit<Persona, 'id'>;

type PersonaApiResponse = PersonaApiSuccessResponse | ApiErrorResponse;

interface PersonaTiposApiSuccessResponse {
  success: true;
  result: PersonaTipo[];
}

type PersonaTiposApiResponse = PersonaTiposApiSuccessResponse | ApiErrorResponse;

interface PersonaTipoApiSuccessResponse {
  success: true;
  result: PersonaTipo;
}

type PersonaTipoApiResponse = PersonaTipoApiSuccessResponse | ApiErrorResponse;

// Query keys
export const personaQueryKeys = {
  all: ['personas'] as const,
  lists: () => [...personaQueryKeys.all, 'list'] as const,
  list: (filters: { consorcio_id: string | number }) => [...personaQueryKeys.lists(), filters] as const
};

export const personaTipoQueryKeys = {
  all: ['personaTipos'] as const,
  lists: () => [...personaTipoQueryKeys.all, 'list'] as const,
  details: () => [...personaTipoQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...personaTipoQueryKeys.details(), id] as const
};

// API functions
export const fetchPersonasByConsorcio = async (consorcio_id: string | number) => {
  const { data } = await apiClient.post<ApiResponse>('/personas/getall', { consorcio_id });
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

export const fetchPersonaTipos = async () => {
  const { data } = await apiClient.get<PersonaTiposApiResponse>('/persona-tipos');
  if (data.success) {
    return data.result || [];
  } else {
    throw new Error(data.message);
  }
};

export const fetchPersonaTipoById = async (id: number) => {
  const { data } = await apiClient.get<PersonaTipoApiResponse>(`/persona-tipos/${id}`);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const createPersona = async (personaData: PersonaCreateData) => {
  const { data } = await apiClient.post<PersonaApiResponse>('/personas', personaData);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const updatePersona = async (persona: Partial<Persona>) => {
  const { data } = await apiClient.put<PersonaApiResponse>(`/personas/${persona.id}`, persona);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const deletePersona = async (id: number) => {
  const { data } = await apiClient.delete<PersonaApiResponse>(`/personas/${id}`);
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

// React Query hooks
export function useGetPersonas(consorcio_id: string | number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: personaQueryKeys.list({ consorcio_id }),
    queryFn: () => fetchPersonasByConsorcio(consorcio_id),
    enabled: !!consorcio_id && (options?.enabled ?? true)
  });
}

export function useGetPersonaTipos(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: personaTipoQueryKeys.lists(),
    queryFn: fetchPersonaTipos,
    enabled: options?.enabled ?? true
  });
}

export function useGetPersonaTipoById(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: personaTipoQueryKeys.detail(id),
    queryFn: () => fetchPersonaTipoById(id),
    enabled: !!id && (options?.enabled ?? true)
  });
}

export function useCreatePersona() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ personaData }: { personaData: PersonaCreateData }) => createPersona(personaData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personaQueryKeys.lists() });
    }
  });
}

export function useDeletePersona() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePersona(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personaQueryKeys.lists() });
    }
  });
}

export function useUpdatePersona() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ personausuario }: { personausuario: Partial<Persona> }) => updatePersona(personausuario),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: personaQueryKeys.lists() });
      // TODO: Dispatch setPersonas once the slice is created
      // if(variables.personaData.consorcio_id){
      //    const updatedPersonas = await fetchPersonasByConsorcio(USER_ID_HERE); // You need to pass the user_id
      //    dispatch(setPersonas(updatedPersonas));
      // }
    }
  });
}
