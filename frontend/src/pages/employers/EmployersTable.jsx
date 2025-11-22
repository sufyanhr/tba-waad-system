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

// ==============================|| EMPLOYERS TABLE ||============================== //

const EmployersTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const mockEmployers = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      employerId: `EMP-${String(i + 1).padStart(4, '0')}`,
      companyName: `Company ${i + 1}`,
      industry: ['Healthcare', 'Technology', 'Finance', 'Retail', 'Manufacturing'][i % 5],
      contactPerson: `Contact ${i + 1}`,
      email: `contact${i + 1}@company${i + 1}.com`,
      phone: `+966 1${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
      totalEmployees: Math.floor(Math.random() * 500) + 50,
      status: i % 4 === 0 ? 'Inactive' : 'Active',
      contractDate: new Date(2024, Math.floor(i / 3), (i % 28) + 1).toLocaleDateString()
    }));
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery) return mockEmployers;
    return mockEmployers.filter(
      (employer) =>
        employer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employer.employerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employer.industry.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mockEmployers, searchQuery]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h3" gutterBottom>
            Employers Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage employer companies and contracts
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<PlusOutlined />}>
          Add Employer
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by company name, ID, or industry..."
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
              <TableCell><strong>Employer ID</strong></TableCell>
              <TableCell><strong>Company Name</strong></TableCell>
              <TableCell><strong>Industry</strong></TableCell>
              <TableCell><strong>Contact Person</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell align="right"><strong>Employees</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((employer) => (
              <TableRow key={employer.id} hover>
                <TableCell>{employer.employerId}</TableCell>
                <TableCell>{employer.companyName}</TableCell>
                <TableCell>{employer.industry}</TableCell>
                <TableCell>{employer.contactPerson}</TableCell>
                <TableCell>{employer.email}</TableCell>
                <TableCell>{employer.phone}</TableCell>
                <TableCell align="right">{employer.totalEmployees}</TableCell>
                <TableCell>
                  <Chip
                    label={employer.status}
                    color={employer.status === 'Active' ? 'success' : 'default'}
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

export default EmployersTable;
