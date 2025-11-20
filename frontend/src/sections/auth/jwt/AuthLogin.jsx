import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink, useSearchParams, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { preload } from 'swr';
import toast from 'react-hot-toast';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { useAuth } from 'modules/auth/useAuth';
import { login as apiLogin } from 'modules/auth/authService';

import { fetcher } from 'utils/axios';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ isDemo = false }) {
  const [checked, setChecked] = React.useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [searchParams] = useSearchParams();
  const auth = searchParams.get('auth'); // get auth and set route based on that

  return (
    <>
      <Formik
        initialValues={{
          identifier: 'info@codedthemes.com',
          password: '123456',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          identifier: Yup.string()
            .required('Username or Email is required')
            .max(255),
          password: Yup.string()
            .required('Password is required')
            .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
            .max(50, 'Password must be less than 50 characters')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const credentials = { username: values.identifier.trim(), password: values.password };
            const { token, user } = await apiLogin(credentials);
            if (!token || !user) throw new Error('Invalid login response');
            login(token, user); // AuthContext persistence
            toast.success('Login successful');
            setStatus({ success: true });
            setSubmitting(false);
            preload('api/menu/dashboard', fetcher);
            navigate('/dashboard/default');
          } catch (err) {
            console.error(err);
            toast.error(err.message);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="identifier-login">Username or Email</InputLabel>
                  <OutlinedInput
                    id="identifier-login"
                    type="text"
                    value={values.identifier}
                    name="identifier"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter username or email address"
                    fullWidth
                    error={Boolean(touched.identifier && errors.identifier)}
                  />
                </Stack>
                {touched.identifier && errors.identifier && (
                  <FormHelperText error id="standard-weight-helper-text-identifier-login">
                    {errors.identifier}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>
              <Grid sx={{ mt: -1 }} size={12}>
                <Stack direction="row" sx={{ gap: 2, alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Keep me sign in</Typography>}
                  />
                  <Link
                    variant="h6"
                    component={RouterLink}
                    to={isDemo ? '/auth/forgot-password' : auth ? `/${auth}/forgot-password?auth=jwt` : '/forgot-password'}
                    color="text.primary"
                  >
                    Forgot Password?
                  </Link>
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid size={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid size={12}>
                <Paper variant="outlined" sx={{ p:2, mb:2 }}>
                  <Typography variant="subtitle2" gutterBottom>Example Login Payload</Typography>
                  <Box component="pre" sx={{ m:0, fontSize:12, whiteSpace:'pre-wrap' }}>{`{
  "identifier": "admin@example.com",
  "password": "ChangeMe123!"
}`}</Box>
                  <Button size="small" sx={{ mt:1 }} onClick={() => {
                    handleChange({ target: { name:'identifier', value:'admin@example.com' }});
                    handleChange({ target: { name:'password', value:'ChangeMe123!' }});
                    toast('Example data filled');
                  }}>Test Example Data</Button>
                </Paper>
              </Grid>
              <Grid size={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Login
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

AuthLogin.propTypes = { isDemo: PropTypes.bool };
