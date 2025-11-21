import { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import DataTable from 'tba/components/DataTable';
import CrudDrawer from 'tba/components/CrudDrawer';
import RBACGuard from 'tba/components/RBACGuard';
import employersApi from 'tba/services/employersApi';
import { useSnackbar } from 'notistack';

const Employers = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEmployer, setEditingEmployer] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: ''
  });

  const columns = [
    { id: 'companyName', label: 'Company Name' },
    { id: 'registrationNumber', label: 'Registration No.' },
    { id: 'contactPerson', label: 'Contact Person' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' }
  ];

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    setLoading(true);
    try {
      const data = await employersApi.getAll();
      setEmployers(data || []);
    } catch (error) {
      setEmployers([
        { id: 1, companyName: 'Tech Corp', registrationNumber: 'REG-001', contactPerson: 'John Doe', email: 'john@techcorp.com', phone: '+966501111111' },
        { id: 2, companyName: 'Health Services Inc', registrationNumber: 'REG-002', contactPerson: 'Jane Smith', email: 'jane@health.com', phone: '+966502222222' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingEmployer(null);
    setFormData({ companyName: '', registrationNumber: '', contactPerson: '', email: '', phone: '', address: '' });
    setDrawerOpen(true);
  };

  const handleEdit = (employer) => {
    setEditingEmployer(employer);
    setFormData({
      companyName: employer.companyName || '',
      registrationNumber: employer.registrationNumber || '',
      contactPerson: employer.contactPerson || '',
      email: employer.email || '',
      phone: employer.phone || '',
      address: employer.address || ''
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (employer) => {
    if (window.confirm(`Delete employer ${employer.companyName}?`)) {
      try {
        await employersApi.delete(employer.id);
        enqueueSnackbar('Employer deleted', { variant: 'success' });
        fetchEmployers();
      } catch (error) {
        enqueueSnackbar('Failed to delete employer', { variant: 'error' });
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editingEmployer) {
        await employersApi.update(editingEmployer.id, formData);
        enqueueSnackbar('Employer updated', { variant: 'success' });
      } else {
        await employersApi.create(formData);
        enqueueSnackbar('Employer created', { variant: 'success' });
      }
      setDrawerOpen(false);
      fetchEmployers();
    } catch (error) {
      enqueueSnackbar('Failed to save employer', { variant: 'error' });
    }
  };

  return (
    <RBACGuard permission="employers.view">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
            <div />
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
              Add Employer
            </Button>
          </Stack>
          <MainCard>
            <DataTable
              title="Employers Management"
              columns={columns}
              data={employers}
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
        title={editingEmployer ? 'Edit Employer' : 'Add New Employer'}
        onSave={handleSave}
        width={500}
      >
        <Stack spacing={3}>
          <TextField label="Company Name" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} fullWidth required />
          <TextField label="Registration Number" value={formData.registrationNumber} onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})} fullWidth required />
          <TextField label="Contact Person" value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} fullWidth required />
          <TextField label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} fullWidth required />
          <TextField label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} fullWidth />
          <TextField label="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} fullWidth multiline rows={3} />
        </Stack>
      </CrudDrawer>
    </RBACGuard>
  );
};

export default Employers;
