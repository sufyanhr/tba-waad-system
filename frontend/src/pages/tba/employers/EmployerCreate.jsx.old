import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// third-party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project imports
import MainCard from 'components/MainCard';
import { createEmployer } from 'api/employers';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';
import RBACGuard from 'components/tba/RBACGuard';

// ==============================|| EMPLOYER CREATE PAGE ||============================== //

const validationSchema = Yup.object({
  companyId: Yup.number().required('Company is required'),
  employerName: Yup.string().required('Employer name is required').max(255, 'Name too long'),
  employerCode: Yup.string().required('Employer code is required').max(50, 'Code too long'),
  address: Yup.string().max(500, 'Address too long'),
  phone: Yup.string().max(20, 'Phone number too long'),
  email: Yup.string().email('Invalid email').max(255, 'Email too long'),
  status: Yup.string().oneOf(['ACTIVE', 'INACTIVE'], 'Invalid status')
});

export default function EmployerCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN');

  const initialValues = {
    companyId: isSuperAdmin ? '' : (user?.companyId || ''),
    employerName: '',
    employerCode: '',
    address: '',
    phone: '',
    email: '',
    contactPerson: '',
    status: 'ACTIVE'
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await createEmployer(values);
      enqueueSnackbar('Employer created successfully', { variant: 'success' });
      navigate('/tba/employers');
    } catch (error) {
      console.error('Error creating employer:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to create employer', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/tba/employers');
  };

  return (
    <RBACGuard requiredPermissions={['MANAGE_EMPLOYERS']}>
      <MainCard
        title={
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleCancel}
              variant="text"
            >
              Back
            </Button>
            <Typography variant="h3">Create Employer</Typography>
          </Stack>
        }
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={touched.companyId && Boolean(errors.companyId)}>
                    <InputLabel>Company *</InputLabel>
                    <Select
                      name="companyId"
                      value={values.companyId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Company *"
                      disabled={!isSuperAdmin}
                    >
                      <MenuItem value="">Select Company</MenuItem>
                      <MenuItem value="1">Company 1</MenuItem>
                      <MenuItem value="2">Company 2</MenuItem>
                      {/* TODO: Load companies dynamically */}
                    </Select>
                    {touched.companyId && errors.companyId && (
                      <FormHelperText>{errors.companyId}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Employer Name *"
                    name="employerName"
                    value={values.employerName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.employerName && Boolean(errors.employerName)}
                    helperText={touched.employerName && errors.employerName}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Employer Code *"
                    name="employerCode"
                    value={values.employerCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.employerCode && Boolean(errors.employerCode)}
                    helperText={touched.employerCode && errors.employerCode}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Person"
                    name="contactPerson"
                    value={values.contactPerson}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Address"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Status"
                    >
                      <MenuItem value="ACTIVE">Active</MenuItem>
                      <MenuItem value="INACTIVE">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Employer'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </MainCard>
    </RBACGuard>
  );
}
