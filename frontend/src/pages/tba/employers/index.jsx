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

// third-party
import * as Yup from 'yup';
import { useFormikContext } from 'formik';

// project imports
import { DataTable, CrudDrawer, RBACGuard } from 'components/tba';
import { employersService } from 'services/api';
import { useSnackbar } from 'notistack';

// ==============================|| TBA - EMPLOYERS PAGE ||============================== //

export default function EmployersPage() {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employerToDelete, setEmployerToDelete] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  // Load employers
  const loadEmployers = async () => {
    try {
      setLoading(true);
      const data = await employersService.getAll();
      setEmployers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading employers:', error);
      enqueueSnackbar('Failed to load employers', { variant: 'error' });
      setEmployers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployers();
  }, []);

  // Table columns
  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'name'
      },
      {
        header: 'Contact Person',
        accessorKey: 'contactName'
      },
      {
        header: 'Phone',
        accessorKey: 'contactPhone'
      },
      {
        header: 'Email',
        accessorKey: 'contactEmail'
      },
      {
        header: 'Status',
        accessorKey: 'active',
        cell: ({ getValue }) => (
          <Chip
            label={getValue() ? 'Active' : 'Inactive'}
            color={getValue() ? 'success' : 'default'}
            size="small"
          />
        )
      }
    ],
    []
  );

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Employer name is required').max(255, 'Name too long'),
    contactName: Yup.string().max(255, 'Contact name too long'),
    contactPhone: Yup.string().max(20, 'Phone number too long'),
    contactEmail: Yup.string().email('Invalid email').max(255, 'Email too long'),
    address: Yup.string().max(500, 'Address too long')
  });

  // Handlers
  const handleAdd = () => {
    setSelectedEmployer(null);
    setDrawerOpen(true);
  };

  const handleEdit = (employer) => {
    setSelectedEmployer(employer);
    setDrawerOpen(true);
  };

  const handleDelete = (employer) => {
    setEmployerToDelete(employer);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await employersService.remove(employerToDelete.id);
      enqueueSnackbar('Employer deleted successfully', { variant: 'success' });
      loadEmployers();
    } catch (error) {
      console.error('Error deleting employer:', error);
      enqueueSnackbar('Failed to delete employer', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setEmployerToDelete(null);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (selectedEmployer) {
        await employersService.update(selectedEmployer.id, values);
        enqueueSnackbar('Employer updated successfully', { variant: 'success' });
      } else {
        await employersService.create(values);
        enqueueSnackbar('Employer created successfully', { variant: 'success' });
      }
      loadEmployers();
    } catch (error) {
      console.error('Error saving employer:', error);
      enqueueSnackbar('Failed to save employer', { variant: 'error' });
      throw error;
    }
  };

  const initialValues = selectedEmployer || {
    name: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    active: true
  };

  return (
    <>
      <RBACGuard requiredPermissions={['READ_EMPLOYER']}>
        <DataTable
          title="Employers"
          data={employers}
          columns={columns}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          addButtonLabel="Add Employer"
        />
      </RBACGuard>

      {/* CRUD Drawer */}
      <CrudDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedEmployer ? 'Edit Employer' : 'Add Employer'}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        width={500}
      >
        <EmployerForm />
      </CrudDrawer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete employer "{employerToDelete?.name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ==============================|| EMPLOYER FORM FIELDS ||============================== //

function EmployerForm() {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext();

  return (
    <>
      <div>
        <InputLabel>Employer Name *</InputLabel>
        <TextField
          fullWidth
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
          placeholder="Enter employer name"
        />
      </div>

      <div>
        <InputLabel>Contact Person</InputLabel>
        <TextField
          fullWidth
          name="contactName"
          value={values.contactName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.contactName && Boolean(errors.contactName)}
          helperText={touched.contactName && errors.contactName}
          placeholder="Enter contact person name"
        />
      </div>

      <div>
        <InputLabel>Phone Number</InputLabel>
        <TextField
          fullWidth
          name="contactPhone"
          value={values.contactPhone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.contactPhone && Boolean(errors.contactPhone)}
          helperText={touched.contactPhone && errors.contactPhone}
          placeholder="Enter phone number"
        />
      </div>

      <div>
        <InputLabel>Email Address</InputLabel>
        <TextField
          fullWidth
          name="contactEmail"
          type="email"
          value={values.contactEmail}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.contactEmail && Boolean(errors.contactEmail)}
          helperText={touched.contactEmail && errors.contactEmail}
          placeholder="Enter email address"
        />
      </div>

      <div>
        <InputLabel>Address</InputLabel>
        <TextField
          fullWidth
          multiline
          rows={3}
          name="address"
          value={values.address}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.address && Boolean(errors.address)}
          helperText={touched.address && errors.address}
          placeholder="Enter full address"
        />
      </div>
    </>
  );
}
