import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TablePagination,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';

// project imports
import MainCard from 'components/MainCard';
import { getEmployers, deleteEmployer } from 'api/employers';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';
import RBACGuard from 'components/tba/RBACGuard';

// ==============================|| EMPLOYERS LIST PAGE ||============================== //

export default function EmployersList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employerToDelete, setEmployerToDelete] = useState(null);

  // Check if user is super admin
  const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN');

  // Set initial company filter
  useEffect(() => {
    if (!isSuperAdmin && user?.companyId) {
      setSelectedCompanyId(user.companyId);
    }
  }, [isSuperAdmin, user]);

  // Load employers
  const loadEmployers = async () => {
    try {
      setLoading(true);
      const companyId = isSuperAdmin ? selectedCompanyId : user?.companyId;
      const response = await getEmployers(companyId, {
        page,
        size: rowsPerPage,
        search: searchTerm
      });
      
      const data = response.data?.data || response.data || [];
      setEmployers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading employers:', error);
      enqueueSnackbar('Failed to load employers', { variant: 'error' });
      setEmployers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployers();
  }, [page, rowsPerPage, searchTerm, selectedCompanyId]);

  // Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleCompanyChange = (event) => {
    setSelectedCompanyId(event.target.value);
    setPage(0);
  };

  const handleCreate = () => {
    navigate('/tba/employers/create');
  };

  const handleView = (id) => {
    navigate(`/tba/employers/view/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/tba/employers/edit/${id}`);
  };

  const handleDeleteClick = (employer) => {
    setEmployerToDelete(employer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteEmployer(employerToDelete.id);
      enqueueSnackbar('Employer deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setEmployerToDelete(null);
      loadEmployers();
    } catch (error) {
      console.error('Error deleting employer:', error);
      enqueueSnackbar('Failed to delete employer', { variant: 'error' });
    }
  };

  return (
    <RBACGuard requiredPermissions={['MANAGE_EMPLOYERS']}>
      <MainCard
        title={
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h3">Employers</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              Add Employer
            </Button>
          </Stack>
        }
      >
        {/* Filters */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          {isSuperAdmin && (
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Company</InputLabel>
              <Select
                value={selectedCompanyId}
                onChange={handleCompanyChange}
                label="Company"
              >
                <MenuItem value="">All Companies</MenuItem>
                <MenuItem value="1">Company 1</MenuItem>
                <MenuItem value="2">Company 2</MenuItem>
                {/* TODO: Load companies dynamically */}
              </Select>
            </FormControl>
          )}
          <TextField
            placeholder="Search employers..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ flexGrow: 1 }}
          />
        </Stack>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employer Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Contact Person</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : employers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No employers found
                  </TableCell>
                </TableRow>
              ) : (
                employers.map((employer) => (
                  <TableRow key={employer.id} hover>
                    <TableCell>{employer.employerName || employer.name}</TableCell>
                    <TableCell>{employer.employerCode || employer.code}</TableCell>
                    <TableCell>{employer.contactPerson}</TableCell>
                    <TableCell>{employer.phone}</TableCell>
                    <TableCell>
                      <Chip
                        label={employer.status === 'ACTIVE' || employer.active ? 'Active' : 'Inactive'}
                        color={employer.status === 'ACTIVE' || employer.active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="View">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleView(employer.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleEdit(employer.id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteClick(employer)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={employers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete employer "{employerToDelete?.employerName || employerToDelete?.name}"?
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </MainCard>
    </RBACGuard>
  );
}
