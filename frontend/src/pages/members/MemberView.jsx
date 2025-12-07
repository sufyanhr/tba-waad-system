// src/pages/members/MemberView.jsx
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, CircularProgress, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { useMemberDetails } from 'hooks/useMembers';

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

const MemberView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { member, loading, error } = useMemberDetails(id);

  return (
    <MainCard
      title="تفاصيل المشترك"
      secondary={
        <Button size="small" variant="outlined" onClick={() => navigate('/tba/members')}>
          رجوع إلى القائمة
        </Button>
      }
    >
      {loading && (
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
          <CircularProgress />
        </Stack>
      )}

      {!loading && error && <Typography color="error">حدث خطأ أثناء جلب بيانات المشترك.</Typography>}

      {!loading && member && (
        <Stack spacing={3}>
          {/* بيانات أساسية */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              البيانات الأساسية
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <InfoRow label="الاسم (عربي)" value={member.fullNameArabic} />
                <InfoRow label="الاسم (إنجليزي)" value={member.fullNameEnglish} />
                <InfoRow label="الرقم الوطني" value={member.civilId} />
                <InfoRow label="تاريخ الميلاد" value={member.birthDate} />
                <InfoRow label="الجنس" value={member.gender} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoRow label="جهة العمل" value={member.employerName} />
                <InfoRow label="رقم البطاقة" value={member.cardNumber} />
                <InfoRow label="رقم البوليسة" value={member.policyNumber} />
                <InfoRow label="رقم الموظف" value={member.employeeNumber} />
                <InfoRow label="الحالة" value={member.status} />
              </Grid>
            </Grid>
          </Box>

          {/* بيانات الاتصال */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              بيانات الاتصال
            </Typography>
            <InfoRow label="رقم الهاتف" value={member.phone} />
            <InfoRow label="البريد الإلكتروني" value={member.email} />
            <InfoRow label="العنوان" value={member.address} />
          </Box>

          {/* أفراد العائلة */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              أفراد العائلة ({member.familyMembersCount ?? 0})
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">#</TableCell>
                  <TableCell>الاسم</TableCell>
                  <TableCell>العلاقة</TableCell>
                  <TableCell>الرقم الوطني</TableCell>
                  <TableCell>تاريخ الميلاد</TableCell>
                  <TableCell>الجنس</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(!member.familyMembers || member.familyMembers.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      لا توجد بيانات لعائلة هذا المشترك
                    </TableCell>
                  </TableRow>
                )}

                {member.familyMembers &&
                  member.familyMembers.map((fm, index) => (
                    <TableRow key={fm.id ?? index}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell>{fm.fullNameArabic || fm.fullNameEnglish}</TableCell>
                      <TableCell>{fm.relationship}</TableCell>
                      <TableCell>{fm.civilId}</TableCell>
                      <TableCell>{fm.birthDate}</TableCell>
                      <TableCell>{fm.gender}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Box>
        </Stack>
      )}
    </MainCard>
  );
};

export default MemberView;
