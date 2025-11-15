import { useState, useEffect } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import PermissionGuard from 'components/auth/PermissionGuard';
import { getUsers, getRoles, assignRolesToUser } from 'api/rbac';

// assets
import UserOutlined from '@ant-design/icons/UserOutlined';

// ==============================|| RBAC - ASSIGN ROLES TO USERS ||============================== //

const AssignRoles = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [usersData, rolesData] = await Promise.all([
        getUsers(),
        getRoles()
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (err) {
      setError('Failed to load data: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignRoles = (user) => {
    setSelectedUser(user);
    setSelectedRoleIds(user.roles?.map(r => r.id) || []);
    setDialogOpen(true);
  };

  const handleRoleChange = (event) => {
    const value = event.target.value;
    setSelectedRoleIds(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSaveAssignment = async () => {
    if (!selectedUser) return;

    try {
      setSaving(true);
      await assignRolesToUser(selectedUser.id, selectedRoleIds);
      setDialogOpen(false);
      await loadData(); // Refresh the data
    } catch (err) {
      setError('Failed to assign roles: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setSelectedRoleIds([]);
  };

  if (loading) {
    return (
      <MainCard>
        <Typography>Loading users and roles...</Typography>
      </MainCard>
    );
  }

  return (
    <PermissionGuard permissions={['users.assign_roles']}>
      <MainCard title="Assign Roles to Users">
        {error && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Current Roles</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <UserOutlined />
                        <Typography variant="subtitle2">{user.username}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <Chip
                              key={role.id}
                              label={role.name}
                              variant="outlined"
                              size="small"
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No roles assigned
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <PermissionGuard permissions={['users.assign_roles']}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleAssignRoles(user)}
                        >
                          Assign Roles
                        </Button>
                      </PermissionGuard>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Assign Roles Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Assign Roles to {selectedUser?.username}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Roles</InputLabel>
                <Select
                  multiple
                  value={selectedRoleIds}
                  onChange={handleRoleChange}
                  input={<OutlinedInput label="Roles" />}
                  renderValue={(selected) => 
                    roles
                      .filter(r => selected.includes(r.id))
                      .map(r => r.name)
                      .join(', ')
                  }
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      <Checkbox checked={selectedRoleIds.indexOf(role.id) > -1} />
                      <ListItemText 
                        primary={role.name}
                        secondary={role.description}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={saving}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveAssignment} 
              variant="contained"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Assignment'}
            </Button>
          </DialogActions>
        </Dialog>
      </MainCard>
    </PermissionGuard>
  );
};

export default AssignRoles;