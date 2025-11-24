import { useState, useEffect, useMemo } from 'react';

// material-ui
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';

// third-party
import * as Yup from 'yup';
import { useFormikContext } from 'formik';

// project imports
import { DataTable, CrudDrawer, RBACGuard } from 'components/tba';
import { membersService, employersService, insuranceService } from 'services/api';
import { useSnackbar } from 'notistack';

// ==============================|| TBA - MEMBERS PAGE ||============================== //

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      const [membersData, employersData, insuranceData] = await Promise.all([
        membersService.getAll(),
        employersService.getAll(),
        insuranceService.getAll()
      ]);
      setMembers(Array.isArray(membersData) ? membersData : []);
      setEmployers(Array.isArray(employersData) ? employersData : []);
      setInsuranceCompanies(Array.isArray(insuranceData) ? insuranceData : []);
    } catch (error) {
      console.error('Error loading data:', error);
      enqueueSnackbar('Failed to load members', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Table columns
  const columns = useMemo(
    () => [
      {
        header: 'Member #',
        accessorKey: 'memberNumber'
      },
      {
        header: 'Full Name',
        accessorFn: (row) => `${row.firstName} ${row.lastName}`
      },
      {
        header: 'National ID',
        accessorKey: 'nationalId'
      },
      {
        header: 'Gender',
        accessorKey: 'gender'
      },
      {
        header: 'Employer',
        accessorKey: 'employer.name'
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => (
          <Chip
            label={getValue() || 'ACTIVE'}
            color={getValue() === 'ACTIVE' ? 'success' : 'default'}
            size="small"
          />
        )
      }
    ],
    []
  );

  // Validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required').max(100),
    lastName: Yup.string().required('Last name is required').max(100),
    nationalId: Yup.string().required('National ID is required').max(50),
    phone: Yup.string().max(20),
    email: Yup.string().email('Invalid email').max(255),
    dateOfBirth: Yup.date().required('Date of birth is required'),
    gender: Yup.string().required('Gender is required'),
    employerId: Yup.number().required('Employer is required'),
    insuranceCompanyId: Yup.number().required('Insurance company is required')
  });

  // Handlers
  const handleAdd = () => {
    setSelectedMember(null);
    setDrawerOpen(true);
  };

  const handleEdit = (member) => {
    setSelectedMember({
      ...member,
      employerId: member.employer?.id,
      insuranceCompanyId: member.insuranceCompany?.id
    });
    setDrawerOpen(true);
  };

  const handleDelete = (member) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await membersService.remove(memberToDelete.id);
      enqueueSnackbar('Member deleted successfully', { variant: 'success' });
      loadData();
    } catch (error) {
      console.error('Error deleting member:', error);
      enqueueSnackbar('Failed to delete member', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        employer: { id: values.employerId },
        insuranceCompany: { id: values.insuranceCompanyId }
      };
      
      if (selectedMember) {
        await membersService.update(selectedMember.id, payload);
        enqueueSnackbar('Member updated successfully', { variant: 'success' });
      } else {
        await membersService.create(payload);
        enqueueSnackbar('Member created successfully', { variant: 'success' });
      }
      loadData();
    } catch (error) {
      console.error('Error saving member:', error);
      enqueueSnackbar('Failed to save member', { variant: 'error' });
      throw error;
    }
  };

  const initialValues = selectedMember || {
    firstName: '',
    lastName: '',
    nationalId: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    employerId: '',
    insuranceCompanyId: '',
    status: 'ACTIVE'
  };

  return (
    <>
      <RBACGuard requiredPermissions={['READ_MEMBER']}>
        <DataTable
          title="Members"
          data={members}
          columns={columns}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          addButtonLabel="Add Member"
        />
      </RBACGuard>

      <CrudDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedMember ? 'Edit Member' : 'Add Member'}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        width={600}
      >
        <MemberForm employers={employers} insuranceCompanies={insuranceCompanies} />
      </CrudDrawer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete member "{memberToDelete?.firstName} {memberToDelete?.lastName}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ==============================|| MEMBER FORM FIELDS ||============================== //

function MemberForm({ employers, insuranceCompanies }) {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext();

  return (
    <>
      <div>
        <InputLabel>First Name *</InputLabel>
        <TextField
          fullWidth
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.firstName && Boolean(errors.firstName)}
          helperText={touched.firstName && errors.firstName}
        />
      </div>

      <div>
        <InputLabel>Last Name *</InputLabel>
        <TextField
          fullWidth
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.lastName && Boolean(errors.lastName)}
          helperText={touched.lastName && errors.lastName}
        />
      </div>

      <div>
        <InputLabel>National ID *</InputLabel>
        <TextField
          fullWidth
          name="nationalId"
          value={values.nationalId}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.nationalId && Boolean(errors.nationalId)}
          helperText={touched.nationalId && errors.nationalId}
        />
      </div>

      <div>
        <InputLabel>Date of Birth *</InputLabel>
        <TextField
          fullWidth
          type="date"
          name="dateOfBirth"
          value={values.dateOfBirth}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
          helperText={touched.dateOfBirth && errors.dateOfBirth}
          InputLabelProps={{ shrink: true }}
        />
      </div>

      <div>
        <InputLabel>Gender *</InputLabel>
        <Select
          fullWidth
          name="gender"
          value={values.gender}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.gender && Boolean(errors.gender)}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
        {touched.gender && errors.gender && <FormHelperText error>{errors.gender}</FormHelperText>}
      </div>

      <div>
        <InputLabel>Phone</InputLabel>
        <TextField
          fullWidth
          name="phone"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.phone && Boolean(errors.phone)}
          helperText={touched.phone && errors.phone}
        />
      </div>

      <div>
        <InputLabel>Email</InputLabel>
        <TextField
          fullWidth
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
        />
      </div>

      <div>
        <InputLabel>Employer *</InputLabel>
        <Select
          fullWidth
          name="employerId"
          value={values.employerId}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.employerId && Boolean(errors.employerId)}
        >
          {employers.map((emp) => (
            <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
          ))}
        </Select>
        {touched.employerId && errors.employerId && <FormHelperText error>{errors.employerId}</FormHelperText>}
      </div>

      <div>
        <InputLabel>Insurance Company *</InputLabel>
        <Select
          fullWidth
          name="insuranceCompanyId"
          value={values.insuranceCompanyId}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.insuranceCompanyId && Boolean(errors.insuranceCompanyId)}
        >
          {insuranceCompanies.map((ins) => (
            <MenuItem key={ins.id} value={ins.id}>{ins.name}</MenuItem>
          ))}
        </Select>
        {touched.insuranceCompanyId && errors.insuranceCompanyId && (
          <FormHelperText error>{errors.insuranceCompanyId}</FormHelperText>
        )}
      </div>

      <div>
        <InputLabel>Address</InputLabel>
        <TextField
          fullWidth
          multiline
          rows={2}
          name="address"
          value={values.address}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
    </>
  );
}
