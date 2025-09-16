import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// TODO: Create and import setPersonas from 'store/slices/persona'
// import { setPersonas } from 'store/slices/persona';

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { Persona, PersonaUsuario } from 'types/persona'; // Import PersonaUsuario
// import { Usuario } from 'types/usuario'; // Keep Usuario for updatePersona

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

// type PersonaCreateData = Omit<Persona, 'id'>; // This type might become obsolete or need adjustment

type PersonaApiResponse = PersonaApiSuccessResponse | ApiErrorResponse;

// Query keys
export const personaQueryKeys = {
  all: ['personas'] as const,
  lists: () => [...personaQueryKeys.all, 'list'] as const,
  list: (filters: { consorcio_id: string | number }) => [...personaQueryKeys.lists(), filters] as const
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

// Modified createPersona function
export const createPersona = async (personausuario: PersonaUsuario) => {
  const { data } = await apiClient.post<PersonaApiResponse>('/personas/usuario', personausuario); // Send single object
  if (data.success) {
    return data.result;
  } else {
    throw new Error(data.message);
  }
};

export const updatePersona = async (personausuario: Partial<PersonaUsuario>) => {
  const { data } = await apiClient.put<PersonaApiResponse>(`/personas/${personausuario.id}`, personausuario);
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

export function useCreatePersona() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ personausuario }: { personausuario: PersonaUsuario }) => createPersona(personausuario), // Pass single object
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: personaQueryKeys.lists() });
      // TODO: Dispatch setPersonas once the slice is created
      // const updatedPersonas = await fetchPersonasByConsorcio(variables.consorcio_id);
      // dispatch(setPersonas(updatedPersonas));
    }
  });
}

export function useUpdatePersona() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ personausuario }: { personausuario: PersonaUsuario }) => updatePersona(personausuario),
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
