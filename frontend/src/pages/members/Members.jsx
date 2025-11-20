import { useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import MainCard from 'components/MainCard';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Drawer from '@mui/material/Drawer';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-hot-toast';
import { useAuth } from 'modules/auth/useAuth';
import EmptyState from 'components/EmptyState';
import membersApi from 'api/membersApi';

export default function Members() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('member.manage');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { page: page + 1, size: rowsPerPage, search, sortBy, sortDir };
      const res = await membersApi.getAll(params);
      setData(res.items || res.data || res || []);
      setTotal(res.total || res.totalItems || res.count || 0);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to load members');
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchData(); },[page, rowsPerPage, search, sortBy, sortDir]);

  const openCreate = () => { setEditing({}); setDrawerOpen(true); };
  const openEdit = (row) => { setEditing(row); setDrawerOpen(true); };
  const closeDrawer = () => { setEditing(null); setDrawerOpen(false); };

  const handleSave = async (values) => {
    try {
      setLoading(true);
      if (editing?.id) {
        await membersApi.updateMember(editing.id, values);
        toast.success('Member updated');
      } else {
        await membersApi.createMember(values);
        toast.success('Member created');
      }
      closeDrawer();
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Save failed');
    } finally { setLoading(false); }
  };

  const confirmDelete = (id) => { setDeletingId(id); setConfirmOpen(true); };
  const handleDelete = async () => {
    try {
      setLoading(true);
      await membersApi.deleteMember(deletingId);
      toast.success('Member deleted');
      setConfirmOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Delete failed');
    } finally { setLoading(false); setDeletingId(null); }
  };

  const headers = useMemo(()=>[
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'nationalId', label: 'National ID' },
    { key: 'phone', label: 'Phone' },
    { key: 'actions', label: 'Actions' }
  ],[]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard>
          <Grid container alignItems="center" spacing={2} sx={{ mb:2 }}>
            <Grid item xs>
              <TextField size="small" placeholder="Search members..." value={search} onChange={(e)=>setSearch(e.target.value)} />
            </Grid>
            <Grid item>
              {canManage && (
                <Button variant="contained" onClick={openCreate}>+ Add Member</Button>
              )}
            </Grid>
          </Grid>

          {loading ? (
            <Grid sx={{ display:'flex', justifyContent:'center', py:4 }}><CircularProgress /></Grid>
          ) : data.length === 0 ? (
            <EmptyState title="No Members" description="No member records found." actionLabel="Retry" onAction={fetchData} />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map(h=> (
                      <TableCell key={h.key}>{h.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map(row => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.fullName || `${row.firstName} ${row.lastName}` || row.name}</TableCell>
                      <TableCell>{row.nationalId}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>
                        {canManage ? (
                          <>
                            <Tooltip title="Edit"><IconButton size="small" onClick={()=>openEdit(row)}>✏️</IconButton></Tooltip>
                            <Tooltip title="Delete"><IconButton size="small" color="error" onClick={()=>confirmDelete(row.id)}>🗑️</IconButton></Tooltip>
                          </>
                        ) : (<em style={{ color: 'gray', fontSize: 12 }}>Read only</em>)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination component="div" count={total} page={page} onPageChange={(e,newPage)=>setPage(newPage)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e)=>{ setRowsPerPage(parseInt(e.target.value,10)); setPage(0); }} />
            </TableContainer>
          )}
        </MainCard>
      </Grid>

      <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
        <div style={{ width: 480, padding: 16 }}>
          <h3>{editing?.id ? 'Edit Member' : 'Add Member'}</h3>
          <MemberForm initial={editing} onCancel={closeDrawer} onSave={handleSave} />
        </div>
      </Drawer>

      <Dialog open={confirmOpen} onClose={()=>setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this member?</DialogContent>
        <DialogActions>
          <Button onClick={()=>setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

function MemberForm({ initial = {}, onCancel, onSave }) {
  const [values, setValues] = useState({ firstName: initial.firstName || '', lastName: initial.lastName || '', nationalId: initial.nationalId || '', phone: initial.phone || '', email: initial.email || '', employerId: initial.employerId || '', insuranceCompanyId: initial.insuranceCompanyId || '' });

  useEffect(()=>{ setValues({ firstName: initial.firstName || '', lastName: initial.lastName || '', nationalId: initial.nationalId || '', phone: initial.phone || '', email: initial.email || '', employerId: initial.employerId || '', insuranceCompanyId: initial.insuranceCompanyId || '' }); },[initial]);

  return (
    <form onSubmit={e=>{ e.preventDefault(); onSave(values); }}>
      <Grid container spacing={2}>
        <Grid item xs={6}><TextField fullWidth label="First Name" value={values.firstName} onChange={e=>setValues(v=>({ ...v, firstName: e.target.value }))} /></Grid>
        <Grid item xs={6}><TextField fullWidth label="Last Name" value={values.lastName} onChange={e=>setValues(v=>({ ...v, lastName: e.target.value }))} /></Grid>
        <Grid item xs={12}><TextField fullWidth label="National ID" value={values.nationalId} onChange={e=>setValues(v=>({ ...v, nationalId: e.target.value }))} /></Grid>
        <Grid item xs={6}><TextField fullWidth label="Phone" value={values.phone} onChange={e=>setValues(v=>({ ...v, phone: e.target.value }))} /></Grid>
        <Grid item xs={6}><TextField fullWidth label="Email" value={values.email} onChange={e=>setValues(v=>({ ...v, email: e.target.value }))} /></Grid>
        <Grid item xs={6}><TextField fullWidth label="Employer ID" value={values.employerId} onChange={e=>setValues(v=>({ ...v, employerId: e.target.value }))} /></Grid>
        <Grid item xs={6}><TextField fullWidth label="Insurance Company ID" value={values.insuranceCompanyId} onChange={e=>setValues(v=>({ ...v, insuranceCompanyId: e.target.value }))} /></Grid>
        <Grid item xs={12} sx={{ display:'flex', justifyContent:'flex-end' }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </Grid>
      </Grid>
    </form>
  );
}
