import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, CircularProgress, FormControlLabel, Grid, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import * as employersService from 'services/employers.service';

const COMPANIES = [
  { id: 1, name: 'الشركة الليبية للأسمنت' },
  { id: 2, name: 'منطقة جليانة' },
  { id: 3, name: 'مصلحة الجمارك' },
  { id: 4, name: 'مصرف الوحدة' },
  { id: 5, name: 'شركة وعد لإدارة النفقات الطبية' }
];

const EmployerEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [employer, setEmployer] = useState(null);

  useEffect(() => {
    const loadEmployer = async () => {
      try {
        setLoading(true);
        const data = await employersService.getEmployerById(id);
        setEmployer(data);
      } catch (err) {
        console.error('Failed to load employer', err);
        alert('حدث خطأ أثناء جلب بيانات جهة العمل');
      } finally {
        setLoading(false);
      }
    };
    loadEmployer();
  }, [id]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setEmployer((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employer.name || !employer.companyCode || !employer.companyId) {
      alert('الرجاء إدخال الحقول الإلزامية: الشركة، الاسم، والكود');
      return;
    }

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
      <MainCard title="تعديل جهة عمل">
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 300 }}>
          <CircularProgress />
        </Stack>
      </MainCard>
    );
  }

  if (!employer) {
    return (
      <MainCard title="تعديل جهة عمل">
        <Typography color="error">لم يتم العثور على جهة العمل</Typography>
      </MainCard>
    );
  }

  return (
    <MainCard
      title="تعديل جهة عمل"
      secondary={
        <Button size="small" variant="outlined" onClick={() => navigate('/employers')}>
          رجوع إلى القائمة
        </Button>
      }
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              required
              label="الشركة"
              value={employer.companyId || ''}
              onChange={handleChange('companyId')}
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
            <TextField fullWidth required label="اسم جهة العمل" value={employer.name || ''} onChange={handleChange('name')} size="small" />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="كود الشركة"
              value={employer.companyCode || ''}
              onChange={handleChange('companyCode')}
              size="small"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="رقم الهاتف" value={employer.phone || ''} onChange={handleChange('phone')} size="small" />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="البريد الإلكتروني"
              type="email"
              value={employer.email || ''}
              onChange={handleChange('email')}
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="العنوان"
              value={employer.address || ''}
              onChange={handleChange('address')}
              multiline
              rows={2}
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel control={<Switch checked={employer.active ?? true} onChange={handleChange('active')} />} label="نشط" />
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/employers')}>
                إلغاء
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={saving}>
                {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
};

export default EmployerEdit;
