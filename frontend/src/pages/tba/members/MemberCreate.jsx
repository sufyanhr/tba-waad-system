import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Stack,
  Typography
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// project imports
import MainCard from 'components/MainCard';
import { createMember } from 'api/members';
import { getEmployers } from 'api/employers';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';

// ==============================|| MEMBER CREATE PAGE ||============================== //

export default function MemberCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    employerId: '',
    companyId: user?.companyId || '',
    fullName: '',
    civilId: '',
    policyNumber: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    active: true
  });

  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(false);

  const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN');

  // Load employers based on company
  useEffect(() => {
    const loadEmployers = async () => {
      try {
        const companyId = isSuperAdmin ? formData.companyId : user?.companyId;
        if (companyId) {
          const response = await getEmployers({ companyId });
          const data = response.data?.data;
          if (data?.items) {
            setEmployers(data.items);
          } else if (Array.isArray(data)) {
            setEmployers(data);
          } else {
            setEmployers([]);
          }
        }
      } catch (error) {
        console.error('Error loading employers:', error);
        setEmployers([]);
      }
    };

    loadEmployers();
  }, [formData.companyId, isSuperAdmin, user?.companyId]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate required fields
      if (!formData.fullName || !formData.civilId || !formData.policyNumber || !formData.employerId || !formData.companyId) {
        enqueueSnackbar('Please fill all required fields', { variant: 'warning' });
        return;
      }

      await createMember(formData);
      enqueueSnackbar('Member created successfully', { variant: 'success' });
      navigate('/tba/members');
    } catch (error) {
      console.error('Error creating member:', error);
      const errorMsg = error.response?.data?.message || 'Failed to create member';
      enqueueSnackbar(errorMsg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/tba/members');
  };

  return (
    <MainCard title="Create Member">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Company Selection (Super Admin Only) */}
          {isSuperAdmin && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Company</InputLabel>
                <Select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  label="Company"
                >
                  <MenuItem value="1">Company 1</MenuItem>
                  <MenuItem value="2">Company 2</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Employer Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Employer</InputLabel>
              <Select
                name="employerId"
                value={formData.employerId}
                onChange={handleChange}
                label="Employer"
                disabled={!formData.companyId}
              >
                {employers.map((employer) => (
                  <MenuItem key={employer.id} value={employer.id}>
                    {employer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Full Name */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </Grid>

          {/* Civil ID */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Civil ID"
              name="civilId"
              value={formData.civilId}
              onChange={handleChange}
              helperText="Must be unique"
            />
          </Grid>

          {/* Policy Number */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Policy Number"
              name="policyNumber"
              value={formData.policyNumber}
              onChange={handleChange}
              helperText="Must be unique"
            />
          </Grid>

          {/* Date of Birth */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Gender */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Phone */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+966501234567"
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>

          {/* Active Status */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />
              }
              label="Active"
            />
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Member'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
}
