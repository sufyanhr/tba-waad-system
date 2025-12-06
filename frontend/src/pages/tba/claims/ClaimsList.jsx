import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import { Add, Edit, Delete, Visibility, Search } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import { useClaimsList, useDeleteClaim } from 'hooks/useClaims';

const STATUS_COLORS = {
  PENDING_REVIEW: 'warning',
  PREAPPROVED: 'info',
  APPROVED: 'success',
  PARTIALLY_APPROVED: 'primary',
  REJECTED: 'error',
  RETURNED_FOR_INFO: 'secondary',
  CANCELLED: 'default'
};

const ClaimsList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  const { data, loading, params, setParams, refresh } = useClaimsList({
    page: 0,
    size: 10,
    search: ''
  });

  const { remove, deleting } = useDeleteClaim();

  const handlePageChange = (event, newPage) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (event) => {
    setParams((prev) => ({ ...prev, size: parseInt(event.target.value, 10), page: 0 }));
  };

  const handleSearch = () => {
    setParams((prev) => ({ ...prev, search: searchInput, page: 0 }));
    setSearch(searchInput);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المطالبة؟')) {
      const result = await remove(id);
      if (result.success) {
        refresh();
      }
    }
  };

  const content = data?.content || [];
  const totalElements = data?.totalElements || 0;

  return (
    <MainCard title="إدارة المطالبات">
      <Stack spacing={3}>
        {/* Search & Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1, flex: 1, maxWidth: 500 }}>
            <TextField
              fullWidth
              placeholder="بحث بمقدم الخدمة، التشخيص، العضو..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<Search />}
            >
              بحث
            </Button>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/claims/create')}
          >
            إضافة مطالبة جديدة
          </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="right">#</TableCell>
                <TableCell align="right">العضو</TableCell>
                <TableCell align="right">شركة التأمين</TableCell>
                <TableCell align="right">مقدم الخدمة</TableCell>
                <TableCell align="right">تاريخ الزيارة</TableCell>
                <TableCell align="right">المبلغ المطلوب</TableCell>
                <TableCell align="right">المبلغ الموافق عليه</TableCell>
                <TableCell align="right">الحالة</TableCell>
                <TableCell align="center">الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : content.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    لا توجد مطالبات
                  </TableCell>
                </TableRow>
              ) : (
                content.map((claim) => (
                  <TableRow key={claim.id} hover>
                    <TableCell align="right">{claim.id}</TableCell>
                    <TableCell align="right">
                      {claim.memberFullNameArabic}
                      <br />
                      <small style={{ color: '#888' }}>{claim.memberCivilId}</small>
                    </TableCell>
                    <TableCell align="right">{claim.companyName}</TableCell>
                    <TableCell align="right">{claim.providerName}</TableCell>
                    <TableCell align="right">
                      {new Date(claim.visitDate).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell align="right">
                      {claim.requestedAmount?.toLocaleString('ar-SA', {
                        minimumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell align="right">
                      {claim.approvedAmount
                        ? claim.approvedAmount.toLocaleString('ar-SA', {
                            minimumFractionDigits: 2
                          })
                        : '-'}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={claim.statusLabel}
                        color={STATUS_COLORS[claim.status] || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="عرض">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/claims/view/${claim.id}`)}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="تعديل">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/claims/edit/${claim.id}`)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="حذف">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(claim.id)}
                            disabled={deleting}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={totalElements}
            page={params.page}
            onPageChange={handlePageChange}
            rowsPerPage={params.size}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="عدد الصفوف:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} من ${count}`
            }
          />
        </TableContainer>
      </Stack>
    </MainCard>
  );
};

export default ClaimsList;
