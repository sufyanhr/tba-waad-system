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
import { useVisits } from 'hooks/tba/useVisits';

// ==============================|| VISITS TABLE ||============================== //

const VisitsTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch visits from API
  const { data: visits = [], isLoading, error } = useVisits();

  const filteredData = useMemo(() => {
    if (!searchQuery) return visits;
    return visits.filter(
      (visit) =>
        visit.visitId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visit.memberName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visit.providerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visit.visitType?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [visits, searchQuery]);

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
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <Typography color="error">Error loading visits: {error.message}</Typography>
          </Box>
        ) : (
          <>
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
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Typography color="text.secondary" py={4}>
                        No visits found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((visit) => (
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

export default VisitsTable;
