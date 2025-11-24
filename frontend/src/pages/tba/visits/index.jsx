import { useState, useEffect, useMemo } from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import * as Yup from 'yup';
import { useFormikContext } from 'formik';
import { DataTable, CrudDrawer, RBACGuard } from 'components/tba';
import { visitsService, membersService } from 'services/api';
import { useSnackbar } from 'notistack';

export default function VisitsPage() {
  const [visits, setVisits] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const loadData = async () => {
    try {
      setLoading(true);
      const [visitsData, membersData] = await Promise.all([visitsService.getAll(), membersService.getAll()]);
      setVisits(Array.isArray(visitsData) ? visitsData : []);
      setMembers(Array.isArray(membersData) ? membersData : []);
    } catch (error) {
      enqueueSnackbar('Failed to load visits', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const columns = useMemo(() => [
    { header: 'Visit Date', accessorKey: 'visitDate' },
    { header: 'Member', accessorFn: (row) => row.member ? `${row.member.firstName} ${row.member.lastName}` : '-' },
    { header: 'Doctor', accessorKey: 'doctorName' },
    { header: 'Specialty', accessorKey: 'specialty' },
    { header: 'Diagnosis', accessorKey: 'diagnosis' },
    { header: 'Total Amount', accessorKey: 'totalAmount', cell: ({ getValue }) => getValue() ? `${getValue()?.toFixed(2)} LYD` : '-' }
  ], []);

  const validationSchema = Yup.object({
    memberId: Yup.number().required('Member is required'),
    visitDate: Yup.date().required('Visit date is required'),
    doctorName: Yup.string().max(255),
    specialty: Yup.string().max(255),
    diagnosis: Yup.string().max(500),
    treatment: Yup.string().max(1000),
    totalAmount: Yup.number().min(0)
  });

  const handleSubmit = async (values) => {
    try {
      const payload = { ...values, member: { id: values.memberId } };
      if (selected) {
        await visitsService.update(selected.id, payload);
        enqueueSnackbar('Visit updated successfully', { variant: 'success' });
      } else {
        await visitsService.create(payload);
        enqueueSnackbar('Visit created successfully', { variant: 'success' });
      }
      loadData();
    } catch (error) {
      enqueueSnackbar('Failed to save visit', { variant: 'error' });
      throw error;
    }
  };

  const confirmDelete = async () => {
    try {
      await visitsService.remove(toDelete.id);
      enqueueSnackbar('Visit deleted successfully', { variant: 'success' });
      loadData();
    } catch (error) {
      enqueueSnackbar('Failed to delete visit', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setToDelete(null);
    }
  };

  const initialValues = selected ? { ...selected, memberId: selected.member?.id } : {
    memberId: '',
    visitDate: new Date().toISOString().split('T')[0],
    doctorName: '',
    specialty: '',
    diagnosis: '',
    treatment: '',
    totalAmount: '',
    notes: ''
  };

  return (
    <>
      <RBACGuard requiredPermissions={['READ_VISIT']}>
        <DataTable
          title="Visits"
          data={visits}
          columns={columns}
          loading={loading}
          onAdd={() => { setSelected(null); setDrawerOpen(true); }}
          onEdit={(row) => { setSelected(row); setDrawerOpen(true); }}
          onDelete={(row) => { setToDelete(row); setDeleteDialogOpen(true); }}
          addButtonLabel="Add Visit"
        />
      </RBACGuard>

      <CrudDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selected ? 'Edit Visit' : 'Add Visit'}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        width={600}
      >
        <VisitForm members={members} />
      </CrudDrawer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this visit?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function VisitForm({ members }) {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext();
  return (
    <>
      <div>
        <InputLabel>Member *</InputLabel>
        <Select fullWidth name="memberId" value={values.memberId} onChange={handleChange} onBlur={handleBlur} error={touched.memberId && Boolean(errors.memberId)}>
          {members.map((m) => <MenuItem key={m.id} value={m.id}>{m.firstName} {m.lastName} - {m.memberNumber}</MenuItem>)}
        </Select>
        {touched.memberId && errors.memberId && <FormHelperText error>{errors.memberId}</FormHelperText>}
      </div>
      <div><InputLabel>Visit Date *</InputLabel><TextField fullWidth type="date" name="visitDate" value={values.visitDate} onChange={handleChange} onBlur={handleBlur} error={touched.visitDate && Boolean(errors.visitDate)} helperText={touched.visitDate && errors.visitDate} InputLabelProps={{ shrink: true }} /></div>
      <div><InputLabel>Doctor Name</InputLabel><TextField fullWidth name="doctorName" value={values.doctorName} onChange={handleChange} onBlur={handleBlur} /></div>
      <div><InputLabel>Specialty</InputLabel><TextField fullWidth name="specialty" value={values.specialty} onChange={handleChange} onBlur={handleBlur} /></div>
      <div><InputLabel>Diagnosis</InputLabel><TextField fullWidth name="diagnosis" value={values.diagnosis} onChange={handleChange} onBlur={handleBlur} /></div>
      <div><InputLabel>Treatment</InputLabel><TextField fullWidth multiline rows={2} name="treatment" value={values.treatment} onChange={handleChange} onBlur={handleBlur} /></div>
      <div><InputLabel>Total Amount (LYD)</InputLabel><TextField fullWidth type="number" name="totalAmount" value={values.totalAmount} onChange={handleChange} onBlur={handleBlur} /></div>
      <div><InputLabel>Notes</InputLabel><TextField fullWidth multiline rows={2} name="notes" value={values.notes} onChange={handleChange} onBlur={handleBlur} /></div>
    </>
  );
}
