import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Chip, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEmployerDetails } from 'hooks/useEmployers';

const COMPANIES = [
  { id: 1, name: 'الشركة الليبية للأسمنت' },
  { id: 2, name: 'منطقة جليانة' },
  { id: 3, name: 'مصلحة الجمارك' },
  { id: 4, name: 'مصرف الوحدة' },
  { id: 5, name: 'شركة وعد لإدارة النفقات الطبية' }
];

const InfoRow = ({ label, value }) => (
  <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
    <Typography variant="subtitle2" sx={{ minWidth: 160 }}>
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
  const { employer, loading, error } = useEmployerDetails(id);

  const getCompanyName = (companyId) => {
    const company = COMPANIES.find((c) => c.id === companyId);
    return company ? company.name : '-';
  };

  return (
    <MainCard
      title="تفاصيل جهة العمل"
      secondary={
        <Button size="small" variant="outlined" onClick={() => navigate('/tba/employers')}>
          رجوع إلى القائمة
        </Button>
      }
    >
      {loading && (
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
          <CircularProgress />
        </Stack>
      )}

      {!loading && error && <Typography color="error">حدث خطأ أثناء جلب بيانات جهة العمل.</Typography>}

      {!loading && !error && employer && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                المعلومات الأساسية
              </Typography>
              <InfoRow label="رقم التعريف" value={employer.id} />
              <InfoRow label="اسم جهة العمل" value={employer.name} />
              <InfoRow label="كود الشركة" value={employer.companyCode} />
              <InfoRow label="الشركة" value={getCompanyName(employer.companyId)} />
              <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ minWidth: 160 }}>
                  الحالة:
                </Typography>
                <Chip label={employer.active ? 'نشط' : 'غير نشط'} color={employer.active ? 'success' : 'default'} size="small" />
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                معلومات الاتصال
              </Typography>
              <InfoRow label="رقم الهاتف" value={employer.phone} />
              <InfoRow label="البريد الإلكتروني" value={employer.email} />
              <InfoRow label="العنوان" value={employer.address} />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                معلومات التدقيق
              </Typography>
              <InfoRow label="تاريخ الإنشاء" value={employer.createdAt ? new Date(employer.createdAt).toLocaleString('ar-EG') : '-'} />
              <InfoRow label="تاريخ آخر تحديث" value={employer.updatedAt ? new Date(employer.updatedAt).toLocaleString('ar-EG') : '-'} />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/tba/employers')}>
                رجوع
              </Button>
              <Button variant="contained" onClick={() => navigate(`/tba/employers/edit/${employer.id}`)}>
                تعديل
              </Button>
            </Stack>
          </Grid>
        </Grid>
      )}
    </MainCard>
  );
};

export default EmployerView;
