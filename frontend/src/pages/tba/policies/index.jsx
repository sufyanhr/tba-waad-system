import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import RBACGuard from 'components/tba/RBACGuard';
import axiosServices from 'utils/axios';

// assets
import { SearchOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

// ==============================|| POLICIES LIST ||============================== //

const PoliciesList = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const response = await axiosServices.get('/api/policies');
      if (response.data.status === 'success') {
        setPolicies(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPolicies = policies.filter((policy) =>
    policy.policyNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
    policy.employerName?.toLowerCase().includes(searchText.toLowerCase()) ||
    policy.insuranceCompanyName?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <RBACGuard permission="POLICY_VIEW">
      <MainCard
        title="Policies"
        secondary={
          <RBACGuard permission="POLICY_MANAGE">
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={() => navigate('/tba/policies/create')}
            >
              Add Policy
            </Button>
          </RBACGuard>
        }
      >
        <Stack spacing={2}>
          {/* Search */}
          <TextField
            placeholder="Search policies..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              )
            }}
            sx={{ maxWidth: 400 }}
          />

          {/* Table */}
          {loading ? (
            <Typography>Loading...</Typography>
          ) : filteredPolicies.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No policies found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {searchText ? 'Try adjusting your search' : 'Click "Add Policy" to create your first policy'}
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Policy Number</TableCell>
                    <TableCell>Employer</TableCell>
                    <TableCell>Insurance Company</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Max Members</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPolicies.map((policy) => (
                    <TableRow key={policy.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2">{policy.policyNumber}</Typography>
                      </TableCell>
                      <TableCell>{policy.employerName || '-'}</TableCell>
                      <TableCell>{policy.insuranceCompanyName || '-'}</TableCell>
                      <TableCell>{policy.startDate || '-'}</TableCell>
                      <TableCell>{policy.endDate || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={policy.active ? 'Active' : 'Inactive'}
                          color={policy.active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{policy.maxMembers || '-'}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/tba/policies/${policy.id}`)}
                            >
                              <EyeOutlined />
                            </IconButton>
                          </Tooltip>
                          <RBACGuard permission="POLICY_MANAGE">
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/tba/policies/${policy.id}/edit`)}
                              >
                                <EditOutlined />
                              </IconButton>
                            </Tooltip>
                          </RBACGuard>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </MainCard>
    </RBACGuard>
  );
};

export default PoliciesList;
