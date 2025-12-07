import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  Chip,
  CircularProgress,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// project imports
import MainCard from 'components/MainCard';
import { getEmployerById } from 'api/employers';
import { useSnackbar } from 'notistack';
import RBACGuard from 'components/tba/RBACGuard';

// ==============================|| EMPLOYER VIEW PAGE ||============================== //

export default function EmployerView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [employer, setEmployer] = useState(null);

  useEffect(() => {
    loadEmployer();
  }, [id]);

  const loadEmployer = async () => {
    try {
      setLoading(true);
      const response = await getEmployerById(id);
      const data = response.data?.data || response.data;
      setEmployer(data);
    } catch (error) {
      console.error('Error loading employer:', error);
      enqueueSnackbar('Failed to load employer', { variant: 'error' });
      navigate('/tba/employers');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/tba/employers/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/tba/employers');
  };

  if (loading) {
    return (
      <MainCard>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  if (!employer) {
    return (
      <MainCard>
        <Typography>Employer not found</Typography>
      </MainCard>
    );
  }

  const DetailRow = ({ label, value }) => (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={4}>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={8}>
        <Typography variant="body1">
          {value || '-'}
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <RBACGuard requiredPermissions={['MANAGE_EMPLOYERS']}>
      <MainCard
        title={
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                variant="text"
              >
                Back
              </Button>
              <Typography variant="h3">Employer Details</Typography>
            </Stack>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Edit
            </Button>
          </Stack>
        }
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            {employer.employerName || employer.name}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <DetailRow 
                label="Employer Code" 
                value={employer.employerCode || employer.code} 
              />
              <DetailRow 
                label="Contact Person" 
                value={employer.contactPerson} 
              />
              <DetailRow 
                label="Phone" 
                value={employer.phone} 
              />
              <DetailRow 
                label="Email" 
                value={employer.email} 
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DetailRow 
                label="Address" 
                value={employer.address} 
              />
              <DetailRow 
                label="Status" 
                value={
                  <Chip
                    label={employer.status === 'ACTIVE' || employer.active ? 'Active' : 'Inactive'}
                    color={employer.status === 'ACTIVE' || employer.active ? 'success' : 'default'}
                    size="small"
                  />
                }
              />
            </Grid>

            {employer.createdAt && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Additional Information
                </Typography>
                <DetailRow 
                  label="Created At" 
                  value={new Date(employer.createdAt).toLocaleString()} 
                />
                {employer.updatedAt && (
                  <DetailRow 
                    label="Last Updated" 
                    value={new Date(employer.updatedAt).toLocaleString()} 
                  />
                )}
              </Grid>
            )}
          </Grid>
        </Box>
      </MainCard>
    </RBACGuard>
  );
}
