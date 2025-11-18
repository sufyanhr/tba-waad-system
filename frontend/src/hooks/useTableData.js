import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

/**
 * Custom hook for table data management with React Query
 * @param {string} queryKey - Unique key for the query (e.g., 'users', 'members')
 * @param {object} api - API service object with getAll, create, update, delete methods
 * @param {object} options - Additional options
 */
export const useTableData = (queryKey, api, options = {}) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const {
    page = 0,
    size = 10,
    sortBy,
    sortOrder,
    filters = {},
    onSuccess,
    onError
  } = options;

  // Build query params
  const params = {
    page,
    size,
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
    ...filters
  };

  // Fetch all data
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: [queryKey, params],
    queryFn: () => api.getAll(params),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to fetch data', { variant: 'error' });
      if (onError) onError(error);
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (newData) => api.create(newData),
    onSuccess: (data) => {
      queryClient.invalidateQueries([queryKey]);
      enqueueSnackbar('Created successfully', { variant: 'success' });
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to create', { variant: 'error' });
      if (onError) onError(error);
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries([queryKey]);
      enqueueSnackbar('Updated successfully', { variant: 'success' });
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to update', { variant: 'error' });
      if (onError) onError(error);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries([queryKey]);
      enqueueSnackbar('Deleted successfully', { variant: 'success' });
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to delete', { variant: 'error' });
      if (onError) onError(error);
    }
  });

  return {
    // Data
    data: data?.content || [],
    totalElements: data?.totalElements || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.number || 0,
    pageSize: data?.size || size,
    
    // Loading states
    isLoading,
    isFetching,
    isError,
    error,
    
    // Actions
    refetch,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
    
    // Mutation states
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading
  };
};

/**
 * Custom hook for single item details
 * @param {string} queryKey - Base query key
 * @param {number|string} id - Item ID
 * @param {object} api - API service object
 */
export const useItemDetails = (queryKey, id, api, options = {}) => {
  const { enqueueSnackbar } = useSnackbar();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: [queryKey, id],
    queryFn: () => api.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to fetch details', { variant: 'error' });
      if (options.onError) options.onError(error);
    }
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch
  };
};

export default useTableData;
