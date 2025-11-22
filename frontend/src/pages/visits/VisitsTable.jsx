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

// ==============================|| VISITS TABLE ||============================== //

const VisitsTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const mockVisits = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i + 1,
      visitId: `VST-${String(i + 1).padStart(5, '0')}`,
      memberName: `Member ${Math.floor(i / 2) + 1}`,
      providerName: ['King Faisal Hospital', 'Saudi German Hospital', 'Al-Habib Medical', 'Sulaiman Al-Habib'][i % 4],
      visitType: ['Consultation', 'Surgery', 'Emergency', 'Follow-up', 'Lab Test'][i % 5],
      diagnosis: ['Hypertension', 'Diabetes', 'Flu', 'Back Pain', 'Allergy'][i % 5],
      visitDate: new Date(2025, 0, (i % 28) + 1).toLocaleDateString(),
      cost: (Math.random() * 5000 + 500).toFixed(2),
      status: ['Completed', 'Pending', 'Cancelled', 'In Progress'][i % 4],
      claimSubmitted: i % 3 === 0 ? 'Yes' : 'No'
    }));
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery) return mockVisits;
    return mockVisits.filter(
      (visit) =>
        visit.visitId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visit.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visit.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visit.visitType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mockVisits, searchQuery]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      case 'In Progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h3" gutterBottom>
            Visits Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track and manage member medical visits
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<PlusOutlined />}>
          Add Visit
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by visit ID, member name, provider, or visit type..."
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
              <TableCell><strong>Visit ID</strong></TableCell>
              <TableCell><strong>Member</strong></TableCell>
              <TableCell><strong>Provider</strong></TableCell>
              <TableCell><strong>Visit Type</strong></TableCell>
              <TableCell><strong>Diagnosis</strong></TableCell>
              <TableCell><strong>Visit Date</strong></TableCell>
              <TableCell align="right"><strong>Cost (SAR)</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Claim</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((visit) => (
              <TableRow key={visit.id} hover>
                <TableCell>{visit.visitId}</TableCell>
                <TableCell>{visit.memberName}</TableCell>
                <TableCell>{visit.providerName}</TableCell>
                <TableCell>{visit.visitType}</TableCell>
                <TableCell>{visit.diagnosis}</TableCell>
                <TableCell>{visit.visitDate}</TableCell>
                <TableCell align="right">{visit.cost}</TableCell>
                <TableCell>
                  <Chip label={visit.status} color={getStatusColor(visit.status)} size="small" />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={visit.claimSubmitted}
                    color={visit.claimSubmitted === 'Yes' ? 'success' : 'default'}
                    size="small"
                    variant="outlined"
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

export default VisitsTable;
