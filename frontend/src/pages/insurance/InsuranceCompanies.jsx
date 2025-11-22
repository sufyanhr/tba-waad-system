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
import { useInsuranceCompanies } from 'hooks/tba/useInsuranceCompanies';

// ==============================|| INSURANCE COMPANIES TABLE ||============================== //

const InsuranceCompanies = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch insurance companies from API
  const { data: insuranceCompanies = [], isLoading, error } = useInsuranceCompanies();

  const filteredData = useMemo(() => {
    if (!searchQuery) return insuranceCompanies;
    return insuranceCompanies.filter(
      (company) =>
        company.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.insuranceId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.licenseNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [insuranceCompanies, searchQuery]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h3" gutterBottom>
            Insurance Companies Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage insurance company partnerships and contracts
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<PlusOutlined />}>
          Add Insurance Company
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by company name, ID, or license number..."
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
            <Typography color="error">Error loading insurance companies: {error.message}</Typography>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fafafa' }}>
                  <TableCell><strong>Insurance ID</strong></TableCell>
                  <TableCell><strong>Company Name</strong></TableCell>
                  <TableCell><strong>License #</strong></TableCell>
                  <TableCell><strong>Contact Person</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Phone</strong></TableCell>
                  <TableCell align="right"><strong>Members</strong></TableCell>
                  <TableCell align="right"><strong>Policies</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Typography color="text.secondary" py={4}>
                        No insurance companies found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((company) => (
                    <TableRow key={company.id} hover>
                      <TableCell>{company.insuranceId}</TableCell>
                      <TableCell>{company.companyName}</TableCell>
                      <TableCell>{company.licenseNumber}</TableCell>
                      <TableCell>{company.contactPerson}</TableCell>
                      <TableCell>{company.email}</TableCell>
                      <TableCell>{company.phone}</TableCell>
                      <TableCell align="right">{company.totalMembers?.toLocaleString()}</TableCell>
                      <TableCell align="right">{company.activePolicies}</TableCell>
                      <TableCell>
                        <Chip
                          label={company.status}
                          color={company.status === 'Active' ? 'success' : 'default'}
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

export default InsuranceCompanies;
