import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import httpClient from 'api/httpClient';
import { toast } from 'react-hot-toast';

// ==============================|| CLAIMS API ||============================== //

const claimsAPI = {
  getAll: () => httpClient.get('/claims'),
  getById: (id) => httpClient.get(`/claims/${id}`),
  create: (data) => httpClient.post('/claims', data),
  update: (id, data) => httpClient.put(`/claims/${id}`, data),
  delete: (id) => httpClient.delete(`/claims/${id}`),
  uploadAttachment: (id, formData) => 
    httpClient.post(`/claims/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};

// ==============================|| HOOKS ||============================== //

export const useClaims = () => {
  return useQuery({
    queryKey: ['claims'],
    queryFn: claimsAPI.getAll,
    staleTime: 30000, // 30 seconds
    retry: 2
  });
};

export const useClaimById = (id) => {
  return useQuery({
    queryKey: ['claim', id],
    queryFn: () => claimsAPI.getById(id),
    enabled: !!id,
    staleTime: 30000
  });
};

export const useCreateClaim = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: claimsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast.success('Claim created successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create claim';
      toast.error(message);
    }
  });
};

export const useUpdateClaim = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => claimsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast.success('Claim updated successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update claim';
      toast.error(message);
    }
  });
};

export const useDeleteClaim = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: claimsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast.success('Claim deleted successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete claim';
      toast.error(message);
    }
  });
};

export const useUploadClaimAttachment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, formData }) => claimsAPI.uploadAttachment(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast.success('Attachment uploaded successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to upload attachment';
      toast.error(message);
    }
  });
};
