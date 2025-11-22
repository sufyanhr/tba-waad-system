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
  Chip
} from '@mui/material';
import { EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';

// ==============================|| MEMBERS TABLE ||============================== //

const MembersTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Static mock data
  const mockMembers = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      memberId: `MEM-${String(i + 1).padStart(5, '0')}`,
      name: `Member ${i + 1}`,
      email: `member${i + 1}@example.com`,
      phone: `+966 5${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      employer: `Company ${Math.floor(i / 5) + 1}`,
      insurancePlan: ['Gold', 'Silver', 'Platinum', 'Basic'][i % 4],
      status: i % 3 === 0 ? 'Inactive' : 'Active',
      joinDate: new Date(2024, Math.floor(i / 4), (i % 28) + 1).toLocaleDateString()
    }));
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery) return mockMembers;
    return mockMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.memberId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mockMembers, searchQuery]);

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
            {paginatedData.map((member) => (
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
            ))}
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
      </TableContainer>
    </Box>
  );
};

export default MembersTable;
