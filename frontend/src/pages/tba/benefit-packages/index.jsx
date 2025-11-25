import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent
} from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import RBACGuard from 'components/tba/RBACGuard';
import axiosServices from 'utils/axios';

// assets
import { SearchOutlined, PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';

// ==============================|| BENEFIT PACKAGES LIST ||============================== //

const BenefitPackagesList = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await axiosServices.get('/api/benefit-packages');
      if (response.data.status === 'success') {
        setPackages(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching benefit packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages.filter((pkg) =>
    pkg.packageName?.toLowerCase().includes(searchText.toLowerCase()) ||
    pkg.packageCode?.toLowerCase().includes(searchText.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LYD'
    }).format(amount || 0);
  };

  return (
    <RBACGuard permission="POLICY_VIEW">
      <MainCard
        title="Benefit Packages"
        secondary={
          <RBACGuard permission="POLICY_MANAGE">
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={() => navigate('/tba/benefit-packages/create')}
            >
              Add Package
            </Button>
          </RBACGuard>
        }
      >
        <Stack spacing={3}>
          {/* Search */}
          <TextField
            placeholder="Search benefit packages..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              )
            }}
            sx={{ maxWidth: 400 }}
          />

          {/* Cards Grid */}
          {loading ? (
            <Typography>Loading...</Typography>
          ) : filteredPackages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No benefit packages found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {searchText ? 'Try adjusting your search' : 'Click "Add Package" to create your first benefit package'}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredPackages.map((pkg) => (
                <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                  <Card>
                    <CardContent>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="h5">{pkg.packageName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {pkg.packageCode}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Outpatient Limit
                          </Typography>
                          <Typography variant="h6">
                            {formatCurrency(pkg.outpatientLimit)}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Inpatient Limit
                          </Typography>
                          <Typography variant="h6">
                            {formatCurrency(pkg.inpatientLimit)}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Maternity Coverage
                          </Typography>
                          <Chip
                            label={pkg.maternityCoverage ? 'Included' : 'Not Included'}
                            color={pkg.maternityCoverage ? 'success' : 'default'}
                            size="small"
                          />
                        </Box>

                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            startIcon={<EyeOutlined />}
                            onClick={() => navigate(`/tba/benefit-packages/${pkg.id}`)}
                          >
                            View
                          </Button>
                          <RBACGuard permission="POLICY_MANAGE">
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<EditOutlined />}
                              onClick={() => navigate(`/tba/benefit-packages/${pkg.id}/edit`)}
                            >
                              Edit
                            </Button>
                          </RBACGuard>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Stack>
      </MainCard>
    </RBACGuard>
  );
};

export default BenefitPackagesList;
