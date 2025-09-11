import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// utils
import { apiClient } from 'services/api/apiClient';

// types
import { CustomerList } from 'types/customer';

// Define los query keys para una gestión centralizada
const customerQueryKeys = {
  all: ['customers'] as const,
  lists: () => [...customerQueryKeys.all, 'list'] as const,
  list: (filters: string) => [...customerQueryKeys.lists(), { filters }] as const,
  details: () => [...customerQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...customerQueryKeys.details(), id] as const
};

/**
 * Hook para obtener la lista de clientes.
 * Usa useQuery para el fetching, cacheo y estados automáticos.
 */
export function useGetCustomers(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: customerQueryKeys.lists(),
    queryFn: async () => {
      // La ruta es relativa a la baseURL del apiClient, por ejemplo: /customer/list
      const { data } = await apiClient.get<{ customers: CustomerList[] }>('/customer/list');
      return data.customers;
    },
    enabled: options?.enabled ?? true // Habilitado por defecto, pero se puede deshabilitar
  });
}

/**
 * Hook para crear un nuevo cliente.
 * Usa useMutation y invalida la caché de la lista para refrescar los datos.
 */
export function useAddCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newCustomer: Omit<CustomerList, 'id'>) => apiClient.post('/customer/insert', newCustomer), // Asumiendo endpoint POST /customer/insert
    onSuccess: () => {
      // Invalida la query de la lista de clientes para que se vuelva a solicitar
      queryClient.invalidateQueries({ queryKey: customerQueryKeys.lists() });
    }
  });
}

/**
 * Hook para actualizar un cliente existente.
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedCustomer: CustomerList) => apiClient.put(`/customer/update/${updatedCustomer.id}`, updatedCustomer), // Asumiendo endpoint PUT /customer/update/:id
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerQueryKeys.lists() });
    }
  });
}

/**
 * Hook para eliminar un cliente.
 */
export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customerId: number) => apiClient.delete(`/customer/delete/${customerId}`), // Asumiendo endpoint DELETE /customer/delete/:id
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerQueryKeys.lists() });
    }
  });
}
