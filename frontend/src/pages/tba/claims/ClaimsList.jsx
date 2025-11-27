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
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import RBACGuard from 'components/tba/RBACGuard';
import TableSkeleton from 'components/tba/TableSkeleton';
import ErrorFallback from 'components/tba/ErrorFallback';
import EmptyState from 'components/tba/EmptyState';
import MainCard from 'components/MainCard';
import { claimsService } from 'services/api/claimsService';
import { EMPLOYERS } from 'constants/companies';

// ==============================|| COLUMN HELPER ||============================== //

const columnHelper = createColumnHelper();

// ==============================|| CLAIMS LIST ||============================== //

export default function ClaimsList() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // State management
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [employerFilter, setEmployerFilter] = useState('all');
  const [claimTypeFilter, setClaimTypeFilter] = useState('all');

  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [approvalAmount, setApprovalAmount] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Load claims data
  const loadClaims = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await claimsService.getAll();
      const data = response?.data || [];
      setClaims(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading claims:', err);
      setError(err.message || 'Failed to load claims');
      enqueueSnackbar('Failed to load claims', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    loadClaims();
  }, [loadClaims]);

  // Filter claims
  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      // Search filter
      const matchesSearch =
        searchTerm === '' ||
        claim.claimNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.member?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.member?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.providerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.diagnosisDescription?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;

      // Employer filter
      const matchesEmployer = 
        employerFilter === 'all' ||
        claim.member?.employer?.id?.toString() === employerFilter;

      // Claim type filter
      const matchesType = 
        claimTypeFilter === 'all' ||
        claim.claimType === claimTypeFilter;

      return matchesSearch && matchesStatus && matchesEmployer && matchesType;
    });
  }, [claims, searchTerm, statusFilter, employerFilter, claimTypeFilter]);

  // Column definitions
  const columns = useMemo(
    () => [
      columnHelper.accessor('claimNumber', {
        header: 'Claim Number',
        cell: (info) => (
          <Typography
            variant="body2"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
            onClick={() => navigate(`/claims/${info.row.original.id}`)}
          >
            {info.getValue() || 'N/A'}
          </Typography>
        ),
        size: 130
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
      columnHelper.accessor('claimType', {
        header: 'Type',
        cell: (info) => {
          const type = info.getValue();
          return (
            <Chip label={type?.replace('_', ' ') || 'N/A'} size="small" color="default" variant="outlined" />
          );
        },
        size: 120
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
      columnHelper.accessor('totalClaimed', {
        header: 'Claimed Amount',
        cell: (info) => {
          const amount = info.getValue();
          return amount ? `${Number(amount).toFixed(2)} LYD` : '0.00 LYD';
        },
        size: 120
      }),
      columnHelper.accessor('totalApproved', {
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
            UNDER_MEDICAL_REVIEW: 'info',
            UNDER_FINANCIAL_REVIEW: 'info',
            APPROVED: 'success',
            PARTIALLY_APPROVED: 'success',
            REJECTED: 'error',
            RESUBMITTED: 'warning'
          };
          return (
            <Chip label={status?.replace(/_/g, ' ') || 'PENDING'} color={statusColors[status] || 'default'} size="small" />
          );
        },
        size: 150
      }),
      columnHelper.accessor('serviceDate', {
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
          const claim = info.row.original;
          return (
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" color="primary" onClick={() => navigate(`/claims/${claim.id}`)} title="View">
                <ViewIcon fontSize="small" />
              </IconButton>

              <RBACGuard permission="CLAIM_UPDATE">
                <IconButton size="small" color="info" onClick={() => navigate(`/claims/${claim.id}/edit`)} title="Edit">
                  <EditIcon fontSize="small" />
                </IconButton>
              </RBACGuard>

              {claim.status === 'PENDING' && (
                <>
                  <RBACGuard permission="CLAIM_APPROVE">
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => {
                        setSelectedClaim(claim);
                        setApprovalAmount(claim.totalClaimed?.toString() || '');
                        setApproveDialogOpen(true);
                      }}
                      title="Approve"
                    >
                      <ApproveIcon fontSize="small" />
                    </IconButton>
                  </RBACGuard>

                  <RBACGuard permission="CLAIM_REJECT">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedClaim(claim);
                        setRejectionReason('');
                        setRejectDialogOpen(true);
                      }}
                      title="Reject"
                    >
                      <RejectIcon fontSize="small" />
                    </IconButton>
                  </RBACGuard>
                </>
              )}

              <RBACGuard permission="CLAIM_DELETE">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    setSelectedClaim(claim);
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
        size: 200
      })
    ],
    [navigate]
  );

  // React Table instance
  const table = useReactTable({
    data: filteredClaims,
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
    if (!selectedClaim) return;

    try {
      await claimsService.remove(selectedClaim.id);
      enqueueSnackbar('Claim deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setSelectedClaim(null);
      loadClaims();
    } catch (err) {
      console.error('Error deleting claim:', err);
      enqueueSnackbar('Failed to delete claim', { variant: 'error' });
    }
  };

  // Handle approve
  const handleApprove = async () => {
    if (!selectedClaim || !approvalAmount) {
      enqueueSnackbar('Please enter approved amount', { variant: 'warning' });
      return;
    }

    try {
      await claimsService.approve(selectedClaim.id, {
        approvedAmount: parseFloat(approvalAmount),
        reviewerId: 1 // TODO: Get from auth context
      });
      enqueueSnackbar('Claim approved successfully', { variant: 'success' });
      setApproveDialogOpen(false);
      setSelectedClaim(null);
      setApprovalAmount('');
      loadClaims();
    } catch (err) {
      console.error('Error approving claim:', err);
      enqueueSnackbar('Failed to approve claim', { variant: 'error' });
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!selectedClaim || !rejectionReason.trim()) {
      enqueueSnackbar('Please enter rejection reason', { variant: 'warning' });
      return;
    }

    try {
      await claimsService.reject(selectedClaim.id, {
        rejectionReason: rejectionReason.trim(),
        reviewerId: 1 // TODO: Get from auth context
      });
      enqueueSnackbar('Claim rejected successfully', { variant: 'success' });
      setRejectDialogOpen(false);
      setSelectedClaim(null);
      setRejectionReason('');
      loadClaims();
    } catch (err) {
      console.error('Error rejecting claim:', err);
      enqueueSnackbar('Failed to reject claim', { variant: 'error' });
    }
  };

  // Retry handler
  const handleRetry = () => {
    loadClaims();
  };

  // Loading state
  if (loading) {
    return (
      <MainCard title="Claims">
        <TableSkeleton rows={10} columns={11} />
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Claims">
        <ErrorFallback error={error} onRetry={handleRetry} />
      </MainCard>
    );
  }

  return (
    <RBACGuard permission="CLAIM_READ">
      <MainCard
        title="Claims Management"
        secondary={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadClaims}
              size="small"
            >
              Refresh
            </Button>
            <RBACGuard permission="CLAIM_CREATE">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/claims/new')}
              >
                New Claim
              </Button>
            </RBACGuard>
          </Stack>
        }
      >
        {/* Filters */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search by claim #, member, provider, diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 300 }}
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
            <MenuItem value="UNDER_MEDICAL_REVIEW">Under Medical Review</MenuItem>
            <MenuItem value="UNDER_FINANCIAL_REVIEW">Under Financial Review</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="PARTIALLY_APPROVED">Partially Approved</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
            <MenuItem value="RESUBMITTED">Resubmitted</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Claim Type"
            value={claimTypeFilter}
            onChange={(e) => setClaimTypeFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="OUTPATIENT">Outpatient</MenuItem>
            <MenuItem value="INPATIENT">Inpatient</MenuItem>
            <MenuItem value="PHARMACY">Pharmacy</MenuItem>
            <MenuItem value="LABORATORY">Laboratory</MenuItem>
            <MenuItem value="RADIOLOGY">Radiology</MenuItem>
            <MenuItem value="DENTAL">Dental</MenuItem>
            <MenuItem value="OPTICAL">Optical</MenuItem>
            <MenuItem value="MATERNITY">Maternity</MenuItem>
            <MenuItem value="EMERGENCY">Emergency</MenuItem>
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
        {filteredClaims.length === 0 ? (
          <EmptyState
            message={searchTerm || statusFilter !== 'all' || employerFilter !== 'all' || claimTypeFilter !== 'all' 
              ? 'No claims match your filters' 
              : 'No claims found'}
            actionLabel="Create First Claim"
            onAction={() => navigate('/claims/new')}
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
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  filteredClaims.length
                )}{' '}
                of {filteredClaims.length} claims
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
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
              Are you sure you want to delete claim <strong>{selectedClaim?.claimNumber}</strong>?
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
          <DialogTitle>Approve Claim</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              Approving claim <strong>{selectedClaim?.claimNumber}</strong>
            </Alert>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Claimed Amount: <strong>{selectedClaim?.totalClaimed} LYD</strong>
            </Typography>
            <TextField
              fullWidth
              label="Approved Amount (LYD)"
              type="number"
              value={approvalAmount}
              onChange={(e) => setApprovalAmount(e.target.value)}
              inputProps={{ min: 0, step: 0.01 }}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApprove} color="success" variant="contained" disabled={!approvalAmount}>
              Approve
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Reject Claim</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Rejecting claim <strong>{selectedClaim?.claimNumber}</strong>
            </Alert>
            <TextField
              fullWidth
              label="Rejection Reason"
              multiline
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejecting this claim..."
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleReject}
              color="error"
              variant="contained"
              disabled={!rejectionReason.trim()}
            >
              Reject
            </Button>
          </DialogActions>
        </Dialog>
      </MainCard>
    </RBACGuard>
  );
}
