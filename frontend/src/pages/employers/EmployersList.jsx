import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
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
  Tooltip,
  Paper,
  TableSortLabel,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

import MainCard from 'components/MainCard';
import ModernPageHeader from 'components/tba/ModernPageHeader';
import ModernEmptyState from 'components/tba/ModernEmptyState';
import TableSkeleton from 'components/tba/LoadingSkeleton';
import { useEmployersList } from 'hooks/useEmployers';
import * as employersService from 'services/employers.service';

const EmployersList = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [searchInput, setSearchInput] = useState('');
  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState('desc');

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

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(property);
    setParams((prev) => ({
      ...prev,
      sortBy: property,
      sortDir: newOrder.toUpperCase()
    }));
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
    if (!window.confirm(intl.formatMessage({ id: 'delete-employer-confirm' }))) return;
    try {
      await employersService.deleteEmployer(id);
      refresh();
    } catch (err) {
      console.error('Failed to delete employer', err);
      alert(intl.formatMessage({ id: 'error' }));
    }
  };

  const handleRefresh = () => {
    setSearchInput('');
    setParams({ page: 0, size: 10, sortBy: 'id', sortDir: 'DESC', search: '' });
    refresh();
  };

  const headCells = [
    { id: 'name', label: intl.formatMessage({ id: 'employer-name-ar' }), sortable: true },
    { id: 'companyCode', label: intl.formatMessage({ id: 'employer-code' }), sortable: true },
    { id: 'phone', label: intl.formatMessage({ id: 'Phone' }), sortable: false },
    { id: 'email', label: intl.formatMessage({ id: 'Email' }), sortable: false },
    { id: 'active', label: intl.formatMessage({ id: 'Status' }), sortable: true },
    { id: 'actions', label: intl.formatMessage({ id: 'Actions' }), sortable: false, align: 'center' }
  ];

  const tableContent = useMemo(() => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={headCells.length}>
            <TableSkeleton />
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={headCells.length}>
            <Alert severity="error" sx={{ my: 2 }}>
              {intl.formatMessage({ id: 'error' })}: {error.message || 'Failed to load employers'}
            </Alert>
          </TableCell>
        </TableRow>
      );
    }

    if (!data?.items || data.items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={headCells.length}>
            <ModernEmptyState
              icon={BusinessIcon}
              title={intl.formatMessage({ id: 'no-employers-found' })}
              description={intl.formatMessage({ id: 'no-employers-desc' })}
              action={
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/employers/create')}
                >
                  {intl.formatMessage({ id: 'add-employer' })}
                </Button>
              }
            />
          </TableCell>
        </TableRow>
      );
    }

    return data.items.map((employer) => (
      <TableRow hover key={employer.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell>
          <Typography variant="body2" fontWeight={500}>
            {employer.name || '-'}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip label={employer.companyCode || '-'} size="small" variant="outlined" />
        </TableCell>
        <TableCell>
          <Typography variant="body2">{employer.phone || '-'}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">{employer.email || '-'}</Typography>
        </TableCell>
        <TableCell>
          <Chip
            label={employer.active ? intl.formatMessage({ id: 'Active' }) : intl.formatMessage({ id: 'Inactive' })}
            size="small"
            color={employer.active ? 'success' : 'error'}
          />
        </TableCell>
        <TableCell align="center">
          <Stack direction="row" spacing={0.5} justifyContent="center">
            <Tooltip title={intl.formatMessage({ id: 'view' })}>
              <IconButton size="small" color="primary" onClick={() => navigate(`/employers/view/${employer.id}`)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={intl.formatMessage({ id: 'Edit' })}>
              <IconButton size="small" color="info" onClick={() => navigate(`/employers/edit/${employer.id}`)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={intl.formatMessage({ id: 'Delete' })}>
              <IconButton size="small" color="error" onClick={() => handleDelete(employer.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
    ));
  }, [data, loading, error, headCells.length, intl, navigate]);

  return (
    <>
      <ModernPageHeader
        title={intl.formatMessage({ id: 'employers-list' })}
        subtitle={intl.formatMessage({ id: 'employers-list-desc' })}
        icon={BusinessIcon}
        breadcrumbs={[{ label: intl.formatMessage({ id: 'employers-list' }), path: '/employers' }]}
        actions={
          <Stack direction="row" spacing={2}>
            <Tooltip title={intl.formatMessage({ id: 'refresh' })}>
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/employers/create')}>
              {intl.formatMessage({ id: 'add-employer' })}
            </Button>
          </Stack>
        }
      />

      <MainCard content={false}>
        {/* Toolbar */}
        <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              fullWidth
              size="small"
              placeholder={intl.formatMessage({ id: 'search-employers' })}
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
              sx={{ maxWidth: { sm: 400 } }}
            />
            <Button variant="outlined" onClick={handleSearchSubmit} sx={{ minWidth: 100 }}>
              {intl.formatMessage({ id: 'Search' })}
            </Button>
          </Stack>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table sx={{ minWidth: 750 }} size="medium">
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id} align={headCell.align || 'left'} sx={{ fontWeight: 600 }}>
                    {headCell.sortable ? (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={() => handleRequestSort(headCell.id)}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>{tableContent}</TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {!loading && !error && data?.items && data.items.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={data.total || 0}
            rowsPerPage={params.size}
            page={params.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={intl.formatMessage({ id: 'rows-per-page' })}
          />
        )}
      </MainCard>
    </>
  );
};

export default EmployersList;
