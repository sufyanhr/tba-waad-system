# 🚀 PHASE B2 QUICKSTART: EMPLOYERS MODULE

**Quick Reference Guide for Developers**

---

## 📦 FILES OVERVIEW

```
frontend/src/
├── services/api/
│   └── employers.service.js      (5 CRUD methods)
├── hooks/
│   └── useEmployers.js            (2 React hooks)
├── pages/employers/
│   ├── EmployersList.jsx          (simple table)
│   ├── EmployerCreate.jsx         (create form)
│   └── EmployerEdit.jsx           (edit form)
├── routes/
│   └── MainRoutes.jsx             (3 routes)
└── menu-items/
    └── components.jsx             (navigation menu)
```

---

## 🔧 SERVICE LAYER

### **employers.service.js**

```javascript
import axiosClient from './axiosClient';

// Helper to unwrap ApiResponse<T>
const unwrap = (response) => response?.data?.data || response?.data || response;

// 5 CRUD Methods
export const getEmployers = async () => {
  const response = await axiosClient.get('/api/employers');
  return unwrap(response);
};

export const getEmployerById = async (id) => {
  const response = await axiosClient.get(`/api/employers/${id}`);
  return unwrap(response);
};

export const createEmployer = async (dto) => {
  const response = await axiosClient.post('/api/employers', dto);
  return unwrap(response);
};

export const updateEmployer = async (id, dto) => {
  const response = await axiosClient.put(`/api/employers/${id}`, dto);
  return unwrap(response);
};

export const deleteEmployer = async (id) => {
  const response = await axiosClient.delete(`/api/employers/${id}`);
  return unwrap(response);
};
```

**Note:** No pagination (backend returns full list).

---

## 🪝 REACT HOOKS

### **useEmployers.js**

```javascript
import { useState, useEffect } from 'react';
import { getEmployers, getEmployerById } from 'services/api/employers.service';

// Hook 1: Fetch all employers
export const useEmployersList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getEmployers();
      setData(result || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch employers');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

// Hook 2: Fetch single employer
export const useEmployerDetails = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const result = await getEmployerById(id);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch employer');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return { data, loading, error, refetch: fetchData };
};
```

---

## 🎨 PAGES OVERVIEW

### **1. EmployersList.jsx**

**Features:**
- Simple table (5 columns: Code, Name AR, Name EN, Status, Actions)
- Add button (top-right)
- Edit/Delete icons (per row)
- Delete confirmation dialog
- Empty state with CTA

**Key Code:**
```jsx
const { data, loading, refetch } = useEmployersList();

// Delete Handler
const handleDelete = async (id) => {
  try {
    await deleteEmployer(id);
    enqueueSnackbar('Employer deleted successfully', { variant: 'success' });
    refetch();
  } catch (error) {
    enqueueSnackbar('Failed to delete employer', { variant: 'error' });
  }
};
```

### **2. EmployerCreate.jsx**

**Features:**
- 4 form fields: `employerCode*`, `nameAr*`, `nameEn`, `active`
- Required field validation
- Save button (POST /api/employers)
- Cancel button
- Success snackbar + navigate to list

**Key Code:**
```jsx
const [formData, setFormData] = useState({
  employerCode: '',
  nameAr: '',
  nameEn: '',
  active: true
});

const handleSubmit = async () => {
  // Validation
  if (!formData.employerCode.trim() || !formData.nameAr.trim()) {
    return;
  }

  try {
    await createEmployer(formData);
    enqueueSnackbar('Employer created successfully', { variant: 'success' });
    navigate('/employers');
  } catch (error) {
    enqueueSnackbar('Failed to create employer', { variant: 'error' });
  }
};
```

### **3. EmployerEdit.jsx**

**Features:**
- Same UI as Create
- Pre-filled from `useEmployerDetails(id)`
- Loading state (CircularProgress)
- 404 handling (Alert + Back button)
- Update success snackbar

**Key Code:**
```jsx
const { data, loading } = useEmployerDetails(id);

useEffect(() => {
  if (data) {
    setFormData({
      employerCode: data.employerCode || '',
      nameAr: data.nameAr || '',
      nameEn: data.nameEn || '',
      active: data.active ?? true
    });
  }
}, [data]);

const handleSubmit = async () => {
  try {
    await updateEmployer(id, formData);
    enqueueSnackbar('Employer updated successfully', { variant: 'success' });
    navigate('/employers');
  } catch (error) {
    enqueueSnackbar('Failed to update employer', { variant: 'error' });
  }
};
```

---

## 🛣️ ROUTING

### **MainRoutes.jsx**

```jsx
// Lazy Imports
const EmployersList = Loadable(lazy(() => import('pages/employers/EmployersList')));
const EmployerCreate = Loadable(lazy(() => import('pages/employers/EmployerCreate')));
const EmployerEdit = Loadable(lazy(() => import('pages/employers/EmployerEdit')));

// Routes (3 paths)
{
  path: 'employers',
  children: [
    {
      path: '',
      element: (
        <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
          <EmployersList />
        </RoleGuard>
      )
    },
    {
      path: 'create',
      element: (
        <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
          <EmployerCreate />
        </RoleGuard>
      )
    },
    {
      path: 'edit/:id',
      element: (
        <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
          <EmployerEdit />
        </RoleGuard>
      )
    }
  ]
}
```

**URLs:**
- List: `/employers`
- Create: `/employers/create`
- Edit: `/employers/edit/:id`

---

## 🧭 NAVIGATION MENU

### **menu-items/components.jsx**

```jsx
{
  id: 'employers',
  title: 'Employers',
  type: 'item',
  url: '/employers',
  icon: BusinessIcon,
  breadcrumbs: true,
  search: 'employers companies organizations clients'
}
```

**Location:** Management group

---

## 🔐 RBAC PERMISSIONS

| Permission | Used In | Purpose |
|------------|---------|---------|
| `VIEW_EMPLOYERS` | EmployersList | View list |
| `MANAGE_EMPLOYERS` | Create, Edit, Delete | Manage employers |

**Allowed Roles:**
- `SUPER_ADMIN`
- `INSURANCE_ADMIN`

---

## 📋 DATA MODEL

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `employerCode` | String | ✅ Yes | - |
| `nameAr` | String | ✅ Yes | - |
| `nameEn` | String | ❌ No | - |
| `active` | Boolean | ❌ No | `true` |

---

## 🧪 TESTING CHECKLIST

- ✅ Navigate to `/employers` (list page loads)
- ✅ Click "Add Employer" (create page opens)
- ✅ Create new employer (save + snackbar)
- ✅ Edit existing employer (pre-filled form)
- ✅ Delete employer (confirmation dialog)
- ✅ Empty state (shows when no employers)
- ✅ Loading skeleton (shows while fetching)
- ✅ Error handling (shows snackbar on failure)

---

## 🐛 TROUBLESHOOTING

### **Issue:** "Cannot find module 'pages/employers/EmployerView'"
**Solution:** EmployerView removed in Phase B2. Check MainRoutes.jsx has only 3 routes.

### **Issue:** "Employer list not loading"
**Solution:** Check backend API `/api/employers` is running. Verify axiosClient configuration.

### **Issue:** "Delete confirmation not showing"
**Solution:** Check `deleteDialogOpen` state in EmployersList.jsx.

---

## 🚀 QUICK COMMANDS

```bash
# Navigate to frontend
cd /workspaces/tba-waad-system/frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Check for errors
npm run lint
```

---

## 📞 SUPPORT FILES

- **Full Report:** `PHASE_B2_COMPLETION_REPORT.md`
- **Service Layer:** `frontend/src/services/api/employers.service.js`
- **Hooks:** `frontend/src/hooks/useEmployers.js`
- **Pages:** `frontend/src/pages/employers/`

---

**END OF QUICKSTART** ⚡
