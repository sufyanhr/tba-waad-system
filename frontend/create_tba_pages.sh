#!/bin/bash

# Create Members page
cat > src/tba/pages/Members.jsx << 'EOF'
import { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import DataTable from 'tba/components/DataTable';
import CrudDrawer from 'tba/components/CrudDrawer';
import RBACGuard from 'tba/components/RBACGuard';
import membersApi from 'tba/services/membersApi';
import { useSnackbar } from 'notistack';

const Members = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    memberNumber: '',
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'MALE'
  });

  const columns = [
    { id: 'memberNumber', label: 'Member Number' },
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'dateOfBirth', label: 'Date of Birth' }
  ];

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await membersApi.getAll();
      setMembers(data || []);
    } catch (error) {
      // Mock data
      setMembers([
        { id: 1, memberNumber: 'MEM-001', name: 'Ahmed Ali', email: 'ahmed@example.com', phone: '+966501234567', dateOfBirth: '1990-05-15' },
        { id: 2, memberNumber: 'MEM-002', name: 'Fatima Hassan', email: 'fatima@example.com', phone: '+966502345678', dateOfBirth: '1985-08-22' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingMember(null);
    setFormData({ memberNumber: '', name: '', email: '', phone: '', dateOfBirth: '', gender: 'MALE' });
    setDrawerOpen(true);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      memberNumber: member.memberNumber || '',
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      dateOfBirth: member.dateOfBirth || '',
      gender: member.gender || 'MALE'
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (member) => {
    if (window.confirm(`Delete member ${member.name}?`)) {
      try {
        await membersApi.delete(member.id);
        enqueueSnackbar('Member deleted', { variant: 'success' });
        fetchMembers();
      } catch (error) {
        enqueueSnackbar('Failed to delete member', { variant: 'error' });
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editingMember) {
        await membersApi.update(editingMember.id, formData);
        enqueueSnackbar('Member updated', { variant: 'success' });
      } else {
        await membersApi.create(formData);
        enqueueSnackbar('Member created', { variant: 'success' });
      }
      setDrawerOpen(false);
      fetchMembers();
    } catch (error) {
      enqueueSnackbar('Failed to save member', { variant: 'error' });
    }
  };

  return (
    <RBACGuard permission="members.view">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
            <div />
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
              Add Member
            </Button>
          </Stack>
          <MainCard>
            <DataTable
              title="Members Management"
              columns={columns}
              data={members}
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
        title={editingMember ? 'Edit Member' : 'Add New Member'}
        onSave={handleSave}
      >
        <Stack spacing={3}>
          <TextField label="Member Number" value={formData.memberNumber} onChange={(e) => setFormData({...formData, memberNumber: e.target.value})} fullWidth required />
          <TextField label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} fullWidth required />
          <TextField label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} fullWidth required />
          <TextField label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} fullWidth />
          <TextField label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} fullWidth InputLabelProps={{ shrink: true }} />
        </Stack>
      </CrudDrawer>
    </RBACGuard>
  );
};

export default Members;
EOF

# Create Employers page
cat > src/tba/pages/Employers.jsx << 'EOF'
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
EOF

echo "✅ TBA pages created (Members, Employers)"
