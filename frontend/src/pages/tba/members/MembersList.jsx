import { useState, useEffect } from 'react';
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
  Tooltip,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';

// project imports
import MainCard from 'components/MainCard';
import { getMembers, deleteMember } from 'api/members';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';

// ==============================|| MEMBERS LIST PAGE ||============================== //

export default function MembersList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Check if user is super admin
  const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN');

  // Set initial company filter
  useEffect(() => {
    if (!isSuperAdmin && user?.companyId) {
      setSelectedCompanyId(user.companyId);
    }
  }, [isSuperAdmin, user]);

  // Load members
  const loadMembers = async () => {
    try {
      setLoading(true);
      const companyId = isSuperAdmin ? (selectedCompanyId || null) : user?.companyId;
      const response = await getMembers({
        page: page + 1, // Backend uses 1-based pagination
        size: rowsPerPage,
        search: searchTerm,
        companyId: companyId
      });
      
      const data = response.data?.data;
      if (data) {
        setMembers(data.items || []);
        setTotalCount(data.total || 0);
      } else {
        setMembers([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error loading members:', error);
      enqueueSnackbar('Failed to load members', { variant: 'error' });
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [page, rowsPerPage, searchTerm, selectedCompanyId]);

  // Handlers
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

  const handleCompanyChange = (event) => {
    setSelectedCompanyId(event.target.value);
    setPage(0);
  };

  const handleViewMember = (id) => {
    navigate(`/tba/members/view/${id}`);
  };

  const handleEditMember = (id) => {
    navigate(`/tba/members/edit/${id}`);
  };

  const handleDeleteClick = (member) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMember(memberToDelete.id);
      enqueueSnackbar('Member deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
      loadMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to delete member', { variant: 'error' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setMemberToDelete(null);
  };

  const handleCreateMember = () => {
    navigate('/tba/members/create');
  };

  return (
    <MainCard
      title="Members"
      secondary={
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateMember}>
          Add Member
        </Button>
      }
    >
      <Stack spacing={2.5}>
        {/* Filters */}
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search by name, civil ID, or policy number..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ flexGrow: 1 }}
          />
          
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
              </Select>
            </FormControl>
          )}
        </Stack>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member Name</TableCell>
                <TableCell>Civil ID</TableCell>
                <TableCell>Policy Number</TableCell>
                <TableCell>Employer</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No members found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow key={member.id} hover>
                    <TableCell>{member.fullName}</TableCell>
                    <TableCell>{member.civilId}</TableCell>
                    <TableCell>{member.policyNumber}</TableCell>
                    <TableCell>{member.employerName || '-'}</TableCell>
                    <TableCell>{member.phone || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={member.active ? 'Active' : 'Inactive'}
                        color={member.active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewMember(member.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditMember(member.id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(member)}
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
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
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
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
