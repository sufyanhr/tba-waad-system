import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
  FormHelperText,
  CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// third-party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project imports
import MainCard from 'components/MainCard';
import { getEmployerById, updateEmployer } from 'api/employers';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';
import RBACGuard from 'components/tba/RBACGuard';

// ==============================|| EMPLOYER EDIT PAGE ||============================== //

const validationSchema = Yup.object({
  companyId: Yup.number().required('Company is required'),
  employerName: Yup.string().required('Employer name is required').max(255, 'Name too long'),
  employerCode: Yup.string().required('Employer code is required').max(50, 'Code too long'),
  address: Yup.string().max(500, 'Address too long'),
  phone: Yup.string().max(20, 'Phone number too long'),
  email: Yup.string().email('Invalid email').max(255, 'Email too long'),
  status: Yup.string().oneOf(['ACTIVE', 'INACTIVE'], 'Invalid status')
});

export default function EmployerEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [employer, setEmployer] = useState(null);

  const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN');

  useEffect(() => {
    loadEmployer();
  }, [id]);

  const loadEmployer = async () => {
    try {
      setLoading(true);
      const response = await getEmployerById(id);
      const data = response.data?.data || response.data;
      setEmployer(data);
    } catch (error) {
      console.error('Error loading employer:', error);
      enqueueSnackbar('Failed to load employer', { variant: 'error' });
      navigate('/tba/employers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateEmployer(id, values);
      enqueueSnackbar('Employer updated successfully', { variant: 'success' });
      navigate('/tba/employers');
    } catch (error) {
      console.error('Error updating employer:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to update employer', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/tba/employers');
  };

  if (loading) {
    return (
      <MainCard>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  if (!employer) {
    return (
      <MainCard>
        <Typography>Employer not found</Typography>
      </MainCard>
    );
  }

  const initialValues = {
    companyId: employer.companyId || '',
    employerName: employer.employerName || employer.name || '',
    employerCode: employer.employerCode || employer.code || '',
    address: employer.address || '',
    phone: employer.phone || '',
    email: employer.email || '',
    contactPerson: employer.contactPerson || '',
    status: employer.status || 'ACTIVE'
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
            <Typography variant="h3">Edit Employer</Typography>
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
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
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
