import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Box, Button, CircularProgress, FormControlLabel, Grid, MenuItem, Stack, Switch, TextField, Alert } from '@mui/material';
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

const EmployerEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const intl = useIntl();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [employer, setEmployer] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadEmployer = async () => {
      try {
        setLoading(true);
        const data = await employersService.getEmployerById(id);
        setEmployer(data);
      } catch (err) {
        console.error('Failed to load employer', err);
        alert(intl.formatMessage({ id: 'error' }));
      } finally {
        setLoading(false);
      }
    };
    loadEmployer();
  }, [id, intl]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setEmployer((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!employer.companyId) newErrors.companyId = intl.formatMessage({ id: 'required' });
    if (!employer.name) newErrors.name = intl.formatMessage({ id: 'required' });
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
      await employersService.updateEmployer(id, employer);
      alert('تم تحديث جهة العمل بنجاح');
      navigate('/employers');
    } catch (err) {
      console.error('Failed to update employer', err);
      alert('حدث خطأ أثناء تحديث جهة العمل');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <ModernPageHeader
          title={intl.formatMessage({ id: 'edit-employer' })}
          breadcrumbs={[
            { title: intl.formatMessage({ id: 'employers' }), to: '/employers' },
            { title: intl.formatMessage({ id: 'edit-employer' }) }
          ]}
          onBack={() => navigate('/employers')}
        />
        <MainCard>
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 300 }}>
            <CircularProgress />
          </Stack>
        </MainCard>
      </>
    );
  }

  if (!employer) {
    return (
      <>
        <ModernPageHeader
          title={intl.formatMessage({ id: 'edit-employer' })}
          breadcrumbs={[
            { title: intl.formatMessage({ id: 'employers' }), to: '/employers' },
            { title: intl.formatMessage({ id: 'edit-employer' }) }
          ]}
          onBack={() => navigate('/employers')}
        />
        <MainCard>
          <Typography color="error">{intl.formatMessage({ id: 'employer-not-found' })}</Typography>
        </MainCard>
      </>
    );
  }

  return (
    <>
      <ModernPageHeader
        title={intl.formatMessage({ id: 'edit-employer' })}
        breadcrumbs={[
          { title: intl.formatMessage({ id: 'employers' }), to: '/employers' },
          { title: intl.formatMessage({ id: 'edit-employer' }) }
        ]}
        onBack={() => navigate('/employers')}
      />
      <MainCard>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                required
                label={intl.formatMessage({ id: 'company' })}
                value={employer.companyId || ''}
                onChange={handleChange('companyId')}
                error={Boolean(errors.companyId)}
                helperText={errors.companyId}
                size="small"
              >
                {COMPANIES.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label={intl.formatMessage({ id: 'employer-name' })}
                value={employer.name || ''}
                onChange={handleChange('name')}
                error={Boolean(errors.name)}
                helperText={errors.name}
                size="small"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label={intl.formatMessage({ id: 'employer-code' })}
                value={employer.companyCode || ''}
                onChange={handleChange('companyCode')}
                error={Boolean(errors.companyCode)}
                helperText={errors.companyCode}
                size="small"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={intl.formatMessage({ id: 'phone' })}
                value={employer.phone || ''}
                onChange={handleChange('phone')}
                error={Boolean(errors.phone)}
                helperText={errors.phone}
                size="small"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={intl.formatMessage({ id: 'email' })}
                type="email"
                value={employer.email || ''}
                onChange={handleChange('email')}
                error={Boolean(errors.email)}
                helperText={errors.email}
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={intl.formatMessage({ id: 'address' })}
                value={employer.address || ''}
                onChange={handleChange('address')}
                multiline
                rows={2}
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={employer.active ?? true} onChange={handleChange('active')} />}
                label={intl.formatMessage({ id: 'active' })}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => navigate('/employers')} startIcon={<CloseOutlined />}>
                  {intl.formatMessage({ id: 'cancel' })}
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={saving} startIcon={<SaveOutlined />}>
                  {saving ? intl.formatMessage({ id: 'saving' }) : intl.formatMessage({ id: 'save-changes' })}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </MainCard>
    </>
  );
};

export default EmployerEdit;
