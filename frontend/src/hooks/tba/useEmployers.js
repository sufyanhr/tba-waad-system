import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import httpClient from 'api/httpClient';
import { toast } from 'react-hot-toast';

// ==============================|| EMPLOYERS API ||============================== //

const employersAPI = {
  getAll: () => httpClient.get('/employers'),
  getById: (id) => httpClient.get(`/employers/${id}`),
  create: (data) => httpClient.post('/employers', data),
  update: (id, data) => httpClient.put(`/employers/${id}`, data),
  delete: (id) => httpClient.delete(`/employers/${id}`)
};

// ==============================|| HOOKS ||============================== //

export const useEmployers = () => {
  return useQuery({
    queryKey: ['employers'],
    queryFn: employersAPI.getAll,
    staleTime: 30000,
    retry: 2
  });
};

export const useEmployerById = (id) => {
  return useQuery({
    queryKey: ['employer', id],
    queryFn: () => employersAPI.getById(id),
    enabled: !!id,
    staleTime: 30000
  });
};

export const useCreateEmployer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: employersAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employers'] });
      toast.success('Employer created successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create employer';
      toast.error(message);
    }
  });
};

export const useUpdateEmployer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => employersAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employers'] });
      toast.success('Employer updated successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update employer';
      toast.error(message);
    }
  });
};

export const useDeleteEmployer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: employersAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employers'] });
      toast.success('Employer deleted successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete employer';
      toast.error(message);
    }
  });
};
