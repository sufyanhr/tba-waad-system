import { useState, useEffect } from 'react';
import { Box, FormControl, Select, MenuItem, Typography, Chip, Avatar } from '@mui/material';
import { BankOutlined } from '@ant-design/icons';
import useCompany from 'hooks/useCompany';
import useAuth from 'hooks/useAuth';
import axios from 'utils/axios';

// ==============================|| COMPANY SWITCHER ||============================== //

export default function CompanySwitcher() {
  const { user, roles } = useAuth();
  const { selectedCompanyId, setCompany } = useCompany();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is EMPLOYER role
  const isEmployer = roles?.includes('EMPLOYER');
  const isProvider = roles?.includes('PROVIDER');

  useEffect(() => {
    // If EMPLOYER, force their company
    if (isEmployer && user?.companyId) {
      setCompany(user.companyId, user.companyName || 'My Company');
      return;
    }

    // If PROVIDER, no company switching
    if (isProvider) {
      return;
    }

    // Fetch companies for ADMIN/TBA staff
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/companies/all');
        const companiesList = response.data.data || response.data || [];
        setCompanies(companiesList);

        // If no company selected and we have companies, select first one
        if (!selectedCompanyId && companiesList.length > 0) {
          setCompany(companiesList[0].id, companiesList[0].name);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmployer, isProvider, user]);

  // Don't show for EMPLOYER or PROVIDER
  if (isEmployer || isProvider) {
    return null;
  }

  const handleCompanyChange = (event) => {
    const companyId = event.target.value;
    const company = companies.find((c) => c.id === companyId);
    if (company) {
      setCompany(company.id, company.name);
    }
  };

  const getCompanyInitials = (name) => {
    if (!name) return 'C';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <Box sx={{ minWidth: 200, display: 'flex', alignItems: 'center', gap: 1 }}>
        <BankOutlined style={{ fontSize: 20 }} />
        <Typography variant="body2">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth size="small">
        <Select
          value={selectedCompanyId || ''}
          onChange={handleCompanyChange}
          displayEmpty
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }
          }}
          renderValue={(selected) => {
            if (!selected) {
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BankOutlined />
                  <Typography variant="body2">Select Company</Typography>
                </Box>
              );
            }
            const company = companies.find((c) => c.id === selected);
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: 'primary.main' }}>{getCompanyInitials(company?.name)}</Avatar>
                <Typography variant="body2">{company?.name || 'Unknown'}</Typography>
              </Box>
            );
          }}
        >
          {companies.length === 0 ? (
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                No companies available
              </Typography>
            </MenuItem>
          ) : (
            companies.map((company) => (
              <MenuItem key={company.id} value={company.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                  <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: 'primary.light' }}>{getCompanyInitials(company.name)}</Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {company.name}
                    </Typography>
                    {company.code && (
                      <Typography variant="caption" color="text.secondary">
                        {company.code}
                      </Typography>
                    )}
                  </Box>
                  {company.id === selectedCompanyId && <Chip label="Active" size="small" color="primary" />}
                </Box>
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </Box>
  );
}
