import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import httpClient from 'api/httpClient';
import { toast } from 'react-hot-toast';

// ==============================|| REVIEWER COMPANIES API ||============================== //

const reviewerCompaniesAPI = {
  getAll: () => httpClient.get('/reviewer-companies'),
  getById: (id) => httpClient.get(`/reviewer-companies/${id}`),
  create: (data) => httpClient.post('/reviewer-companies', data),
  update: (id, data) => httpClient.put(`/reviewer-companies/${id}`, data),
  delete: (id) => httpClient.delete(`/reviewer-companies/${id}`)
};

// ==============================|| HOOKS ||============================== //

export const useReviewerCompanies = () => {
  return useQuery({
    queryKey: ['reviewer-companies'],
    queryFn: reviewerCompaniesAPI.getAll,
    staleTime: 30000,
    retry: 2
  });
};

export const useReviewerCompanyById = (id) => {
  return useQuery({
    queryKey: ['reviewer-company', id],
    queryFn: () => reviewerCompaniesAPI.getById(id),
    enabled: !!id,
    staleTime: 30000
  });
};

export const useCreateReviewerCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reviewerCompaniesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewer-companies'] });
      toast.success('Reviewer company created successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create reviewer company';
      toast.error(message);
    }
  });
};

export const useUpdateReviewerCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => reviewerCompaniesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewer-companies'] });
      toast.success('Reviewer company updated successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update reviewer company';
      toast.error(message);
    }
  });
};

export const useDeleteReviewerCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reviewerCompaniesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewer-companies'] });
      toast.success('Reviewer company deleted successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete reviewer company';
      toast.error(message);
    }
  });
};
