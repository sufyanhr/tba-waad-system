// Mock hook for Reviewer Companies - Phase F will connect to API
export const useReviewerCompanies = () => {
  const mockData = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    reviewerId: `REV-${String(i + 1).padStart(4, '0')}`,
    companyName: `Reviewer Company ${i + 1}`,
    specialization: ['General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Dermatology'][i % 5],
    contactPerson: `Reviewer ${i + 1}`,
    email: `reviewer${i + 1}@company${i + 1}.com`,
    phone: `+966 1${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
    totalReviews: Math.floor(Math.random() * 1000) + 100,
    rating: (Math.random() * 2 + 3).toFixed(1),
    status: i % 5 === 0 ? 'Inactive' : 'Active',
    contractDate: new Date(2024, Math.floor(i / 3), (i % 28) + 1).toISOString()
  }));

  return {
    data: mockData,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(mockData)
  };
};
