import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControlLabel, Grid, MenuItem, Stack, Switch, TextField } from '@mui/material';
import MainCard from 'components/MainCard';
import * as employersService from 'services/employers.service';

const COMPANIES = [
  { id: 1, name: 'الشركة الليبية للأسمنت' },
  { id: 2, name: 'منطقة جليانة' },
  { id: 3, name: 'مصلحة الجمارك' },
  { id: 4, name: 'مصرف الوحدة' },
  { id: 5, name: 'شركة وعد لإدارة النفقات الطبية' }
];

const emptyEmployer = {
  companyId: '',
  name: '',
  companyCode: '',
  phone: '',
  email: '',
  address: '',
  active: true
};

const EmployerCreate = () => {
  const navigate = useNavigate();
  const [employer, setEmployer] = useState(emptyEmployer);
  const [saving, setSaving] = useState(false);

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
      await employersService.createEmployer(employer);
      alert('تم إنشاء جهة العمل بنجاح');
      navigate('/tba/employers');
    } catch (err) {
      console.error('Failed to create employer', err);
      alert('حدث خطأ أثناء إنشاء جهة العمل');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainCard
      title="إنشاء جهة عمل جديدة"
      secondary={
        <Button size="small" variant="outlined" onClick={() => navigate('/tba/employers')}>
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
              value={employer.companyId}
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
            <TextField fullWidth required label="اسم جهة العمل" value={employer.name} onChange={handleChange('name')} size="small" />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="كود الشركة"
              value={employer.companyCode}
              onChange={handleChange('companyCode')}
              size="small"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="رقم الهاتف" value={employer.phone} onChange={handleChange('phone')} size="small" />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="البريد الإلكتروني"
              type="email"
              value={employer.email}
              onChange={handleChange('email')}
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="العنوان"
              value={employer.address}
              onChange={handleChange('address')}
              multiline
              rows={2}
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel control={<Switch checked={employer.active} onChange={handleChange('active')} />} label="نشط" />
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/tba/employers')}>
                إلغاء
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={saving}>
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
};

export default EmployerCreate;
