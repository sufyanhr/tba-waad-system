// Mock hook for Employers - Phase F will connect to API
export const useEmployers = () => {
  const mockData = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    employerId: `EMP-${String(i + 1).padStart(4, '0')}`,
    companyName: `Company ${i + 1}`,
    industry: ['Healthcare', 'Technology', 'Finance', 'Retail', 'Manufacturing'][i % 5],
    contactPerson: `Contact ${i + 1}`,
    email: `contact${i + 1}@company${i + 1}.com`,
    phone: `+966 1${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
    totalEmployees: Math.floor(Math.random() * 500) + 50,
    status: i % 4 === 0 ? 'Inactive' : 'Active',
    contractDate: new Date(2024, Math.floor(i / 3), (i % 28) + 1).toISOString()
  }));

  return {
    data: mockData,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(mockData)
  };
};
