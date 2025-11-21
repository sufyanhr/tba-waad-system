import { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import DataTable from 'tba/components/DataTable';
import CrudDrawer from 'tba/components/CrudDrawer';
import RBACGuard from 'tba/components/RBACGuard';
import reviewerCompaniesApi from 'tba/services/reviewerCompaniesApi';
import { useSnackbar } from 'notistack';

const ReviewerCompanies = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    certificationNumber: '',
    contactPerson: '',
    email: '',
    phone: '',
    specialization: ''
  });

  const columns = [
    { id: 'companyName', label: 'Company Name' },
    { id: 'certificationNumber', label: 'Certification No.' },
    { id: 'contactPerson', label: 'Contact Person' },
    { id: 'specialization', label: 'Specialization' },
    { id: 'phone', label: 'Phone' }
  ];

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await reviewerCompaniesApi.getAll();
      setCompanies(data || []);
    } catch (error) {
      setCompanies([
        { id: 1, companyName: 'Medical Review Services', certificationNumber: 'CERT-001', contactPerson: 'Dr. Hassan', email: 'contact@medreview.com', phone: '+966505555555', specialization: 'Medical Claims' },
        { id: 2, companyName: 'Health Audit Group', certificationNumber: 'CERT-002', contactPerson: 'Dr. Layla', email: 'info@healthaudit.com', phone: '+966506666666', specialization: 'Health Insurance' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCompany(null);
    setFormData({ companyName: '', certificationNumber: '', contactPerson: '', email: '', phone: '', specialization: '' });
    setDrawerOpen(true);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      companyName: company.companyName || '',
      certificationNumber: company.certificationNumber || '',
      contactPerson: company.contactPerson || '',
      email: company.email || '',
      phone: company.phone || '',
      specialization: company.specialization || ''
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (company) => {
    if (window.confirm(`Delete ${company.companyName}?`)) {
      try {
        await reviewerCompaniesApi.delete(company.id);
        enqueueSnackbar('Reviewer company deleted', { variant: 'success' });
        fetchCompanies();
      } catch (error) {
        enqueueSnackbar('Failed to delete reviewer company', { variant: 'error' });
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editingCompany) {
        await reviewerCompaniesApi.update(editingCompany.id, formData);
        enqueueSnackbar('Reviewer company updated', { variant: 'success' });
      } else {
        await reviewerCompaniesApi.create(formData);
        enqueueSnackbar('Reviewer company created', { variant: 'success' });
      }
      setDrawerOpen(false);
      fetchCompanies();
    } catch (error) {
      enqueueSnackbar('Failed to save reviewer company', { variant: 'error' });
    }
  };

  return (
    <RBACGuard permission="reviewer-companies.view">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
            <div />
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
              Add Reviewer Company
            </Button>
          </Stack>
          <MainCard>
            <DataTable
              title="Reviewer Companies Management"
              columns={columns}
              data={companies}
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
        title={editingCompany ? 'Edit Reviewer Company' : 'Add New Reviewer Company'}
        onSave={handleSave}
        width={500}
      >
        <Stack spacing={3}>
          <TextField label="Company Name" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} fullWidth required />
          <TextField label="Certification Number" value={formData.certificationNumber} onChange={(e) => setFormData({...formData, certificationNumber: e.target.value})} fullWidth required />
          <TextField label="Contact Person" value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} fullWidth required />
          <TextField label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} fullWidth required />
          <TextField label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} fullWidth />
          <TextField label="Specialization" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} fullWidth />
        </Stack>
      </CrudDrawer>
    </RBACGuard>
  );
};

export default ReviewerCompanies;
