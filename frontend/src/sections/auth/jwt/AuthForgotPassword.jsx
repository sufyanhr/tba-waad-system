import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'api/snackbar';

// ============================|| JWT - FORGOT PASSWORD ||============================ //

export default function AuthForgotPassword() {
  const navigate = useNavigate();

  return (
    <>
      <Formik
        initialValues={{
          identifier: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          identifier: Yup.string().max(255).required('Email or Phone is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            // TODO: Connect to backend API later
            // For now, just show success message
            setStatus({ success: true });
            setSubmitting(false);
            
            openSnackbar({
              open: true,
              message: 'Reset code sent! Please check your email or phone.',
              variant: 'alert',
              alert: {
                color: 'success'
              }
            });

            setTimeout(() => {
              navigate('/auth/reset-password', { replace: true });
            }, 1500);
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="identifier-forgot">Email or Phone</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.identifier && errors.identifier)}
                    id="identifier-forgot"
                    type="text"
                    value={values.identifier}
                    name="identifier"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email or phone number"
                  />
                </Stack>
                {touched.identifier && errors.identifier && (
                  <FormHelperText error id="helper-text-identifier-forgot">
                    {errors.identifier}
                  </FormHelperText>
                )}
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12} sx={{ mb: -2 }}>
                <Typography variant="caption">
                  You will receive a reset code via email or SMS.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button 
                    disableElevation 
                    disabled={isSubmitting} 
                    fullWidth 
                    size="large" 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                  >
                    Send Reset Code
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
