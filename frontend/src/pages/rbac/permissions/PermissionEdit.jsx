import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import PermissionGuard from 'components/auth/PermissionGuard';
import { getPermission, updatePermission } from 'api/rbac';

// ==============================|| RBAC - PERMISSION EDIT ||============================== //

const PermissionEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    group: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPermission = async () => {
      try {
        setLoadingData(true);
        setError('');
        const data = await getPermission(id);
        setFormData({
          name: data.name || '',
          group: data.group || '',
          description: data.description || ''
        });
      } catch (err) {
        setError('Failed to load permission: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoadingData(false);
      }
    };
    
    loadPermission();
  }, [id]);

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
      await updatePermission(id, formData);
      navigate('/admin/rbac/permissions');
    } catch (err) {
      setError('Failed to update permission: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/rbac/permissions');
  };

  if (loadingData) {
    return (
      <MainCard>
        <Typography>Loading permission data...</Typography>
      </MainCard>
    );
  }

  return (
    <PermissionGuard permissions={['permissions.manage']}>
      <MainCard title={`Edit Permission: ${formData.name}`}>
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
                  {loading ? 'Updating...' : 'Update Permission'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </MainCard>
    </PermissionGuard>
  );
};

export default PermissionEdit;