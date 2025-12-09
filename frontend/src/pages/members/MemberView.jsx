import { useNavigate, useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  CardMembership as CardMembershipIcon,
  ContactPhone as ContactPhoneIcon,
  FamilyRestroom as FamilyRestroomIcon
} from '@mui/icons-material';
import MainCard from 'components/MainCard';
import ModernPageHeader from 'components/tba/ModernPageHeader';
import { useMemberDetails } from 'hooks/useMembers';

const InfoRow = ({ label, value, type = 'text' }) => {
  const renderValue = () => {
    if (value === null || value === undefined || value === '') {
      return <Typography color="text.disabled">-</Typography>;
    }

    if (type === 'boolean') {
      return <Chip label={value ? 'Yes' : 'No'} size="small" color={value ? 'success' : 'default'} />;
    }

    if (type === 'status') {
      return <Chip label={value ? 'Active' : 'Inactive'} size="small" color={value ? 'success' : 'error'} />;
    }

    return <Typography fontWeight={500}>{value}</Typography>;
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={5}>
        <Typography color="text.secondary">{label}</Typography>
      </Grid>
      <Grid item xs={12} sm={7}>
        {renderValue()}
      </Grid>
    </Grid>
  );
};

const SectionCard = ({ title, icon: Icon, children }) => {
  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <Icon color="primary" />
        <Typography variant="h6">{title}</Typography>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2}>{children}</Stack>
    </Paper>
  );
};

const MemberView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const { data: member, loading, error } = useMemberDetails(id);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !member) {
    return (
      <MainCard>
        <Alert severity="error">
          {intl.formatMessage({ id: 'common.error' }) || 'Error'}: {error?.message || 'Member not found'}
        </Alert>
      </MainCard>
    );
  }

  return (
    <>
      <ModernPageHeader
        title={intl.formatMessage({ id: 'members.view' }) || 'View Member'}
        subtitle={member.fullNameAr || member.memberCode}
        icon={VisibilityIcon}
        breadcrumbs={[
          { label: intl.formatMessage({ id: 'members.list' }) || 'Members', path: '/members' },
          { label: intl.formatMessage({ id: 'members.view' }) || 'View', path: `/members/view/${id}` }
        ]}
        actions={
          <Stack direction="row" spacing={2}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/members')} variant="outlined">
              {intl.formatMessage({ id: 'common.back' }) || 'Back'}
            </Button>
            <Button startIcon={<EditIcon />} onClick={() => navigate(`/members/edit/${id}`)} variant="contained">
              {intl.formatMessage({ id: 'common.edit' }) || 'Edit'}
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={3}>
        {/* Section 1: Personal Info */}
        <Grid item xs={12} md={6}>
          <SectionCard title={intl.formatMessage({ id: 'members.personal-info' }) || 'Personal Information'} icon={PersonIcon}>
            <InfoRow label={intl.formatMessage({ id: 'common.id' }) || 'ID'} value={member.id} />
            <InfoRow
              label={intl.formatMessage({ id: 'members.national-id' }) || 'National ID'}
              value={member.nationalId}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'members.full-name-ar' }) || 'Full Name (Arabic)'}
              value={member.fullNameAr}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'members.full-name-en' }) || 'Full Name (English)'}
              value={member.fullNameEn}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'members.birth-date' }) || 'Birth Date'}
              value={member.birthDate}
            />
            <InfoRow label={intl.formatMessage({ id: 'members.gender' }) || 'Gender'} value={member.gender} />
            <InfoRow
              label={intl.formatMessage({ id: 'members.marital-status' }) || 'Marital Status'}
              value={member.maritalStatus}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'members.nationality' }) || 'Nationality'}
              value={member.nationality}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'members.occupation' }) || 'Occupation'}
              value={member.occupation}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'members.blood-type' }) || 'Blood Type'}
              value={member.bloodType}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'members.height' }) || 'Height (cm)'}
              value={member.height}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'members.weight' }) || 'Weight (kg)'}
              value={member.weight}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'members.chronic-diseases' }) || 'Chronic Diseases'}
              value={member.chronicDiseases}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'members.allergies' }) || 'Allergies'}
              value={member.allergies}
            />
            <InfoRow label={intl.formatMessage({ id: 'members.notes' }) || 'Notes'} value={member.notes} />
          </SectionCard>
        </Grid>

        {/* Section 2: Insurance Details */}
        <Grid item xs={12} md={6}>
          <SectionCard
            title={intl.formatMessage({ id: 'members.insurance-info' }) || 'Insurance Details'}
            icon={CardMembershipIcon}
          >
            <InfoRow
              label={intl.formatMessage({ id: 'members.member-code' }) || 'Member Code'}
              value={member.memberCode}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'members.employer' }) || 'Employer'}
              value={member.employerName}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'members.insurance-company' }) || 'Insurance Company'}
              value={member.insuranceCompanyName}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'members.policy-number' }) || 'Policy Number'}
              value={member.policyNumber}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'members.coverage-start-date' }) || 'Coverage Start Date'}
              value={member.coverageStartDate}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'members.coverage-end-date' }) || 'Coverage End Date'}
              value={member.coverageEndDate}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'members.dependent-type' }) || 'Dependent Type'}
              value={member.dependentType}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'members.max-coverage-amount' }) || 'Max Coverage Amount'}
              value={member.maxCoverageAmount}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'members.copayment-percentage' }) || 'Copayment (%)'}
              value={member.copaymentPercentage}
            />
            <InfoRow
              label={intl.formatMessage({ id: 'common.status' }) || 'Status'}
              value={member.active}
              type="status"
            />
          </SectionCard>
        </Grid>

        {/* Section 3: Contact Info */}
        <Grid item xs={12} md={6}>
          <SectionCard
            title={intl.formatMessage({ id: 'members.contact-info' }) || 'Contact Information'}
            icon={ContactPhoneIcon}
          >
            <InfoRow label={intl.formatMessage({ id: 'members.email' }) || 'Email'} value={member.email} />
            <InfoRow label={intl.formatMessage({ id: 'members.phone' }) || 'Phone'} value={member.phone} />
            <InfoRow
              label={intl.formatMessage({ id: 'members.mobile-phone' }) || 'Mobile Phone'}
              value={member.mobilePhone}
            />
            <InfoRow label={intl.formatMessage({ id: 'members.city' }) || 'City'} value={member.city} />
            <InfoRow label={intl.formatMessage({ id: 'members.district' }) || 'District'} value={member.district} />
            <InfoRow label={intl.formatMessage({ id: 'members.address' }) || 'Address'} value={member.address} />
          </SectionCard>
        </Grid>

        {/* Section 4: Family Members (Placeholder) */}
        <Grid item xs={12} md={6}>
          <SectionCard
            title={intl.formatMessage({ id: 'members.family-info' }) || 'Family Members'}
            icon={FamilyRestroomIcon}
          >
            <Paper elevation={0} sx={{ p: 3, textAlign: 'center', border: '1px dashed', borderColor: 'divider' }}>
              <FamilyRestroomIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {intl.formatMessage({ id: 'members.no-dependents' }) || 'No dependents added yet'}
              </Typography>
            </Paper>
          </SectionCard>
        </Grid>
      </Grid>
    </>
  );
};

export default MemberView;
