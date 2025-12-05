// src/pages/tba/members/MembersList.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TablePagination
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import MainCard from 'components/MainCard';
import { useMembersList } from 'hooks/useMembers';
import * as membersService from 'services/members.service';

const MembersList = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  const { data, loading, error, params, setParams, refresh } = useMembersList({
    page: 0,
    size: 10,
    sortBy: 'id',
    sortDir: 'DESC'
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setParams((prev) => ({ ...prev, page: 0, search: searchInput.trim() }));
  };

  const handleChangePage = (_, newPage) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setParams((prev) => ({
      ...prev,
      page: 0,
      size: parseInt(event.target.value, 10)
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف المشترك؟ (سيتم الإخفاء فقط)')) return;
    try {
      await membersService.deleteMember(id);
      refresh();
    } catch (err) {
      console.error('Failed to delete member', err);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  return (
    <MainCard title="الأعضاء (المؤمن عليهم)">
      <Stack spacing={2}>
        {/* شريط الأكشن العلوي */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
        >
          <Typography variant="body2" color="text.secondary">
            عرض قائمة المؤمن عليهم مع إمكانية البحث والفرز.
          </Typography>

          <Stack direction="row" spacing={1}>
            <form onSubmit={handleSearchSubmit}>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  placeholder="بحث بالاسم أو الرقم الوطني..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Button type="submit" variant="outlined">
                  بحث
                </Button>
              </Stack>
            </form>

            <Button variant="contained" color="primary" onClick={() => navigate('/tba/members/create')}>
              إضافة مشترك جديد
            </Button>
          </Stack>
        </Stack>

        {/* جدول البيانات */}
        <Box sx={{ position: 'relative', minHeight: 200 }}>
          {loading && (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ position: 'absolute', inset: 0, zIndex: 1, bgcolor: 'rgba(255,255,255,0.5)' }}
            >
              <CircularProgress />
            </Stack>
          )}

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              حدث خطأ أثناء جلب البيانات.
            </Typography>
          )}

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell>اسم المشترك (عربي)</TableCell>
                <TableCell>اسم المشترك (إنجليزي)</TableCell>
                <TableCell>الرقم الوطني</TableCell>
                <TableCell>جهة العمل</TableCell>
                <TableCell>الحالة</TableCell>
                <TableCell align="center">إجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    لا توجد بيانات حالياً
                  </TableCell>
                </TableRow>
              )}

              {data.items.map((member, index) => (
                <TableRow key={member.id} hover>
                  <TableCell align="center">{data.page * data.size + index + 1}</TableCell>
                  <TableCell>{member.fullNameArabic || '-'}</TableCell>
                  <TableCell>{member.fullNameEnglish || '-'}</TableCell>
                  <TableCell>{member.civilId || '-'}</TableCell>
                  <TableCell>{member.employerName || '-'}</TableCell>
                  <TableCell>{member.status || '-'}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <IconButton size="small" onClick={() => navigate(`/tba/members/view/${member.id}`)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => navigate(`/tba/members/edit/${member.id}`)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(member.id)}>
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={data.total}
            page={params.page}
            onPageChange={handleChangePage}
            rowsPerPage={params.size}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="عدد الصفوف في الصفحة"
          />
        </Box>
      </Stack>
    </MainCard>
  );
};

export default MembersList;
