// Mock hook for Claims - Phase F will connect to API
export const useClaims = () => {
  // Static mock data
  const mockData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    claimNumber: `CLM-2025-${String(i + 1).padStart(4, '0')}`,
    memberName: `Member ${i + 1}`,
    employer: `Company ${Math.floor(i / 5) + 1}`,
    insuranceCompany: ['Saudi Insurance', 'Tawuniya', 'AXA', 'Bupa'][i % 4],
    claimAmount: (Math.random() * 10000 + 1000).toFixed(2),
    status: ['Pending', 'Approved', 'Rejected', 'Under Review'][i % 4],
    submissionDate: new Date(2025, 0, (i % 28) + 1).toISOString()
  }));

  return {
    data: mockData,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(mockData)
  };
};

export const useClaimById = (id) => {
  const { data } = useClaims();
  return {
    data: data.find((claim) => claim.id === parseInt(id)),
    isLoading: false,
    error: null
  };
};

export const useCreateClaim = () => {
  return {
    mutate: (newClaim) => {
      console.log('Creating claim (mock):', newClaim);
      return Promise.resolve({ ...newClaim, id: Date.now() });
    },
    isLoading: false
  };
};

export const useUpdateClaim = () => {
  return {
    mutate: (updatedClaim) => {
      console.log('Updating claim (mock):', updatedClaim);
      return Promise.resolve(updatedClaim);
    },
    isLoading: false
  };
};

export const useDeleteClaim = () => {
  return {
    mutate: (id) => {
      console.log('Deleting claim (mock):', id);
      return Promise.resolve({ success: true });
    },
    isLoading: false
  };
};
