import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import { EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useMembers } from 'hooks/tba/useMembers';

// ==============================|| MEMBERS TABLE ||============================== //

const MembersTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch members from API
  const { data: members = [], isLoading, error } = useMembers();

  const filteredData = useMemo(() => {
    if (!searchQuery) return members;
    return members.filter(
      (member) =>
        member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.memberId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h3" gutterBottom>
            Members Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage member information and insurance plans
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<PlusOutlined />}>
          Add Member
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by name, email, or member ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchOutlined style={{ marginRight: 8, color: '#999' }} />
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <Typography color="error">Error loading members: {error.message}</Typography>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fafafa' }}>
                  <TableCell><strong>Member ID</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Phone</strong></TableCell>
                  <TableCell><strong>Employer</strong></TableCell>
                  <TableCell><strong>Plan</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Join Date</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography color="text.secondary" py={4}>
                        No members found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((member) => (
                    <TableRow key={member.id} hover>
                      <TableCell>{member.memberId}</TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>{member.employer}</TableCell>
                      <TableCell>{member.insurancePlan}</TableCell>
                      <TableCell>
                        <Chip
                          label={member.status}
                          color={member.status === 'Active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{member.joinDate}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary">
                          <EyeOutlined />
                        </IconButton>
                        <IconButton size="small" color="default">
                          <EditOutlined />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteOutlined />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </TableContainer>
    </Box>
  );
};

export default MembersTable;
