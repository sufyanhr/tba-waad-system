// src/pages/tba/members/MemberCreate.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import * as membersService from 'services/members.service';

const emptyMember = {
  employerId: '',
  fullNameArabic: '',
  fullNameEnglish: '',
  civilId: '',
  birthDate: '',
  gender: 'MALE',
  phone: '',
  email: '',
  cardNumber: '',
  employeeNumber: '',
  joinDate: '',
  occupation: '',
  familyMembers: []
};

const genderOptions = [
  { value: 'MALE', label: 'ذكر' },
  { value: 'FEMALE', label: 'أنثى' }
];

const relationshipOptions = [
  { value: 'WIFE', label: 'زوجة' },
  { value: 'HUSBAND', label: 'زوج' },
  { value: 'SON', label: 'ابن' },
  { value: 'DAUGHTER', label: 'ابنة' },
  { value: 'FATHER', label: 'أب' },
  { value: 'MOTHER', label: 'أم' }
];

const MemberCreate = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState(emptyMember);
  const [saving, setSaving] = useState(false);
  const [familyDraft, setFamilyDraft] = useState({
    relationship: 'SON',
    fullNameEnglish: '',
    fullNameArabic: '',
    civilId: '',
    birthDate: '',
    gender: 'MALE'
  });

  const handleChange = (field) => (event) => {
    setMember((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleFamilyDraftChange = (field) => (event) => {
    setFamilyDraft((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const addFamilyMember = () => {
    if (!familyDraft.fullNameEnglish || !familyDraft.civilId || !familyDraft.birthDate) {
      alert('يجب إدخال الاسم والرقم الوطني وتاريخ الميلاد لعنصر العائلة');
      return;
    }
    setMember((prev) => ({
      ...prev,
      familyMembers: [...prev.familyMembers, { ...familyDraft }]
    }));
    setFamilyDraft({
      relationship: 'SON',
      fullNameEnglish: '',
      fullNameArabic: '',
      civilId: '',
      birthDate: '',
      gender: 'MALE'
    });
  };

  const removeFamilyMember = (index) => {
    setMember((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!member.employerId) {
      alert('يجب اختيار جهة العمل (Employer ID)');
      return;
    }
    if (!member.fullNameEnglish && !member.fullNameArabic) {
      alert('يجب إدخال اسم المشترك على الأقل بلغة واحدة');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        ...member,
        employerId: Number(member.employerId),
        joinDate: member.joinDate || null,
        birthDate: member.birthDate || null
      };
      await membersService.createMember(payload);
      navigate('/tba/members');
    } catch (err) {
      console.error('Failed to create member', err);
      alert('حدث خطأ أثناء حفظ بيانات المشترك');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainCard
      title="إضافة مشترك جديد"
      secondary={
        <Button size="small" variant="outlined" onClick={() => navigate('/tba/members')}>
          إلغاء والرجوع
        </Button>
      }
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* القسم الأساسي */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              البيانات الأساسية
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  label="جهة العمل (Employer ID)"
                  value={member.employerId}
                  onChange={handleChange('employerId')}
                  type="number"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="الاسم الكامل (عربي)"
                  value={member.fullNameArabic}
                  onChange={handleChange('fullNameArabic')}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="الاسم الكامل (إنجليزي)"
                  value={member.fullNameEnglish}
                  onChange={handleChange('fullNameEnglish')}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField fullWidth required label="الرقم الوطني" value={member.civilId} onChange={handleChange('civilId')} size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  label="تاريخ الميلاد"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={member.birthDate}
                  onChange={handleChange('birthDate')}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField select fullWidth label="الجنس" value={member.gender} onChange={handleChange('gender')} size="small">
                  {genderOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField fullWidth label="رقم الهاتف" value={member.phone} onChange={handleChange('phone')} size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="البريد الإلكتروني" value={member.email} onChange={handleChange('email')} size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="رقم البطاقة" value={member.cardNumber} onChange={handleChange('cardNumber')} size="small" />
              </Grid>
            </Grid>
          </Box>

          {/* بيانات العمل */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              بيانات العمل
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="رقم الموظف"
                  value={member.employeeNumber}
                  onChange={handleChange('employeeNumber')}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="تاريخ الالتحاق"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={member.joinDate}
                  onChange={handleChange('joinDate')}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="المسمى الوظيفي" value={member.occupation} onChange={handleChange('occupation')} size="small" />
              </Grid>
            </Grid>
          </Box>

          {/* أفراد العائلة - بسيط */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              أفراد العائلة
            </Typography>

            <Grid container spacing={2} sx={{ mb: 1 }}>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="العلاقة"
                  value={familyDraft.relationship}
                  onChange={handleFamilyDraftChange('relationship')}
                  size="small"
                >
                  {relationshipOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="الاسم (إنجليزي)"
                  value={familyDraft.fullNameEnglish}
                  onChange={handleFamilyDraftChange('fullNameEnglish')}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="الرقم الوطني"
                  value={familyDraft.civilId}
                  onChange={handleFamilyDraftChange('civilId')}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="تاريخ الميلاد"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={familyDraft.birthDate}
                  onChange={handleFamilyDraftChange('birthDate')}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={1}>
                <Button fullWidth variant="outlined" sx={{ height: '100%' }} onClick={addFamilyMember}>
                  إضافة
                </Button>
              </Grid>
            </Grid>

            {member.familyMembers.length > 0 && (
              <Stack spacing={0.5}>
                {member.familyMembers.map((fm, index) => (
                  <Stack key={index} direction="row" spacing={1} alignItems="center" sx={{ fontSize: 14 }}>
                    <Typography sx={{ minWidth: 40 }}>{index + 1}.</Typography>
                    <Typography sx={{ flexGrow: 1 }}>
                      {fm.fullNameEnglish} ({fm.relationship}) - {fm.civilId}
                    </Typography>
                    <Button size="small" color="error" onClick={() => removeFamilyMember(index)}>
                      حذف
                    </Button>
                  </Stack>
                ))}
              </Stack>
            )}
          </Box>

          <Box>
            <Button type="submit" variant="contained" color="primary" disabled={saving}>
              {saving ? 'جارٍ الحفظ...' : 'حفظ المشترك'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </MainCard>
  );
};

export default MemberCreate;
