import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

// project imports
import MainCard from 'components/MainCard';
import PermissionGuard from 'components/auth/PermissionGuard';
import { createPermission } from 'api/rbac';

// ==============================|| RBAC - PERMISSION CREATE ||============================== //

const PermissionCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    group: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Permission name is required');
      return;
    }

    if (!formData.group.trim()) {
      setError('Permission group is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await createPermission(formData);
      navigate('/admin/rbac/permissions');
    } catch (err) {
      setError('Failed to create permission: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/rbac/permissions');
  };

  return (
    <PermissionGuard permissions={['permissions.manage']}>
      <MainCard title="Create New Permission">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Permission Name"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., claims.view, users.edit"
                helperText="Use dot notation: module.action"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Group"
                required
                value={formData.group}
                onChange={(e) => handleInputChange('group', e.target.value)}
                placeholder="e.g., claims, members, employers"
                helperText="The module/area this permission belongs to"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of what this permission allows"
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Permission'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </MainCard>
    </PermissionGuard>
  );
};

export default PermissionCreate;