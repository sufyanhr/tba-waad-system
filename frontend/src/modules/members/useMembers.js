import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import membersService from './membersService';

/**
 * Custom React Query hooks for Members
 */

// Query key
const MEMBERS_KEY = 'members';

/**
 * Hook to fetch all members with pagination
 */
export const useGetMembers = (params = {}) => {
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
    queryKey: [MEMBERS_KEY, queryParams],
    queryFn: () => membersService.getAll(queryParams),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to fetch members', { variant: 'error' });
    }
  });
};

/**
 * Hook to fetch single member by ID
 */
export const useGetMember = (id) => {
  const { enqueueSnackbar } = useSnackbar();

  return useQuery({
    queryKey: [MEMBERS_KEY, id],
    queryFn: () => membersService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to fetch member details', { variant: 'error' });
    }
  });
};

/**
 * Hook to fetch member statistics
 */
export const useGetMemberStats = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useQuery({
    queryKey: [MEMBERS_KEY, 'stats'],
    queryFn: () => membersService.getStats(),
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to fetch member statistics', { variant: 'error' });
    }
  });
};

/**
 * Hook to fetch members count
 */
export const useGetMembersCount = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useQuery({
    queryKey: [MEMBERS_KEY, 'count'],
    queryFn: () => membersService.getCount(),
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to fetch members count', { variant: 'error' });
    }
  });
};

/**
 * Hook to create new member
 */
export const useCreateMember = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (memberData) => membersService.create(memberData),
    onSuccess: () => {
      queryClient.invalidateQueries([MEMBERS_KEY]);
      enqueueSnackbar('Member created successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to create member', { variant: 'error' });
    }
  });
};

/**
 * Hook to update existing member
 */
export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ id, data }) => membersService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([MEMBERS_KEY]);
      queryClient.invalidateQueries([MEMBERS_KEY, variables.id]);
      enqueueSnackbar('Member updated successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to update member', { variant: 'error' });
    }
  });
};

/**
 * Hook to delete member
 */
export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (id) => membersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries([MEMBERS_KEY]);
      enqueueSnackbar('Member deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to delete member', { variant: 'error' });
    }
  });
};

/**
 * Hook to search members
 */
export const useSearchMembers = (query) => {
  const { enqueueSnackbar } = useSnackbar();

  return useQuery({
    queryKey: [MEMBERS_KEY, 'search', query],
    queryFn: () => membersService.search(query),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to search members', { variant: 'error' });
    }
  });
};
