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
  InputLabel
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
import medicalCategoriesService from 'services/medical-categories.service';
import MainCard from 'components/MainCard';
import RBACGuard from 'components/tba/RBACGuard';
import TableSkeleton from 'components/tba/TableSkeleton';
import ErrorFallback from 'components/tba/ErrorFallback';
import EmptyState from 'components/tba/EmptyState';

const columnHelper = createColumnHelper();

export default function MedicalCategoriesList() {
  const { enqueueSnackbar } = useSnackbar();

  // State
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Dialogs
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Selected category
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    code: '',
    nameAr: '',
    nameEn: '',
    description: '',
    active: true
  });

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await medicalCategoriesService.getAll();

      if (response.success) {
        setData(Array.isArray(response.data) ? response.data : []);
      } else {
        throw new Error(response.error || 'Failed to load medical categories');
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      setError(err.message || 'Failed to load medical categories');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter((category) => {
      // Search filter
      const matchesSearch =
        searchTerm === '' ||
        category.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.nameAr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.nameEn?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === '' || (statusFilter === 'active' ? category.active === true : category.active === false);

      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, statusFilter]);

  // Columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('code', {
        header: 'Category Code',
        cell: (info) => (
          <Typography
            variant="body2"
            sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => handleViewOpen(info.row.original)}
          >
            {info.getValue()}
          </Typography>
        ),
        size: 120
      }),
      columnHelper.accessor('nameAr', {
        header: 'Arabic Name',
        cell: (info) => <Typography variant="body2">{info.getValue()}</Typography>,
        size: 200
      }),
      columnHelper.accessor('nameEn', {
        header: 'English Name',
        cell: (info) => <Typography variant="body2">{info.getValue()}</Typography>,
        size: 200
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: (info) => (
          <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {info.getValue() || '-'}
          </Typography>
        ),
        size: 300
      }),
      columnHelper.accessor('active', {
        header: 'Status',
        cell: (info) => (
          <Chip label={info.getValue() ? 'Active' : 'Inactive'} color={info.getValue() ? 'success' : 'default'} size="small" />
        ),
        size: 100
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: (info) => {
          const date = info.getValue();
          return <Typography variant="body2">{date ? new Date(date).toLocaleDateString('en-GB') : '-'}</Typography>;
        },
        size: 120
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Updated At',
        cell: (info) => {
          const date = info.getValue();
          return <Typography variant="body2">{date ? new Date(date).toLocaleDateString('en-GB') : '-'}</Typography>;
        },
        size: 120
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="View">
              <IconButton size="small" onClick={() => handleViewOpen(info.row.original)}>
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
            <RBACGuard requiredPermission="MEDICAL_CATEGORY_UPDATE">
              <Tooltip title="Edit">
                <IconButton size="small" color="primary" onClick={() => handleEditOpen(info.row.original)}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            </RBACGuard>
            <RBACGuard requiredPermission="MEDICAL_CATEGORY_DELETE">
              <Tooltip title="Delete">
                <IconButton size="small" color="error" onClick={() => handleDeleteOpen(info.row.original)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </RBACGuard>
          </Stack>
        ),
        size: 150
      })
    ],
    []
  );

  // Table instance
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
  const handleViewOpen = (category) => {
    setSelectedCategory(category);
    setViewDialogOpen(true);
  };

  const handleCreateOpen = () => {
    setFormData({
      code: '',
      nameAr: '',
      nameEn: '',
      description: '',
      active: true
    });
    setCreateDialogOpen(true);
  };

  const handleEditOpen = (category) => {
    setSelectedCategory(category);
    setFormData({
      code: category.code || '',
      nameAr: category.nameAr || '',
      nameEn: category.nameEn || '',
      description: category.description || '',
      active: category.active !== undefined ? category.active : true
    });
    setEditDialogOpen(true);
  };

  const handleDeleteOpen = (category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleCloseDialogs = () => {
    setViewDialogOpen(false);
    setCreateDialogOpen(false);
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
    setFormData({
      code: '',
      nameAr: '',
      nameEn: '',
      description: '',
      active: true
    });
  };

  // CRUD Operations
  const handleCreate = async () => {
    // Validation
    if (!formData.code || !formData.nameAr || !formData.nameEn) {
      enqueueSnackbar('Please fill in all required fields', { variant: 'warning' });
      return;
    }

    try {
      const response = await medicalCategoriesService.create(formData);

      if (response.success) {
        enqueueSnackbar(response.message || 'Medical category created successfully', { variant: 'success' });
        handleCloseDialogs();
        loadCategories();
      } else {
        throw new Error(response.error || 'Failed to create medical category');
      }
    } catch (err) {
      console.error('Error creating category:', err);
      enqueueSnackbar(err.message || 'Failed to create medical category', { variant: 'error' });
    }
  };

  const handleUpdate = async () => {
    // Validation
    if (!formData.code || !formData.nameAr || !formData.nameEn) {
      enqueueSnackbar('Please fill in all required fields', { variant: 'warning' });
      return;
    }

    if (!selectedCategory?.id) {
      enqueueSnackbar('No category selected for update', { variant: 'error' });
      return;
    }

    try {
      const response = await medicalCategoriesService.update(selectedCategory.id, formData);

      if (response.success) {
        enqueueSnackbar(response.message || 'Medical category updated successfully', { variant: 'success' });
        handleCloseDialogs();
        loadCategories();
      } else {
        throw new Error(response.error || 'Failed to update medical category');
      }
    } catch (err) {
      console.error('Error updating category:', err);
      enqueueSnackbar(err.message || 'Failed to update medical category', { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory?.id) {
      enqueueSnackbar('No category selected for deletion', { variant: 'error' });
      return;
    }

    try {
      const response = await medicalCategoriesService.delete(selectedCategory.id);

      if (response.success) {
        enqueueSnackbar(response.message || 'Medical category deleted successfully', { variant: 'success' });
        handleCloseDialogs();
        loadCategories();
      } else {
        throw new Error(response.error || 'Failed to delete medical category');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      enqueueSnackbar(err.message || 'Failed to delete medical category', { variant: 'error' });
    }
  };

  // Loading state
  if (loading) {
    return (
      <MainCard title="Medical Categories">
        <TableSkeleton rows={10} columns={8} />
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Medical Categories">
        <ErrorFallback error={error} onRetry={loadCategories} />
      </MainCard>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <MainCard title="Medical Categories">
        <EmptyState
          title="No Medical Categories"
          description="Get started by creating your first medical category"
          action={
            <RBACGuard requiredPermission="MEDICAL_CATEGORY_CREATE">
              <Button variant="contained" startIcon={<Add />} onClick={handleCreateOpen}>
                Create Category
              </Button>
            </RBACGuard>
          }
        />
      </MainCard>
    );
  }

  return (
    <RBACGuard requiredPermission="MEDICAL_CATEGORY_READ">
      <MainCard
        title="Medical Categories"
        secondary={
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton onClick={loadCategories} size="small">
                <Refresh />
              </IconButton>
            </Tooltip>
            <RBACGuard requiredPermission="MEDICAL_CATEGORY_CREATE">
              <Button variant="contained" startIcon={<Add />} onClick={handleCreateOpen}>
                Create Category
              </Button>
            </RBACGuard>
          </Stack>
        }
      >
        {/* Filters */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            placeholder="Search by code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ width: 300 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Table */}
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        padding: '12px',
                        textAlign: 'left',
                        borderBottom: '2px solid #e0e0e0',
                        fontWeight: 600,
                        cursor: header.column.getCanSort() ? 'pointer' : 'default'
                      }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder ? null : (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() && (
                            <span style={{ marginLeft: 4 }}>{header.column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽'}</span>
                          )}
                        </Box>
                      )}
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
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} style={{ padding: '12px' }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        {/* Pagination */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredData.length)} of{' '}
            {filteredData.length} entries
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button size="small" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </Stack>
        </Stack>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
          <DialogTitle>Medical Category Details</DialogTitle>
          <DialogContent>
            {selectedCategory && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Category Code
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedCategory.code}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Arabic Name
                  </Typography>
                  <Typography variant="body1">{selectedCategory.nameAr}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    English Name
                  </Typography>
                  <Typography variant="body1">{selectedCategory.nameEn}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Description
                  </Typography>
                  <Typography variant="body1">{selectedCategory.description || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedCategory.active ? 'Active' : 'Inactive'}
                      color={selectedCategory.active ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Created At
                  </Typography>
                  <Typography variant="body1">
                    {selectedCategory.createdAt ? new Date(selectedCategory.createdAt).toLocaleString('en-GB') : '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Updated At
                  </Typography>
                  <Typography variant="body1">
                    {selectedCategory.updatedAt ? new Date(selectedCategory.updatedAt).toLocaleString('en-GB') : '-'}
                  </Typography>
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
          <DialogTitle>Create Medical Category</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Category Code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                fullWidth
                placeholder="e.g., LAB, RAD, DENT"
              />
              <TextField
                label="Arabic Name"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                required
                fullWidth
                placeholder="الاسم بالعربية"
              />
              <TextField
                label="English Name"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                required
                fullWidth
                placeholder="Name in English"
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
                placeholder="Category description (optional)"
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.value })} label="Status">
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
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
        <Dialog open={editDialogOpen} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Medical Category</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Category Code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                fullWidth
                placeholder="e.g., LAB, RAD, DENT"
              />
              <TextField
                label="Arabic Name"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                required
                fullWidth
                placeholder="الاسم بالعربية"
              />
              <TextField
                label="English Name"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                required
                fullWidth
                placeholder="Name in English"
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
                placeholder="Category description (optional)"
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.value })} label="Status">
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
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
          <DialogTitle>Delete Medical Category</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Are you sure you want to delete this medical category?
            </Alert>
            {selectedCategory && (
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Code:</strong> {selectedCategory.code}
                </Typography>
                <Typography variant="body2">
                  <strong>Name (EN):</strong> {selectedCategory.nameEn}
                </Typography>
                <Typography variant="body2">
                  <strong>Name (AR):</strong> {selectedCategory.nameAr}
                </Typography>
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
      </MainCard>
    </RBACGuard>
  );
}
