import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
  Grid
} from '@mui/material';
import { Add, Edit, Delete, Visibility, Refresh } from '@mui/icons-material';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  createColumnHelper
} from '@tanstack/react-table';
import { useSnackbar } from 'notistack';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import visitsService from 'services/visits.service';
import membersService from 'services/members.service';
import providersService from 'services/providers.service';
import { EMPLOYERS } from 'constants/companies';
import MainCard from 'components/MainCard';
import RBACGuard from 'components/tba/RBACGuard';
import TableSkeleton from 'components/tba/TableSkeleton';
import ErrorFallback from 'components/tba/ErrorFallback';
import EmptyState from 'components/tba/EmptyState';

const columnHelper = createColumnHelper();

// Visit status options
const VISIT_STATUS = [
  { value: 'SCHEDULED', label: 'Scheduled', color: 'info' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'warning' },
  { value: 'COMPLETED', label: 'Completed', color: 'success' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'error' }
];

// Visit types
const VISIT_TYPES = ['CONSULTATION', 'EMERGENCY', 'FOLLOW_UP', 'SURGERY', 'DIAGNOSTIC', 'PREVENTIVE', 'VACCINATION', 'THERAPY'];

export default function VisitsList() {
  const { enqueueSnackbar } = useSnackbar();

  // State
  const [data, setData] = useState([]);
  const [members, setMembers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [employerFilter, setEmployerFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');

  // Dialogs
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Selected visit
  const [selectedVisit, setSelectedVisit] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    memberId: null,
    providerId: null,
    visitType: 'CONSULTATION',
    diagnosis: '',
    visitDate: new Date(),
    status: 'SCHEDULED',
    costLyd: '',
    notes: ''
  });

  // Load members
  const loadMembers = useCallback(async () => {
    try {
      const response = await membersService.list({ size: 1000 });
      if (response.success) {
        const membersList = response.data?.content || [];
        setMembers(membersList);
      }
    } catch (err) {
      console.error('Error loading members:', err);
    }
  }, []);

  // Load providers
  const loadProviders = useCallback(async () => {
    try {
      const response = await providersService.getAll();
      if (response.success) {
        setProviders(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('Error loading providers:', err);
    }
  }, []);

  // Load visits
  const loadVisits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await visitsService.list();

      if (response.success) {
        const visitsList = response.data?.content || response.data || [];
        setData(Array.isArray(visitsList) ? visitsList : []);
      } else {
        throw new Error(response.error || 'Failed to load visits');
      }
    } catch (err) {
      console.error('Error loading visits:', err);
      setError(err.message || 'Failed to load visits');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadMembers();
    loadProviders();
    loadVisits();
  }, [loadMembers, loadProviders, loadVisits]);

  // Apply filters
  const filteredData = useMemo(() => {
    return data.filter((visit) => {
      const matchesSearch =
        !searchTerm ||
        visit.visitId?.toString().includes(searchTerm) ||
        visit.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.providerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || visit.status === statusFilter;

      const matchesEmployer = employerFilter === 'all' || visit.employerName === employerFilter;

      const matchesProvider = providerFilter === 'all' || visit.providerId?.toString() === providerFilter;

      return matchesSearch && matchesStatus && matchesEmployer && matchesProvider;
    });
  }, [data, searchTerm, statusFilter, employerFilter, providerFilter]);

  // Table columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('visitId', {
        header: 'Visit ID',
        cell: (info) => (
          <Tooltip title="Click to view details">
            <Typography
              variant="body2"
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                fontWeight: 500,
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={() => handleView(info.row.original)}
            >
              #{info.getValue()}
            </Typography>
          </Tooltip>
        ),
        size: 100
      }),
      columnHelper.accessor('memberName', {
        header: 'Member',
        cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
        size: 180
      }),
      columnHelper.accessor('employerName', {
        header: 'Employer',
        cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
        size: 150
      }),
      columnHelper.accessor('providerName', {
        header: 'Provider',
        cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
        size: 180
      }),
      columnHelper.accessor('visitType', {
        header: 'Type',
        cell: (info) => <Chip label={info.getValue()?.replace('_', ' ')} size="small" color="primary" variant="outlined" />,
        size: 130
      }),
      columnHelper.accessor('diagnosis', {
        header: 'Diagnosis',
        cell: (info) => {
          const diagnosis = info.getValue();
          return (
            <Tooltip title={diagnosis || ''}>
              <Typography
                variant="body2"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '200px'
                }}
              >
                {diagnosis || '-'}
              </Typography>
            </Tooltip>
          );
        },
        size: 200
      }),
      columnHelper.accessor('visitDate', {
        header: 'Visit Date',
        cell: (info) => {
          const date = info.getValue();
          return (
            <Typography variant="body2">
              {date
                ? new Date(date).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : '-'}
            </Typography>
          );
        },
        size: 150
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const statusObj = VISIT_STATUS.find((s) => s.value === info.getValue());
          return <Chip label={statusObj?.label || info.getValue()} color={statusObj?.color || 'default'} size="small" />;
        },
        size: 120
      }),
      columnHelper.accessor('costLyd', {
        header: 'Cost (LYD)',
        cell: (info) => (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {info.getValue() ? `${parseFloat(info.getValue()).toFixed(2)} LYD` : '-'}
          </Typography>
        ),
        size: 120
      }),
      columnHelper.accessor('policyNumber', {
        header: 'Policy',
        cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
        size: 140
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created',
        cell: (info) => {
          const date = info.getValue();
          return (
            <Typography variant="body2">
              {date
                ? new Date(date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })
                : '-'}
            </Typography>
          );
        },
        size: 110
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <Stack direction="row" spacing={0.5}>
            <RBACGuard requiredPermissions={['VISIT_READ']}>
              <Tooltip title="View">
                <IconButton size="small" color="info" onClick={() => handleView(info.row.original)}>
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
            </RBACGuard>
            <RBACGuard requiredPermissions={['VISIT_UPDATE']}>
              <Tooltip title="Edit">
                <IconButton size="small" color="primary" onClick={() => handleEdit(info.row.original)}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            </RBACGuard>
            <RBACGuard requiredPermissions={['VISIT_DELETE']}>
              <Tooltip title="Delete">
                <IconButton size="small" color="error" onClick={() => handleDeleteClick(info.row.original)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </RBACGuard>
          </Stack>
        ),
        size: 130
      })
    ],
    []
  );

  // React Table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  });

  // Dialog handlers
  const handleCloseDialogs = () => {
    setViewDialogOpen(false);
    setCreateDialogOpen(false);
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setSelectedVisit(null);
    setFormData({
      memberId: null,
      providerId: null,
      visitType: 'CONSULTATION',
      diagnosis: '',
      visitDate: new Date(),
      status: 'SCHEDULED',
      costLyd: '',
      notes: ''
    });
  };

  const handleView = (visit) => {
    setSelectedVisit(visit);
    setViewDialogOpen(true);
  };

  const handleEdit = (visit) => {
    setSelectedVisit(visit);
    setFormData({
      memberId: visit.memberId,
      providerId: visit.providerId,
      visitType: visit.visitType || 'CONSULTATION',
      diagnosis: visit.diagnosis || '',
      visitDate: visit.visitDate ? new Date(visit.visitDate) : new Date(),
      status: visit.status || 'SCHEDULED',
      costLyd: visit.costLyd || '',
      notes: visit.notes || ''
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (visit) => {
    setSelectedVisit(visit);
    setDeleteDialogOpen(true);
  };

  // CRUD operations
  const handleCreate = async () => {
    if (!formData.memberId || !formData.providerId) {
      enqueueSnackbar('Member and Provider are required', { variant: 'error' });
      return;
    }

    if (!formData.diagnosis) {
      enqueueSnackbar('Diagnosis is required', { variant: 'error' });
      return;
    }

    try {
      const payload = {
        ...formData,
        visitDate: formData.visitDate?.toISOString(),
        costLyd: formData.costLyd ? parseFloat(formData.costLyd) : null
      };

      const response = await visitsService.create(payload);

      if (response.success) {
        enqueueSnackbar('Visit created successfully', { variant: 'success' });
        loadVisits();
        handleCloseDialogs();
      } else {
        enqueueSnackbar(response.error || 'Failed to create visit', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar(err.message || 'Failed to create visit', { variant: 'error' });
    }
  };

  const handleUpdate = async () => {
    if (!formData.memberId || !formData.providerId) {
      enqueueSnackbar('Member and Provider are required', { variant: 'error' });
      return;
    }

    if (!formData.diagnosis) {
      enqueueSnackbar('Diagnosis is required', { variant: 'error' });
      return;
    }

    try {
      const payload = {
        ...formData,
        visitDate: formData.visitDate?.toISOString(),
        costLyd: formData.costLyd ? parseFloat(formData.costLyd) : null
      };

      const response = await visitsService.update(selectedVisit.id || selectedVisit.visitId, payload);

      if (response.success) {
        enqueueSnackbar('Visit updated successfully', { variant: 'success' });
        loadVisits();
        handleCloseDialogs();
      } else {
        enqueueSnackbar(response.error || 'Failed to update visit', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar(err.message || 'Failed to update visit', { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await visitsService.delete(selectedVisit.id || selectedVisit.visitId);

      if (response.success) {
        enqueueSnackbar('Visit deleted successfully', { variant: 'success' });
        loadVisits();
        handleCloseDialogs();
      } else {
        enqueueSnackbar(response.error || 'Failed to delete visit', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar(err.message || 'Failed to delete visit', { variant: 'error' });
    }
  };

  // Render loading state
  if (loading) {
    return (
      <RBACGuard requiredPermissions={['VISIT_READ']}>
        <MainCard title="Visits Management">
          <TableSkeleton columns={12} rows={5} />
        </MainCard>
      </RBACGuard>
    );
  }

  // Render error state
  if (error) {
    return (
      <RBACGuard requiredPermissions={['VISIT_READ']}>
        <MainCard title="Visits Management">
          <ErrorFallback error={error} onRetry={loadVisits} />
        </MainCard>
      </RBACGuard>
    );
  }

  return (
    <RBACGuard requiredPermissions={['VISIT_READ']}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MainCard
          title="Visits Management"
          secondary={
            <Stack direction="row" spacing={1}>
              <Tooltip title="Refresh">
                <IconButton size="small" onClick={loadVisits}>
                  <Refresh />
                </IconButton>
              </Tooltip>
              <RBACGuard requiredPermissions={['VISIT_CREATE']}>
                <Button variant="contained" startIcon={<Add />} onClick={() => setCreateDialogOpen(true)} size="small">
                  New Visit
                </Button>
              </RBACGuard>
            </Stack>
          }
        >
          {/* Filters */}
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search visits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  label="Search"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                    <MenuItem value="all">All Status</MenuItem>
                    {VISIT_STATUS.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Employer</InputLabel>
                  <Select value={employerFilter} onChange={(e) => setEmployerFilter(e.target.value)} label="Employer">
                    <MenuItem value="all">All Employers</MenuItem>
                    {EMPLOYERS.map((employer) => (
                      <MenuItem key={employer.code} value={employer.labelEn}>
                        {employer.labelEn}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Provider</InputLabel>
                  <Select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)} label="Provider">
                    <MenuItem value="all">All Providers</MenuItem>
                    {providers.map((provider) => (
                      <MenuItem key={provider.id} value={provider.id.toString()}>
                        {provider.nameEn || provider.nameAr}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Stack>

          {/* Table */}
          {filteredData.length === 0 ? (
            <EmptyState message="No visits found" />
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          style={{
                            textAlign: 'left',
                            padding: '12px',
                            borderBottom: '2px solid #e0e0e0',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} style={{ padding: '12px' }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="body2">
                  Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                  {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredData.length)} of{' '}
                  {filteredData.length} visits
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button size="small" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Previous
                  </Button>
                  <Button size="small" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                  </Button>
                </Stack>
              </Box>
            </Box>
          )}
        </MainCard>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
          <DialogTitle>Visit Details</DialogTitle>
          <DialogContent>
            {selectedVisit && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Visit ID
                  </Typography>
                  <Typography variant="body1">#{selectedVisit.visitId}</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Member
                    </Typography>
                    <Typography variant="body1">{selectedVisit.memberName || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Employer
                    </Typography>
                    <Typography variant="body1">{selectedVisit.employerName || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Provider
                    </Typography>
                    <Typography variant="body1">{selectedVisit.providerName || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Visit Type
                    </Typography>
                    <Chip label={selectedVisit.visitType?.replace('_', ' ')} size="small" color="primary" variant="outlined" />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Diagnosis
                    </Typography>
                    <Typography variant="body1">{selectedVisit.diagnosis || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Visit Date
                    </Typography>
                    <Typography variant="body1">
                      {selectedVisit.visitDate
                        ? new Date(selectedVisit.visitDate).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={VISIT_STATUS.find((s) => s.value === selectedVisit.status)?.label || selectedVisit.status}
                      color={VISIT_STATUS.find((s) => s.value === selectedVisit.status)?.color || 'default'}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Cost (LYD)
                    </Typography>
                    <Typography variant="body1">
                      {selectedVisit.costLyd ? `${parseFloat(selectedVisit.costLyd).toFixed(2)} LYD` : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Policy Number
                    </Typography>
                    <Typography variant="body1">{selectedVisit.policyNumber || '-'}</Typography>
                  </Grid>
                  {selectedVisit.notes && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Notes
                      </Typography>
                      <Typography variant="body1">{selectedVisit.notes}</Typography>
                    </Grid>
                  )}
                </Grid>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
          <DialogTitle>Create New Visit</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Autocomplete
                options={members}
                getOptionLabel={(option) => `${option.nameEn || option.nameAr} (${option.memberId || option.id})`}
                value={members.find((m) => m.id === formData.memberId) || null}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, memberId: newValue?.id || null });
                }}
                renderInput={(params) => <TextField {...params} label="Select Member *" placeholder="Search member" />}
              />
              <Autocomplete
                options={providers}
                getOptionLabel={(option) => `${option.nameEn || option.nameAr} - ${option.providerType || ''}`}
                value={providers.find((p) => p.id === formData.providerId) || null}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, providerId: newValue?.id || null });
                }}
                renderInput={(params) => <TextField {...params} label="Select Provider *" placeholder="Search provider" />}
              />
              <FormControl fullWidth>
                <InputLabel>Visit Type *</InputLabel>
                <Select
                  value={formData.visitType}
                  onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
                  label="Visit Type *"
                >
                  {VISIT_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Diagnosis *"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                multiline
                rows={3}
                placeholder="Enter diagnosis details"
              />
              <DateTimePicker
                label="Visit Date & Time *"
                value={formData.visitDate}
                onChange={(newValue) => setFormData({ ...formData, visitDate: newValue })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <FormControl fullWidth>
                <InputLabel>Status *</InputLabel>
                <Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} label="Status *">
                  {VISIT_STATUS.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Cost (LYD)"
                type="number"
                value={formData.costLyd}
                onChange={(e) => setFormData({ ...formData, costLyd: e.target.value })}
                placeholder="0.00"
                inputProps={{ step: '0.01', min: '0' }}
              />
              <TextField
                fullWidth
                label="Notes (Optional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                multiline
                rows={3}
                placeholder="Additional notes"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
            <Button onClick={handleCreate} variant="contained" color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
          <DialogTitle>Edit Visit</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Autocomplete
                options={members}
                getOptionLabel={(option) => `${option.nameEn || option.nameAr} (${option.memberId || option.id})`}
                value={members.find((m) => m.id === formData.memberId) || null}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, memberId: newValue?.id || null });
                }}
                renderInput={(params) => <TextField {...params} label="Select Member *" placeholder="Search member" />}
              />
              <Autocomplete
                options={providers}
                getOptionLabel={(option) => `${option.nameEn || option.nameAr} - ${option.providerType || ''}`}
                value={providers.find((p) => p.id === formData.providerId) || null}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, providerId: newValue?.id || null });
                }}
                renderInput={(params) => <TextField {...params} label="Select Provider *" placeholder="Search provider" />}
              />
              <FormControl fullWidth>
                <InputLabel>Visit Type *</InputLabel>
                <Select
                  value={formData.visitType}
                  onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
                  label="Visit Type *"
                >
                  {VISIT_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Diagnosis *"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                multiline
                rows={3}
                placeholder="Enter diagnosis details"
              />
              <DateTimePicker
                label="Visit Date & Time *"
                value={formData.visitDate}
                onChange={(newValue) => setFormData({ ...formData, visitDate: newValue })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <FormControl fullWidth>
                <InputLabel>Status *</InputLabel>
                <Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} label="Status *">
                  {VISIT_STATUS.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Cost (LYD)"
                type="number"
                value={formData.costLyd}
                onChange={(e) => setFormData({ ...formData, costLyd: e.target.value })}
                placeholder="0.00"
                inputProps={{ step: '0.01', min: '0' }}
              />
              <TextField
                fullWidth
                label="Notes (Optional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                multiline
                rows={3}
                placeholder="Additional notes"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleCloseDialogs} maxWidth="xs" fullWidth>
          <DialogTitle>Delete Visit</DialogTitle>
          <DialogContent>
            {selectedVisit && (
              <Stack spacing={2}>
                <Alert severity="warning">Are you sure you want to delete this visit? This action cannot be undone.</Alert>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Visit ID
                  </Typography>
                  <Typography variant="body1">#{selectedVisit.visitId}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Member
                  </Typography>
                  <Typography variant="body1">{selectedVisit.memberName || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Provider
                  </Typography>
                  <Typography variant="body1">{selectedVisit.providerName || '-'}</Typography>
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
            <Button onClick={handleDelete} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </RBACGuard>
  );
}
