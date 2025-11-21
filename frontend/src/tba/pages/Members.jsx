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
