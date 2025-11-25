import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
  CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// project imports
import MainCard from 'components/MainCard';
import { getMemberById, updateMember } from 'api/members';
import { getEmployers } from 'api/employers';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';

// ==============================|| MEMBER EDIT PAGE ||============================== //

export default function MemberEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    employerId: '',
    companyId: '',
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN');

  // Load member data
  useEffect(() => {
    const loadMember = async () => {
      try {
        setLoading(true);
        const response = await getMemberById(id);
        const memberData = response.data?.data;
        if (memberData) {
          setFormData({
            employerId: memberData.employerId || '',
            companyId: memberData.companyId || '',
            fullName: memberData.fullName || '',
            civilId: memberData.civilId || '',
            policyNumber: memberData.policyNumber || '',
            dateOfBirth: memberData.dateOfBirth || '',
            gender: memberData.gender || '',
            phone: memberData.phone || '',
            email: memberData.email || '',
            active: memberData.active !== undefined ? memberData.active : true
          });
        }
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

    if (formData.companyId) {
      loadEmployers();
    }
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
      setSaving(true);
      
      // Validate required fields
      if (!formData.fullName || !formData.civilId || !formData.policyNumber || !formData.employerId || !formData.companyId) {
        enqueueSnackbar('Please fill all required fields', { variant: 'warning' });
        return;
      }

      await updateMember(id, formData);
      enqueueSnackbar('Member updated successfully', { variant: 'success' });
      navigate('/tba/members');
    } catch (error) {
      console.error('Error updating member:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update member';
      enqueueSnackbar(errorMsg, { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/tba/members');
  };

  if (loading) {
    return (
      <MainCard title="Edit Member">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard title="Edit Member">
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
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
}
