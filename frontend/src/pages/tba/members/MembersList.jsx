// src/pages/tba/members/MembersList.jsx
import { useMemo, useState } from 'react';
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
  Add as AddIcon
} from '@mui/icons-material';

import MainCard from 'components/MainCard';
import TableSkeleton from 'components/tba/LoadingSkeleton';
import { useMembersList } from 'hooks/useMembers';
import * as membersService from 'services/members.service';

const MembersList = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('DESC');

  const { data, loading, error, params, setParams, refresh } = useMembersList({
    page: 0,
    size: 10,
    sortBy: sortBy,
    sortDir: sortDir
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setParams((prev) => ({ ...prev, page: 0, search: searchInput.trim() }));
  };

  const handleSort = (column) => {
    const isAsc = sortBy === column && sortDir === 'ASC';
    const newDir = isAsc ? 'DESC' : 'ASC';
    setSortDir(newDir);
    setSortBy(column);
    setParams((prev) => ({ ...prev, sortBy: column, sortDir: newDir }));
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

  const getStatusChip = (status) => {
    const statusColors = {
      ACTIVE: 'success',
      INACTIVE: 'default',
      SUSPENDED: 'warning',
      TERMINATED: 'error'
    };
    return (
      <Chip 
        label={status || 'N/A'} 
        color={statusColors[status] || 'default'} 
        size="small" 
        variant="outlined"
      />
    );
  };

  return (
    <MainCard 
      title="الأعضاء (المؤمن عليهم)"
      content={false}
    >
      <Box sx={{ p: 3 }}>
        {/* Toolbar */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Typography variant="body2" color="text.secondary">
            عرض قائمة المؤمن عليهم مع إمكانية البحث والفرز
          </Typography>

          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              placeholder="بحث بالاسم أو الرقم الوطني..."
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
              onClick={() => navigate('/members/create')}
            >
              إضافة مشترك
            </Button>
          </Stack>
        </Stack>

        {/* جدول البيانات */}
        {loading ? (
          <TableSkeleton rows={10} columns={7} />
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
                  <TableCell 
                    sx={{ fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => handleSort('fullNameArabic')}
                  >
                    اسم المشترك (عربي)
                  </TableCell>
                  <TableCell 
                    sx={{ fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => handleSort('fullNameEnglish')}
                  >
                    اسم المشترك (إنجليزي)
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>الرقم الوطني</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>جهة العمل</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">الحالة</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>إجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <Typography variant="subtitle1" color="text.secondary">
                        لا توجد بيانات حالياً
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.items.map((member, index) => (
                    <TableRow 
                      key={member.id} 
                      hover
                      sx={{ 
                        '&:hover': { 
                          bgcolor: 'action.hover',
                          cursor: 'pointer'
                        }
                      }}
                    >
                      <TableCell align="center">
                        <Typography variant="subtitle2">
                          {data.page * data.size + index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {member.fullNameArabic || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {member.fullNameEnglish || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {member.civilId || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {member.employerName || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {getStatusChip(member.status)}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="عرض التفاصيل">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => navigate(`/members/view/${member.id}`)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="تعديل">
                            <IconButton 
                              size="small" 
                              color="info"
                              onClick={() => navigate(`/members/edit/${member.id}`)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="حذف">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleDelete(member.id)}
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

export default MembersList;
