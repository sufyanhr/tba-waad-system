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
import medicalServicesService from 'services/medical-services.service';
import medicalCategoriesService from 'services/medical-categories.service';
import MainCard from 'components/MainCard';
import RBACGuard from 'components/tba/RBACGuard';
import TableSkeleton from 'components/tba/TableSkeleton';
import ErrorFallback from 'components/tba/ErrorFallback';
import EmptyState from 'components/tba/EmptyState';

const columnHelper = createColumnHelper();

export default function MedicalServicesList() {
  const { enqueueSnackbar } = useSnackbar();

  // State
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  // Dialogs
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Selected service
  const [selectedService, setSelectedService] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    code: '',
    nameAr: '',
    nameEn: '',
    categoryId: '',
    priceLyd: '',
    costLyd: '',
    coverageLimit: '',
    description: '',
    active: true
  });

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      const response = await medicalCategoriesService.getAll();
      if (response.success) {
        setCategories(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  }, []);

  // Load services
  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await medicalServicesService.getAll();

      if (response.success) {
        setData(Array.isArray(response.data) ? response.data : []);
      } else {
        throw new Error(response.error || 'Failed to load medical services');
      }
    } catch (err) {
      console.error('Error loading services:', err);
      setError(err.message || 'Failed to load medical services');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    loadServices();
  }, [loadCategories, loadServices]);

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter((service) => {
      // Search filter
      const matchesSearch =
        searchTerm === '' ||
        service.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.nameAr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.nameEn?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = categoryFilter === '' || service.categoryId === Number(categoryFilter);

      // Status filter
      const matchesStatus = statusFilter === '' || (statusFilter === 'active' ? service.active === true : service.active === false);

      // Price range filter
      const price = Number(service.priceLyd);
      const matchesPriceMin = priceMin === '' || price >= Number(priceMin);
      const matchesPriceMax = priceMax === '' || price <= Number(priceMax);

      return matchesSearch && matchesCategory && matchesStatus && matchesPriceMin && matchesPriceMax;
    });
  }, [data, searchTerm, categoryFilter, statusFilter, priceMin, priceMax]);

  // Columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('code', {
        header: 'Service Code',
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
        cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
        size: 200
      }),
      columnHelper.accessor('categoryNameEn', {
        header: 'Category',
        cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
        size: 150
      }),
      columnHelper.accessor('categoryNameAr', {
        header: 'Category (AR)',
        cell: (info) => {
          const row = info.row.original;
          return <Typography variant="body2">{row.categoryNameAr || '-'}</Typography>;
        },
        size: 150
      }),
      columnHelper.accessor('categoryCode', {
        header: 'Category Code',
        cell: (info) => {
          const row = info.row.original;
          return <Typography variant="body2">{row.categoryCode || '-'}</Typography>;
        },
        size: 120
      }),
      columnHelper.accessor('priceLyd', {
        header: 'Price (LYD)',
        cell: (info) => {
          const price = info.getValue();
          return <Typography variant="body2">{price ? `${Number(price).toFixed(2)} LYD` : '-'}</Typography>;
        },
        size: 120
      }),
      columnHelper.accessor('costLyd', {
        header: 'Cost (LYD)',
        cell: (info) => {
          const cost = info.getValue();
          return <Typography variant="body2">{cost ? `${Number(cost).toFixed(2)} LYD` : '-'}</Typography>;
        },
        size: 120
      }),
      columnHelper.accessor('coverageLimit', {
        header: 'Coverage Limit',
        cell: (info) => {
          const limit = info.getValue();
          return <Typography variant="body2">{limit ? `${Number(limit).toFixed(2)} LYD` : '-'}</Typography>;
        },
        size: 140
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: (info) => {
          const date = info.getValue();
          return (
            <Typography variant="body2">
              {date ? new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
            </Typography>
          );
        },
        size: 120
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Updated At',
        cell: (info) => {
          const date = info.getValue();
          return (
            <Typography variant="body2">
              {date ? new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
            </Typography>
          );
        },
        size: 120
      }),
      columnHelper.accessor('active', {
        header: 'Status',
        cell: (info) => (
          <Chip label={info.getValue() ? 'Active' : 'Inactive'} color={info.getValue() ? 'success' : 'default'} size="small" />
        ),
        size: 100
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
            <RBACGuard requiredPermission="MEDICAL_SERVICE_UPDATE">
              <Tooltip title="Edit">
                <IconButton size="small" color="primary" onClick={() => handleEditOpen(info.row.original)}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            </RBACGuard>
            <RBACGuard requiredPermission="MEDICAL_SERVICE_DELETE">
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
  const handleViewOpen = (service) => {
    setSelectedService(service);
    setViewDialogOpen(true);
  };

  const handleCreateOpen = () => {
    setFormData({
      code: '',
      nameAr: '',
      nameEn: '',
      categoryId: '',
      priceLyd: '',
      costLyd: '',
      coverageLimit: '',
      description: '',
      active: true
    });
    setCreateDialogOpen(true);
  };

  const handleEditOpen = (service) => {
    setSelectedService(service);
    setFormData({
      code: service.code || '',
      nameAr: service.nameAr || '',
      nameEn: service.nameEn || '',
      categoryId: service.categoryId || '',
      priceLyd: service.priceLyd || '',
      costLyd: service.costLyd || '',
      coverageLimit: service.coverageLimit || '',
      description: service.description || '',
      active: service.active !== undefined ? service.active : true
    });
    setEditDialogOpen(true);
  };

  const handleDeleteOpen = (service) => {
    setSelectedService(service);
    setDeleteDialogOpen(true);
  };

  const handleCloseDialogs = () => {
    setViewDialogOpen(false);
    setCreateDialogOpen(false);
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setSelectedService(null);
    setFormData({
      code: '',
      nameAr: '',
      nameEn: '',
      categoryId: '',
      priceLyd: '',
      costLyd: '',
      coverageLimit: '',
      description: '',
      active: true
    });
  };

  // CRUD Operations
  const handleCreate = async () => {
    // Validation
    if (!formData.code || !formData.nameAr || !formData.priceLyd || !formData.categoryId) {
      enqueueSnackbar('Please fill in all required fields', { variant: 'warning' });
      return;
    }

    try {
      const payload = {
        code: formData.code,
        nameAr: formData.nameAr,
        nameEn: formData.nameEn || formData.nameAr,
        categoryId: Number(formData.categoryId),
        priceLyd: Number(formData.priceLyd),
        costLyd: formData.costLyd ? Number(formData.costLyd) : null,
        coverageLimit: formData.coverageLimit ? Number(formData.coverageLimit) : null,
        description: formData.description || null,
        active: formData.active
      };

      const response = await medicalServicesService.create(payload);

      if (response.success) {
        enqueueSnackbar(response.message || 'Medical service created successfully', { variant: 'success' });
        handleCloseDialogs();
        loadServices();
      } else {
        throw new Error(response.error || 'Failed to create medical service');
      }
    } catch (err) {
      console.error('Error creating service:', err);
      enqueueSnackbar(err.message || 'Failed to create medical service', { variant: 'error' });
    }
  };

  const handleUpdate = async () => {
    // Validation
    if (!formData.code || !formData.nameAr || !formData.priceLyd || !formData.categoryId) {
      enqueueSnackbar('Please fill in all required fields', { variant: 'warning' });
      return;
    }

    if (!selectedService?.id) {
      enqueueSnackbar('No service selected for update', { variant: 'error' });
      return;
    }

    try {
      const payload = {
        code: formData.code,
        nameAr: formData.nameAr,
        nameEn: formData.nameEn || formData.nameAr,
        categoryId: Number(formData.categoryId),
        priceLyd: Number(formData.priceLyd),
        costLyd: formData.costLyd ? Number(formData.costLyd) : null,
        coverageLimit: formData.coverageLimit ? Number(formData.coverageLimit) : null,
        description: formData.description || null,
        active: formData.active
      };

      const response = await medicalServicesService.update(selectedService.id, payload);

      if (response.success) {
        enqueueSnackbar(response.message || 'Medical service updated successfully', { variant: 'success' });
        handleCloseDialogs();
        loadServices();
      } else {
        throw new Error(response.error || 'Failed to update medical service');
      }
    } catch (err) {
      console.error('Error updating service:', err);
      enqueueSnackbar(err.message || 'Failed to update medical service', { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!selectedService?.id) {
      enqueueSnackbar('No service selected for deletion', { variant: 'error' });
      return;
    }

    try {
      const response = await medicalServicesService.delete(selectedService.id);

      if (response.success) {
        enqueueSnackbar(response.message || 'Medical service deleted successfully', { variant: 'success' });
        handleCloseDialogs();
        loadServices();
      } else {
        throw new Error(response.error || 'Failed to delete medical service');
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      enqueueSnackbar(err.message || 'Failed to delete medical service', { variant: 'error' });
    }
  };

  // Loading state
  if (loading) {
    return (
      <MainCard title="Medical Services">
        <TableSkeleton rows={10} columns={13} />
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Medical Services">
        <ErrorFallback error={error} onRetry={loadServices} />
      </MainCard>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <MainCard title="Medical Services">
        <EmptyState
          title="No Medical Services"
          description="Get started by creating your first medical service"
          action={
            <RBACGuard requiredPermission="MEDICAL_SERVICE_CREATE">
              <Button variant="contained" startIcon={<Add />} onClick={handleCreateOpen}>
                Create Service
              </Button>
            </RBACGuard>
          }
        />
      </MainCard>
    );
  }

  return (
    <RBACGuard requiredPermission="MEDICAL_SERVICE_READ">
      <MainCard
        title="Medical Services"
        secondary={
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton onClick={loadServices} size="small">
                <Refresh />
              </IconButton>
            </Tooltip>
            <RBACGuard requiredPermission="MEDICAL_SERVICE_CREATE">
              <Button variant="contained" startIcon={<Add />} onClick={handleCreateOpen}>
                Create Service
              </Button>
            </RBACGuard>
          </Stack>
        }
      >
        {/* Filters */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
          <TextField
            placeholder="Search by code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ width: 300 }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Category</InputLabel>
            <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} label="Category">
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nameEn || cat.nameAr} ({cat.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <TextField
            placeholder="Min Price (LYD)"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            size="small"
            type="number"
            sx={{ width: 150 }}
          />
          <TextField
            placeholder="Max Price (LYD)"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            size="small"
            type="number"
            sx={{ width: 150 }}
          />
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
          <DialogTitle>Medical Service Details</DialogTitle>
          <DialogContent>
            {selectedService && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Service Code
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedService.code}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Arabic Name
                  </Typography>
                  <Typography variant="body1">{selectedService.nameAr}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    English Name
                  </Typography>
                  <Typography variant="body1">{selectedService.nameEn || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Category
                  </Typography>
                  <Typography variant="body1">{selectedService.categoryNameEn || selectedService.categoryNameAr || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Price (LYD)
                  </Typography>
                  <Typography variant="body1">
                    {selectedService.priceLyd ? `${Number(selectedService.priceLyd).toFixed(2)} LYD` : '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Cost (LYD)
                  </Typography>
                  <Typography variant="body1">
                    {selectedService.costLyd ? `${Number(selectedService.costLyd).toFixed(2)} LYD` : '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedService.active ? 'Active' : 'Inactive'}
                      color={selectedService.active ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
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
          <DialogTitle>Create Medical Service</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Service Code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                fullWidth
                placeholder="e.g., CBC, XR-CHEST"
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
                fullWidth
                placeholder="Name in English (optional)"
              />
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  label="Category"
                >
                  <MenuItem value="">
                    <em>Select Category</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.nameEn || cat.nameAr} ({cat.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Price (LYD)"
                value={formData.priceLyd}
                onChange={(e) => setFormData({ ...formData, priceLyd: e.target.value })}
                required
                fullWidth
                type="number"
                placeholder="0.00"
              />
              <TextField
                label="Cost (LYD)"
                value={formData.costLyd}
                onChange={(e) => setFormData({ ...formData, costLyd: e.target.value })}
                fullWidth
                type="number"
                placeholder="0.00 (optional)"
              />
              <TextField
                label="Coverage Limit (LYD)"
                value={formData.coverageLimit}
                onChange={(e) => setFormData({ ...formData, coverageLimit: e.target.value })}
                fullWidth
                type="number"
                placeholder="0.00 (optional)"
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
                placeholder="Service description (optional)"
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
          <DialogTitle>Edit Medical Service</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Service Code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                fullWidth
                placeholder="e.g., CBC, XR-CHEST"
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
                fullWidth
                placeholder="Name in English (optional)"
              />
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  label="Category"
                >
                  <MenuItem value="">
                    <em>Select Category</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.nameEn || cat.nameAr} ({cat.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Price (LYD)"
                value={formData.priceLyd}
                onChange={(e) => setFormData({ ...formData, priceLyd: e.target.value })}
                required
                fullWidth
                type="number"
                placeholder="0.00"
              />
              <TextField
                label="Cost (LYD)"
                value={formData.costLyd}
                onChange={(e) => setFormData({ ...formData, costLyd: e.target.value })}
                fullWidth
                type="number"
                placeholder="0.00 (optional)"
              />
              <TextField
                label="Coverage Limit (LYD)"
                value={formData.coverageLimit}
                onChange={(e) => setFormData({ ...formData, coverageLimit: e.target.value })}
                fullWidth
                type="number"
                placeholder="0.00 (optional)"
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
                placeholder="Service description (optional)"
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
          <DialogTitle>Delete Medical Service</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Are you sure you want to delete this medical service?
            </Alert>
            {selectedService && (
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Code:</strong> {selectedService.code}
                </Typography>
                <Typography variant="body2">
                  <strong>Name (AR):</strong> {selectedService.nameAr}
                </Typography>
                <Typography variant="body2">
                  <strong>Name (EN):</strong> {selectedService.nameEn || '-'}
                </Typography>
                <Typography variant="body2">
                  <strong>Price:</strong> {selectedService.priceLyd ? `${Number(selectedService.priceLyd).toFixed(2)} LYD` : '-'}
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
