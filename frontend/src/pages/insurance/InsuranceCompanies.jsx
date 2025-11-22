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

// ==============================|| INSURANCE COMPANIES TABLE ||============================== //

const InsuranceCompanies = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const mockInsuranceCompanies = useMemo(() => {
    const companies = [
      'Saudi Insurance', 'Tawuniya', 'AXA', 'Bupa Arabia', 'Medgulf',
      'Al Rajhi Takaful', 'Walaa Insurance', 'SABB Takaful', 'Allianz',
      'Chubb Arabia', 'Solidarity', 'Ace Arabia', 'SALAMA', 'Gulf Union',
      'Al Ahlia', 'United Cooperative', 'Wataniya', 'Arabian Shield', 'Malath'
    ];
    
    return companies.map((name, i) => ({
      id: i + 1,
      insuranceId: `INS-${String(i + 1).padStart(4, '0')}`,
      companyName: name,
      licenseNumber: `LIC-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
      contactPerson: `Manager ${i + 1}`,
      email: `contact@${name.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+966 1${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
      totalMembers: Math.floor(Math.random() * 5000) + 500,
      activePolicies: Math.floor(Math.random() * 100) + 20,
      status: i % 6 === 0 ? 'Inactive' : 'Active',
      contractDate: new Date(2023 + (i % 2), Math.floor(i / 3), (i % 28) + 1).toLocaleDateString()
    }));
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery) return mockInsuranceCompanies;
    return mockInsuranceCompanies.filter(
      (company) =>
        company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.insuranceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mockInsuranceCompanies, searchQuery]);

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
            {paginatedData.map((company) => (
              <TableRow key={company.id} hover>
                <TableCell>{company.insuranceId}</TableCell>
                <TableCell>{company.companyName}</TableCell>
                <TableCell>{company.licenseNumber}</TableCell>
                <TableCell>{company.contactPerson}</TableCell>
                <TableCell>{company.email}</TableCell>
                <TableCell>{company.phone}</TableCell>
                <TableCell align="right">{company.totalMembers.toLocaleString()}</TableCell>
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

export default InsuranceCompanies;
