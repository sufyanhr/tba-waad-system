import { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import DataTable from 'tba/components/DataTable';
import CrudDrawer from 'tba/components/CrudDrawer';
import RBACGuard from 'tba/components/RBACGuard';
import insuranceCompaniesApi from 'tba/services/insuranceCompaniesApi';
import { useSnackbar } from 'notistack';

const InsuranceCompanies = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    licenseNumber: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: ''
  });

  const columns = [
    { id: 'companyName', label: 'Company Name' },
    { id: 'licenseNumber', label: 'License No.' },
    { id: 'contactPerson', label: 'Contact Person' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' }
  ];

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await insuranceCompaniesApi.getAll();
      setCompanies(data || []);
    } catch (error) {
      setCompanies([
        { id: 1, companyName: 'National Insurance', licenseNumber: 'LIC-001', contactPerson: 'Mohammed Ali', email: 'contact@national-ins.com', phone: '+966503333333' },
        { id: 2, companyName: 'Gulf Insurance Co', licenseNumber: 'LIC-002', contactPerson: 'Sara Ahmed', email: 'info@gulf-ins.com', phone: '+966504444444' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCompany(null);
    setFormData({ companyName: '', licenseNumber: '', contactPerson: '', email: '', phone: '', address: '' });
    setDrawerOpen(true);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      companyName: company.companyName || '',
      licenseNumber: company.licenseNumber || '',
      contactPerson: company.contactPerson || '',
      email: company.email || '',
      phone: company.phone || '',
      address: company.address || ''
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (company) => {
    if (window.confirm(`Delete ${company.companyName}?`)) {
      try {
        await insuranceCompaniesApi.delete(company.id);
        enqueueSnackbar('Insurance company deleted', { variant: 'success' });
        fetchCompanies();
      } catch (error) {
        enqueueSnackbar('Failed to delete insurance company', { variant: 'error' });
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editingCompany) {
        await insuranceCompaniesApi.update(editingCompany.id, formData);
        enqueueSnackbar('Insurance company updated', { variant: 'success' });
      } else {
        await insuranceCompaniesApi.create(formData);
        enqueueSnackbar('Insurance company created', { variant: 'success' });
      }
      setDrawerOpen(false);
      fetchCompanies();
    } catch (error) {
      enqueueSnackbar('Failed to save insurance company', { variant: 'error' });
    }
  };

  return (
    <RBACGuard permission="insurance-companies.view">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
            <div />
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
              Add Insurance Company
            </Button>
          </Stack>
          <MainCard>
            <DataTable
              title="Insurance Companies Management"
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
        title={editingCompany ? 'Edit Insurance Company' : 'Add New Insurance Company'}
        onSave={handleSave}
        width={500}
      >
        <Stack spacing={3}>
          <TextField label="Company Name" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} fullWidth required />
          <TextField label="License Number" value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} fullWidth required />
          <TextField label="Contact Person" value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} fullWidth required />
          <TextField label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} fullWidth required />
          <TextField label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} fullWidth />
          <TextField label="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} fullWidth multiline rows={3} />
        </Stack>
      </CrudDrawer>
    </RBACGuard>
  );
};

export default InsuranceCompanies;
