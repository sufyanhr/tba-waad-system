import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Alert,
  Tabs,
  Tab,
  Paper,
  Typography,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  CardMembership as CardMembershipIcon,
  ContactPhone as ContactPhoneIcon,
  FamilyRestroom as FamilyRestroomIcon
} from '@mui/icons-material';
import MainCard from 'components/MainCard';
import ModernPageHeader from 'components/tba/ModernPageHeader';
import { membersService } from 'services/api/members.service';
import axios from 'axios';

const TabPanel = ({ children, value, index }) => {
  return value === index && <Box sx={{ py: 3 }}>{children}</Box>;
};

const emptyMember = {
  // Tab 1: Personal Info
  nationalId: '',
  fullNameAr: '',
  fullNameEn: '',
  birthDate: '',
  gender: '',
  maritalStatus: '',
  nationality: '',
  occupation: '',
  bloodType: '',
  height: null,
  weight: null,
  chronicDiseases: '',
  allergies: '',
  notes: '',

  // Tab 2: Insurance Details
  memberCode: '',
  employerId: '',
  insuranceCompanyId: '',
  policyNumber: '',
  coverageStartDate: '',
  coverageEndDate: '',
  dependentType: 'PRIMARY',
  maxCoverageAmount: null,
  copaymentPercentage: null,
  active: true,

  // Tab 3: Contact Info
  email: '',
  phone: '',
  mobilePhone: '',
  city: '',
  district: '',
  address: ''
};

const MemberCreate = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState(0);
  const [member, setMember] = useState(emptyMember);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [employers, setEmployers] = useState([]);
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoadingDropdowns(true);
        const [employersRes, insuranceRes] = await Promise.all([
          axios.get('/api/employers/selector'),
          axios.get('/api/insurance-companies/selector')
        ]);
        setEmployers(employersRes.data || []);
        setInsuranceCompanies(insuranceRes.data || []);
      } catch (err) {
        console.error('Failed to load dropdown data', err);
        alert(intl.formatMessage({ id: 'common.error' }) || 'Failed to load data');
      } finally {
        setLoadingDropdowns(false);
      }
    };
    fetchDropdownData();
  }, [intl]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setMember((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    // Required fields
    if (!member.nationalId) newErrors.nationalId = intl.formatMessage({ id: 'validation.required' }) || 'Required';
    if (!member.fullNameAr) newErrors.fullNameAr = intl.formatMessage({ id: 'validation.required' }) || 'Required';
    if (!member.birthDate) newErrors.birthDate = intl.formatMessage({ id: 'validation.required' }) || 'Required';
    if (!member.employerId) newErrors.employerId = intl.formatMessage({ id: 'validation.required' }) || 'Required';
    if (!member.insuranceCompanyId)
      newErrors.insuranceCompanyId = intl.formatMessage({ id: 'validation.required' }) || 'Required';
    if (!member.memberCode) newErrors.memberCode = intl.formatMessage({ id: 'validation.required' }) || 'Required';

    // Email format validation
    if (member.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
      newErrors.email = intl.formatMessage({ id: 'validation.email-invalid' }) || 'Invalid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      alert(intl.formatMessage({ id: 'validation.fix-errors' }) || 'Please fix validation errors');
      return;
    }

    try {
      setSaving(true);
      await membersService.createMember(member);
      navigate('/members');
    } catch (err) {
      console.error('Failed to create member', err);
      alert(intl.formatMessage({ id: 'common.error' }) || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ModernPageHeader
        title={intl.formatMessage({ id: 'members.add' }) || 'Add Member'}
        icon={PersonAddIcon}
        breadcrumbs={[
          { label: intl.formatMessage({ id: 'members.list' }) || 'Members', path: '/members' },
          { label: intl.formatMessage({ id: 'members.add' }) || 'Add', path: '/members/create' }
        ]}
        actions={
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/members')} variant="outlined">
            {intl.formatMessage({ id: 'common.back' }) || 'Back'}
          </Button>
        }
      />

      <MainCard>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Tabs Navigation */}
          <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} variant="fullWidth">
              <Tab icon={<PersonIcon />} label={intl.formatMessage({ id: 'members.personal-info' }) || 'Personal Info'} />
              <Tab
                icon={<CardMembershipIcon />}
                label={intl.formatMessage({ id: 'members.insurance-info' }) || 'Insurance Details'}
              />
              <Tab icon={<ContactPhoneIcon />} label={intl.formatMessage({ id: 'members.contact-info' }) || 'Contact Info'} />
              <Tab
                icon={<FamilyRestroomIcon />}
                label={intl.formatMessage({ id: 'members.family-info' }) || 'Family Members'}
              />
            </Tabs>
          </Paper>

          {/* Tab 1: Personal Info */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Alert severity="info">
                  {intl.formatMessage({ id: 'members.personal-info-desc' }) ||
                    'Enter personal information of the member. Fields marked with * are required.'}
                </Alert>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={intl.formatMessage({ id: 'members.national-id' }) || 'National ID'}
                  value={member.nationalId}
                  onChange={handleChange('nationalId')}
                  error={!!errors.nationalId}
                  helperText={errors.nationalId}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={intl.formatMessage({ id: 'members.full-name-ar' }) || 'Full Name (Arabic)'}
                  value={member.fullNameAr}
                  onChange={handleChange('fullNameAr')}
                  error={!!errors.fullNameAr}
                  helperText={errors.fullNameAr}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={intl.formatMessage({ id: 'members.full-name-en' }) || 'Full Name (English)'}
                  value={member.fullNameEn}
                  onChange={handleChange('fullNameEn')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label={intl.formatMessage({ id: 'members.birth-date' }) || 'Birth Date'}
                  value={member.birthDate}
                  onChange={handleChange('birthDate')}
                  error={!!errors.birthDate}
                  helperText={errors.birthDate}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label={intl.formatMessage({ id: 'members.gender' }) || 'Gender'}
                  value={member.gender}
                  onChange={handleChange('gender')}
                >
                  <MenuItem value="">
                    <em>{intl.formatMessage({ id: 'common.select' }) || 'Select'}</em>
                  </MenuItem>
                  <MenuItem value="MALE">{intl.formatMessage({ id: 'common.male' }) || 'Male'}</MenuItem>
                  <MenuItem value="FEMALE">{intl.formatMessage({ id: 'common.female' }) || 'Female'}</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label={intl.formatMessage({ id: 'members.marital-status' }) || 'Marital Status'}
                  value={member.maritalStatus}
                  onChange={handleChange('maritalStatus')}
                >
                  <MenuItem value="">
                    <em>{intl.formatMessage({ id: 'common.select' }) || 'Select'}</em>
                  </MenuItem>
                  <MenuItem value="SINGLE">{intl.formatMessage({ id: 'common.single' }) || 'Single'}</MenuItem>
                  <MenuItem value="MARRIED">{intl.formatMessage({ id: 'common.married' }) || 'Married'}</MenuItem>
                  <MenuItem value="DIVORCED">{intl.formatMessage({ id: 'common.divorced' }) || 'Divorced'}</MenuItem>
                  <MenuItem value="WIDOWED">{intl.formatMessage({ id: 'common.widowed' }) || 'Widowed'}</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={intl.formatMessage({ id: 'members.nationality' }) || 'Nationality'}
                  value={member.nationality}
                  onChange={handleChange('nationality')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={intl.formatMessage({ id: 'members.occupation' }) || 'Occupation'}
                  value={member.occupation}
                  onChange={handleChange('occupation')}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label={intl.formatMessage({ id: 'members.blood-type' }) || 'Blood Type'}
                  value={member.bloodType}
                  onChange={handleChange('bloodType')}
                >
                  <MenuItem value="">
                    <em>{intl.formatMessage({ id: 'common.select' }) || 'Select'}</em>
                  </MenuItem>
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label={intl.formatMessage({ id: 'members.height' }) || 'Height (cm)'}
                  value={member.height || ''}
                  onChange={handleChange('height')}
                  inputProps={{ min: 0, max: 300 }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label={intl.formatMessage({ id: 'members.weight' }) || 'Weight (kg)'}
                  value={member.weight || ''}
                  onChange={handleChange('weight')}
                  inputProps={{ min: 0, max: 500 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={intl.formatMessage({ id: 'members.chronic-diseases' }) || 'Chronic Diseases'}
                  value={member.chronicDiseases}
                  onChange={handleChange('chronicDiseases')}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={intl.formatMessage({ id: 'members.allergies' }) || 'Allergies'}
                  value={member.allergies}
                  onChange={handleChange('allergies')}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={intl.formatMessage({ id: 'members.notes' }) || 'Notes'}
                  value={member.notes}
                  onChange={handleChange('notes')}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 2: Insurance Details */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Alert severity="info">
                  {intl.formatMessage({ id: 'members.insurance-info-desc' }) ||
                    'Enter insurance coverage details. Fields marked with * are required.'}
                </Alert>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={intl.formatMessage({ id: 'members.member-code' }) || 'Member Code'}
                  value={member.memberCode}
                  onChange={handleChange('memberCode')}
                  error={!!errors.memberCode}
                  helperText={errors.memberCode}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  required
                  label={intl.formatMessage({ id: 'members.employer' }) || 'Employer'}
                  value={member.employerId}
                  onChange={handleChange('employerId')}
                  error={!!errors.employerId}
                  helperText={errors.employerId}
                  disabled={loadingDropdowns}
                >
                  <MenuItem value="">
                    <em>{intl.formatMessage({ id: 'common.select' }) || 'Select'}</em>
                  </MenuItem>
                  {employers.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  required
                  label={intl.formatMessage({ id: 'members.insurance-company' }) || 'Insurance Company'}
                  value={member.insuranceCompanyId}
                  onChange={handleChange('insuranceCompanyId')}
                  error={!!errors.insuranceCompanyId}
                  helperText={errors.insuranceCompanyId}
                  disabled={loadingDropdowns}
                >
                  <MenuItem value="">
                    <em>{intl.formatMessage({ id: 'common.select' }) || 'Select'}</em>
                  </MenuItem>
                  {insuranceCompanies.map((ins) => (
                    <MenuItem key={ins.id} value={ins.id}>
                      {ins.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={intl.formatMessage({ id: 'members.policy-number' }) || 'Policy Number'}
                  value={member.policyNumber}
                  onChange={handleChange('policyNumber')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label={intl.formatMessage({ id: 'members.coverage-start-date' }) || 'Coverage Start Date'}
                  value={member.coverageStartDate}
                  onChange={handleChange('coverageStartDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label={intl.formatMessage({ id: 'members.coverage-end-date' }) || 'Coverage End Date'}
                  value={member.coverageEndDate}
                  onChange={handleChange('coverageEndDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label={intl.formatMessage({ id: 'members.dependent-type' }) || 'Dependent Type'}
                  value={member.dependentType}
                  onChange={handleChange('dependentType')}
                >
                  <MenuItem value="PRIMARY">{intl.formatMessage({ id: 'members.primary' }) || 'Primary'}</MenuItem>
                  <MenuItem value="SPOUSE">{intl.formatMessage({ id: 'members.spouse' }) || 'Spouse'}</MenuItem>
                  <MenuItem value="CHILD">{intl.formatMessage({ id: 'members.child' }) || 'Child'}</MenuItem>
                  <MenuItem value="PARENT">{intl.formatMessage({ id: 'members.parent' }) || 'Parent'}</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label={intl.formatMessage({ id: 'members.max-coverage-amount' }) || 'Max Coverage Amount'}
                  value={member.maxCoverageAmount || ''}
                  onChange={handleChange('maxCoverageAmount')}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label={intl.formatMessage({ id: 'members.copayment-percentage' }) || 'Copayment (%)'}
                  value={member.copaymentPercentage || ''}
                  onChange={handleChange('copaymentPercentage')}
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch checked={member.active} onChange={handleChange('active')} color="primary" />}
                  label={intl.formatMessage({ id: 'common.active' }) || 'Active'}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 3: Contact Info */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Alert severity="info">
                  {intl.formatMessage({ id: 'members.contact-info-desc' }) ||
                    'Enter contact information for the member. Valid email format is required.'}
                </Alert>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="email"
                  label={intl.formatMessage({ id: 'members.email' }) || 'Email'}
                  value={member.email}
                  onChange={handleChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={intl.formatMessage({ id: 'members.phone' }) || 'Phone'}
                  value={member.phone}
                  onChange={handleChange('phone')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={intl.formatMessage({ id: 'members.mobile-phone' }) || 'Mobile Phone'}
                  value={member.mobilePhone}
                  onChange={handleChange('mobilePhone')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={intl.formatMessage({ id: 'members.city' }) || 'City'}
                  value={member.city}
                  onChange={handleChange('city')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={intl.formatMessage({ id: 'members.district' }) || 'District'}
                  value={member.district}
                  onChange={handleChange('district')}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={intl.formatMessage({ id: 'members.address' }) || 'Address'}
                  value={member.address}
                  onChange={handleChange('address')}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 4: Family Members (Placeholder) */}
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Alert severity="info">
                  {intl.formatMessage({ id: 'members.family-info-desc' }) ||
                    'Family members and dependents will be managed after the primary member is created.'}
                </Alert>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, textAlign: 'center', border: '1px dashed', borderColor: 'divider' }}>
                  <FamilyRestroomIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    {intl.formatMessage({ id: 'members.no-dependents' }) || 'No dependents added yet'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {intl.formatMessage({ id: 'members.add-dependents-later' }) ||
                      'You can add dependents after creating the primary member'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Form Actions */}
          <Divider sx={{ my: 3 }} />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate('/members')} disabled={saving}>
              {intl.formatMessage({ id: 'common.cancel' }) || 'Cancel'}
            </Button>
            <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={saving}>
              {saving ? intl.formatMessage({ id: 'common.saving' }) || 'Saving...' : intl.formatMessage({ id: 'common.save' }) || 'Save'}
            </Button>
          </Stack>
        </Box>
      </MainCard>
    </>
  );
};

export default MemberCreate;
