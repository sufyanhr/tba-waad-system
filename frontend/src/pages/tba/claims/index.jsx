import { useState, useEffect, useMemo } from 'react';
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
import * as Yup from 'yup';
import { useFormikContext } from 'formik';
import { DataTable, CrudDrawer, RBACGuard } from 'components/tba';
import { claimsService, visitsService } from 'services/api';
import { useSnackbar } from 'notistack';

export default function ClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const loadData = async () => {
    try {
      setLoading(true);
      const [claimsData, visitsData] = await Promise.all([claimsService.getAll(), visitsService.getAll()]);
      setClaims(Array.isArray(claimsData) ? claimsData : []);
      setVisits(Array.isArray(visitsData) ? visitsData : []);
    } catch (error) {
      enqueueSnackbar('Failed to load claims', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const columns = useMemo(() => [
    { header: 'Claim #', accessorKey: 'claimNumber' },
    { header: 'Visit ID', accessorKey: 'visit.id' },
    { header: 'Claim Date', accessorKey: 'claimDate' },
    { header: 'Requested Amount', accessorKey: 'requestedAmount', cell: ({ getValue }) => `${getValue()?.toFixed(2)} LYD` },
    { header: 'Approved Amount', accessorKey: 'approvedAmount', cell: ({ getValue }) => getValue() ? `${getValue()?.toFixed(2)} LYD` : '-' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const status = getValue();
        const color = status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'error' : 'warning';
        return <Chip label={status || 'PENDING'} color={color} size="small" />;
      }
    }
  ], []);

  const validationSchema = Yup.object({
    visitId: Yup.number().required('Visit is required'),
    claimDate: Yup.date().required('Claim date is required'),
    requestedAmount: Yup.number().required('Requested amount is required').min(0),
    status: Yup.string().required('Status is required')
  });

  const handleSubmit = async (values) => {
    try {
      const payload = { ...values, visit: { id: values.visitId } };
      if (selected) {
        await claimsService.update(selected.id, payload);
        enqueueSnackbar('Claim updated successfully', { variant: 'success' });
      } else {
        await claimsService.create(payload);
        enqueueSnackbar('Claim created successfully', { variant: 'success' });
      }
      loadData();
    } catch (error) {
      enqueueSnackbar('Failed to save claim', { variant: 'error' });
      throw error;
    }
  };

  const confirmDelete = async () => {
    try {
      await claimsService.remove(toDelete.id);
      enqueueSnackbar('Claim deleted successfully', { variant: 'success' });
      loadData();
    } catch (error) {
      enqueueSnackbar('Failed to delete claim', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setToDelete(null);
    }
  };

  const initialValues = selected ? { ...selected, visitId: selected.visit?.id } : {
    visitId: '',
    claimDate: new Date().toISOString().split('T')[0],
    requestedAmount: '',
    approvedAmount: '',
    status: 'PENDING',
    rejectionReason: '',
    notes: ''
  };

  return (
    <>
      <RBACGuard requiredPermissions={['READ_CLAIM']}>
        <DataTable
          title="Claims"
          data={claims}
          columns={columns}
          loading={loading}
          onAdd={() => { setSelected(null); setDrawerOpen(true); }}
          onEdit={(row) => { setSelected(row); setDrawerOpen(true); }}
          onDelete={(row) => { setToDelete(row); setDeleteDialogOpen(true); }}
          addButtonLabel="Add Claim"
        />
      </RBACGuard>

      <CrudDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selected ? 'Edit Claim' : 'Add Claim'}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        width={600}
      >
        <ClaimForm visits={visits} />
      </CrudDrawer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete claim "{toDelete?.claimNumber}"?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function ClaimForm({ visits }) {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext();
  return (
    <>
      <div>
        <InputLabel>Visit *</InputLabel>
        <Select fullWidth name="visitId" value={values.visitId} onChange={handleChange} onBlur={handleBlur} error={touched.visitId && Boolean(errors.visitId)}>
          {visits.map((v) => <MenuItem key={v.id} value={v.id}>Visit #{v.id} - {v.member?.firstName}</MenuItem>)}
        </Select>
        {touched.visitId && errors.visitId && <FormHelperText error>{errors.visitId}</FormHelperText>}
      </div>
      <div><InputLabel>Claim Date *</InputLabel><TextField fullWidth type="date" name="claimDate" value={values.claimDate} onChange={handleChange} onBlur={handleBlur} error={touched.claimDate && Boolean(errors.claimDate)} helperText={touched.claimDate && errors.claimDate} InputLabelProps={{ shrink: true }} /></div>
      <div><InputLabel>Requested Amount (LYD) *</InputLabel><TextField fullWidth type="number" name="requestedAmount" value={values.requestedAmount} onChange={handleChange} onBlur={handleBlur} error={touched.requestedAmount && Boolean(errors.requestedAmount)} helperText={touched.requestedAmount && errors.requestedAmount} /></div>
      <div><InputLabel>Approved Amount (LYD)</InputLabel><TextField fullWidth type="number" name="approvedAmount" value={values.approvedAmount} onChange={handleChange} onBlur={handleBlur} /></div>
      <div>
        <InputLabel>Status *</InputLabel>
        <Select fullWidth name="status" value={values.status} onChange={handleChange} onBlur={handleBlur}>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="APPROVED">Approved</MenuItem>
          <MenuItem value="REJECTED">Rejected</MenuItem>
        </Select>
      </div>
      <div><InputLabel>Rejection Reason</InputLabel><TextField fullWidth name="rejectionReason" value={values.rejectionReason} onChange={handleChange} onBlur={handleBlur} /></div>
      <div><InputLabel>Notes</InputLabel><TextField fullWidth multiline rows={3} name="notes" value={values.notes} onChange={handleChange} onBlur={handleBlur} /></div>
    </>
  );
}
