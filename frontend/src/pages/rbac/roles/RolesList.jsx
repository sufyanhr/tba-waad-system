import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import PermissionGuard from 'components/auth/PermissionGuard';
import { getRoles, deleteRole } from 'api/rbac';

// assets
import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';

// ==============================|| RBAC - ROLES LIST ||============================== //

const RolesList = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      setError('Failed to load roles: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleDelete = async (id, roleName) => {
    if (window.confirm(`Are you sure you want to delete role "${roleName}"?`)) {
      try {
        await deleteRole(id);
        await loadRoles(); // Refresh the list
      } catch (err) {
        setError('Failed to delete role: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/rbac/roles/${id}/edit`);
  };

  if (loading) {
    return (
      <MainCard>
        <Typography>Loading roles...</Typography>
      </MainCard>
    );
  }

  return (
    <PermissionGuard permissions={['roles.manage']}>
      <MainCard
        title="Roles Management"
        secondary={
          <PermissionGuard permissions={['roles.manage']}>
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={() => navigate('/admin/rbac/roles/create')}
            >
              Add New Role
            </Button>
          </PermissionGuard>
        }
      >
        {error && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Permissions Count</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No roles found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <Typography variant="subtitle2">{role.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {role.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={role.permissions?.length || 0} 
                        variant="outlined" 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <PermissionGuard permissions={['roles.manage']}>
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(role.id)}
                            size="small"
                          >
                            <EditOutlined />
                          </IconButton>
                        </PermissionGuard>
                        <PermissionGuard permissions={['roles.manage']}>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(role.id, role.name)}
                            size="small"
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </PermissionGuard>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>
    </PermissionGuard>
  );
};

export default RolesList;