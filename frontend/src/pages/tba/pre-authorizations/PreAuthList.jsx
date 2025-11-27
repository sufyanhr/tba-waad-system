import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack
} from '@mui/material';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  useReactTable
} from '@tanstack/react-table';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Schedule as ReviewIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import RBACGuard from 'components/tba/RBACGuard';
import TableSkeleton from 'components/tba/TableSkeleton';
import ErrorFallback from 'components/tba/ErrorFallback';
import EmptyState from 'components/tba/EmptyState';
import MainCard from 'components/MainCard';
import preauthService from 'services/preauth.service';
import { EMPLOYERS } from 'constants/companies';

// ==============================|| COLUMN HELPER ||============================== //

const columnHelper = createColumnHelper();

// ==============================|| PRE-AUTH LIST ||============================== //

export default function PreAuthList() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // State management
  const [preAuths, setPreAuths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [employerFilter, setEmployerFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');

  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedPreAuth, setSelectedPreAuth] = useState(null);

  // Approval form
  const [approvedAmount, setApprovedAmount] = useState('');
  const [validityDays, setValidityDays] = useState('30');
  const [approvalNotes, setApprovalNotes] = useState('');

  // Rejection form
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('');

  // Load pre-authorizations
  const loadPreAuths = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await preauthService.list();
      if (response.success) {
        setPreAuths(Array.isArray(response.data) ? response.data : []);
      } else {
        throw new Error(response.error || 'Failed to load pre-authorizations');
      }
    } catch (err) {
      console.error('Error loading pre-authorizations:', err);
      setError(err.message || 'Failed to load pre-authorizations');
      enqueueSnackbar('Failed to load pre-authorizations', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    loadPreAuths();
  }, [loadPreAuths]);

  // Filter pre-authorizations
  const filteredPreAuths = useMemo(() => {
    return preAuths.filter((preAuth) => {
      // Search filter
      const matchesSearch =
        searchTerm === '' ||
        preAuth.preAuthNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        preAuth.member?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        preAuth.member?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        preAuth.providerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        preAuth.diagnosisDescription?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || preAuth.status === statusFilter;

      // Employer filter
      const matchesEmployer = employerFilter === 'all' || preAuth.member?.employer?.id?.toString() === employerFilter;

      // Service type filter
      const matchesType = serviceTypeFilter === 'all' || preAuth.serviceType === serviceTypeFilter;

      return matchesSearch && matchesStatus && matchesEmployer && matchesType;
    });
  }, [preAuths, searchTerm, statusFilter, employerFilter, serviceTypeFilter]);

  // Column definitions
  const columns = useMemo(
    () => [
      columnHelper.accessor('preAuthNumber', {
        header: 'Pre-Auth Number',
        cell: (info) => (
          <Typography
            variant="body2"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
            onClick={() => navigate(`/pre-authorizations/${info.row.original.id}`)}
          >
            {info.getValue() || 'N/A'}
          </Typography>
        ),
        size: 140
      }),
      columnHelper.accessor('member.firstName', {
        header: 'Member',
        cell: (info) => {
          const member = info.row.original.member;
          return member ? `${member.firstName || ''} ${member.lastName || ''}`.trim() : 'N/A';
        },
        size: 150
      }),
      columnHelper.accessor('member.employer.name', {
        header: 'Employer',
        cell: (info) => info.getValue() || 'N/A',
        size: 150
      }),
      columnHelper.accessor('providerName', {
        header: 'Provider',
        cell: (info) => info.getValue() || 'N/A',
        size: 150
      }),
      columnHelper.accessor('serviceType', {
        header: 'Service Type',
        cell: (info) => {
          const type = info.getValue();
          return <Chip label={type?.replace('_', ' ') || 'N/A'} size="small" color="default" variant="outlined" />;
        },
        size: 130
      }),
      columnHelper.accessor('diagnosisDescription', {
        header: 'Diagnosis',
        cell: (info) => {
          const diagnosis = info.getValue();
          return diagnosis ? (
            <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
              {diagnosis}
            </Typography>
          ) : (
            'N/A'
          );
        },
        size: 200
      }),
      columnHelper.accessor('estimatedCost', {
        header: 'Estimated Cost',
        cell: (info) => {
          const amount = info.getValue();
          return amount ? `${Number(amount).toFixed(2)} LYD` : '0.00 LYD';
        },
        size: 120
      }),
      columnHelper.accessor('approvedAmount', {
        header: 'Approved Amount',
        cell: (info) => {
          const amount = info.getValue();
          return amount ? `${Number(amount).toFixed(2)} LYD` : '-';
        },
        size: 130
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue();
          const statusColors = {
            PENDING: 'warning',
            UNDER_REVIEW: 'info',
            APPROVED: 'success',
            PARTIALLY_APPROVED: 'success',
            REJECTED: 'error',
            EXPIRED: 'default',
            MORE_INFO_REQUIRED: 'warning'
          };
          return <Chip label={status?.replace(/_/g, ' ') || 'PENDING'} color={statusColors[status] || 'default'} size="small" />;
        },
        size: 150
      }),
      columnHelper.accessor('requestDate', {
        header: 'Request Date',
        cell: (info) => {
          const date = info.getValue();
          return date ? new Date(date).toLocaleDateString('en-GB') : 'N/A';
        },
        size: 110
      }),
      columnHelper.accessor('expectedServiceDate', {
        header: 'Service Date',
        cell: (info) => {
          const date = info.getValue();
          return date ? new Date(date).toLocaleDateString('en-GB') : 'N/A';
        },
        size: 110
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const preAuth = info.row.original;
          return (
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" color="primary" onClick={() => navigate(`/pre-authorizations/${preAuth.id}`)} title="View">
                <ViewIcon fontSize="small" />
              </IconButton>

              <RBACGuard permission="PREAUTH_UPDATE">
                <IconButton size="small" color="info" onClick={() => navigate(`/pre-authorizations/${preAuth.id}/edit`)} title="Edit">
                  <EditIcon fontSize="small" />
                </IconButton>
              </RBACGuard>

              {preAuth.status === 'PENDING' && (
                <>
                  <RBACGuard permission="PREAUTH_REVIEW">
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => {
                        setSelectedPreAuth(preAuth);
                        setReviewDialogOpen(true);
                      }}
                      title="Mark Under Review"
                    >
                      <ReviewIcon fontSize="small" />
                    </IconButton>
                  </RBACGuard>

                  <RBACGuard permission="PREAUTH_APPROVE">
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => {
                        setSelectedPreAuth(preAuth);
                        setApprovedAmount(preAuth.estimatedCost?.toString() || '');
                        setValidityDays('30');
                        setApprovalNotes('');
                        setApproveDialogOpen(true);
                      }}
                      title="Approve"
                    >
                      <ApproveIcon fontSize="small" />
                    </IconButton>
                  </RBACGuard>

                  <RBACGuard permission="PREAUTH_REJECT">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedPreAuth(preAuth);
                        setRejectionReason('');
                        setRejectionNotes('');
                        setRejectDialogOpen(true);
                      }}
                      title="Reject"
                    >
                      <RejectIcon fontSize="small" />
                    </IconButton>
                  </RBACGuard>
                </>
              )}

              {preAuth.status === 'UNDER_REVIEW' && (
                <>
                  <RBACGuard permission="PREAUTH_APPROVE">
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => {
                        setSelectedPreAuth(preAuth);
                        setApprovedAmount(preAuth.estimatedCost?.toString() || '');
                        setValidityDays('30');
                        setApprovalNotes('');
                        setApproveDialogOpen(true);
                      }}
                      title="Approve"
                    >
                      <ApproveIcon fontSize="small" />
                    </IconButton>
                  </RBACGuard>

                  <RBACGuard permission="PREAUTH_REJECT">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedPreAuth(preAuth);
                        setRejectionReason('');
                        setRejectionNotes('');
                        setRejectDialogOpen(true);
                      }}
                      title="Reject"
                    >
                      <RejectIcon fontSize="small" />
                    </IconButton>
                  </RBACGuard>
                </>
              )}

              <RBACGuard permission="PREAUTH_DELETE">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    setSelectedPreAuth(preAuth);
                    setDeleteDialogOpen(true);
                  }}
                  title="Delete"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </RBACGuard>
            </Stack>
          );
        },
        size: 220
      })
    ],
    [navigate]
  );

  // React Table instance
  const table = useReactTable({
    data: filteredPreAuths,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 }
    }
  });

  // Handle delete
  const handleDelete = async () => {
    if (!selectedPreAuth) return;

    try {
      const response = await preauthService.delete(selectedPreAuth.id);
      if (response.success) {
        enqueueSnackbar('Pre-authorization deleted successfully', { variant: 'success' });
        setDeleteDialogOpen(false);
        setSelectedPreAuth(null);
        loadPreAuths();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error('Error deleting pre-authorization:', err);
      enqueueSnackbar('Failed to delete pre-authorization', { variant: 'error' });
    }
  };

  // Handle approve
  const handleApprove = async () => {
    if (!selectedPreAuth || !approvedAmount) {
      enqueueSnackbar('Please enter approved amount', { variant: 'warning' });
      return;
    }

    try {
      const response = await preauthService.approve(selectedPreAuth.id, {
        reviewerId: 1, // TODO: Get from auth context
        approvedAmount: parseFloat(approvedAmount),
        validityDays: parseInt(validityDays, 10),
        reviewerNotes: approvalNotes.trim() || undefined
      });

      if (response.success) {
        enqueueSnackbar('Pre-authorization approved successfully', { variant: 'success' });
        setApproveDialogOpen(false);
        setSelectedPreAuth(null);
        setApprovedAmount('');
        setValidityDays('30');
        setApprovalNotes('');
        loadPreAuths();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error('Error approving pre-authorization:', err);
      enqueueSnackbar('Failed to approve pre-authorization', { variant: 'error' });
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!selectedPreAuth || !rejectionReason.trim()) {
      enqueueSnackbar('Please enter rejection reason', { variant: 'warning' });
      return;
    }

    try {
      const response = await preauthService.reject(selectedPreAuth.id, {
        reviewerId: 1, // TODO: Get from auth context
        rejectionReason: rejectionReason.trim(),
        reviewerNotes: rejectionNotes.trim() || undefined
      });

      if (response.success) {
        enqueueSnackbar('Pre-authorization rejected successfully', { variant: 'success' });
        setRejectDialogOpen(false);
        setSelectedPreAuth(null);
        setRejectionReason('');
        setRejectionNotes('');
        loadPreAuths();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error('Error rejecting pre-authorization:', err);
      enqueueSnackbar('Failed to reject pre-authorization', { variant: 'error' });
    }
  };

  // Handle mark under review
  const handleMarkUnderReview = async () => {
    if (!selectedPreAuth) return;

    try {
      const response = await preauthService.markUnderReview(selectedPreAuth.id, 1); // TODO: Get reviewerId from auth

      if (response.success) {
        enqueueSnackbar('Pre-authorization marked as under review', { variant: 'success' });
        setReviewDialogOpen(false);
        setSelectedPreAuth(null);
        loadPreAuths();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error('Error marking under review:', err);
      enqueueSnackbar('Failed to mark pre-authorization as under review', { variant: 'error' });
    }
  };

  // Retry handler
  const handleRetry = () => {
    loadPreAuths();
  };

  // Loading state
  if (loading) {
    return (
      <MainCard title="Pre-Authorizations">
        <TableSkeleton rows={10} columns={12} />
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Pre-Authorizations">
        <ErrorFallback error={error} onRetry={handleRetry} />
      </MainCard>
    );
  }

  return (
    <RBACGuard permission="PREAUTH_READ">
      <MainCard
        title="Pre-Authorizations Management"
        secondary={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadPreAuths} size="small">
              Refresh
            </Button>
            <RBACGuard permission="PREAUTH_CREATE">
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/pre-authorizations/new')}>
                New Pre-Auth
              </Button>
            </RBACGuard>
          </Stack>
        }
      >
        {/* Filters */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search by pre-auth #, member, provider, diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 350 }}
          />

          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="PARTIALLY_APPROVED">Partially Approved</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
            <MenuItem value="EXPIRED">Expired</MenuItem>
            <MenuItem value="MORE_INFO_REQUIRED">More Info Required</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Service Type"
            value={serviceTypeFilter}
            onChange={(e) => setServiceTypeFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="INPATIENT">Inpatient</MenuItem>
            <MenuItem value="OUTPATIENT">Outpatient</MenuItem>
            <MenuItem value="SURGERY">Surgery</MenuItem>
            <MenuItem value="MATERNITY">Maternity</MenuItem>
            <MenuItem value="EMERGENCY">Emergency</MenuItem>
            <MenuItem value="DENTAL">Dental</MenuItem>
            <MenuItem value="OPTICAL">Optical</MenuItem>
            <MenuItem value="CHRONIC_DISEASE">Chronic Disease</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Employer"
            value={employerFilter}
            onChange={(e) => setEmployerFilter(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="all">All Employers</MenuItem>
            {EMPLOYERS.map((employer) => (
              <MenuItem key={employer.id} value={employer.id.toString()}>
                {employer.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Data Display */}
        {filteredPreAuths.length === 0 ? (
          <EmptyState
            message={
              searchTerm || statusFilter !== 'all' || employerFilter !== 'all' || serviceTypeFilter !== 'all'
                ? 'No pre-authorizations match your filters'
                : 'No pre-authorizations found'
            }
            actionLabel="Create First Pre-Authorization"
            onAction={() => navigate('/pre-authorizations/new')}
          />
        ) : (
          <>
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
                            padding: '12px 8px',
                            borderBottom: '2px solid #e0e0e0',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            color: '#424242',
                            cursor: header.column.getCanSort() ? 'pointer' : 'default'
                          }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽'
                          }[header.column.getIsSorted()] ?? null}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom: '1px solid #f0f0f0',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} style={{ padding: '12px 8px' }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredPreAuths.length)} of{' '}
                {filteredPreAuths.length} pre-authorizations
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
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Are you sure you want to delete pre-authorization <strong>{selectedPreAuth?.preAuthNumber}</strong>?
            </Alert>
            <Typography variant="body2" color="text.secondary">
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Approve Dialog */}
        <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Approve Pre-Authorization</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2, mt: 1 }}>
              Approving pre-authorization <strong>{selectedPreAuth?.preAuthNumber}</strong>
            </Alert>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Estimated Cost: <strong>{selectedPreAuth?.estimatedCost} LYD</strong>
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Approved Amount (LYD)"
                type="number"
                value={approvedAmount}
                onChange={(e) => setApprovedAmount(e.target.value)}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
              <TextField
                fullWidth
                label="Validity Period (Days)"
                type="number"
                value={validityDays}
                onChange={(e) => setValidityDays(e.target.value)}
                inputProps={{ min: 1, max: 365 }}
                helperText="Number of days this approval is valid"
                required
              />
              <TextField
                fullWidth
                label="Approval Notes (Optional)"
                multiline
                rows={3}
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Add any notes or conditions for this approval..."
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApprove} color="success" variant="contained" disabled={!approvedAmount || !validityDays}>
              Approve
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Reject Pre-Authorization</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2, mt: 1 }}>
              Rejecting pre-authorization <strong>{selectedPreAuth?.preAuthNumber}</strong>
            </Alert>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Rejection Reason"
                multiline
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide the main reason for rejection..."
                required
              />
              <TextField
                fullWidth
                label="Additional Notes (Optional)"
                multiline
                rows={2}
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                placeholder="Add any additional details or recommendations..."
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleReject} color="error" variant="contained" disabled={!rejectionReason.trim()}>
              Reject
            </Button>
          </DialogActions>
        </Dialog>

        {/* Mark Under Review Dialog */}
        <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Mark Under Review</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2, mt: 1 }}>
              Mark pre-authorization <strong>{selectedPreAuth?.preAuthNumber}</strong> as under review?
            </Alert>
            <Typography variant="body2" color="text.secondary">
              This will change the status to "Under Review" and assign you as the reviewer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleMarkUnderReview} color="secondary" variant="contained">
              Mark Under Review
            </Button>
          </DialogActions>
        </Dialog>
      </MainCard>
    </RBACGuard>
  );
}
