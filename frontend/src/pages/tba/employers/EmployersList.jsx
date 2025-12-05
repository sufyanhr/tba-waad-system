import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
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
import { useEmployersList } from 'hooks/useEmployers';
import * as employersService from 'services/employers.service';

const EmployersList = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  const { data, loading, error, params, setParams, refresh } = useEmployersList({
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
    if (!window.confirm('هل أنت متأكد من حذف جهة العمل؟')) return;
    try {
      await employersService.deleteEmployer(id);
      refresh();
    } catch (err) {
      console.error('Failed to delete employer', err);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  return (
    <MainCard title="جهات العمل (Employers)">
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
        >
          <Typography variant="body2" color="text.secondary">
            عرض قائمة جهات العمل مع إمكانية البحث والفرز.
          </Typography>

          <Stack direction="row" spacing={1}>
            <form onSubmit={handleSearchSubmit}>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  placeholder="بحث بالاسم أو الكود..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Button type="submit" variant="outlined">
                  بحث
                </Button>
              </Stack>
            </form>

            <Button variant="contained" color="primary" onClick={() => navigate('/tba/employers/create')}>
              إضافة جهة عمل جديدة
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ position: 'relative', minHeight: 200 }}>
          {loading && (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                bgcolor: 'rgba(255,255,255,0.5)'
              }}
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
                <TableCell>اسم جهة العمل</TableCell>
                <TableCell>كود الشركة</TableCell>
                <TableCell>رقم الهاتف</TableCell>
                <TableCell align="center">الحالة</TableCell>
                <TableCell align="center">إجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    لا توجد بيانات حالياً
                  </TableCell>
                </TableRow>
              )}

              {data.items.map((employer, index) => (
                <TableRow key={employer.id} hover>
                  <TableCell align="center">{data.page * data.size + index + 1}</TableCell>
                  <TableCell>{employer.name || '-'}</TableCell>
                  <TableCell>{employer.companyCode || '-'}</TableCell>
                  <TableCell>{employer.phone || '-'}</TableCell>
                  <TableCell align="center">
                    <Chip label={employer.active ? 'نشط' : 'غير نشط'} color={employer.active ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <IconButton size="small" onClick={() => navigate(`/tba/employers/view/${employer.id}`)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => navigate(`/tba/employers/edit/${employer.id}`)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(employer.id)}>
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

export default EmployersList;
