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
import { useEmployers } from 'hooks/tba/useEmployers';

// ==============================|| EMPLOYERS TABLE ||============================== //

const EmployersTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch employers from API
  const { data: employers = [], isLoading, error } = useEmployers();

  const filteredData = useMemo(() => {
    if (!searchQuery) return employers;
    return employers.filter(
      (employer) =>
        employer.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employer.employerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employer.industry?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [employers, searchQuery]);

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
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <Typography color="error">Error loading employers: {error.message}</Typography>
          </Box>
        ) : (
          <>
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
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography color="text.secondary" py={4}>
                        No employers found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((employer) => (
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

export default EmployersTable;
