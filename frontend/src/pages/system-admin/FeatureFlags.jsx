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
  FlagOutlined
} from '@ant-design/icons';

import MainCard from 'components/MainCard';
import { useFeatureFlags } from '../../hooks/systemadmin/useFeatureFlags';
import { useRoles } from '../../hooks/systemadmin/useRoles';
import { openSnackbar } from 'api/snackbar';

// Validation schema
const featureFlagValidationSchema = Yup.object({
  featureKey: Yup.string().required('Feature key is required').min(3, 'Min 3 characters'),
  featureName: Yup.string().required('Feature name is required'),
  description: Yup.string()
});

export default function FeatureFlags() {
  const {
    featureFlags,
    loading,
    fetchFeatureFlags,
    createFeatureFlag,
    updateFeatureFlag,
    deleteFeatureFlag,
    toggleFeatureFlag
  } = useFeatureFlags();

  const { roles, fetchRoles } = useRoles();

  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState(null);

  useEffect(() => {
    fetchFeatureFlags();
    fetchRoles();
  }, []);

  const columns = [
    {
      field: 'featureKey',
      headerName: 'Feature Key',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <FlagOutlined style={{ color: params.row.enabled ? '#52c41a' : '#d9d9d9' }} />
          <Typography variant="body2" fontWeight={500}>
            {params.row.featureKey}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'featureName',
      headerName: 'Feature Name',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 250
    },
    {
      field: 'enabled',
      headerName: 'Status',
      width: 140,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Switch
            checked={params.row.enabled}
            onChange={() => handleToggle(params.row)}
            size="small"
            color="success"
          />
          <Chip
            label={params.row.enabled ? 'Enabled' : 'Disabled'}
            color={params.row.enabled ? 'success' : 'default'}
            size="small"
          />
        </Stack>
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
            return (
              <Chip key={roleId} label={role?.name || roleId} size="small" color="primary" />
            );
          })}
        </Stack>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}>
              <EditOutlined />
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
    setSelectedFlag(null);
    setOpenModal(true);
  };

  const handleEdit = (flag) => {
    setSelectedFlag(flag);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFlag(null);
  };

  const handleOpenDeleteDialog = (flag) => {
    setSelectedFlag(flag);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedFlag(null);
  };

  const handleToggle = async (flag) => {
    try {
      await toggleFeatureFlag(flag.featureKey, !flag.enabled);
      openSnackbar({
        open: true,
        message: `Feature flag ${!flag.enabled ? 'enabled' : 'disabled'} successfully`,
        variant: 'alert',
        alert: { color: 'success' }
      });
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message || 'Failed to toggle feature flag',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (selectedFlag) {
        await updateFeatureFlag(selectedFlag.featureKey, values);
        openSnackbar({
          open: true,
          message: 'Feature flag updated successfully',
          variant: 'alert',
          alert: { color: 'success' }
        });
      } else {
        await createFeatureFlag(values);
        openSnackbar({
          open: true,
          message: 'Feature flag created successfully',
          variant: 'alert',
          alert: { color: 'success' }
        });
      }
      handleCloseModal();
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message || 'Failed to save feature flag',
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFeatureFlag(selectedFlag.featureKey);
      openSnackbar({
        open: true,
        message: 'Feature flag deleted successfully',
        variant: 'alert',
        alert: { color: 'success' }
      });
      handleCloseDeleteDialog();
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message || 'Failed to delete feature flag',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
  };

  return (
    <MainCard
      title="Feature Flags"
      secondary={
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleOpenModal}>
          Add Feature Flag
        </Button>
      }
    >
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={featureFlags}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.featureKey}
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
        <DialogTitle>{selectedFlag ? 'Edit Feature Flag' : 'Create Feature Flag'}</DialogTitle>
        <Formik
          initialValues={{
            featureKey: selectedFlag?.featureKey || '',
            featureName: selectedFlag?.featureName || '',
            description: selectedFlag?.description || '',
            enabled: selectedFlag?.enabled ?? true,
            allowedRoles: selectedFlag?.allowedRoles || []
          }}
          validationSchema={featureFlagValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={Boolean(touched.featureKey && errors.featureKey)}>
                      <InputLabel>Feature Key *</InputLabel>
                      <OutlinedInput
                        name="featureKey"
                        value={values.featureKey}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Feature Key *"
                        disabled={!!selectedFlag}
                      />
                      {touched.featureKey && errors.featureKey && <FormHelperText>{errors.featureKey}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={Boolean(touched.featureName && errors.featureName)}>
                      <InputLabel>Feature Name *</InputLabel>
                      <OutlinedInput
                        name="featureName"
                        value={values.featureName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Feature Name *"
                      />
                      {touched.featureName && errors.featureName && <FormHelperText>{errors.featureName}</FormHelperText>}
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
                        rows={3}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
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

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.enabled}
                          onChange={(e) => setFieldValue('enabled', e.target.checked)}
                          color="success"
                        />
                      }
                      label="Enabled"
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
            Are you sure you want to delete feature flag <strong>{selectedFlag?.featureKey}</strong>?
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
