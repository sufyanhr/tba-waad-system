import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import PermissionGuard from 'components/auth/PermissionGuard';
import { getRole, updateRole, getPermissions } from 'api/rbac';

// ==============================|| RBAC - ROLE EDIT ||============================== //

const RoleEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissionIds: []
  });
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        setError('');
        
        const [roleData, permissionsData] = await Promise.all([
          getRole(id),
          getPermissions()
        ]);
        
        setFormData({
          name: roleData.name || '',
          description: roleData.description || '',
          permissionIds: roleData.permissions?.map(p => p.id) || []
        });
        setPermissions(permissionsData);
      } catch (err) {
        setError('Failed to load role data: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoadingData(false);
      }
    };
    
    loadData();
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePermissionChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      permissionIds: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Role name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await updateRole(id, formData);
      navigate('/admin/rbac/roles');
    } catch (err) {
      setError('Failed to update role: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/rbac/roles');
  };

  if (loadingData) {
    return (
      <MainCard>
        <Typography>Loading role data...</Typography>
      </MainCard>
    );
  }

  return (
    <PermissionGuard permissions={['roles.manage']}>
      <MainCard title={`Edit Role: ${formData.name}`}>
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
                label="Role Name"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Admin, Manager, User"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of this role"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Permissions</InputLabel>
                <Select
                  multiple
                  value={formData.permissionIds}
                  onChange={handlePermissionChange}
                  input={<OutlinedInput label="Permissions" />}
                  renderValue={(selected) => 
                    permissions
                      .filter(p => selected.includes(p.id))
                      .map(p => p.name)
                      .join(', ')
                  }
                >
                  {permissions.map((permission) => (
                    <MenuItem key={permission.id} value={permission.id}>
                      <Checkbox checked={formData.permissionIds.indexOf(permission.id) > -1} />
                      <ListItemText 
                        primary={permission.name}
                        secondary={permission.group ? `${permission.group} - ${permission.description || ''}` : permission.description}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                  {loading ? 'Updating...' : 'Update Role'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </MainCard>
    </PermissionGuard>
  );
};

export default RoleEdit;