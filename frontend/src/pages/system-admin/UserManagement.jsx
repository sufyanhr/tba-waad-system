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
  TextField,
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
  LockOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

import MainCard from 'components/MainCard';
import { useUsers } from 'hooks/systemadmin/useUsers';
import { useRoles } from 'hooks/systemadmin/useRoles';
import { openSnackbar } from 'api/snackbar';

// Validation schemas
const userValidationSchema = Yup.object({
  username: Yup.string().required('Username is required').min(3, 'Min 3 characters'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  fullName: Yup.string().required('Full name is required'),
  password: Yup.string().when('$isEdit', {
    is: false,
    then: (schema) => schema.required('Password is required').min(8, 'Min 8 characters'),
    otherwise: (schema) => schema
  })
});

const passwordValidationSchema = Yup.object({
  newPassword: Yup.string().required('New password is required').min(8, 'Min 8 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required')
});

export default function UserManagement() {
  const {
    users,
    loading,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    resetPassword,
    assignRoles,
    removeRoles
  } = useUsers();

  const { roles, fetchRoles } = useRoles();

  const [openModal, setOpenModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openRolesModal, setOpenRolesModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20
  });

  useEffect(() => {
    fetchUsers(paginationModel.page, paginationModel.pageSize);
    fetchRoles();
  }, [paginationModel.page, paginationModel.pageSize]);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80
    },
    {
      field: 'username',
      headerName: 'Username',
      flex: 1,
      minWidth: 150
    },
    {
      field: 'fullName',
      headerName: 'Full Name',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'roles',
      headerName: 'Roles',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} flexWrap="wrap">
          {params.row.roles?.map((role) => (
            <Chip key={role} label={role} size="small" color="primary" />
          ))}
        </Stack>
      )
    },
    {
      field: 'active',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.active ? 'Active' : 'Inactive'}
          color={params.row.active ? 'success' : 'default'}
          size="small"
          icon={params.row.active ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
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
          <Tooltip title="Reset Password">
            <IconButton size="small" color="warning" onClick={() => handleOpenPasswordModal(params.row)}>
              <LockOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Manage Roles">
            <IconButton size="small" color="info" onClick={() => handleOpenRolesModal(params.row)}>
              <UserAddOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.active ? 'Deactivate' : 'Activate'}>
            <IconButton
              size="small"
              color={params.row.active ? 'error' : 'success'}
              onClick={() => handleToggleStatus(params.row)}
            >
              {params.row.active ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
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
    setSelectedUser(null);
    setOpenModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const handleOpenPasswordModal = (user) => {
    setSelectedUser(user);
    setOpenPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setOpenPasswordModal(false);
    setSelectedUser(null);
  };

  const handleOpenRolesModal = (user) => {
    setSelectedUser(user);
    setOpenRolesModal(true);
  };

  const handleCloseRolesModal = () => {
    setOpenRolesModal(false);
    setSelectedUser(null);
  };

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, values);
        openSnackbar({
          open: true,
          message: 'User updated successfully',
          variant: 'alert',
          alert: { color: 'success' }
        });
      } else {
        await createUser(values);
        openSnackbar({
          open: true,
          message: 'User created successfully',
          variant: 'alert',
          alert: { color: 'success' }
        });
      }
      handleCloseModal();
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message || 'Failed to save user',
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordReset = async (values, { setSubmitting }) => {
    try {
      await resetPassword(selectedUser.id, values.newPassword);
      openSnackbar({
        open: true,
        message: 'Password reset successfully',
        variant: 'alert',
        alert: { color: 'success' }
      });
      handleClosePasswordModal();
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message || 'Failed to reset password',
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await toggleUserStatus(user.id);
      openSnackbar({
        open: true,
        message: `User ${!user.active ? 'activated' : 'deactivated'} successfully`,
        variant: 'alert',
        alert: { color: 'success' }
      });
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message || 'Failed to toggle user status',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(selectedUser.id);
      openSnackbar({
        open: true,
        message: 'User deleted successfully',
        variant: 'alert',
        alert: { color: 'success' }
      });
      handleCloseDeleteDialog();
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message || 'Failed to delete user',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
  };

  const handleRoleAssign = async (roleIds) => {
    try {
      await assignRoles(selectedUser.id, roleIds);
      openSnackbar({
        open: true,
        message: 'Roles assigned successfully',
        variant: 'alert',
        alert: { color: 'success' }
      });
      handleCloseRolesModal();
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message || 'Failed to assign roles',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
  };

  return (
    <MainCard
      title="User Management"
      secondary={
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleOpenModal}>
          Add User
        </Button>
      }
    >
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          loading={loading}
          pagination
          paginationMode="server"
          rowCount={pagination.total}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 20, 50]}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none'
            }
          }}
        />
      </Box>

      {/* Create/Edit User Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>{selectedUser ? 'Edit User' : 'Create User'}</DialogTitle>
        <Formik
          initialValues={{
            username: selectedUser?.username || '',
            email: selectedUser?.email || '',
            fullName: selectedUser?.fullName || '',
            password: ''
          }}
          validationSchema={userValidationSchema}
          context={{ isEdit: !!selectedUser }}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={Boolean(touched.username && errors.username)}>
                      <InputLabel>Username *</InputLabel>
                      <OutlinedInput
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Username *"
                      />
                      {touched.username && errors.username && <FormHelperText>{errors.username}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth error={Boolean(touched.email && errors.email)}>
                      <InputLabel>Email *</InputLabel>
                      <OutlinedInput
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Email *"
                      />
                      {touched.email && errors.email && <FormHelperText>{errors.email}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth error={Boolean(touched.fullName && errors.fullName)}>
                      <InputLabel>Full Name *</InputLabel>
                      <OutlinedInput
                        name="fullName"
                        value={values.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Full Name *"
                      />
                      {touched.fullName && errors.fullName && <FormHelperText>{errors.fullName}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  {!selectedUser && (
                    <Grid item xs={12}>
                      <FormControl fullWidth error={Boolean(touched.password && errors.password)}>
                        <InputLabel>Password *</InputLabel>
                        <OutlinedInput
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label="Password *"
                          endAdornment={
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            </IconButton>
                          }
                        />
                        {touched.password && errors.password && <FormHelperText>{errors.password}</FormHelperText>}
                      </FormControl>
                    </Grid>
                  )}
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

      {/* Reset Password Modal */}
      <Dialog open={openPasswordModal} onClose={handleClosePasswordModal} maxWidth="sm" fullWidth>
        <DialogTitle>Reset Password</DialogTitle>
        <Formik
          initialValues={{
            newPassword: '',
            confirmPassword: ''
          }}
          validationSchema={passwordValidationSchema}
          onSubmit={handlePasswordReset}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    Resetting password for: <strong>{selectedUser?.username}</strong>
                  </Typography>

                  <FormControl fullWidth error={Boolean(touched.newPassword && errors.newPassword)}>
                    <InputLabel>New Password *</InputLabel>
                    <OutlinedInput
                      name="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={values.newPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="New Password *"
                      endAdornment={
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      }
                    />
                    {touched.newPassword && errors.newPassword && <FormHelperText>{errors.newPassword}</FormHelperText>}
                  </FormControl>

                  <FormControl fullWidth error={Boolean(touched.confirmPassword && errors.confirmPassword)}>
                    <InputLabel>Confirm Password *</InputLabel>
                    <OutlinedInput
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Confirm Password *"
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <FormHelperText>{errors.confirmPassword}</FormHelperText>
                    )}
                  </FormControl>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClosePasswordModal}>Cancel</Button>
                <Button type="submit" variant="contained" color="warning" disabled={isSubmitting}>
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>

      {/* Manage Roles Modal */}
      <Dialog open={openRolesModal} onClose={handleCloseRolesModal} maxWidth="sm" fullWidth>
        <DialogTitle>Manage User Roles</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              User: <strong>{selectedUser?.username}</strong>
            </Typography>
            <Typography variant="body2">Current Roles:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {selectedUser?.roles?.map((role) => (
                <Chip key={role} label={role} color="primary" size="small" />
              ))}
              {selectedUser?.roles?.length === 0 && <Typography variant="body2">No roles assigned</Typography>}
            </Stack>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Available Roles:
            </Typography>
            <Stack spacing={1}>
              {roles.map((role) => (
                <Chip
                  key={role.id}
                  label={role.name}
                  onClick={() => handleRoleAssign([role.id])}
                  color={selectedUser?.roles?.includes(role.name) ? 'primary' : 'default'}
                />
              ))}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRolesModal}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user <strong>{selectedUser?.username}</strong>? This action cannot be undone.
          </Typography>
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
