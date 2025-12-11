import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  SafetyOutlined
} from '@ant-design/icons';

import MainCard from 'components/MainCard';
import { useRoles } from '../../hooks/systemadmin/useRoles';
import { openSnackbar } from 'api/snackbar';

// Validation schema
const roleValidationSchema = Yup.object({
  name: Yup.string().required('Role name is required').min(3, 'Min 3 characters'),
  description: Yup.string()
});

export default function RoleManagement() {
  const {
    roles,
    loading,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    getUsersWithRole
  } = useRoles();

  const [openModal, setOpenModal] = useState(false);
  const [openUsersModal, setOpenUsersModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [usersWithRole, setUsersWithRole] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80
    },
    {
      field: 'name',
      headerName: 'Role Name',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <SafetyOutlined style={{ color: '#1890ff' }} />
          <Typography variant="body2" fontWeight={500}>
            {params.row.name}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 300
    },
    {
      field: 'userCount',
      headerName: 'Users',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={`${params.row.userCount || 0} users`}
          size="small"
          color="primary"
          variant="outlined"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}>
              <EditOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Users">
            <IconButton size="small" color="info" onClick={() => handleViewUsers(params.row)}>
              <TeamOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(params.row)}>
              <DeleteOutlined />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  const handleOpenModal = () => {
    setSelectedRole(null);
    setOpenModal(true);
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRole(null);
  };

  const handleViewUsers = async (role) => {
    setSelectedRole(role);
    setOpenUsersModal(true);
    setLoadingUsers(true);
    try {
      const users = await getUsersWithRole(role.id);
      setUsersWithRole(users);
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message || 'Failed to load users',
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleCloseUsersModal = () => {
    setOpenUsersModal(false);
    setSelectedRole(null);
    setUsersWithRole([]);
  };

  const handleOpenDeleteDialog = (role) => {
    setSelectedRole(role);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedRole(null);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (selectedRole) {
        await updateRole(selectedRole.id, values);
        openSnackbar({
          open: true,
          message: 'Role updated successfully',
          variant: 'alert',
          alert: { color: 'success' }
        });
      } else {
        await createRole(values);
        openSnackbar({
          open: true,
          message: 'Role created successfully',
          variant: 'alert',
          alert: { color: 'success' }
        });
      }
      handleCloseModal();
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message || 'Failed to save role',
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRole(selectedRole.id);
      openSnackbar({
        open: true,
        message: 'Role deleted successfully',
        variant: 'alert',
        alert: { color: 'success' }
      });
      handleCloseDeleteDialog();
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message || 'Failed to delete role',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
  };

  return (
    <MainCard
      title="Role Management"
      secondary={
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleOpenModal}>
          Add Role
        </Button>
      }
    >
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={roles}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 20 }
            }
          }}
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none'
            }
          }}
        />
      </Box>

      {/* Create/Edit Role Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedRole ? 'Edit Role' : 'Create Role'}</DialogTitle>
        <Formik
          initialValues={{
            name: selectedRole?.name || '',
            description: selectedRole?.description || ''
          }}
          validationSchema={roleValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={Boolean(touched.name && errors.name)}>
                      <InputLabel>Role Name *</InputLabel>
                      <OutlinedInput
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Role Name *"
                      />
                      {touched.name && errors.name && <FormHelperText>{errors.name}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth error={Boolean(touched.description && errors.description)}>
                      <InputLabel>Description</InputLabel>
                      <OutlinedInput
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Description"
                        multiline
                        rows={3}
                      />
                      {touched.description && errors.description && (
                        <FormHelperText>{errors.description}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>

      {/* View Users Modal */}
      <Dialog open={openUsersModal} onClose={handleCloseUsersModal} maxWidth="sm" fullWidth>
        <DialogTitle>Users with Role: {selectedRole?.name}</DialogTitle>
        <DialogContent>
          {loadingUsers ? (
            <Typography>Loading users...</Typography>
          ) : usersWithRole.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No users assigned to this role
            </Typography>
          ) : (
            <Stack spacing={1}>
              {usersWithRole.map((user) => (
                <Box
                  key={user.id}
                  sx={{
                    p: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body1" fontWeight={500}>
                    {user.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.username} • {user.email}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUsersModal}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete role <strong>{selectedRole?.name}</strong>?
          </Typography>
          {selectedRole?.userCount > 0 && (
            <Typography color="error" sx={{ mt: 1 }}>
              Warning: {selectedRole.userCount} users are currently assigned to this role.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
