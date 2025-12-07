import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TablePagination,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

import MainCard from 'components/MainCard';
import TableSkeleton from 'components/tba/LoadingSkeleton';
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
    <MainCard title="جهات العمل (Employers)" content={false}>
      <Box sx={{ p: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Typography variant="body2" color="text.secondary">
            عرض قائمة جهات العمل مع إمكانية البحث والفرز
          </Typography>

          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              placeholder="بحث بالاسم أو الكود..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: 250 }}
            />
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => navigate('/employers/create')}
            >
              إضافة جهة عمل
            </Button>
          </Stack>
        </Stack>

        {loading ? (
          <TableSkeleton rows={10} columns={6} />
        ) : error ? (
          <Typography color="error" align="center" sx={{ py: 3 }}>
            حدث خطأ أثناء جلب البيانات
          </Typography>
        ) : (
          <TableContainer>
            <Table sx={{ '& .MuiTableCell-root': { py: 1.5 } }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>اسم جهة العمل</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>كود الشركة</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>رقم الهاتف</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>الحالة</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>إجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <Typography variant="subtitle1" color="text.secondary">
                        لا توجد بيانات حالياً
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.items.map((employer, index) => (
                    <TableRow 
                      key={employer.id} 
                      hover
                      sx={{ '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' } }}
                    >
                      <TableCell align="center">
                        <Typography variant="subtitle2">
                          {data.page * data.size + index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <BusinessIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {employer.name || '-'}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {employer.companyCode || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {employer.phone || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={employer.active ? 'نشط' : 'غير نشط'} 
                          color={employer.active ? 'success' : 'default'} 
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="عرض التفاصيل">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => navigate(`/employers/view/${employer.id}`)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="تعديل">
                            <IconButton 
                              size="small" 
                              color="info"
                              onClick={() => navigate(`/employers/edit/${employer.id}`)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="حذف">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleDelete(employer.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!loading && !error && (
          <TablePagination
            component="div"
            count={data.total}
            page={params.page}
            onPageChange={handleChangePage}
            rowsPerPage={params.size}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            labelRowsPerPage="عدد الصفوف في الصفحة"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}–${to} من ${count !== -1 ? count : `أكثر من ${to}`}`
            }
          />
        )}
      </Box>
    </MainCard>
  );
};

export default EmployersList;
