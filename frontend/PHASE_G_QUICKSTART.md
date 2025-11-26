# Phase G: Full Frontend Integration - Quickstart Guide

**For Developers:** How to continue implementing remaining TPA modules

---

## 📦 What's Already Done (40%)

### ✅ Infrastructure (Ready to Use)
1. **`hooks/useFetch.js`** - Data fetching hook with loading/error/retry
2. **`components/tba/LoadingSkeleton.jsx`** - `TableSkeleton` and `CardGridSkeleton`
3. **`components/tba/ErrorFallback.jsx`** - `ErrorFallback` and `EmptyState` components
4. **`components/tba/RBACGuard.jsx`** - Permission-based component wrapper

### ✅ Service Layer (11 Services Ready)
All services follow this pattern:
```javascript
import serviceName from 'services/service-name.service';

// All methods return: { success, data, message, error }
const result = await serviceName.list({ page: 0, size: 10 });
if (result.success) {
  console.log(result.data); // Use data
} else {
  console.error(result.error); // Handle error
}
```

**Available Services:**
- `membersService` → `/members`
- `employersService` → `/employers`
- `policiesService` → `/policies`
- `benefitPackagesService` → `/benefit-packages`
- `preauthService` → `/pre-authorizations`
- `claimsService` → `/claims`
- `invoicesService` → `/invoices`
- `visitsService` → `/visits`
- `medicalServicesService` → `/medical-services`
- `providersService` → `/providers`
- `medicalCategoriesService` → `/medical-categories`

### ✅ First Module Completed
**`pages/tba/members/MembersList.jsx`** is fully integrated and can be used as a **reference template**.

---

## 🚀 How to Test Members Module (Next Step)

### 1. Start Backend Server
```bash
cd /workspaces/tba-waad-system/backend
mvn spring-boot:run
```

Wait for: `Started TbaWaadSystemApplication in X seconds`

### 2. Start Frontend Dev Server
```bash
cd /workspaces/tba-waad-system/frontend
npm run dev
```

Open browser: `http://localhost:3000`

### 3. Login
- **Username:** `admin` (or your test user)
- **Password:** `admin123` (or your test password)

### 4. Navigate to Members
Go to: **TPA Management → Members List**

### 5. Test Checklist
- [ ] Page loads with loading skeleton
- [ ] Data appears in table
- [ ] Search works
- [ ] Pagination works (Next/Previous buttons)
- [ ] Click "Add Member" → Form opens
- [ ] Create new member → Success notification
- [ ] Click Edit button → Form opens with data
- [ ] Update member → Success notification
- [ ] Click Delete button → Confirmation dialog
- [ ] Confirm delete → Success notification
- [ ] Test error: Stop backend → See error message with retry button
- [ ] Click Retry → Loading → Data reappears
- [ ] Test empty state: Delete all members → See "No members found"

---

## 📝 How to Integrate Next Module (Employers)

### Step 1: Open EmployersList.jsx
```bash
code /workspaces/tba-waad-system/frontend/src/pages/tba/employers/EmployersList.jsx
```

### Step 2: Update Imports
Replace old imports with:
```jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Typography,
  TablePagination
} from '@mui/material';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';

// project imports
import MainCard from 'components/MainCard';
import RBACGuard from 'components/tba/RBACGuard';
import { TableSkeleton } from 'components/tba/LoadingSkeleton';
import ErrorFallback, { EmptyState } from 'components/tba/ErrorFallback';
import employersService from 'services/employers.service';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';

// third-party
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table';
```

### Step 3: Define Columns
```jsx
const columnHelper = createColumnHelper();

export default function EmployersList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // State
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState(null);

  // Columns definition
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Company Name',
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('commercialRegistration', {
        header: 'CR Number',
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('contactPerson', {
        header: 'Contact Person',
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('active', {
        header: 'Status',
        cell: (info) => (
          <Chip
            label={info.getValue() ? 'Active' : 'Inactive'}
            color={info.getValue() ? 'success' : 'default'}
            size="small"
          />
        )
      }),
      columnHelper.accessor('id', {
        header: 'Actions',
        cell: (info) => (
          <Stack direction="row" spacing={0.5}>
            <RBACGuard requiredPermission="EMPLOYER_MANAGE">
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => navigate(`/tpa/employers/edit/${info.getValue()}`)}
                >
                  <EditOutlined />
                </IconButton>
              </Tooltip>
            </RBACGuard>
            <RBACGuard requiredPermission="EMPLOYER_MANAGE">
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => openDeleteDialog(info.row.original)}
                >
                  <DeleteOutlined />
                </IconButton>
              </Tooltip>
            </RBACGuard>
          </Stack>
        )
      })
    ],
    [navigate]
  );

  // Data fetching
  const loadEmployers = async () => {
    setLoading(true);
    setError(null);
    const result = await employersService.list({
      page,
      size: rowsPerPage,
      search: searchTerm
    });

    if (result.success) {
      setEmployers(result.data.content || []);
    } else {
      setError(result.error);
      enqueueSnackbar(result.error, { variant: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEmployers();
  }, [page, rowsPerPage, searchTerm]);

  // Event handlers
  const handleRetry = () => {
    loadEmployers();
  };

  const openDeleteDialog = (employer) => {
    setSelectedEmployer(employer);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    const result = await employersService.delete(selectedEmployer.id);
    if (result.success) {
      enqueueSnackbar('Employer deleted successfully', { variant: 'success' });
      loadEmployers();
    } else {
      enqueueSnackbar(result.error, { variant: 'error' });
    }
    setDeleteDialogOpen(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // React Table initialization
  const table = useReactTable({
    data: employers,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  // ... JSX (see next step)
}
```

### Step 4: Update JSX Return
```jsx
return (
  <RBACGuard requiredPermission="EMPLOYER_VIEW">
    <MainCard
      title="Employers"
      content={false}
      secondary={
        <RBACGuard requiredPermission="EMPLOYER_MANAGE">
          <Button
            variant="contained"
            startIcon={<PlusOutlined />}
            onClick={() => navigate('/tpa/employers/add')}
          >
            Add Employer
          </Button>
        </RBACGuard>
      }
    >
      {/* Search Bar */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search employers..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <SearchOutlined style={{ marginRight: 8 }} />
          }}
        />
      </Box>

      {/* Loading State */}
      {loading && <TableSkeleton rows={rowsPerPage} columns={7} />}

      {/* Error State */}
      {!loading && error && (
        <ErrorFallback error={error} onRetry={handleRetry} />
      )}

      {/* Empty State */}
      {!loading && !error && employers.length === 0 && (
        <EmptyState
          title="No employers found"
          description={
            searchTerm
              ? 'Try adjusting your search criteria'
              : 'Get started by adding your first employer'
          }
          action={() => navigate('/tpa/employers/add')}
          actionLabel="Add Employer"
        />
      )}

      {/* Data Table */}
      {!loading && !error && employers.length > 0 && (
        <>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{
                          padding: '16px',
                          textAlign: 'left',
                          borderBottom: '1px solid #e0e0e0',
                          fontWeight: 600
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{
                          padding: '16px',
                          borderBottom: '1px solid #f0f0f0'
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={employers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete employer "{selectedEmployer?.name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  </RBACGuard>
);
```

### Step 5: Test Build
```bash
cd /workspaces/tba-waad-system/frontend
npm run build
```

Should see: `✓ built in Xm Ys`

### Step 6: Test in Browser
1. Start servers (backend + frontend)
2. Navigate to **TPA Management → Employers**
3. Follow same test checklist as Members module

---

## 🎯 Module Implementation Order

Follow this order as specified by the user:

1. ✅ **Members** - DONE (95% - needs testing)
2. ⏳ **Employers** - NEXT
3. ⏳ **Providers**
4. ⏳ **Policies**
5. ⏳ **Benefit Packages**
6. ⏳ **Pre-Authorizations** (has approval workflow)
7. ⏳ **Claims** (has approval workflow)
8. ⏳ **Invoices** (has payment tracking)
9. ⏳ **Visits**
10. ⏳ **Medical Services**
11. ⏳ **Medical Categories**

---

## 🛠️ Common Patterns

### Pattern 1: Column with Status Badge
```jsx
columnHelper.accessor('status', {
  header: 'Status',
  cell: (info) => {
    const status = info.getValue();
    const statusColors = {
      ACTIVE: 'success',
      INACTIVE: 'default',
      PENDING: 'warning',
      APPROVED: 'success',
      REJECTED: 'error'
    };
    return (
      <Chip
        label={status}
        color={statusColors[status] || 'default'}
        size="small"
      />
    );
  }
})
```

### Pattern 2: Column with Date Formatting
```jsx
columnHelper.accessor('createdAt', {
  header: 'Created Date',
  cell: (info) => {
    const date = new Date(info.getValue());
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
})
```

### Pattern 3: Column with Currency
```jsx
columnHelper.accessor('amount', {
  header: 'Amount',
  cell: (info) => {
    const amount = info.getValue();
    return new Intl.NumberFormat('en-KW', {
      style: 'currency',
      currency: 'KWD'
    }).format(amount);
  }
})
```

### Pattern 4: Workflow Actions (Pre-Auth/Claims)
```jsx
columnHelper.accessor('id', {
  header: 'Actions',
  cell: (info) => {
    const status = info.row.original.status;
    return (
      <Stack direction="row" spacing={0.5}>
        {status === 'PENDING' && (
          <>
            <RBACGuard requiredPermission="PREAUTH_REVIEW">
              <Tooltip title="Approve">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => handleApprove(info.getValue())}
                >
                  <CheckOutlined />
                </IconButton>
              </Tooltip>
            </RBACGuard>
            <RBACGuard requiredPermission="PREAUTH_REVIEW">
              <Tooltip title="Reject">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleReject(info.getValue())}
                >
                  <CloseOutlined />
                </IconButton>
              </Tooltip>
            </RBACGuard>
          </>
        )}
        <Tooltip title="View Details">
          <IconButton
            size="small"
            onClick={() => navigate(`/tpa/preauth/${info.getValue()}`)}
          >
            <EyeOutlined />
          </IconButton>
        </Tooltip>
      </Stack>
    );
  }
})
```

---

## 🔐 RBAC Permissions Reference

| Module              | View Permission      | Manage Permission    | Review Permission      |
|---------------------|---------------------|---------------------|------------------------|
| Members             | `MEMBER_VIEW`       | `MEMBER_MANAGE`     | -                      |
| Employers           | `EMPLOYER_VIEW`     | `EMPLOYER_MANAGE`   | -                      |
| Providers           | `PROVIDER_VIEW`     | `PROVIDER_MANAGE`   | -                      |
| Policies            | `POLICY_VIEW`       | `POLICY_MANAGE`     | -                      |
| Benefit Packages    | `PACKAGE_VIEW`      | `PACKAGE_MANAGE`    | -                      |
| Pre-Authorizations  | `PREAUTH_VIEW`      | `PREAUTH_MANAGE`    | `PREAUTH_REVIEW`       |
| Claims              | `CLAIM_VIEW`        | `CLAIM_MANAGE`      | `CLAIM_REVIEW`         |
| Invoices            | `INVOICE_VIEW`      | `INVOICE_MANAGE`    | -                      |
| Visits              | `VISIT_VIEW`        | `VISIT_MANAGE`      | -                      |
| Medical Services    | `SERVICE_VIEW`      | `SERVICE_MANAGE`    | -                      |
| Medical Categories  | `CATEGORY_VIEW`     | `CATEGORY_MANAGE`   | -                      |

---

## 📊 Service Methods Quick Reference

### Standard CRUD (All Services)
```javascript
list({ page, size, search, sortBy, sortDir })  // Paginated list
get(id)                                          // Get by ID
create(data)                                     // Create new
update(id, data)                                 // Update existing
delete(id)                                       // Delete
count()                                          // Total count
```

### Pre-Authorizations Service
```javascript
approve(id, { reviewerId, approvedAmount, reviewerNotes, validityDays })
reject(id, { reviewerId, rejectionReason, reviewerNotes })
markUnderReview(id, reviewerId)
getByStatus(status)
getByMember(memberId)
getByProvider(providerId)
getByNumber(preAuthNumber)
```

### Claims Service
```javascript
approve(id, { reviewerId, approvedAmount })
reject(id, { reviewerId, rejectionReason })
getByStatus(status)
```

### Invoices Service
```javascript
getByStatus(status)
getByProvider(providerId)
getByNumber(invoiceNumber)
updateStatus(id, status)
markAsPaid(id, { paymentDate, paymentMethod, transactionRef })
```

### Policies Service
```javascript
getActive()
getByEmployer(employerId)
getByInsuranceCompany(insuranceCompanyId)
getByNumber(policyNumber)
updateStatus(id, status)
```

### Providers Service
```javascript
getActive()
getByLicense(licenseNumber)
getByType(type) // HOSPITAL, CLINIC, PHARMACY, LABORATORY
```

### Medical Services Service
```javascript
getByCode(code)
getActive()
getByCategory(categoryId)
```

---

## ⚡ Performance Tips

1. **Use React.memo for columns:**
```jsx
const columns = useMemo(() => [...], [navigate]);
```

2. **Debounce search:**
```jsx
import { debounce } from 'lodash';
const debouncedSearch = useMemo(
  () => debounce((value) => setSearchTerm(value), 500),
  []
);
```

3. **Pagination from backend:**
Always use `page`, `size` params and display `totalPages` from API response.

4. **Cancel requests on unmount:**
```jsx
useEffect(() => {
  const controller = new AbortController();
  // ... fetch with controller.signal
  return () => controller.abort();
}, []);
```

---

## 🐛 Troubleshooting

### Build Error: "Cannot resolve import"
**Solution:** Check import paths, use relative paths from `src/`:
```jsx
import Component from 'components/Component'; // ✅
import Component from '../../../components/Component'; // ❌
```

### API Error: 401 Unauthorized
**Solution:** Check JWT token in `axiosServices`:
```javascript
localStorage.getItem('serviceToken')
```

### RBAC not working
**Solution:** Verify user permissions in `useAuth()`:
```javascript
const { user } = useAuth();
console.log(user.permissions);
```

### Pagination not working
**Solution:** Ensure backend returns:
```json
{
  "content": [...],
  "totalPages": 10,
  "totalElements": 100,
  "size": 10,
  "number": 0
}
```

---

## 📚 References

- **MembersList.jsx**: `/workspaces/tba-waad-system/frontend/src/pages/tba/members/MembersList.jsx`
- **Service Pattern**: Any file in `/workspaces/tba-waad-system/frontend/src/services/`
- **React Table Docs**: https://tanstack.com/table/v8
- **Material-UI**: https://mui.com/
- **Mantis Template**: Existing component patterns in `frontend/src/`

---

## 🎯 Success Criteria for Each Module

- [ ] Page loads without errors
- [ ] Loading skeleton appears during fetch
- [ ] Data displays in table format
- [ ] Search functionality works
- [ ] Pagination works (Next/Previous)
- [ ] Create new record → Success
- [ ] Edit existing record → Success
- [ ] Delete record with confirmation → Success
- [ ] Error handling shows proper message
- [ ] Retry button works after error
- [ ] Empty state displays when no data
- [ ] RBAC hides buttons for unauthorized users
- [ ] Build passes without warnings

---

**Ready to implement!** Start with Employers module using this guide.

**Questions?** Check `PHASE_G_PROGRESS_REPORT.md` for detailed progress tracking.
