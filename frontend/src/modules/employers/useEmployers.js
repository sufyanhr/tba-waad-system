import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import employersService from './employersService';

/**
 * Custom React Query hooks for Employers
 */

// Query key
const EMPLOYERS_KEY = 'employers';

/**
 * Hook to fetch all employers with pagination
 */
export const useGetEmployers = (params = {}) => {
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
    queryKey: [EMPLOYERS_KEY, queryParams],
    queryFn: () => employersService.getAll(queryParams),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to fetch employers', { variant: 'error' });
    }
  });
};

/**
 * Hook to fetch single employer by ID
 */
export const useGetEmployer = (id) => {
  const { enqueueSnackbar } = useSnackbar();

  return useQuery({
    queryKey: [EMPLOYERS_KEY, id],
    queryFn: () => employersService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to fetch employer details', { variant: 'error' });
    }
  });
};

/**
 * Hook to fetch employers count
 */
export const useGetEmployersCount = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useQuery({
    queryKey: [EMPLOYERS_KEY, 'count'],
    queryFn: () => employersService.getCount(),
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to fetch employers count', { variant: 'error' });
    }
  });
};

/**
 * Hook to fetch employer's employees
 */
export const useGetEmployerEmployees = (employerId, params = {}) => {
  const { enqueueSnackbar } = useSnackbar();

  return useQuery({
    queryKey: [EMPLOYERS_KEY, employerId, 'employees', params],
    queryFn: () => employersService.getEmployees(employerId, params),
    enabled: !!employerId,
    staleTime: 3 * 60 * 1000,
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to fetch employees', { variant: 'error' });
    }
  });
};

/**
 * Hook to create new employer
 */
export const useCreateEmployer = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (employerData) => employersService.create(employerData),
    onSuccess: () => {
      queryClient.invalidateQueries([EMPLOYERS_KEY]);
      enqueueSnackbar('Employer created successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to create employer', { variant: 'error' });
    }
  });
};

/**
 * Hook to update existing employer
 */
export const useUpdateEmployer = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ id, data }) => employersService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([EMPLOYERS_KEY]);
      queryClient.invalidateQueries([EMPLOYERS_KEY, variables.id]);
      enqueueSnackbar('Employer updated successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to update employer', { variant: 'error' });
    }
  });
};

/**
 * Hook to delete employer
 */
export const useDeleteEmployer = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (id) => employersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries([EMPLOYERS_KEY]);
      enqueueSnackbar('Employer deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to delete employer', { variant: 'error' });
    }
  });
};
