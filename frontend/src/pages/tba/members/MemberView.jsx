import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  Grid,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// project imports
import MainCard from 'components/MainCard';
import { getMemberById } from 'api/members';
import { useSnackbar } from 'notistack';

// ==============================|| MEMBER VIEW PAGE ||============================== //

export default function MemberView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMember = async () => {
      try {
        setLoading(true);
        const response = await getMemberById(id);
        const memberData = response.data?.data;
        setMember(memberData);
      } catch (error) {
        console.error('Error loading member:', error);
        enqueueSnackbar('Failed to load member', { variant: 'error' });
        navigate('/tba/members');
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [id, navigate, enqueueSnackbar]);

  const handleEdit = () => {
    navigate(`/tba/members/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/tba/members');
  };

  if (loading) {
    return (
      <MainCard title="Member Details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  if (!member) {
    return (
      <MainCard title="Member Details">
        <Typography>Member not found</Typography>
      </MainCard>
    );
  }

  return (
    <MainCard
      title="Member Details"
      secondary={
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" startIcon={<EditIcon />} onClick={handleEdit}>
            Edit
          </Button>
        </Stack>
      }
    >
      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Full Name
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {member.fullName}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Civil ID
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {member.civilId}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Policy Number
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {member.policyNumber}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Date of Birth
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {member.dateOfBirth || '-'}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Gender
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {member.gender || '-'}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Status
          </Typography>
          <Chip
            label={member.active ? 'Active' : 'Inactive'}
            color={member.active ? 'success' : 'default'}
            size="small"
          />
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Phone
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {member.phone || '-'}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Email
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {member.email || '-'}
          </Typography>
        </Grid>

        {/* Employer Information */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Employer Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Employer
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {member.employerName || '-'}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Company ID
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {member.companyId}
          </Typography>
        </Grid>

        {/* System Information */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            System Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Created At
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {member.createdAt ? new Date(member.createdAt).toLocaleString() : '-'}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Last Updated
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {member.updatedAt ? new Date(member.updatedAt).toLocaleString() : '-'}
          </Typography>
        </Grid>
      </Grid>
    </MainCard>
  );
}
