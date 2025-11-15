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
import { getPermissions } from 'api/rbac';

// assets
import EditOutlined from '@ant-design/icons/EditOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';

// ==============================|| RBAC - PERMISSIONS LIST ||============================== //

const PermissionsList = () => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPermissions = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getPermissions();
      setPermissions(data);
    } catch (err) {
      setError('Failed to load permissions: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/rbac/permissions/${id}/edit`);
  };

  const getGroupColor = (group) => {
    const colors = {
      'claims': 'primary',
      'members': 'secondary',
      'employers': 'success',
      'providers': 'warning',
      'admin': 'error',
      'rbac': 'info',
      'finance': 'default'
    };
    return colors[group?.toLowerCase()] || 'default';
  };

  if (loading) {
    return (
      <MainCard>
        <Typography>Loading permissions...</Typography>
      </MainCard>
    );
  }

  return (
    <PermissionGuard permissions={['permissions.manage']}>
      <MainCard
        title="Permissions Management"
        secondary={
          <PermissionGuard permissions={['permissions.manage']}>
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={() => navigate('/admin/rbac/permissions/create')}
            >
              Add Permission
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
                <TableCell>Group</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No permissions found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell>
                      <Typography variant="subtitle2">{permission.name}</Typography>
                    </TableCell>
                    <TableCell>
                      {permission.group ? (
                        <Chip 
                          label={permission.group} 
                          color={getGroupColor(permission.group)}
                          variant="outlined" 
                          size="small" 
                        />
                      ) : (
                        <Typography variant="body2" color="textSecondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {permission.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <PermissionGuard permissions={['permissions.manage']}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(permission.id)}
                          size="small"
                        >
                          <EditOutlined />
                        </IconButton>
                      </PermissionGuard>
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

export default PermissionsList;