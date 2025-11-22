// Mock hook for Visits - Phase F will connect to API
export const useVisits = () => {
  const mockData = Array.from({ length: 60 }, (_, i) => ({
    id: i + 1,
    visitId: `VST-${String(i + 1).padStart(5, '0')}`,
    memberName: `Member ${Math.floor(i / 2) + 1}`,
    providerName: ['King Faisal Hospital', 'Saudi German Hospital', 'Al-Habib Medical', 'Sulaiman Al-Habib'][i % 4],
    visitType: ['Consultation', 'Surgery', 'Emergency', 'Follow-up', 'Lab Test'][i % 5],
    diagnosis: ['Hypertension', 'Diabetes', 'Flu', 'Back Pain', 'Allergy'][i % 5],
    visitDate: new Date(2025, 0, (i % 28) + 1).toISOString(),
    cost: (Math.random() * 5000 + 500).toFixed(2),
    status: ['Completed', 'Pending', 'Cancelled', 'In Progress'][i % 4],
    claimSubmitted: i % 3 === 0 ? 'Yes' : 'No'
  }));

  return {
    data: mockData,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(mockData)
  };
};
