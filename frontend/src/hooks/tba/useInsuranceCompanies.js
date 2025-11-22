// Mock hook for Insurance Companies - Phase F will connect to API
export const useInsuranceCompanies = () => {
  const companies = [
    'Saudi Insurance', 'Tawuniya', 'AXA', 'Bupa Arabia', 'Medgulf',
    'Al Rajhi Takaful', 'Walaa Insurance', 'SABB Takaful', 'Allianz',
    'Chubb Arabia', 'Solidarity', 'Ace Arabia', 'SALAMA', 'Gulf Union',
    'Al Ahlia', 'United Cooperative', 'Wataniya', 'Arabian Shield', 'Malath'
  ];
  
  const mockData = companies.map((name, i) => ({
    id: i + 1,
    insuranceId: `INS-${String(i + 1).padStart(4, '0')}`,
    companyName: name,
    licenseNumber: `LIC-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
    contactPerson: `Manager ${i + 1}`,
    email: `contact@${name.toLowerCase().replace(/\s+/g, '')}.com`,
    phone: `+966 1${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
    totalMembers: Math.floor(Math.random() * 5000) + 500,
    activePolicies: Math.floor(Math.random() * 100) + 20,
    status: i % 6 === 0 ? 'Inactive' : 'Active',
    contractDate: new Date(2023 + (i % 2), Math.floor(i / 3), (i % 28) + 1).toISOString()
  }));

  return {
    data: mockData,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(mockData)
  };
};
