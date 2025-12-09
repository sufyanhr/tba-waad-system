import { useState, useEffect, useMemo, useCallback } from 'react';

// material-ui
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Alert,
  FormControl,
  InputLabel
} from '@mui/material';

// third-party
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  createColumnHelper
} from '@tanstack/react-table';

// project imports
import MainCard from 'components/MainCard';
import RBACGuard from 'components/tba/RBACGuard';
import TableSkeleton from 'components/tba/TableSkeleton';
import ErrorFallback from 'components/tba/ErrorFallback';
import EmptyState from 'components/tba/EmptyState';
// TODO: Create benefitPackages.service.js in services/api folder
const benefitPackagesService = {
  getAll: async () => [],
  getById: async () => null,
  create: async () => null,
  update: async () => null,
  remove: async () => null
};

// assets
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';

// column helper
const columnHelper = createColumnHelper();

// ==============================|| BENEFIT PACKAGES LIST ||============================== //

const BenefitPackagesList = () => {
  // State
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Form states for create/edit
  const [formData, setFormData] = useState({
    code: '',
    nameAr: '',
    nameEn: '',
    description: '',
    opCoverageLimit: '',
    opCoPaymentPercentage: '',
    ipCoverageLimit: '',
    ipCoPaymentPercentage: '',
    maternityCovered: false,
    maternityCoverageLimit: '',
    dentalCovered: false,
    dentalCoverageLimit: '',
    opticalCovered: false,
    opticalCoverageLimit: '',
    pharmacyCovered: true,
    pharmacyCoverageLimit: '',
    annualLimitPerMember: '',
    lifetimeLimitPerMember: '',
    emergencyCovered: true,
    chronicDiseaseCovered: false,
    preExistingConditionsCovered: false,
    active: true
  });

  const [formErrors, setFormErrors] = useState({});

  // Load benefit packages
  const loadPackages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await benefitPackagesService.list();
      if (response.success) {
        setPackages(response.data || []);
      } else {
        setError(response.error || 'Failed to load benefit packages');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error loading benefit packages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      // Search filter
      const matchesSearch =
        searchTerm === '' ||
        pkg.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.nameAr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.nameEn?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === '' || (statusFilter === 'active' ? pkg.active === true : pkg.active === false);

      return matchesSearch && matchesStatus;
    });
  }, [packages, searchTerm, statusFilter]);

  // Table columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('code', {
        header: 'Package Code',
        cell: (info) => (
          <Typography
            variant="body2"
            sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => handleView(info.row.original)}
          >
            {info.getValue()}
          </Typography>
        )
      }),
      columnHelper.accessor('nameAr', {
        header: 'Name (Arabic)',
        cell: (info) => <Typography variant="body2">{info.getValue()}</Typography>
      }),
      columnHelper.accessor('nameEn', {
        header: 'Name (English)',
        cell: (info) => <Typography variant="body2">{info.getValue()}</Typography>
      }),
      columnHelper.accessor('annualLimitPerMember', {
        header: 'Annual Limit',
        cell: (info) => {
          const value = info.getValue();
          return <Typography variant="body2">{value ? `${Number(value).toFixed(2)} LYD` : '-'}</Typography>;
        }
      }),
      columnHelper.accessor('opCoverageLimit', {
        header: 'OP Limit',
        cell: (info) => {
          const value = info.getValue();
          return <Typography variant="body2">{value ? `${Number(value).toFixed(2)} LYD` : '-'}</Typography>;
        }
      }),
      columnHelper.accessor('ipCoverageLimit', {
        header: 'IP Limit',
        cell: (info) => {
          const value = info.getValue();
          return <Typography variant="body2">{value ? `${Number(value).toFixed(2)} LYD` : '-'}</Typography>;
        }
      }),
      columnHelper.display({
        id: 'coverage',
        header: 'Coverage',
        cell: (info) => {
          const pkg = info.row.original;
          const coverages = [];
          if (pkg.maternityCovered) coverages.push('Maternity');
          if (pkg.dentalCovered) coverages.push('Dental');
          if (pkg.opticalCovered) coverages.push('Optical');
          if (pkg.pharmacyCovered) coverages.push('Pharmacy');
          if (pkg.emergencyCovered) coverages.push('Emergency');
          if (pkg.chronicDiseaseCovered) coverages.push('Chronic');

          return (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {coverages.length > 0 ? (
                coverages
                  .slice(0, 2)
                  .map((cov) => <Chip key={cov} label={cov} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />)
              ) : (
                <Typography variant="caption" color="text.secondary">
                  None
                </Typography>
              )}
              {coverages.length > 2 && (
                <Tooltip title={coverages.slice(2).join(', ')}>
                  <Chip label={`+${coverages.length - 2}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                </Tooltip>
              )}
            </Box>
          );
        }
      }),
      columnHelper.accessor('active', {
        header: 'Status',
        cell: (info) => {
          const active = info.getValue();
          return <Chip label={active ? 'Active' : 'Inactive'} color={active ? 'success' : 'default'} size="small" />;
        }
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created',
        cell: (info) => {
          const date = info.getValue();
          return date ? new Date(date).toLocaleDateString('en-GB') : '-';
        }
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="View">
              <IconButton size="small" onClick={() => handleView(info.row.original)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <RBACGuard requiredPermission="BENEFIT_UPDATE">
              <Tooltip title="Edit">
                <IconButton size="small" color="primary" onClick={() => handleEdit(info.row.original)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </RBACGuard>
            <RBACGuard requiredPermission="BENEFIT_DELETE">
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

  // Table instance
  const table = useReactTable({
    data: filteredPackages,
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

  // Handlers
  const handleView = (pkg) => {
    setSelectedPackage(pkg);
    setViewDialogOpen(true);
  };

  const handleEdit = (pkg) => {
    setSelectedPackage(pkg);
    setFormData({
      code: pkg.code || '',
      nameAr: pkg.nameAr || '',
      nameEn: pkg.nameEn || '',
      description: pkg.description || '',
      opCoverageLimit: pkg.opCoverageLimit || '',
      opCoPaymentPercentage: pkg.opCoPaymentPercentage || '',
      ipCoverageLimit: pkg.ipCoverageLimit || '',
      ipCoPaymentPercentage: pkg.ipCoPaymentPercentage || '',
      maternityCovered: pkg.maternityCovered || false,
      maternityCoverageLimit: pkg.maternityCoverageLimit || '',
      dentalCovered: pkg.dentalCovered || false,
      dentalCoverageLimit: pkg.dentalCoverageLimit || '',
      opticalCovered: pkg.opticalCovered || false,
      opticalCoverageLimit: pkg.opticalCoverageLimit || '',
      pharmacyCovered: pkg.pharmacyCovered !== false,
      pharmacyCoverageLimit: pkg.pharmacyCoverageLimit || '',
      annualLimitPerMember: pkg.annualLimitPerMember || '',
      lifetimeLimitPerMember: pkg.lifetimeLimitPerMember || '',
      emergencyCovered: pkg.emergencyCovered !== false,
      chronicDiseaseCovered: pkg.chronicDiseaseCovered || false,
      preExistingConditionsCovered: pkg.preExistingConditionsCovered || false,
      active: pkg.active !== false
    });
    setFormErrors({});
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (pkg) => {
    setSelectedPackage(pkg);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPackage) return;

    try {
      const response = await benefitPackagesService.delete(selectedPackage.id);
      if (response.success) {
        await loadPackages();
        setDeleteDialogOpen(false);
        setSelectedPackage(null);
      } else {
        alert(response.error || 'Failed to delete benefit package');
      }
    } catch (error) {
      console.error('Error deleting benefit package:', error);
      alert('An error occurred while deleting the benefit package');
    }
  };

  const handleCreateOpen = () => {
    setFormData({
      code: '',
      nameAr: '',
      nameEn: '',
      description: '',
      opCoverageLimit: '',
      opCoPaymentPercentage: '',
      ipCoverageLimit: '',
      ipCoPaymentPercentage: '',
      maternityCovered: false,
      maternityCoverageLimit: '',
      dentalCovered: false,
      dentalCoverageLimit: '',
      opticalCovered: false,
      opticalCoverageLimit: '',
      pharmacyCovered: true,
      pharmacyCoverageLimit: '',
      annualLimitPerMember: '',
      lifetimeLimitPerMember: '',
      emergencyCovered: true,
      chronicDiseaseCovered: false,
      preExistingConditionsCovered: false,
      active: true
    });
    setFormErrors({});
    setCreateDialogOpen(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.code?.trim()) {
      errors.code = 'Package code is required';
    }

    if (!formData.nameAr?.trim()) {
      errors.nameAr = 'Arabic name is required';
    }

    if (!formData.nameEn?.trim()) {
      errors.nameEn = 'English name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      const response = await benefitPackagesService.create(formData);
      if (response.success) {
        await loadPackages();
        setCreateDialogOpen(false);
        setFormData({});
      } else {
        alert(response.error || 'Failed to create benefit package');
      }
    } catch (error) {
      console.error('Error creating benefit package:', error);
      alert('An error occurred while creating the benefit package');
    }
  };

  const handleUpdate = async () => {
    if (!validateForm() || !selectedPackage) return;

    try {
      const response = await benefitPackagesService.update(selectedPackage.id, formData);
      if (response.success) {
        await loadPackages();
        setEditDialogOpen(false);
        setSelectedPackage(null);
        setFormData({});
      } else {
        alert(response.error || 'Failed to update benefit package');
      }
    } catch (error) {
      console.error('Error updating benefit package:', error);
      alert('An error occurred while updating the benefit package');
    }
  };

  const handleRetry = () => {
    loadPackages();
  };

  // Loading state
  if (loading) {
    return (
      <MainCard title="Benefit Packages">
        <TableSkeleton rows={10} columns={9} />
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Benefit Packages">
        <ErrorFallback error={error} onRetry={handleRetry} />
      </MainCard>
    );
  }

  return (
    <RBACGuard requiredPermission="BENEFIT_READ">
      <MainCard
        title="Benefit Packages"
        secondary={
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton onClick={loadPackages} size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <RBACGuard requiredPermission="BENEFIT_CREATE">
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateOpen}>
                Create Package
              </Button>
            </RBACGuard>
          </Stack>
        }
      >
        <Stack spacing={3}>
          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ minWidth: 300 }}
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Table */}
          {filteredPackages.length === 0 ? (
            <EmptyState
              title="No benefit packages found"
              description={searchTerm || statusFilter ? 'Try adjusting your filters' : 'Create your first benefit package to get started'}
              action={
                <RBACGuard requiredPermission="BENEFIT_CREATE">
                  <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateOpen}>
                    Create Package
                  </Button>
                </RBACGuard>
              }
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
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom: '1px solid #e0e0e0',
                              fontWeight: 600,
                              cursor: header.column.getCanSort() ? 'pointer' : 'default'
                            }}
                            onClick={header.column.getToggleSortingHandler()}
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
                <Typography variant="body2" color="text.secondary">
                  Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                  {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredPackages.length)} of{' '}
                  {filteredPackages.length} benefit packages
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
        </Stack>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Benefit Package Details</DialogTitle>
          <DialogContent>
            {selectedPackage && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Package Code
                  </Typography>
                  <Typography variant="body1">{selectedPackage.code}</Typography>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Arabic Name
                    </Typography>
                    <Typography variant="body1">{selectedPackage.nameAr}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      English Name
                    </Typography>
                    <Typography variant="body1">{selectedPackage.nameEn}</Typography>
                  </Box>
                </Box>

                {selectedPackage.description && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body2">{selectedPackage.description}</Typography>
                  </Box>
                )}

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      OP Coverage Limit
                    </Typography>
                    <Typography variant="body1">
                      {selectedPackage.opCoverageLimit ? `${Number(selectedPackage.opCoverageLimit).toFixed(2)} LYD` : '-'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      IP Coverage Limit
                    </Typography>
                    <Typography variant="body1">
                      {selectedPackage.ipCoverageLimit ? `${Number(selectedPackage.ipCoverageLimit).toFixed(2)} LYD` : '-'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Annual Limit Per Member
                    </Typography>
                    <Typography variant="body1">
                      {selectedPackage.annualLimitPerMember ? `${Number(selectedPackage.annualLimitPerMember).toFixed(2)} LYD` : '-'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Lifetime Limit Per Member
                    </Typography>
                    <Typography variant="body1">
                      {selectedPackage.lifetimeLimitPerMember ? `${Number(selectedPackage.lifetimeLimitPerMember).toFixed(2)} LYD` : '-'}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Coverage Options
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedPackage.maternityCovered && <Chip label="Maternity" color="success" size="small" />}
                    {selectedPackage.dentalCovered && <Chip label="Dental" color="success" size="small" />}
                    {selectedPackage.opticalCovered && <Chip label="Optical" color="success" size="small" />}
                    {selectedPackage.pharmacyCovered && <Chip label="Pharmacy" color="success" size="small" />}
                    {selectedPackage.emergencyCovered && <Chip label="Emergency" color="success" size="small" />}
                    {selectedPackage.chronicDiseaseCovered && <Chip label="Chronic Disease" color="success" size="small" />}
                    {selectedPackage.preExistingConditionsCovered && <Chip label="Pre-existing" color="success" size="small" />}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <br />
                  <Chip
                    label={selectedPackage.active ? 'Active' : 'Inactive'}
                    color={selectedPackage.active ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create Benefit Package</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Package Code"
                required
                fullWidth
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                error={!!formErrors.code}
                helperText={formErrors.code}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Arabic Name"
                  required
                  fullWidth
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  error={!!formErrors.nameAr}
                  helperText={formErrors.nameAr}
                />
                <TextField
                  label="English Name"
                  required
                  fullWidth
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  error={!!formErrors.nameEn}
                  helperText={formErrors.nameEn}
                />
              </Box>

              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="OP Coverage Limit (LYD)"
                  type="number"
                  fullWidth
                  value={formData.opCoverageLimit}
                  onChange={(e) => setFormData({ ...formData, opCoverageLimit: e.target.value })}
                />
                <TextField
                  label="IP Coverage Limit (LYD)"
                  type="number"
                  fullWidth
                  value={formData.ipCoverageLimit}
                  onChange={(e) => setFormData({ ...formData, ipCoverageLimit: e.target.value })}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Annual Limit Per Member (LYD)"
                  type="number"
                  fullWidth
                  value={formData.annualLimitPerMember}
                  onChange={(e) => setFormData({ ...formData, annualLimitPerMember: e.target.value })}
                />
                <TextField
                  label="Lifetime Limit Per Member (LYD)"
                  type="number"
                  fullWidth
                  value={formData.lifetimeLimitPerMember}
                  onChange={(e) => setFormData({ ...formData, lifetimeLimitPerMember: e.target.value })}
                />
              </Box>

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
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreate}>
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Benefit Package</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Package Code"
                required
                fullWidth
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                error={!!formErrors.code}
                helperText={formErrors.code}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Arabic Name"
                  required
                  fullWidth
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  error={!!formErrors.nameAr}
                  helperText={formErrors.nameAr}
                />
                <TextField
                  label="English Name"
                  required
                  fullWidth
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  error={!!formErrors.nameEn}
                  helperText={formErrors.nameEn}
                />
              </Box>

              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="OP Coverage Limit (LYD)"
                  type="number"
                  fullWidth
                  value={formData.opCoverageLimit}
                  onChange={(e) => setFormData({ ...formData, opCoverageLimit: e.target.value })}
                />
                <TextField
                  label="IP Coverage Limit (LYD)"
                  type="number"
                  fullWidth
                  value={formData.ipCoverageLimit}
                  onChange={(e) => setFormData({ ...formData, ipCoverageLimit: e.target.value })}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Annual Limit Per Member (LYD)"
                  type="number"
                  fullWidth
                  value={formData.annualLimitPerMember}
                  onChange={(e) => setFormData({ ...formData, annualLimitPerMember: e.target.value })}
                />
                <TextField
                  label="Lifetime Limit Per Member (LYD)"
                  type="number"
                  fullWidth
                  value={formData.lifetimeLimitPerMember}
                  onChange={(e) => setFormData({ ...formData, lifetimeLimitPerMember: e.target.value })}
                />
              </Box>

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
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdate}>
              Update
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm">
          <DialogTitle>Delete Benefit Package</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Are you sure you want to delete this benefit package?
            </Alert>
            {selectedPackage && (
              <Typography>
                Package: <strong>{selectedPackage.nameEn}</strong> ({selectedPackage.code})
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </MainCard>
    </RBACGuard>
  );
};

export default BenefitPackagesList;
