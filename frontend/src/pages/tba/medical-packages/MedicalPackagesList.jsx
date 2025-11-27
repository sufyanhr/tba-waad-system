import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Alert,
  Autocomplete
} from '@mui/material';
import { Add, Delete, Edit, Refresh, Visibility } from '@mui/icons-material';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useSnackbar } from 'notistack';

// Project imports
import MainCard from 'components/MainCard';
import { RBACGuard } from 'contexts/RBACContext';
import TableSkeleton from 'components/tba/TableSkeleton';
import ErrorFallback from 'components/ErrorFallback';
import EmptyState from 'components/tba/EmptyState';
import medicalPackagesService from 'services/medical-packages.service';
import medicalServicesService from 'services/medical-services.service';

const columnHelper = createColumnHelper();

export default function MedicalPackagesList() {
  const { enqueueSnackbar } = useSnackbar();

  // State management
  const [data, setData] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [servicesCountMin, setServicesCountMin] = useState('');
  const [servicesCountMax, setServicesCountMax] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    code: '',
    nameAr: '',
    nameEn: '',
    description: '',
    serviceIds: [],
    totalCoverageLimit: '',
    active: true
  });

  // Load medical services for selection
  const loadServices = useCallback(async () => {
    try {
      const response = await medicalServicesService.getAll();
      if (response.success) {
        setServices(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('Error loading services:', err);
    }
  }, []);

  // Load medical packages
  const loadPackages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await medicalPackagesService.getAll();

      if (response.success) {
        setData(Array.isArray(response.data) ? response.data : []);
      } else {
        throw new Error(response.error || 'Failed to load medical packages');
      }
    } catch (err) {
      console.error('Error loading packages:', err);
      setError(err.message || 'Failed to load medical packages');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
    loadPackages();
  }, [loadServices, loadPackages]);

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter((pkg) => {
      // Search filter
      const matchesSearch =
        searchTerm === '' ||
        pkg.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.nameAr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.nameEn?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? pkg.active === true : pkg.active === false);

      // Services count filter
      const count = pkg.servicesCount || 0;
      const matchesCountMin = servicesCountMin === '' || count >= Number(servicesCountMin);
      const matchesCountMax = servicesCountMax === '' || count <= Number(servicesCountMax);

      return matchesSearch && matchesStatus && matchesCountMin && matchesCountMax;
    });
  }, [data, searchTerm, statusFilter, servicesCountMin, servicesCountMax]);

  // Columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('code', {
        header: 'Package Code',
        cell: (info) => (
          <Typography
            variant="body2"
            sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => handleViewOpen(info.row.original)}
          >
            {info.getValue()}
          </Typography>
        ),
        size: 140
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
      columnHelper.accessor('servicesCount', {
        header: 'Services Count',
        cell: (info) => {
          const count = info.getValue() || 0;
          return <Chip label={count} color={count > 0 ? 'primary' : 'default'} size="small" sx={{ minWidth: 50 }} />;
        },
        size: 120
      }),
      columnHelper.accessor('totalCoverageLimit', {
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
        size: 120
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Updated At',
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
            <RBACGuard requiredPermission="MEDICAL_PACKAGE_UPDATE">
              <Tooltip title="Edit">
                <IconButton size="small" color="primary" onClick={() => handleEditOpen(info.row.original)}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            </RBACGuard>
            <RBACGuard requiredPermission="MEDICAL_PACKAGE_DELETE">
              <Tooltip title="Delete">
                <IconButton size="small" color="error" onClick={() => handleDeleteOpen(info.row.original)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </RBACGuard>
          </Stack>
        ),
        size: 120
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
  const handleViewOpen = (pkg) => {
    setSelectedPackage(pkg);
    setViewDialogOpen(true);
  };

  const handleCreateOpen = () => {
    setFormData({
      code: '',
      nameAr: '',
      nameEn: '',
      description: '',
      serviceIds: [],
      totalCoverageLimit: '',
      active: true
    });
    setCreateDialogOpen(true);
  };

  const handleEditOpen = (pkg) => {
    setSelectedPackage(pkg);
    
    // Extract service IDs from services array
    const serviceIds = pkg.services ? pkg.services.map((s) => s.id) : [];
    
    setFormData({
      code: pkg.code || '',
      nameAr: pkg.nameAr || '',
      nameEn: pkg.nameEn || '',
      description: pkg.description || '',
      serviceIds: serviceIds,
      totalCoverageLimit: pkg.totalCoverageLimit || '',
      active: pkg.active !== undefined ? pkg.active : true
    });
    setEditDialogOpen(true);
  };

  const handleDeleteOpen = (pkg) => {
    setSelectedPackage(pkg);
    setDeleteDialogOpen(true);
  };

  const handleCloseDialogs = () => {
    setViewDialogOpen(false);
    setCreateDialogOpen(false);
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setSelectedPackage(null);
    setFormData({
      code: '',
      nameAr: '',
      nameEn: '',
      description: '',
      serviceIds: [],
      totalCoverageLimit: '',
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
      const payload = {
        code: formData.code,
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        description: formData.description || null,
        serviceIds: formData.serviceIds,
        totalCoverageLimit: formData.totalCoverageLimit ? Number(formData.totalCoverageLimit) : null,
        active: formData.active
      };

      const response = await medicalPackagesService.create(payload);

      if (response.success) {
        enqueueSnackbar(response.message || 'Medical package created successfully', { variant: 'success' });
        handleCloseDialogs();
        loadPackages();
      } else {
        throw new Error(response.error || 'Failed to create medical package');
      }
    } catch (err) {
      console.error('Error creating package:', err);
      enqueueSnackbar(err.message || 'Failed to create medical package', { variant: 'error' });
    }
  };

  const handleUpdate = async () => {
    // Validation
    if (!formData.code || !formData.nameAr || !formData.nameEn) {
      enqueueSnackbar('Please fill in all required fields', { variant: 'warning' });
      return;
    }

    if (!selectedPackage?.id) {
      enqueueSnackbar('No package selected for update', { variant: 'error' });
      return;
    }

    try {
      const payload = {
        code: formData.code,
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        description: formData.description || null,
        serviceIds: formData.serviceIds,
        totalCoverageLimit: formData.totalCoverageLimit ? Number(formData.totalCoverageLimit) : null,
        active: formData.active
      };

      const response = await medicalPackagesService.update(selectedPackage.id, payload);

      if (response.success) {
        enqueueSnackbar(response.message || 'Medical package updated successfully', { variant: 'success' });
        handleCloseDialogs();
        loadPackages();
      } else {
        throw new Error(response.error || 'Failed to update medical package');
      }
    } catch (err) {
      console.error('Error updating package:', err);
      enqueueSnackbar(err.message || 'Failed to update medical package', { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!selectedPackage?.id) {
      enqueueSnackbar('No package selected for deletion', { variant: 'error' });
      return;
    }

    try {
      const response = await medicalPackagesService.delete(selectedPackage.id);

      if (response.success) {
        enqueueSnackbar(response.message || 'Medical package deleted successfully', { variant: 'success' });
        handleCloseDialogs();
        loadPackages();
      } else {
        throw new Error(response.error || 'Failed to delete medical package');
      }
    } catch (err) {
      console.error('Error deleting package:', err);
      enqueueSnackbar(err.message || 'Failed to delete medical package', { variant: 'error' });
    }
  };

  // Loading state
  if (loading) {
    return (
      <MainCard title="Medical Packages">
        <TableSkeleton rows={10} columns={9} />
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Medical Packages">
        <ErrorFallback error={error} onRetry={loadPackages} />
      </MainCard>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <MainCard title="Medical Packages">
        <EmptyState
          title="No Medical Packages"
          description="Get started by creating your first medical package"
          action={
            <RBACGuard requiredPermission="MEDICAL_PACKAGE_CREATE">
              <Button variant="contained" startIcon={<Add />} onClick={handleCreateOpen}>
                Create Package
              </Button>
            </RBACGuard>
          }
        />
      </MainCard>
    );
  }

  return (
    <RBACGuard requiredPermission="MEDICAL_PACKAGE_READ">
      <MainCard
        title="Medical Packages"
        secondary={
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Refresh">
              <IconButton size="small" onClick={loadPackages}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <RBACGuard requiredPermission="MEDICAL_PACKAGE_CREATE">
              <Button variant="contained" startIcon={<Add />} onClick={handleCreateOpen}>
                Create Package
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
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <TextField
            placeholder="Min Services"
            value={servicesCountMin}
            onChange={(e) => setServicesCountMin(e.target.value)}
            size="small"
            type="number"
            sx={{ width: 140 }}
          />
          <TextField
            placeholder="Max Services"
            value={servicesCountMax}
            onChange={(e) => setServicesCountMax(e.target.value)}
            size="small"
            type="number"
            sx={{ width: 140 }}
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
                        borderBottom: '1px solid #e0e0e0',
                        fontWeight: 600,
                        backgroundColor: '#f5f5f5'
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
        </Box>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2">
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
        </Box>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
          <DialogTitle>View Medical Package</DialogTitle>
          <DialogContent>
            {selectedPackage && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Package Code
                  </Typography>
                  <Typography variant="body1">{selectedPackage.code}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Arabic Name
                  </Typography>
                  <Typography variant="body1">{selectedPackage.nameAr}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    English Name
                  </Typography>
                  <Typography variant="body1">{selectedPackage.nameEn || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Description
                  </Typography>
                  <Typography variant="body1">{selectedPackage.description || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Services Count
                  </Typography>
                  <Typography variant="body1">{selectedPackage.servicesCount || 0}</Typography>
                </Box>
                {selectedPackage.services && selectedPackage.services.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Included Services
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {selectedPackage.services.map((service) => (
                        <Chip
                          key={service.id}
                          label={`${service.code} - ${service.nameEn || service.nameAr}`}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Coverage Limit
                  </Typography>
                  <Typography variant="body1">
                    {selectedPackage.totalCoverageLimit ? `${Number(selectedPackage.totalCoverageLimit).toFixed(2)} LYD` : '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedPackage.active ? 'Active' : 'Inactive'}
                      color={selectedPackage.active ? 'success' : 'default'}
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
        <Dialog open={createDialogOpen} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
          <DialogTitle>Create Medical Package</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Package Code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                fullWidth
                placeholder="e.g., PKG-BASIC, PKG-PREMIUM"
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
                placeholder="Package description (optional)"
              />
              <Autocomplete
                multiple
                options={services}
                getOptionLabel={(option) => `${option.code} - ${option.nameEn || option.nameAr}`}
                value={services.filter((s) => formData.serviceIds.includes(s.id))}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, serviceIds: newValue.map((v) => v.id) });
                }}
                renderInput={(params) => <TextField {...params} label="Select Services" placeholder="Choose medical services" />}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => <Chip {...getTagProps({ index })} key={option.id} label={option.code} size="small" />)
                }
              />
              <TextField
                label="Coverage Limit (LYD)"
                value={formData.totalCoverageLimit}
                onChange={(e) => setFormData({ ...formData, totalCoverageLimit: e.target.value })}
                fullWidth
                type="number"
                placeholder="0.00 (optional)"
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
        <Dialog open={editDialogOpen} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
          <DialogTitle>Edit Medical Package</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Package Code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                fullWidth
                placeholder="e.g., PKG-BASIC, PKG-PREMIUM"
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
                placeholder="Package description (optional)"
              />
              <Autocomplete
                multiple
                options={services}
                getOptionLabel={(option) => `${option.code} - ${option.nameEn || option.nameAr}`}
                value={services.filter((s) => formData.serviceIds.includes(s.id))}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, serviceIds: newValue.map((v) => v.id) });
                }}
                renderInput={(params) => <TextField {...params} label="Select Services" placeholder="Choose medical services" />}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => <Chip {...getTagProps({ index })} key={option.id} label={option.code} size="small" />)
                }
              />
              <TextField
                label="Coverage Limit (LYD)"
                value={formData.totalCoverageLimit}
                onChange={(e) => setFormData({ ...formData, totalCoverageLimit: e.target.value })}
                fullWidth
                type="number"
                placeholder="0.00 (optional)"
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
          <DialogTitle>Delete Medical Package</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              This action cannot be undone. Are you sure you want to delete this medical package?
            </Alert>
            {selectedPackage && (
              <Stack spacing={1}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Package Code
                  </Typography>
                  <Typography variant="body2">{selectedPackage.code}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Arabic Name
                  </Typography>
                  <Typography variant="body2">{selectedPackage.nameAr}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    English Name
                  </Typography>
                  <Typography variant="body2">{selectedPackage.nameEn || '-'}</Typography>
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
      </MainCard>
    </RBACGuard>
  );
}
