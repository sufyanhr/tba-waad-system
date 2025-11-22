import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import httpClient from 'api/httpClient';
import { toast } from 'react-hot-toast';

// ==============================|| INSURANCE COMPANIES API ||============================== //

const insuranceCompaniesAPI = {
  getAll: () => httpClient.get('/insurance-companies'),
  getById: (id) => httpClient.get(`/insurance-companies/${id}`),
  create: (data) => httpClient.post('/insurance-companies', data),
  update: (id, data) => httpClient.put(`/insurance-companies/${id}`, data),
  delete: (id) => httpClient.delete(`/insurance-companies/${id}`)
};

// ==============================|| HOOKS ||============================== //

export const useInsuranceCompanies = () => {
  return useQuery({
    queryKey: ['insurance-companies'],
    queryFn: insuranceCompaniesAPI.getAll,
    staleTime: 30000,
    retry: 2
  });
};

export const useInsuranceCompanyById = (id) => {
  return useQuery({
    queryKey: ['insurance-company', id],
    queryFn: () => insuranceCompaniesAPI.getById(id),
    enabled: !!id,
    staleTime: 30000
  });
};

export const useCreateInsuranceCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: insuranceCompaniesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-companies'] });
      toast.success('Insurance company created successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create insurance company';
      toast.error(message);
    }
  });
};

export const useUpdateInsuranceCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => insuranceCompaniesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-companies'] });
      toast.success('Insurance company updated successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update insurance company';
      toast.error(message);
    }
  });
};

export const useDeleteInsuranceCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: insuranceCompaniesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-companies'] });
      toast.success('Insurance company deleted successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete insurance company';
      toast.error(message);
    }
  });
};
