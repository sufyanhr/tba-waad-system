import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';

import MainCard from 'components/MainCard';
import { usePermissions } from '../../hooks/systemadmin/usePermissions';
import { useRoles } from '../../hooks/systemadmin/useRoles';
import { openSnackbar } from 'api/snackbar';

export default function PermissionMatrix() {
  const { permissionMatrix, loading, fetchPermissionMatrix, bulkAssign, bulkRemove } = usePermissions();
  const { roles, fetchRoles } = useRoles();
  const [matrixState, setMatrixState] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchPermissionMatrix();
    fetchRoles();
  }, []);

  useEffect(() => {
    if (permissionMatrix.length > 0) {
      const initialState = {};
      permissionMatrix.forEach((item) => {
        initialState[item.roleId] = item.permissionMap || {};
      });
      setMatrixState(initialState);
    }
  }, [permissionMatrix]);

  const handleCheckboxChange = (roleId, permission) => {
    setMatrixState((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permission]: !prev[roleId]?.[permission]
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      const promises = [];
      
      permissionMatrix.forEach((item) => {
        const roleId = item.roleId;
        const originalPerms = item.permissionMap || {};
        const newPerms = matrixState[roleId] || {};

        const toAdd = [];
        const toRemove = [];

        Object.keys(newPerms).forEach((perm) => {
          if (newPerms[perm] && !originalPerms[perm]) {
            toAdd.push(perm);
          }
        });

        Object.keys(originalPerms).forEach((perm) => {
          if (originalPerms[perm] && !newPerms[perm]) {
            toRemove.push(perm);
          }
        });

        if (toAdd.length > 0) {
          promises.push(bulkAssign(roleId, toAdd));
        }
        if (toRemove.length > 0) {
          promises.push(bulkRemove(roleId, toRemove));
        }
      });

      await Promise.all(promises);
      
      openSnackbar({
        open: true,
        message: 'Permission matrix saved successfully',
        variant: 'alert',
        alert: { color: 'success' }
      });
      
      setHasChanges(false);
      fetchPermissionMatrix();
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message || 'Failed to save permission matrix',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
  };

  const handleReset = () => {
    const initialState = {};
    permissionMatrix.forEach((item) => {
      initialState[item.roleId] = item.permissionMap || {};
    });
    setMatrixState(initialState);
    setHasChanges(false);
  };

  const allPermissions = permissionMatrix.length > 0 
    ? Object.keys(permissionMatrix[0]?.permissionMap || {})
    : [];

  return (
    <MainCard
      title="Permission Matrix"
      secondary={
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<ReloadOutlined />}
            onClick={handleReset}
            disabled={!hasChanges}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveOutlined />}
            onClick={handleSave}
            disabled={!hasChanges || loading}
          >
            Save Changes
          </Button>
        </Stack>
      }
    >
      {hasChanges && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'warning.lighter', borderRadius: 1 }}>
          <Typography variant="body2" color="warning.dark">
            You have unsaved changes. Click "Save Changes" to apply them.
          </Typography>
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>
                Role / Permission
              </TableCell>
              {allPermissions.map((permission) => (
                <TableCell key={permission} align="center" sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>
                  {permission}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {permissionMatrix.map((item) => {
              const role = roles.find((r) => r.id === item.roleId);
              return (
                <TableRow key={item.roleId} hover>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {role?.name || `Role ${item.roleId}`}
                  </TableCell>
                  {allPermissions.map((permission) => (
                    <TableCell key={permission} align="center">
                      <Checkbox
                        checked={matrixState[item.roleId]?.[permission] || false}
                        onChange={() => handleCheckboxChange(item.roleId, permission)}
                        color="primary"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {permissionMatrix.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No permission data available
          </Typography>
        </Box>
      )}
    </MainCard>
  );
}
