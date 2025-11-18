import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import claimsService from './claimsService';

/**
 * Custom React Query hooks for Claims
 */

// Query key
const CLAIMS_KEY = 'claims';

/**
 * Hook to fetch all claims with pagination
 */
export const useGetClaims = (params = {}) => {
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
    queryKey: [CLAIMS_KEY, queryParams],
    queryFn: () => claimsService.getAll(queryParams),
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000, // 3 minutes
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to fetch claims', { variant: 'error' });
    }
  });
};

/**
 * Hook to fetch single claim by ID
 */
export const useGetClaim = (id) => {
  const { enqueueSnackbar } = useSnackbar();

  return useQuery({
    queryKey: [CLAIMS_KEY, id],
    queryFn: () => claimsService.getById(id),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to fetch claim details', { variant: 'error' });
    }
  });
};

/**
 * Hook to fetch claim statistics
 */
export const useGetClaimStats = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useQuery({
    queryKey: [CLAIMS_KEY, 'stats'],
    queryFn: () => claimsService.getStats(),
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to fetch claim statistics', { variant: 'error' });
    }
  });
};

/**
 * Hook to fetch pending claims
 */
export const useGetPendingClaims = (params = {}) => {
  const { enqueueSnackbar } = useSnackbar();

  return useQuery({
    queryKey: [CLAIMS_KEY, 'pending', params],
    queryFn: () => claimsService.getPending(params),
    staleTime: 2 * 60 * 1000,
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to fetch pending claims', { variant: 'error' });
    }
  });
};

/**
 * Hook to create new claim
 */
export const useCreateClaim = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (claimData) => claimsService.create(claimData),
    onSuccess: () => {
      queryClient.invalidateQueries([CLAIMS_KEY]);
      enqueueSnackbar('Claim submitted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to submit claim', { variant: 'error' });
    }
  });
};

/**
 * Hook to update existing claim
 */
export const useUpdateClaim = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ id, data }) => claimsService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([CLAIMS_KEY]);
      queryClient.invalidateQueries([CLAIMS_KEY, variables.id]);
      enqueueSnackbar('Claim updated successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to update claim', { variant: 'error' });
    }
  });
};

/**
 * Hook to approve claim
 */
export const useApproveClaim = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ id, data }) => claimsService.approve(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([CLAIMS_KEY]);
      queryClient.invalidateQueries([CLAIMS_KEY, variables.id]);
      enqueueSnackbar('Claim approved successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to approve claim', { variant: 'error' });
    }
  });
};

/**
 * Hook to reject claim
 */
export const useRejectClaim = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ id, data }) => claimsService.reject(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([CLAIMS_KEY]);
      queryClient.invalidateQueries([CLAIMS_KEY, variables.id]);
      enqueueSnackbar('Claim rejected', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to reject claim', { variant: 'error' });
    }
  });
};

/**
 * Hook to delete claim
 */
export const useDeleteClaim = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (id) => claimsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries([CLAIMS_KEY]);
      enqueueSnackbar('Claim deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to delete claim', { variant: 'error' });
    }
  });
};
