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
  Tooltip,
  Tab,
  Tabs
} from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import RBACGuard from 'components/tba/RBACGuard';
import axiosServices from 'utils/axios';

// assets
import { SearchOutlined, PlusOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

// ==============================|| PRE-AUTHORIZATIONS LIST ||============================== //

const PreAuthorizationsList = () => {
  const navigate = useNavigate();
  const [preAuths, setPreAuths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchPreAuths();
  }, [statusFilter]);

  const fetchPreAuths = async () => {
    setLoading(true);
    try {
      let url = '/api/pre-authorizations';
      if (statusFilter !== 'ALL') {
        url += `/status/${statusFilter}`;
      }
      const response = await axiosServices.get(url);
      if (response.data.status === 'success') {
        setPreAuths(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching pre-authorizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axiosServices.post(`/api/pre-authorizations/${id}/approve`, {
        approvedBy: 1, // Current user ID
        approvalNotes: 'Approved via UI'
      });
      fetchPreAuths();
    } catch (error) {
      console.error('Error approving pre-auth:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosServices.post(`/api/pre-authorizations/${id}/reject`, {
        rejectedBy: 1, // Current user ID
        rejectionReason: 'Rejected via UI'
      });
      fetchPreAuths();
    } catch (error) {
      console.error('Error rejecting pre-auth:', error);
    }
  };

  const filteredPreAuths = preAuths.filter((preAuth) =>
    preAuth.preAuthNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
    preAuth.memberName?.toLowerCase().includes(searchText.toLowerCase()) ||
    preAuth.providerName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      UNDER_REVIEW: 'info',
      APPROVED: 'success',
      REJECTED: 'error',
      EXPIRED: 'default'
    };
    return colors[status] || 'default';
  };

  return (
    <RBACGuard permission="PREAUTH_VIEW">
      <MainCard
        title="Pre-Authorizations"
        secondary={
          <RBACGuard permission="PREAUTH_MANAGE">
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={() => navigate('/tba/pre-authorizations/create')}
            >
              New Pre-Auth
            </Button>
          </RBACGuard>
        }
      >
        <Stack spacing={2}>
          {/* Status Tabs */}
          <Tabs value={statusFilter} onChange={(e, newValue) => setStatusFilter(newValue)}>
            <Tab label="All" value="ALL" />
            <Tab label="Pending" value="PENDING" />
            <Tab label="Under Review" value="UNDER_REVIEW" />
            <Tab label="Approved" value="APPROVED" />
            <Tab label="Rejected" value="REJECTED" />
          </Tabs>

          {/* Search */}
          <TextField
            placeholder="Search pre-authorizations..."
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
          ) : filteredPreAuths.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No pre-authorizations found
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Pre-Auth #</TableCell>
                    <TableCell>Member</TableCell>
                    <TableCell>Provider</TableCell>
                    <TableCell>Service Date</TableCell>
                    <TableCell>Diagnosis</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Estimated Cost</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPreAuths.map((preAuth) => (
                    <TableRow key={preAuth.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2">{preAuth.preAuthNumber}</Typography>
                      </TableCell>
                      <TableCell>{preAuth.memberName || '-'}</TableCell>
                      <TableCell>{preAuth.providerName || '-'}</TableCell>
                      <TableCell>{preAuth.serviceDate || '-'}</TableCell>
                      <TableCell>{preAuth.diagnosisDescription || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={preAuth.status}
                          color={getStatusColor(preAuth.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{preAuth.estimatedCost || '-'}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/tba/pre-authorizations/${preAuth.id}`)}
                            >
                              <EyeOutlined />
                            </IconButton>
                          </Tooltip>
                          {preAuth.status === 'PENDING' && (
                            <RBACGuard permission="PREAUTH_REVIEW">
                              <>
                                <Tooltip title="Approve">
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => handleApprove(preAuth.id)}
                                  >
                                    <CheckCircleOutlined />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleReject(preAuth.id)}
                                  >
                                    <CloseCircleOutlined />
                                  </IconButton>
                                </Tooltip>
                              </>
                            </RBACGuard>
                          )}
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

export default PreAuthorizationsList;
