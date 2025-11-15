import { useState, useEffect } from 'react';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';

// project imports
import MainCard from 'components/MainCard';
import PermissionGuard from 'components/auth/PermissionGuard';
import { getRoles, getPermissions, assignPermissionsToRole } from 'api/rbac';

// ==============================|| RBAC - ASSIGN PERMISSIONS TO ROLES ||============================== //

const AssignPermissions = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        const [rolesData, permissionsData] = await Promise.all([
          getRoles(),
          getPermissions()
        ]);
        setRoles(rolesData);
        setPermissions(permissionsData);
      } catch (err) {
        setError('Failed to load data: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRoleChange = (event) => {
    const roleId = event.target.value;
    setSelectedRoleId(roleId);
    setSuccess('');
    
    // Pre-select permissions that the role already has
    if (roleId) {
      const selectedRole = roles.find(r => r.id === roleId);
      setSelectedPermissionIds(selectedRole?.permissions?.map(p => p.id) || []);
    } else {
      setSelectedPermissionIds([]);
    }
  };

  const handlePermissionChange = (event) => {
    const value = event.target.value;
    setSelectedPermissionIds(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSave = async () => {
    if (!selectedRoleId) {
      setError('Please select a role first');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await assignPermissionsToRole(selectedRoleId, selectedPermissionIds);
      setSuccess('Permissions assigned successfully!');
      
      // Refresh roles data to show updated permissions
      const rolesData = await getRoles();
      setRoles(rolesData);
      
    } catch (err) {
      setError('Failed to assign permissions: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const selectedRole = roles.find(r => r.id === selectedRoleId);
  
  // Group permissions by their group field
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const group = permission.group || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(permission);
    return acc;
  }, {});

  if (loading) {
    return (
      <MainCard>
        <Typography>Loading roles and permissions...</Typography>
      </MainCard>
    );
  }

  return (
    <PermissionGuard permissions={['roles.assign_permissions']}>
      <MainCard title="Assign Permissions to Roles">
        <Grid container spacing={3}>
          {(error || success) && (
            <Grid item xs={12}>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Role</InputLabel>
              <Select
                value={selectedRoleId}
                onChange={handleRoleChange}
                input={<OutlinedInput label="Select Role" />}
              >
                <MenuItem value="">
                  <em>Choose a role...</em>
                </MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                    {role.description && ` - ${role.description}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {selectedRole && (
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Current Role Info
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Role: {selectedRole.name}
                  </Typography>
                  {selectedRole.description && (
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Description: {selectedRole.description}
                    </Typography>
                  )}
                  <Typography variant="body2" color="textSecondary">
                    Current Permissions: {selectedRole.permissions?.length || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {selectedRoleId && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Assign Permissions
              </Typography>
              
              {Object.entries(groupedPermissions).map(([group, groupPermissions]) => (
                <Box key={group} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    <Chip label={group} color="primary" variant="outlined" size="small" />
                  </Typography>
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <Select
                      multiple
                      value={selectedPermissionIds.filter(id => 
                        groupPermissions.some(p => p.id === id)
                      )}
                      onChange={handlePermissionChange}
                      input={<OutlinedInput />}
                      renderValue={(selected) => 
                        groupPermissions
                          .filter(p => selected.includes(p.id))
                          .map(p => p.name)
                          .join(', ')
                      }
                    >
                      {groupPermissions.map((permission) => (
                        <MenuItem key={permission.id} value={permission.id}>
                          <Checkbox checked={selectedPermissionIds.indexOf(permission.id) > -1} />
                          <ListItemText 
                            primary={permission.name}
                            secondary={permission.description}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              ))}

              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Permission Assignment'}
                </Button>
              </Stack>
            </Grid>
          )}

          {!selectedRoleId && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="textSecondary">
                  Please select a role to manage its permissions
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </MainCard>
    </PermissionGuard>
  );
};

export default AssignPermissions;