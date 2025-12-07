import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Box, Button, FormControlLabel, Grid, MenuItem, Stack, Switch, TextField, Alert } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon, Business as BusinessIcon } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import ModernPageHeader from 'components/tba/ModernPageHeader';
import * as employersService from 'services/employers.service';

const COMPANIES = [
  { id: 1, name: 'الشركة الليبية للأسمنت', nameEn: 'Libyan Cement Company' },
  { id: 2, name: 'منطقة جليانة', nameEn: 'Jlyana District' },
  { id: 3, name: 'مصلحة الجمارك', nameEn: 'Customs Authority' },
  { id: 4, name: 'مصرف الوحدة', nameEn: 'Al-Wahda Bank' },
  { id: 5, name: 'شركة وعد لإدارة النفقات الطبية', nameEn: 'Waad Medical Expenses Management' }
];

const emptyEmployer = {
  companyId: '',
  name: '',
  nameEn: '',
  companyCode: '',
  phone: '',
  email: '',
  address: '',
  active: true
};

const EmployerCreate = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [employer, setEmployer] = useState(emptyEmployer);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setEmployer((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!employer.companyId) newErrors.companyId = intl.formatMessage({ id: 'required' });
    if (!employer.name) newErrors.name = intl.formatMessage({ id: 'required' });
    if (!employer.nameEn) newErrors.nameEn = intl.formatMessage({ id: 'required' });
    if (!employer.companyCode) newErrors.companyCode = intl.formatMessage({ id: 'required' });
    if (employer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employer.email)) {
      newErrors.email = intl.formatMessage({ id: 'email-invalid' });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSaving(true);
      await employersService.createEmployer(employer);
      navigate('/employers');
    } catch (err) {
      console.error('Failed to create employer', err);
      alert(intl.formatMessage({ id: 'error' }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ModernPageHeader
        title={intl.formatMessage({ id: 'employer-create-title' })}
        icon={BusinessIcon}
        breadcrumbs={[
          { label: intl.formatMessage({ id: 'employers-list' }), path: '/employers' },
          { label: intl.formatMessage({ id: 'add-employer' }), path: '/employers/create' }
        ]}
        actions={
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/employers')} variant="outlined">
            {intl.formatMessage({ id: 'back' })}
          </Button>
        }
      />

      <MainCard>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            {/* Company Selection */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                required
                label={intl.formatMessage({ id: 'select-company' })}
                value={employer.companyId}
                onChange={handleChange('companyId')}
                error={Boolean(errors.companyId)}
                helperText={errors.companyId}
              >
                {COMPANIES.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Employer Code */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label={intl.formatMessage({ id: 'employer-code' })}
                value={employer.companyCode}
                onChange={handleChange('companyCode')}
                error={Boolean(errors.companyCode)}
                helperText={errors.companyCode}
              />
            </Grid>

            {/* Arabic Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label={intl.formatMessage({ id: 'employer-name-ar' })}
                value={employer.name}
                onChange={handleChange('name')}
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
            </Grid>

            {/* English Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label={intl.formatMessage({ id: 'employer-name-en' })}
                value={employer.nameEn}
                onChange={handleChange('nameEn')}
                error={Boolean(errors.nameEn)}
                helperText={errors.nameEn}
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={intl.formatMessage({ id: 'Phone' })}
                value={employer.phone}
                onChange={handleChange('phone')}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={intl.formatMessage({ id: 'Email' })}
                type="email"
                value={employer.email}
                onChange={handleChange('email')}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={intl.formatMessage({ id: 'Address' })}
                value={employer.address}
                onChange={handleChange('address')}
                multiline
                rows={3}
              />
            </Grid>

            {/* Active Status */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={employer.active} onChange={handleChange('active')} color="success" />}
                label={intl.formatMessage({ id: 'Active' })}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => navigate('/employers')} disabled={saving}>
                  {intl.formatMessage({ id: 'Cancel' })}
                </Button>
                <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={saving}>
                  {saving ? intl.formatMessage({ id: 'loading' }) : intl.formatMessage({ id: 'Save' })}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </MainCard>
    </>
  );
};

export default EmployerCreate;
