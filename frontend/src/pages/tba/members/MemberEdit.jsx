// src/pages/tba/members/MemberEdit.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, CircularProgress, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import * as membersService from 'services/members.service';

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

const MemberEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [member, setMember] = useState(null);
  const [familyDraft, setFamilyDraft] = useState({
    relationship: 'SON',
    fullNameEnglish: '',
    fullNameArabic: '',
    civilId: '',
    birthDate: '',
    gender: 'MALE'
  });

  useEffect(() => {
    const loadMember = async () => {
      try {
        setLoading(true);
        const data = await membersService.getMemberById(id);
        setMember({
          employerId: data.employerId,
          fullNameArabic: data.fullNameArabic || '',
          fullNameEnglish: data.fullNameEnglish || '',
          civilId: data.civilId || '',
          birthDate: data.birthDate || '',
          gender: data.gender || 'MALE',
          phone: data.phone || '',
          email: data.email || '',
          cardNumber: data.cardNumber || '',
          employeeNumber: data.employeeNumber || '',
          joinDate: data.joinDate || '',
          occupation: data.occupation || '',
          familyMembers: data.familyMembers || []
        });
      } catch (err) {
        console.error('Failed to load member for edit', err);
        alert('حدث خطأ أثناء جلب بيانات المشترك');
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [id]);

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
      familyMembers: [...prev.familyMembers, { ...familyDraft, id: null }]
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
    if (!member) return;
    try {
      setSaving(true);
      const payload = {
        fullNameArabic: member.fullNameArabic,
        fullNameEnglish: member.fullNameEnglish,
        civilId: member.civilId,
        birthDate: member.birthDate || null,
        gender: member.gender,
        phone: member.phone,
        email: member.email,
        cardNumber: member.cardNumber,
        employeeNumber: member.employeeNumber,
        joinDate: member.joinDate || null,
        occupation: member.occupation,
        familyMembers: member.familyMembers
      };
      await membersService.updateMember(id, payload);
      navigate('/tba/members');
    } catch (err) {
      console.error('Failed to update member', err);
      alert('حدث خطأ أثناء تحديث بيانات المشترك');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !member) {
    return (
      <MainCard title="تعديل بيانات المشترك">
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
          <CircularProgress />
        </Stack>
      </MainCard>
    );
  }

  return (
    <MainCard
      title={`تعديل بيانات المشترك #${id}`}
      secondary={
        <Button size="small" variant="outlined" onClick={() => navigate('/tba/members')}>
          إلغاء والرجوع
        </Button>
      }
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              البيانات الأساسية
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="جهة العمل (للعرض فقط)" value={member.employerId} InputProps={{ readOnly: true }} size="small" />
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
                <TextField fullWidth label="الرقم الوطني" value={member.civilId} onChange={handleChange('civilId')} size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
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

          {/* العائلة */}
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
                  <Stack key={fm.id ?? index} direction="row" spacing={1} alignItems="center" sx={{ fontSize: 14 }}>
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
              {saving ? 'جارٍ الحفظ...' : 'تحديث بيانات المشترك'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </MainCard>
  );
};

export default MemberEdit;
