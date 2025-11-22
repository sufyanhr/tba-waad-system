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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useClaims } from 'hooks/tba/useClaims';

// ==============================|| CLAIMS TABLE ||============================== //

const ClaimsTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Fetch claims from API
  const { data: claims = [], isLoading, error } = useClaims();

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery) return claims;
    return claims.filter(
      (claim) =>
        claim.claimNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.memberName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.employer?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [claims, searchQuery]);

  // Pagination
  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'error';
      case 'Under Review':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h3" gutterBottom>
            Claims Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and track all insurance claims
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<UploadOutlined />}
          onClick={() => setUploadDialogOpen(true)}
        >
          Upload Attachment
        </Button>
      </Stack>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by claim number, member name, or employer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchOutlined style={{ marginRight: 8, color: '#999' }} />
          }}
        />
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <Typography color="error">Error loading claims: {error.message}</Typography>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fafafa' }}>
                  <TableCell><strong>Claim #</strong></TableCell>
                  <TableCell><strong>Member</strong></TableCell>
                  <TableCell><strong>Employer</strong></TableCell>
                  <TableCell><strong>Insurance</strong></TableCell>
                  <TableCell align="right"><strong>Amount (SAR)</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography color="text.secondary" py={4}>
                        No claims found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((claim) => (
                    <TableRow key={claim.id} hover>
                      <TableCell>{claim.claimNumber}</TableCell>
                      <TableCell>{claim.memberName}</TableCell>
                      <TableCell>{claim.employer}</TableCell>
                      <TableCell>{claim.insuranceCompany}</TableCell>
                      <TableCell align="right">{claim.claimAmount}</TableCell>
                      <TableCell>
                        <Chip label={claim.status} color={getStatusColor(claim.status)} size="small" />
                      </TableCell>
                      <TableCell>{claim.submissionDate}</TableCell>
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
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </TableContainer>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Attachment</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outlined" component="span" fullWidth sx={{ py: 3, borderStyle: 'dashed' }}>
                <Box textAlign="center">
                  <UploadOutlined style={{ fontSize: 40, color: '#999', marginBottom: 8 }} />
                  <Typography variant="body2" color="text.secondary">
                    Click to select files or drag and drop
                  </Typography>
                </Box>
              </Button>
            </label>
            {selectedFiles.length > 0 && (
              <Box mt={2}>
                <Typography variant="body2" gutterBottom>
                  Selected files:
                </Typography>
                {selectedFiles.map((file, index) => (
                  <Chip key={index} label={file.name} sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setUploadDialogOpen(false)}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClaimsTable;
