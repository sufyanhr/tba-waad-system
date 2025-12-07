import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Typography,
  TablePagination
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon
} from '@mui/icons-material';

// project imports
import MainCard from 'components/MainCard';
import RBACGuard from 'components/tba/RBACGuard';
import TableSkeleton from 'components/tba/LoadingSkeleton';
import ErrorFallback, { EmptyState } from 'components/tba/ErrorFallback';
import * as membersService from 'services/members.service';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';

// third-party
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';

// ==============================|| MEMBERS LIST PAGE ||============================== //

const columnHelper = createColumnHelper();

export default function MembersList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Define table columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('fullName', {
        header: 'Member Name',
        cell: (info) => (
          <Typography variant="body2" fontWeight={500}>
            {info.getValue()}
          </Typography>
        )
      }),
      columnHelper.accessor('civilId', {
        header: 'Civil ID',
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('policyNumber', {
        header: 'Policy Number',
        cell: (info) => (
          <Typography variant="body2" color="primary">
            {info.getValue()}
          </Typography>
        )
      }),
      columnHelper.accessor('employerName', {
        header: 'Employer',
        cell: (info) => info.getValue() || '-'
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: (info) => info.getValue() || '-'
      }),
      columnHelper.accessor('active', {
        header: 'Status',
        cell: (info) => (
          <Chip label={info.getValue() ? 'Active' : 'Inactive'} color={info.getValue() ? 'success' : 'default'} size="small" />
        )
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <Stack direction="row" spacing={0.5} justifyContent="center">
            <Tooltip title="View">
              <IconButton size="small" color="primary" onClick={() => handleViewMember(info.row.original.id)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <RBACGuard permission="MEMBER_MANAGE">
              <Tooltip title="Edit">
                <IconButton size="small" color="primary" onClick={() => handleEditMember(info.row.original.id)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" color="error" onClick={() => handleDeleteClick(info.row.original)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </RBACGuard>
          </Stack>
        )
      })
    ],
    []
  );

  // Load members from API
  const loadMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await membersService.getMembers({
        page,
        size: rowsPerPage,
        search: searchTerm,
        sortBy: 'id',
        sortDir: 'DESC'
      });

      setMembers(result.items || []);
      setTotalCount(result.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load members');
      setMembers([]);
      setTotalCount(0);
      enqueueSnackbar('Failed to load members', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [page, rowsPerPage, searchTerm]);

  // Event handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleViewMember = (id) => {
    navigate(`/members/${id}`);
  };

  const handleEditMember = (id) => {
    navigate(`/members/edit/${id}`);
  };

  const handleDeleteClick = (member) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await membersService.deleteMember(memberToDelete.id);
      enqueueSnackbar('Member deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
      loadMembers();
    } catch (err) {
      enqueueSnackbar('Failed to delete member', { variant: 'error' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setMemberToDelete(null);
  };

  const handleCreateMember = () => {
    navigate('/members/create');
  };

  const handleRetry = () => {
    loadMembers();
  };

  // Initialize React Table
  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalCount / rowsPerPage)
  });

  return (
    <RBACGuard permission="MEMBER_VIEW">
      <MainCard
        title="Members"
        secondary={
          <RBACGuard permission="MEMBER_MANAGE">
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateMember}>
              Add Member
            </Button>
          </RBACGuard>
        }
      >
        <Stack spacing={3}>
          {/* Search Bar */}
          <TextField
            placeholder="Search by name, civil ID, or policy number..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            fullWidth
          />

          {/* Error State */}
          {error && !loading && <ErrorFallback error={error} onRetry={handleRetry} />}

          {/* Loading State */}
          {loading && <TableSkeleton rows={rowsPerPage} columns={7} />}

          {/* Empty State */}
          {!loading && !error && members.length === 0 && (
            <EmptyState
              title="No members found"
              description={searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first member'}
              action={handleCreateMember}
              actionLabel="Add Member"
            />
          )}

          {/* Data Table */}
          {!loading && !error && members.length > 0 && (
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
                            padding: '12px 16px',
                            borderBottom: '1px solid #e0e0e0',
                            fontWeight: 600,
                            color: '#666'
                          }}
                        >
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fafafa')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} style={{ padding: '12px 16px' }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}

          {/* Pagination */}
          {!loading && !error && totalCount > 0 && (
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          )}
        </Stack>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete member "<strong>{memberToDelete?.fullName}</strong>"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </MainCard>
    </RBACGuard>
  );
}
