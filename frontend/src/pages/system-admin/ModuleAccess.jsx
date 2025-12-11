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
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
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
  CheckCircleOutlined,
  CloseCircleOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

import MainCard from 'components/MainCard';
import { useModuleAccess } from '../../hooks/systemadmin/useModuleAccess';
import { useRoles } from '../../hooks/systemadmin/useRoles';
import { useFeatureFlags } from '../../hooks/systemadmin/useFeatureFlags';
import { openSnackbar } from 'api/snackbar';

// Validation schema
const moduleValidationSchema = Yup.object({
  moduleKey: Yup.string().required('Module key is required').min(3, 'Min 3 characters'),
  moduleName: Yup.string().required('Module name is required'),
  description: Yup.string()
});

export default function ModuleAccess() {
  const {
    modules,
    loading,
    fetchModules,
    createModule,
    updateModule,
    deleteModule,
    toggleModuleStatus
  } = useModuleAccess();

  const { roles, fetchRoles } = useRoles();
  const { featureFlags, fetchFeatureFlags } = useFeatureFlags();

  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    fetchModules();
    fetchRoles();
    fetchFeatureFlags();
  }, []);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80
    },
    {
      field: 'moduleKey',
      headerName: 'Module Key',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <AppstoreOutlined style={{ color: params.row.active ? '#1890ff' : '#d9d9d9' }} />
          <Typography variant="body2" fontWeight={500}>
            {params.row.moduleKey}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'moduleName',
      headerName: 'Module Name',
      flex: 1,
      minWidth: 180
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 200
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
      field: 'allowedRoles',
      headerName: 'Allowed Roles',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} flexWrap="wrap">
          {params.row.allowedRoles?.map((roleId) => {
            const role = roles.find((r) => r.id === roleId);
            return <Chip key={roleId} label={role?.name || roleId} size="small" color="primary" />;
          })}
        </Stack>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}>
              <EditOutlined />
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
    setSelectedModule(null);
    setOpenModal(true);
  };

  const handleEdit = (module) => {
    setSelectedModule(module);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedModule(null);
  };

  const handleOpenDeleteDialog = (module) => {
    setSelectedModule(module);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedModule(null);
  };

  const handleToggleStatus = async (module) => {
    try {
      await toggleModuleStatus(module.id, !module.active);
      openSnackbar({
        open: true,
        message: `Module ${!module.active ? 'activated' : 'deactivated'} successfully`,
        variant: 'alert',
        alert: { color: 'success' }
      });
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message || 'Failed to toggle module status',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (selectedModule) {
        await updateModule(selectedModule.id, values);
        openSnackbar({
          open: true,
          message: 'Module updated successfully',
          variant: 'alert',
          alert: { color: 'success' }
        });
      } else {
        await createModule(values);
        openSnackbar({
          open: true,
          message: 'Module created successfully',
          variant: 'alert',
          alert: { color: 'success' }
        });
      }
      handleCloseModal();
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message || 'Failed to save module',
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteModule(selectedModule.id);
      openSnackbar({
        open: true,
        message: 'Module deleted successfully',
        variant: 'alert',
        alert: { color: 'success' }
      });
      handleCloseDeleteDialog();
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message || 'Failed to delete module',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
  };

  return (
    <MainCard
      title="Module Access Control"
      secondary={
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleOpenModal}>
          Add Module
        </Button>
      }
    >
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={modules}
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

      {/* Create/Edit Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>{selectedModule ? 'Edit Module' : 'Create Module'}</DialogTitle>
        <Formik
          initialValues={{
            moduleKey: selectedModule?.moduleKey || '',
            moduleName: selectedModule?.moduleName || '',
            description: selectedModule?.description || '',
            allowedRoles: selectedModule?.allowedRoles || [],
            requiredPermissions: selectedModule?.requiredPermissions || [],
            featureFlagKey: selectedModule?.featureFlagKey || '',
            active: selectedModule?.active ?? true
          }}
          validationSchema={moduleValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={Boolean(touched.moduleKey && errors.moduleKey)}>
                      <InputLabel>Module Key *</InputLabel>
                      <OutlinedInput
                        name="moduleKey"
                        value={values.moduleKey}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Module Key *"
                        disabled={!!selectedModule}
                      />
                      {touched.moduleKey && errors.moduleKey && <FormHelperText>{errors.moduleKey}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={Boolean(touched.moduleName && errors.moduleName)}>
                      <InputLabel>Module Name *</InputLabel>
                      <OutlinedInput
                        name="moduleName"
                        value={values.moduleName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Module Name *"
                      />
                      {touched.moduleName && errors.moduleName && <FormHelperText>{errors.moduleName}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Description</InputLabel>
                      <OutlinedInput
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Description"
                        multiline
                        rows={2}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Allowed Roles</InputLabel>
                      <Select
                        multiple
                        value={values.allowedRoles}
                        onChange={(e) => setFieldValue('allowedRoles', e.target.value)}
                        label="Allowed Roles"
                        renderValue={(selected) => (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap">
                            {selected.map((roleId) => {
                              const role = roles.find((r) => r.id === roleId);
                              return <Chip key={roleId} label={role?.name || roleId} size="small" />;
                            })}
                          </Stack>
                        )}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Feature Flag</InputLabel>
                      <Select
                        value={values.featureFlagKey}
                        onChange={(e) => setFieldValue('featureFlagKey', e.target.value)}
                        label="Feature Flag"
                      >
                        <MenuItem value="">None</MenuItem>
                        {featureFlags.map((flag) => (
                          <MenuItem key={flag.featureKey} value={flag.featureKey}>
                            {flag.featureName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.active}
                          onChange={(e) => setFieldValue('active', e.target.checked)}
                          color="success"
                        />
                      }
                      label="Active"
                    />
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete module <strong>{selectedModule?.moduleName}</strong>?
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
