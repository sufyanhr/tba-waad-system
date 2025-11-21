import { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField, MenuItem } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import DataTable from 'tba/components/DataTable';
import CrudDrawer from 'tba/components/CrudDrawer';
import RBACGuard from 'tba/components/RBACGuard';
import claimsApi from 'tba/services/claimsApi';
import { useSnackbar } from 'notistack';

// ==============================|| CLAIMS PAGE ||============================== //

const Claims = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingClaim, setEditingClaim] = useState(null);
  const [formData, setFormData] = useState({
    claimNumber: '',
    memberName: '',
    claimAmount: '',
    status: 'PENDING',
    submissionDate: '',
    description: ''
  });

  // Table columns configuration
  const columns = [
    { id: 'claimNumber', label: 'Claim Number' },
    { id: 'memberName', label: 'Member' },
    {
      id: 'claimAmount',
      label: 'Amount',
      render: (value) => `$${Number(value).toFixed(2)}`
    },
    {
      id: 'status',
      label: 'Status',
      render: (value) => (
        <span style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 500,
          backgroundColor: value === 'APPROVED' ? '#e8f5e9' : value === 'REJECTED' ? '#ffebee' : '#fff3e0',
          color: value === 'APPROVED' ? '#2e7d32' : value === 'REJECTED' ? '#c62828' : '#e65100'
        }}>
          {value}
        </span>
      )
    },
    { id: 'submissionDate', label: 'Submission Date' }
  ];

  // Load claims
  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const data = await claimsApi.getAll();
      setClaims(data || []);
    } catch (error) {
      enqueueSnackbar('Failed to load claims', { variant: 'error' });
      // Mock data for development
      setClaims([
        {
          id: 1,
          claimNumber: 'CLM-2025-001',
          memberName: 'Ahmed Al-Hassan',
          claimAmount: 1500.00,
          status: 'PENDING',
          submissionDate: '2025-01-15'
        },
        {
          id: 2,
          claimNumber: 'CLM-2025-002',
          memberName: 'Fatima Mohammed',
          claimAmount: 2300.50,
          status: 'APPROVED',
          submissionDate: '2025-01-14'
        },
        {
          id: 3,
          claimNumber: 'CLM-2025-003',
          memberName: 'Omar Abdullah',
          claimAmount: 890.25,
          status: 'REJECTED',
          submissionDate: '2025-01-13'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingClaim(null);
    setFormData({
      claimNumber: '',
      memberName: '',
      claimAmount: '',
      status: 'PENDING',
      submissionDate: '',
      description: ''
    });
    setDrawerOpen(true);
  };

  const handleEdit = (claim) => {
    setEditingClaim(claim);
    setFormData({
      claimNumber: claim.claimNumber || '',
      memberName: claim.memberName || '',
      claimAmount: claim.claimAmount || '',
      status: claim.status || 'PENDING',
      submissionDate: claim.submissionDate || '',
      description: claim.description || ''
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (claim) => {
    if (window.confirm(`Are you sure you want to delete claim ${claim.claimNumber}?`)) {
      try {
        await claimsApi.delete(claim.id);
        enqueueSnackbar('Claim deleted successfully', { variant: 'success' });
        fetchClaims();
      } catch (error) {
        enqueueSnackbar('Failed to delete claim', { variant: 'error' });
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editingClaim) {
        await claimsApi.update(editingClaim.id, formData);
        enqueueSnackbar('Claim updated successfully', { variant: 'success' });
      } else {
        await claimsApi.create(formData);
        enqueueSnackbar('Claim created successfully', { variant: 'success' });
      }
      setDrawerOpen(false);
      fetchClaims();
    } catch (error) {
      enqueueSnackbar('Failed to save claim', { variant: 'error' });
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  return (
    <RBACGuard permission="claims.view">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <div />
            <RBACGuard permission="claims.create">
              <Button
                variant="contained"
                startIcon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Add Claim
              </Button>
            </RBACGuard>
          </Stack>
          
          <MainCard>
            <DataTable
              title="Claims Management"
              columns={columns}
              data={claims}
              loading={loading}
              onEdit={(row) => handleEdit(row)}
              onDelete={(row) => handleDelete(row)}
            />
          </MainCard>
        </Grid>
      </Grid>

      {/* CRUD Drawer */}
      <CrudDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingClaim ? 'Edit Claim' : 'Add New Claim'}
        onSave={handleSave}
        width={500}
      >
        <Stack spacing={3}>
          <TextField
            label="Claim Number"
            value={formData.claimNumber}
            onChange={handleInputChange('claimNumber')}
            fullWidth
            required
          />
          <TextField
            label="Member Name"
            value={formData.memberName}
            onChange={handleInputChange('memberName')}
            fullWidth
            required
          />
          <TextField
            label="Claim Amount"
            type="number"
            value={formData.claimAmount}
            onChange={handleInputChange('claimAmount')}
            fullWidth
            required
          />
          <TextField
            label="Status"
            select
            value={formData.status}
            onChange={handleInputChange('status')}
            fullWidth
            required
          >
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
            <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
          </TextField>
          <TextField
            label="Submission Date"
            type="date"
            value={formData.submissionDate}
            onChange={handleInputChange('submissionDate')}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={handleInputChange('description')}
            fullWidth
            multiline
            rows={4}
          />
        </Stack>
      </CrudDrawer>
    </RBACGuard>
  );
};

export default Claims;
