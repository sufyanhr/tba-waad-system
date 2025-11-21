import { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField, MenuItem } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import DataTable from 'tba/components/DataTable';
import CrudDrawer from 'tba/components/CrudDrawer';
import RBACGuard from 'tba/components/RBACGuard';
import visitsApi from 'tba/services/visitsApi';
import { useSnackbar } from 'notistack';

const Visits = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [formData, setFormData] = useState({
    visitNumber: '',
    memberName: '',
    providerName: '',
    visitDate: '',
    visitType: 'CONSULTATION',
    diagnosis: '',
    cost: ''
  });

  const columns = [
    { id: 'visitNumber', label: 'Visit Number' },
    { id: 'memberName', label: 'Member' },
    { id: 'providerName', label: 'Provider' },
    { id: 'visitDate', label: 'Visit Date' },
    { id: 'visitType', label: 'Visit Type' },
    {
      id: 'cost',
      label: 'Cost',
      render: (value) => `$${Number(value).toFixed(2)}`
    }
  ];

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const data = await visitsApi.getAll();
      setVisits(data || []);
    } catch (error) {
      setVisits([
        { id: 1, visitNumber: 'VST-001', memberName: 'Ahmed Ali', providerName: 'City Hospital', visitDate: '2025-01-15', visitType: 'CONSULTATION', cost: 150.00 },
        { id: 2, visitNumber: 'VST-002', memberName: 'Fatima Hassan', providerName: 'Medical Center', visitDate: '2025-01-14', visitType: 'EMERGENCY', cost: 450.00 },
        { id: 3, visitNumber: 'VST-003', memberName: 'Omar Abdullah', providerName: 'Dental Clinic', visitDate: '2025-01-13', visitType: 'DENTAL', cost: 200.00 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingVisit(null);
    setFormData({ visitNumber: '', memberName: '', providerName: '', visitDate: '', visitType: 'CONSULTATION', diagnosis: '', cost: '' });
    setDrawerOpen(true);
  };

  const handleEdit = (visit) => {
    setEditingVisit(visit);
    setFormData({
      visitNumber: visit.visitNumber || '',
      memberName: visit.memberName || '',
      providerName: visit.providerName || '',
      visitDate: visit.visitDate || '',
      visitType: visit.visitType || 'CONSULTATION',
      diagnosis: visit.diagnosis || '',
      cost: visit.cost || ''
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (visit) => {
    if (window.confirm(`Delete visit ${visit.visitNumber}?`)) {
      try {
        await visitsApi.delete(visit.id);
        enqueueSnackbar('Visit deleted', { variant: 'success' });
        fetchVisits();
      } catch (error) {
        enqueueSnackbar('Failed to delete visit', { variant: 'error' });
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editingVisit) {
        await visitsApi.update(editingVisit.id, formData);
        enqueueSnackbar('Visit updated', { variant: 'success' });
      } else {
        await visitsApi.create(formData);
        enqueueSnackbar('Visit created', { variant: 'success' });
      }
      setDrawerOpen(false);
      fetchVisits();
    } catch (error) {
      enqueueSnackbar('Failed to save visit', { variant: 'error' });
    }
  };

  return (
    <RBACGuard permission="visits.view">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
            <div />
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
              Add Visit
            </Button>
          </Stack>
          <MainCard>
            <DataTable
              title="Visits Management"
              columns={columns}
              data={visits}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </MainCard>
        </Grid>
      </Grid>

      <CrudDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingVisit ? 'Edit Visit' : 'Add New Visit'}
        onSave={handleSave}
        width={500}
      >
        <Stack spacing={3}>
          <TextField label="Visit Number" value={formData.visitNumber} onChange={(e) => setFormData({...formData, visitNumber: e.target.value})} fullWidth required />
          <TextField label="Member Name" value={formData.memberName} onChange={(e) => setFormData({...formData, memberName: e.target.value})} fullWidth required />
          <TextField label="Provider Name" value={formData.providerName} onChange={(e) => setFormData({...formData, providerName: e.target.value})} fullWidth required />
          <TextField label="Visit Date" type="date" value={formData.visitDate} onChange={(e) => setFormData({...formData, visitDate: e.target.value})} fullWidth required InputLabelProps={{ shrink: true }} />
          <TextField
            label="Visit Type"
            select
            value={formData.visitType}
            onChange={(e) => setFormData({...formData, visitType: e.target.value})}
            fullWidth
            required
          >
            <MenuItem value="CONSULTATION">Consultation</MenuItem>
            <MenuItem value="EMERGENCY">Emergency</MenuItem>
            <MenuItem value="DENTAL">Dental</MenuItem>
            <MenuItem value="SURGERY">Surgery</MenuItem>
            <MenuItem value="FOLLOW_UP">Follow Up</MenuItem>
          </TextField>
          <TextField label="Diagnosis" value={formData.diagnosis} onChange={(e) => setFormData({...formData, diagnosis: e.target.value})} fullWidth multiline rows={3} />
          <TextField label="Cost" type="number" value={formData.cost} onChange={(e) => setFormData({...formData, cost: e.target.value})} fullWidth required />
        </Stack>
      </CrudDrawer>
    </RBACGuard>
  );
};

export default Visits;
