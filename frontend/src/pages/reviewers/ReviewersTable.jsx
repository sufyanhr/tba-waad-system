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

// ==============================|| REVIEWERS TABLE ||============================== //

const ReviewersTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const mockReviewers = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      reviewerId: `REV-${String(i + 1).padStart(4, '0')}`,
      companyName: `Reviewer Company ${i + 1}`,
      specialization: ['General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Dermatology'][i % 5],
      contactPerson: `Reviewer ${i + 1}`,
      email: `reviewer${i + 1}@company${i + 1}.com`,
      phone: `+966 1${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
      totalReviews: Math.floor(Math.random() * 1000) + 100,
      rating: (Math.random() * 2 + 3).toFixed(1),
      status: i % 5 === 0 ? 'Inactive' : 'Active',
      contractDate: new Date(2024, Math.floor(i / 3), (i % 28) + 1).toLocaleDateString()
    }));
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery) return mockReviewers;
    return mockReviewers.filter(
      (reviewer) =>
        reviewer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reviewer.reviewerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reviewer.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mockReviewers, searchQuery]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h3" gutterBottom>
            Reviewer Companies Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage medical reviewer companies and their specializations
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<PlusOutlined />}>
          Add Reviewer Company
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by company name, ID, or specialization..."
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
              <TableCell><strong>Reviewer ID</strong></TableCell>
              <TableCell><strong>Company Name</strong></TableCell>
              <TableCell><strong>Specialization</strong></TableCell>
              <TableCell><strong>Contact Person</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell align="right"><strong>Reviews</strong></TableCell>
              <TableCell align="center"><strong>Rating</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((reviewer) => (
              <TableRow key={reviewer.id} hover>
                <TableCell>{reviewer.reviewerId}</TableCell>
                <TableCell>{reviewer.companyName}</TableCell>
                <TableCell>{reviewer.specialization}</TableCell>
                <TableCell>{reviewer.contactPerson}</TableCell>
                <TableCell>{reviewer.email}</TableCell>
                <TableCell>{reviewer.phone}</TableCell>
                <TableCell align="right">{reviewer.totalReviews}</TableCell>
                <TableCell align="center">
                  <Chip label={`⭐ ${reviewer.rating}`} color="primary" size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={reviewer.status}
                    color={reviewer.status === 'Active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
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

export default ReviewersTable;
