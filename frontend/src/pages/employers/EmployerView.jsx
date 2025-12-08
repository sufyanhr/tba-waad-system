import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Chip, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import MainCard from 'components/MainCard';
import ModernPageHeader from 'components/tba/ModernPageHeader';
import { useEmployerDetails } from 'hooks/useEmployers';

const COMPANIES = [
  { id: 1, name: 'الشركة الليبية للأسمنت' },
  { id: 2, name: 'منطقة جليانة' },
  { id: 3, name: 'مصلحة الجمارك' },
  { id: 4, name: 'مصرف الوحدة' },
  { id: 5, name: 'شركة وعد لإدارة النفقات الطبية' }
];

const InfoRow = ({ label, value }) => (
  <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
    <Typography variant="subtitle2" sx={{ minWidth: 160, fontWeight: 600 }}>
      {label}:
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {value ?? '-'}
    </Typography>
  </Stack>
);

const EmployerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const { employer, loading, error } = useEmployerDetails(id);

  const getCompanyName = (companyId) => {
    const company = COMPANIES.find((c) => c.id === companyId);
    return company ? company.name : '-';
  };

  if (loading) {
    return (
      <>
        <ModernPageHeader
          title={intl.formatMessage({ id: 'view-employer' })}
          breadcrumbs={[
            { title: intl.formatMessage({ id: 'employers' }), to: '/employers' },
            { title: intl.formatMessage({ id: 'view-employer' }) }
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

  if (error || !employer) {
    return (
      <>
        <ModernPageHeader
          title={intl.formatMessage({ id: 'view-employer' })}
          breadcrumbs={[
            { title: intl.formatMessage({ id: 'employers' }), to: '/employers' },
            { title: intl.formatMessage({ id: 'view-employer' }) }
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
        title={intl.formatMessage({ id: 'view-employer' })}
        breadcrumbs={[
          { title: intl.formatMessage({ id: 'employers' }), to: '/employers' },
          { title: intl.formatMessage({ id: 'view-employer' }) }
        ]}
        onBack={() => navigate('/employers')}
        action={
          <Button variant="contained" onClick={() => navigate(`/employers/edit/${employer.id}`)} startIcon={<EditOutlined />}>
            {intl.formatMessage({ id: 'edit-employer' })}
          </Button>
        }
      />
      <MainCard>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2.5, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                {intl.formatMessage({ id: 'basic-information' })}
              </Typography>
              <InfoRow label={intl.formatMessage({ id: 'id' })} value={employer.id} />
              <InfoRow label={intl.formatMessage({ id: 'employer-name' })} value={employer.name} />
              <InfoRow label={intl.formatMessage({ id: 'employer-code' })} value={employer.companyCode} />
              <InfoRow label={intl.formatMessage({ id: 'company' })} value={getCompanyName(employer.companyId)} />
              <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ minWidth: 160, fontWeight: 600 }}>
                  {intl.formatMessage({ id: 'status' })}:
                </Typography>
                <Chip
                  label={employer.active ? intl.formatMessage({ id: 'active' }) : intl.formatMessage({ id: 'inactive' })}
                  color={employer.active ? 'success' : 'default'}
                  size="small"
                />
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2.5, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                {intl.formatMessage({ id: 'contact-information' })}
              </Typography>
              <InfoRow label={intl.formatMessage({ id: 'phone' })} value={employer.phone} />
              <InfoRow label={intl.formatMessage({ id: 'email' })} value={employer.email} />
              <InfoRow label={intl.formatMessage({ id: 'address' })} value={employer.address} />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ p: 2.5, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                {intl.formatMessage({ id: 'audit-information' })}
              </Typography>
              <InfoRow
                label={intl.formatMessage({ id: 'created-at' })}
                value={employer.createdAt ? new Date(employer.createdAt).toLocaleString('ar-EG') : '-'}
              />
              <InfoRow
                label={intl.formatMessage({ id: 'updated-at' })}
                value={employer.updatedAt ? new Date(employer.updatedAt).toLocaleString('ar-EG') : '-'}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/employers')} startIcon={<ArrowLeftOutlined />}>
                {intl.formatMessage({ id: 'back-to-list' })}
              </Button>
              <Button variant="contained" onClick={() => navigate(`/employers/edit/${employer.id}`)} startIcon={<EditOutlined />}>
                {intl.formatMessage({ id: 'edit' })}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
};

export default EmployerView;
