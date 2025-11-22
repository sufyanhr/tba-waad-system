import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import httpClient from 'api/httpClient';
import { toast } from 'react-hot-toast';

// ==============================|| VISITS API ||============================== //

const visitsAPI = {
  getAll: () => httpClient.get('/visits'),
  getById: (id) => httpClient.get(`/visits/${id}`),
  create: (data) => httpClient.post('/visits', data),
  update: (id, data) => httpClient.put(`/visits/${id}`, data),
  delete: (id) => httpClient.delete(`/visits/${id}`)
};

// ==============================|| HOOKS ||============================== //

export const useVisits = () => {
  return useQuery({
    queryKey: ['visits'],
    queryFn: visitsAPI.getAll,
    staleTime: 30000,
    retry: 2
  });
};

export const useVisitById = (id) => {
  return useQuery({
    queryKey: ['visit', id],
    queryFn: () => visitsAPI.getById(id),
    enabled: !!id,
    staleTime: 30000
  });
};

export const useCreateVisit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: visitsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      toast.success('Visit created successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create visit';
      toast.error(message);
    }
  });
};

export const useUpdateVisit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => visitsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      toast.success('Visit updated successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update visit';
      toast.error(message);
    }
  });
};

export const useDeleteVisit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: visitsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      toast.success('Visit deleted successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete visit';
      toast.error(message);
    }
  });
};
