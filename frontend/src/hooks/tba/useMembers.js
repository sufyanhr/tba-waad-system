// Mock hook for Members - Phase F will connect to API
export const useMembers = () => {
  const mockData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    memberId: `MEM-${String(i + 1).padStart(5, '0')}`,
    name: `Member ${i + 1}`,
    email: `member${i + 1}@example.com`,
    phone: `+966 5${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    employer: `Company ${Math.floor(i / 5) + 1}`,
    insurancePlan: ['Gold', 'Silver', 'Platinum', 'Basic'][i % 4],
    status: i % 3 === 0 ? 'Inactive' : 'Active',
    joinDate: new Date(2024, Math.floor(i / 4), (i % 28) + 1).toISOString()
  }));

  return {
    data: mockData,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(mockData)
  };
};

export const useMemberById = (id) => {
  const { data } = useMembers();
  return {
    data: data.find((member) => member.id === parseInt(id)),
    isLoading: false,
    error: null
  };
};
