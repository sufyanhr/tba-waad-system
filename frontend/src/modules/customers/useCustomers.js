import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import customersService from './customersService';

/**
 * Custom React Query hooks for Customers
 */

// Query key
const CUSTOMERS_KEY = 'customers';

/**
 * Hook to fetch all customers with pagination
 */
export const useGetCustomers = (params = {}) => {
  const { enqueueSnackbar } = useSnackbar();

  const {
    page = 0,
    size = 10,
    sortBy,
    sortOrder,
    ...filters
  } = params;

  const queryParams = {
    page,
    size,
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
    ...filters
  };

  return useQuery({
    queryKey: [CUSTOMERS_KEY, queryParams],
    queryFn: () => customersService.getAll(queryParams),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to fetch customers', { variant: 'error' });
    }
  });
};

/**
 * Hook to fetch single customer by ID
 */
export const useGetCustomer = (id) => {
  const { enqueueSnackbar } = useSnackbar();

  return useQuery({
    queryKey: [CUSTOMERS_KEY, id],
    queryFn: () => customersService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to fetch customer details', { variant: 'error' });
    }
  });
};

/**
 * Hook to fetch customer statistics
 */
export const useGetCustomerStats = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useQuery({
    queryKey: [CUSTOMERS_KEY, 'stats'],
    queryFn: () => customersService.getStats(),
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to fetch customer statistics', { variant: 'error' });
    }
  });
};

/**
 * Hook to create new customer
 */
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (customerData) => customersService.create(customerData),
    onSuccess: () => {
      queryClient.invalidateQueries([CUSTOMERS_KEY]);
      enqueueSnackbar('Customer created successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to create customer', { variant: 'error' });
    }
  });
};

/**
 * Hook to update existing customer
 */
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ id, data }) => customersService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([CUSTOMERS_KEY]);
      queryClient.invalidateQueries([CUSTOMERS_KEY, variables.id]);
      enqueueSnackbar('Customer updated successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to update customer', { variant: 'error' });
    }
  });
};

/**
 * Hook to delete customer
 */
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (id) => customersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries([CUSTOMERS_KEY]);
      enqueueSnackbar('Customer deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to delete customer', { variant: 'error' });
    }
  });
};
