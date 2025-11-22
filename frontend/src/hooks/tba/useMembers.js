import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import httpClient from 'api/httpClient';
import { toast } from 'react-hot-toast';

// ==============================|| MEMBERS API ||============================== //

const membersAPI = {
  getAll: () => httpClient.get('/members'),
  getById: (id) => httpClient.get(`/members/${id}`),
  create: (data) => httpClient.post('/members', data),
  update: (id, data) => httpClient.put(`/members/${id}`, data),
  delete: (id) => httpClient.delete(`/members/${id}`)
};

// ==============================|| HOOKS ||============================== //

export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: membersAPI.getAll,
    staleTime: 30000,
    retry: 2
  });
};

export const useMemberById = (id) => {
  return useQuery({
    queryKey: ['member', id],
    queryFn: () => membersAPI.getById(id),
    enabled: !!id,
    staleTime: 30000
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: membersAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member created successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create member';
      toast.error(message);
    }
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => membersAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member updated successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update member';
      toast.error(message);
    }
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: membersAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member deleted successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete member';
      toast.error(message);
    }
  });
};
