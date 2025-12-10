# 🚀 PHASE 1.5 — RBAC SYSTEM QUICKSTART GUIDE

## 📖 Table of Contents
1. [Overview](#overview)
2. [Quick Start (30 seconds)](#quick-start-30-seconds)
3. [RBAC Store API](#rbac-store-api)
4. [Protecting Routes](#protecting-routes)
5. [Menu Filtering](#menu-filtering)
6. [Employer Context](#employer-context)
7. [Common Use Cases](#common-use-cases)
8. [Troubleshooting](#troubleshooting)

---

## Overview

**What is RBAC?**  
Role-Based Access Control (RBAC) - A security system that restricts access based on user roles.

**What does Phase 1.5 provide?**
- ✅ Central RBAC state management (Zustand store)
- ✅ Route protection (RouteGuard component)
- ✅ Menu filtering (dynamic based on roles)
- ✅ Employer context switching
- ✅ Automatic API header injection (`X-Employer-ID`)
- ✅ EMPLOYER role isolation (locked to their company)

**Roles in System:**
- `ADMIN` - Full system access
- `EMPLOYER` - Company-specific access (Members, Claims, Visits)
- `INSURANCE_COMPANY` - Insurance operations (Providers, Policies, Claims)
- `REVIEWER` - Medical review (Claims, Pre-Approvals)

---

## Quick Start (30 seconds)

### 1. **Check User's Role**
```javascript
import { useRoles } from 'api/rbac';

function MyComponent() {
  const roles = useRoles();
  
  // roles = ['ADMIN'] or ['EMPLOYER'] or ['INSURANCE_COMPANY', 'REVIEWER']
  
  return <div>Your roles: {roles.join(', ')}</div>;
}
```

### 2. **Protect a Route**
```jsx
import RouteGuard from 'routes/RouteGuard';

// In your routes file:
{
  path: 'members',
  element: (
    <RouteGuard allowedRoles={['ADMIN', 'EMPLOYER']}>
      <MembersList />
    </RouteGuard>
  )
}
```

### 3. **Conditionally Show UI Elements**
```javascript
import { useRBAC } from 'api/rbac';

function MemberActions() {
  const { hasAnyRole } = useRBAC();
  
  return (
    <>
      {hasAnyRole(['ADMIN', 'EMPLOYER']) && (
        <Button onClick={handleEdit}>Edit Member</Button>
      )}
    </>
  );
}
```

### 4. **Access Employer Context**
```javascript
import { useEmployerContext } from 'api/rbac';

function MyComponent() {
  const { employerId, canSwitch, setEmployerId } = useEmployerContext();
  
  // employerId: current selected employer ID (or null)
  // canSwitch: false for EMPLOYER role, true for others
  // setEmployerId(123): switch to employer ID 123
  
  return <div>Current Employer ID: {employerId}</div>;
}
```

**That's it!** You're now using RBAC. 🎉

---

## RBAC Store API

### 🎣 Hooks

#### `useRoles()` - Get user roles
```javascript
import { useRoles } from 'api/rbac';

const roles = useRoles();
// Returns: string[]
// Example: ['ADMIN'] or ['EMPLOYER', 'REVIEWER']
```

#### `usePermissions()` - Get user permissions
```javascript
import { usePermissions } from 'api/rbac';

const permissions = usePermissions();
// Returns: string[]
// Example: ['VIEW_MEMBERS', 'EDIT_MEMBERS', 'DELETE_MEMBERS']
```

#### `useEmployerContext()` - Get employer context
```javascript
import { useEmployerContext } from 'api/rbac';

const { employerId, canSwitch, setEmployerId } = useEmployerContext();

// employerId: number | null (current selected employer)
// canSwitch: boolean (false for EMPLOYER role)
// setEmployerId: (id: number) => void (switch employer)
```

**Example:**
```javascript
function EmployerSwitcher() {
  const { employerId, canSwitch, setEmployerId } = useEmployerContext();
  
  if (!canSwitch) {
    return <div>Your employer: {employerId} (locked)</div>;
  }
  
  return (
    <Select value={employerId} onChange={(e) => setEmployerId(e.target.value)}>
      <MenuItem value={1}>Company A</MenuItem>
      <MenuItem value={2}>Company B</MenuItem>
    </Select>
  );
}
```

#### `useUser()` - Get full user object
```javascript
import { useUser } from 'api/rbac';

const user = useUser();
// Returns: { id, name, email, employerId, roles, permissions, ... }
```

#### `useRBAC()` - Get full RBAC state + methods
```javascript
import { useRBAC } from 'api/rbac';

const rbac = useRBAC();
// Returns: {
//   roles: string[],
//   permissions: string[],
//   employerId: number | null,
//   user: object,
//   isInitialized: boolean,
//   hasAnyRole: (roles) => boolean,
//   hasAllRoles: (roles) => boolean,
//   hasPermission: (permission) => boolean,
//   isEmployerRole: () => boolean,
//   canSwitchEmployer: () => boolean,
//   setEmployerId: (id) => void,
//   ...
// }
```

---

### 🔐 Access Control Methods

#### `hasAnyRole(roles)`
Check if user has **ANY** of the specified roles.

```javascript
const { hasAnyRole } = useRBAC();

if (hasAnyRole(['ADMIN', 'EMPLOYER'])) {
  // User is either ADMIN or EMPLOYER (or both)
}
```

#### `hasAllRoles(roles)`
Check if user has **ALL** of the specified roles.

```javascript
const { hasAllRoles } = useRBAC();

if (hasAllRoles(['ADMIN', 'EMPLOYER'])) {
  // User must have BOTH ADMIN and EMPLOYER roles
}
```

#### `hasPermission(permission)`
Check if user has a specific permission.

```javascript
const { hasPermission } = useRBAC();

if (hasPermission('DELETE_MEMBERS')) {
  // User can delete members
}
```

#### `isEmployerRole()`
Check if user is EMPLOYER role (locked to their company).

```javascript
const { isEmployerRole } = useRBAC();

if (isEmployerRole()) {
  // User is EMPLOYER role (cannot switch companies)
}
```

#### `canSwitchEmployer()`
Check if user can switch employers.

```javascript
const { canSwitchEmployer } = useRBAC();

if (canSwitchEmployer()) {
  // User can switch employers (show employer switcher UI)
}
```

---

### 🛠️ Store Methods (Direct Access)

Use these in non-component contexts (e.g., axios interceptors, utility functions):

```javascript
import { useRBACStore } from 'api/rbac';

// Get current state
const { roles, employerId, user } = useRBACStore.getState();

// Initialize from backend (called in login)
useRBACStore.getState().initialize(userData);

// Clear state (called in logout)
useRBACStore.getState().clear();

// Set employer ID
useRBACStore.getState().setEmployerId(123);
```

**Example: Axios Interceptor**
```javascript
import axios from 'axios';
import { useRBACStore } from 'api/rbac';

axios.interceptors.request.use((config) => {
  const employerId = useRBACStore.getState().employerId;
  
  if (employerId) {
    config.headers['X-Employer-ID'] = employerId.toString();
  }
  
  return config;
});
```

---

## Protecting Routes

### Basic Protection
```jsx
import RouteGuard from 'routes/RouteGuard';

{
  path: 'members',
  element: (
    <RouteGuard allowedRoles={['ADMIN', 'EMPLOYER']}>
      <MembersList />
    </RouteGuard>
  )
}
```

**How it works:**
1. User navigates to `/members`
2. RouteGuard checks user's roles
3. If user has `ADMIN` or `EMPLOYER` role → Render `<MembersList />`
4. If user has no roles → Redirect to `/login`
5. If user has different role (e.g., `REVIEWER`) → Redirect to `/403`

---

### Multiple Protected Routes
```jsx
// MainRoutes.jsx
import RouteGuard from 'routes/RouteGuard';

export default [
  {
    path: 'members',
    element: (
      <RouteGuard allowedRoles={['ADMIN', 'EMPLOYER']}>
        <MembersList />
      </RouteGuard>
    )
  },
  {
    path: 'employers',
    element: (
      <RouteGuard allowedRoles={['ADMIN', 'INSURANCE_COMPANY', 'REVIEWER']}>
        <EmployersList />
      </RouteGuard>
    )
  },
  {
    path: 'claims',
    element: (
      <RouteGuard allowedRoles={['ADMIN', 'EMPLOYER', 'REVIEWER']}>
        <ClaimsList />
      </RouteGuard>
    )
  },
  {
    path: 'admin/users',
    element: (
      <RouteGuard allowedRoles={['ADMIN']}>
        <UsersList />
      </RouteGuard>
    )
  }
];
```

---

### No Role Restriction (Public Route)
```jsx
// Don't wrap with RouteGuard if route is public
{
  path: 'profile',
  element: <ProfilePage /> // Any authenticated user can access
}
```

---

## Menu Filtering

Menu items are automatically filtered based on user roles. No manual work needed!

### How It Works
```
User with EMPLOYER role logs in
         ↓
Menu system calls filterMenuByRoles(menuItems, ['EMPLOYER'])
         ↓
Menu items with id in hideList are removed:
  - 'employers' → HIDDEN
  - 'insurance-companies' → HIDDEN
  - 'providers' → HIDDEN
  - 'users' → HIDDEN
  - 'roles' → HIDDEN
  - 'companies' → HIDDEN
  - 'audit' → HIDDEN
         ↓
User sees only allowed menu items:
  ✅ Dashboard
  ✅ Members
  ✅ Claims
  ✅ Visits
  ✅ Pre-Approvals
  ✅ Medical Categories
  ✅ Medical Services
  ✅ Medical Packages
  ✅ Settings
```

### Menu Visibility Matrix

| Menu Item | ADMIN | EMPLOYER | INSURANCE_COMPANY | REVIEWER |
|-----------|-------|----------|-------------------|----------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Members | ✅ | ✅ | ✅ | ❌ |
| Employers | ✅ | ❌ | ❌ | ❌ |
| Providers | ✅ | ❌ | ✅ | ❌ |
| Insurance Companies | ✅ | ❌ | ✅ | ❌ |
| Claims | ✅ | ✅ | ✅ | ✅ |
| Visits | ✅ | ✅ | ✅ | ❌ |
| Pre-Approvals | ✅ | ✅ | ✅ | ✅ |
| Medical Categories | ✅ | ✅ | ✅ | ✅ |
| Medical Services | ✅ | ✅ | ✅ | ✅ |
| Medical Packages | ✅ | ✅ | ✅ | ✅ |
| Provider Contracts | ✅ | ❌ | ✅ | ❌ |
| Policies | ✅ | ❌ | ✅ | ❌ |
| Users (Admin) | ✅ | ❌ | ❌ | ❌ |
| Roles (Admin) | ✅ | ❌ | ❌ | ❌ |
| Companies (Admin) | ✅ | ❌ | ❌ | ❌ |
| Audit Log | ✅ | ❌ | ✅ | ✅ |
| Settings | ✅ | ✅ | ✅ | ✅ |

---

### Add New Menu Item with RBAC

**Step 1:** Add menu item in `menu-items/components.jsx`
```javascript
{
  id: 'reports',
  title: 'Reports',
  type: 'item',
  url: '/reports',
  icon: AssessmentIcon,
  breadcrumbs: true,
  search: 'reports analytics'
}
```

**Step 2:** Update `filterMenuByRoles()` role rules
```javascript
const roleRules = {
  EMPLOYER: {
    hide: ['employers', 'providers', 'reports'], // Hide Reports for EMPLOYER
    show: ['dashboard', 'members', 'claims', ...]
  },
  INSURANCE_COMPANY: {
    hide: ['employers'],
    show: ['dashboard', 'reports', ...] // Show Reports for INSURANCE_COMPANY
  },
  REVIEWER: {
    hide: ['employers', 'members', 'reports'], // Hide Reports for REVIEWER
    show: ['dashboard', 'claims', ...]
  }
};
```

**Step 3:** Create protected route
```jsx
{
  path: 'reports',
  element: (
    <RouteGuard allowedRoles={['ADMIN', 'INSURANCE_COMPANY']}>
      <ReportsList />
    </RouteGuard>
  )
}
```

**Done!** Menu will automatically show/hide based on roles.

---

## Employer Context

### What is Employer Context?
- Each user can work in the context of one employer (company)
- All API requests include `X-Employer-ID` header
- Backend filters data based on this employer ID
- **EMPLOYER role:** Locked to their own company (cannot switch)
- **Other roles:** Can switch between employers

---

### Get Current Employer
```javascript
import { useEmployerContext } from 'api/rbac';

function MyComponent() {
  const { employerId } = useEmployerContext();
  
  return <div>Working in employer ID: {employerId}</div>;
}
```

---

### Switch Employer (if allowed)
```javascript
import { useEmployerContext } from 'api/rbac';
import { Button } from '@mui/material';

function EmployerSwitcher() {
  const { employerId, canSwitch, setEmployerId } = useEmployerContext();
  
  if (!canSwitch) {
    return <div>Your employer: {employerId} (locked)</div>;
  }
  
  const handleSwitch = () => {
    setEmployerId(999); // Switch to employer ID 999
  };
  
  return (
    <Button onClick={handleSwitch}>
      Switch to Employer 999
    </Button>
  );
}
```

---

### EMPLOYER Role Lock (Automatic)
```javascript
// User with EMPLOYER role logs in
// userData = { id: 1, name: 'John', employerId: 5, roles: ['EMPLOYER'] }

// RBAC store automatically sets:
// - employerId = 5 (locked)
// - canSwitch = false

// If user tries to switch:
setEmployerId(999); // ❌ IGNORED! employerId remains 5

// Axios interceptor automatically adds:
// X-Employer-ID: 5 (in all API requests)
```

**Why?** EMPLOYER role users should only see their own company's data.

---

### Axios Header Injection (Automatic)
```javascript
// You don't need to do anything!
// Axios interceptor automatically adds X-Employer-ID header

// Example:
axios.get('/members'); 

// Backend receives:
// GET /members
// Headers:
//   Authorization: Bearer <token>
//   X-Employer-ID: 5
```

**How it works:**
```javascript
// In utils/axios.js:
import { useRBACStore } from 'api/rbac';

axios.interceptors.request.use((config) => {
  const employerId = useRBACStore.getState().employerId;
  
  if (employerId) {
    config.headers['X-Employer-ID'] = employerId.toString();
  }
  
  return config;
});
```

---

## Common Use Cases

### 1. Show/Hide Button Based on Role
```javascript
import { useRBAC } from 'api/rbac';
import { Button } from '@mui/material';

function MemberActions() {
  const { hasAnyRole } = useRBAC();
  
  return (
    <>
      {hasAnyRole(['ADMIN']) && (
        <Button color="error" onClick={handleDelete}>
          Delete Member
        </Button>
      )}
      
      {hasAnyRole(['ADMIN', 'EMPLOYER']) && (
        <Button onClick={handleEdit}>
          Edit Member
        </Button>
      )}
    </>
  );
}
```

---

### 2. Conditional Rendering
```javascript
import { useRoles } from 'api/rbac';

function Dashboard() {
  const roles = useRoles();
  
  if (roles.includes('ADMIN')) {
    return <AdminDashboard />;
  }
  
  if (roles.includes('EMPLOYER')) {
    return <EmployerDashboard />;
  }
  
  if (roles.includes('REVIEWER')) {
    return <ReviewerDashboard />;
  }
  
  return <GenericDashboard />;
}
```

---

### 3. Form Field Visibility
```javascript
import { useRBAC } from 'api/rbac';
import { TextField } from '@mui/material';

function MemberForm() {
  const { hasAnyRole } = useRBAC();
  
  return (
    <form>
      <TextField label="Name" name="name" />
      <TextField label="Email" name="email" />
      
      {/* Only ADMIN can edit employer */}
      {hasAnyRole(['ADMIN']) && (
        <TextField label="Employer ID" name="employerId" />
      )}
    </form>
  );
}
```

---

### 4. API Call with Employer Context
```javascript
import { useEmployerContext } from 'api/rbac';
import axios from 'utils/axios';

function useFetchMembers() {
  const { employerId } = useEmployerContext();
  
  const fetchMembers = async () => {
    // No need to manually add X-Employer-ID header
    // Axios interceptor adds it automatically
    const response = await axios.get('/members');
    return response.data;
  };
  
  return { fetchMembers };
}
```

---

### 5. Permission-Based Access
```javascript
import { useRBAC } from 'api/rbac';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function MemberRow({ member }) {
  const { hasPermission } = useRBAC();
  
  return (
    <tr>
      <td>{member.name}</td>
      <td>{member.email}</td>
      <td>
        {hasPermission('DELETE_MEMBERS') && (
          <IconButton onClick={() => handleDelete(member.id)}>
            <DeleteIcon />
          </IconButton>
        )}
      </td>
    </tr>
  );
}
```

---

### 6. Multi-Role Logic
```javascript
import { useRoles } from 'api/rbac';

function ClaimActions({ claim }) {
  const roles = useRoles();
  
  // ADMIN can do everything
  if (roles.includes('ADMIN')) {
    return (
      <>
        <Button onClick={handleEdit}>Edit</Button>
        <Button onClick={handleDelete}>Delete</Button>
        <Button onClick={handleApprove}>Approve</Button>
      </>
    );
  }
  
  // EMPLOYER can only view and edit their own claims
  if (roles.includes('EMPLOYER')) {
    return <Button onClick={handleEdit}>Edit</Button>;
  }
  
  // REVIEWER can approve claims
  if (roles.includes('REVIEWER')) {
    return <Button onClick={handleApprove}>Approve</Button>;
  }
  
  return null; // No actions for other roles
}
```

---

## Troubleshooting

### ❌ Issue: "Cannot read property 'roles' of undefined"
**Cause:** RBAC store not initialized (user not logged in).

**Solution:**
```javascript
import { useRBAC } from 'api/rbac';

function MyComponent() {
  const { roles, isInitialized } = useRBAC();
  
  if (!isInitialized) {
    return <div>Loading...</div>;
  }
  
  return <div>Roles: {roles.join(', ')}</div>;
}
```

---

### ❌ Issue: User logged in but no roles
**Cause:** Backend not returning `roles` array in `/auth/login` or `/auth/me`.

**Solution:** Ensure backend returns:
```json
{
  "token": "eyJ...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "employerId": 5,
    "roles": ["EMPLOYER"], // ← REQUIRED
    "permissions": ["VIEW_MEMBERS", "EDIT_MEMBERS"] // ← OPTIONAL
  }
}
```

---

### ❌ Issue: Employer Switcher not showing
**Cause:** User is EMPLOYER role (locked to their company).

**Solution:** This is expected behavior. EMPLOYER role cannot switch employers.

**Debug:**
```javascript
import { useEmployerContext } from 'api/rbac';

function Debug() {
  const { employerId, canSwitch } = useEmployerContext();
  
  console.log('Employer ID:', employerId);
  console.log('Can Switch:', canSwitch); // false for EMPLOYER role
  
  return null;
}
```

---

### ❌ Issue: Menu items not filtering
**Cause:** `filterMenuByRoles()` not called in `useGetMenuMaster()`.

**Solution:** Check `frontend/src/api/menu.js`:
```javascript
import { filterMenuByRoles } from 'menu-items/components';
import { useRBACStore } from 'api/rbac';

export const useGetMenuMaster = () => {
  const roles = useRBACStore((state) => state.roles);
  const filteredMenu = filterMenuByRoles(menuItem, roles); // ← Must be called
  
  return { 
    menuMaster: {
      isDashboardDrawerOpened: useMenuStore.getState().openDrawer,
      ...filteredMenu 
    }
  };
};
```

---

### ❌ Issue: 403 page not showing
**Cause:** RouteGuard redirects to `/403` but route not defined.

**Solution:** Check `frontend/src/routes/MainRoutes.jsx`:
```jsx
import NoAccess from 'pages/errors/NoAccess';

{
  path: '403',
  element: <NoAccess /> // ← Route must exist
}
```

---

### ❌ Issue: X-Employer-ID header not sent
**Cause:** Axios interceptor not configured or employerId is null.

**Solution:**
1. Check `frontend/src/utils/axios.js`:
   ```javascript
   import { useRBACStore } from 'api/rbac';
   
   axios.interceptors.request.use((config) => {
     const employerId = useRBACStore.getState().employerId;
     
     if (employerId) {
       config.headers['X-Employer-ID'] = employerId.toString();
     }
     
     return config;
   });
   ```

2. Check employer is selected:
   ```javascript
   import { useEmployerContext } from 'api/rbac';
   
   function Debug() {
     const { employerId } = useEmployerContext();
     console.log('Current Employer ID:', employerId); // Should not be null
     return null;
   }
   ```

---

## 🎓 Best Practices

### ✅ DO: Use hooks in components
```javascript
import { useRoles, useEmployerContext, useRBAC } from 'api/rbac';
```

### ✅ DO: Use store methods in non-component contexts
```javascript
import { useRBACStore } from 'api/rbac';
const { roles, employerId } = useRBACStore.getState();
```

### ✅ DO: Check if user is initialized
```javascript
const { isInitialized } = useRBAC();
if (!isInitialized) return <Loader />;
```

### ✅ DO: Use RouteGuard for ALL protected routes
```jsx
<RouteGuard allowedRoles={['ADMIN', 'EMPLOYER']}>
  <ProtectedComponent />
</RouteGuard>
```

### ❌ DON'T: Read localStorage directly
```javascript
// ❌ BAD
const roles = JSON.parse(localStorage.getItem('userRoles'));

// ✅ GOOD
const roles = useRoles();
```

### ❌ DON'T: Manual role checks in multiple places
```javascript
// ❌ BAD (scattered logic)
if (roles.includes('ADMIN') || roles.includes('EMPLOYER')) { ... }

// ✅ GOOD (centralized in RBAC store)
const { hasAnyRole } = useRBAC();
if (hasAnyRole(['ADMIN', 'EMPLOYER'])) { ... }
```

---

## 📚 Related Documentation
- [Phase 1.5 Completion Report](./PHASE_1.5_RBAC_COMPLETION_REPORT.md)
- [Backend API Documentation](./BACKEND_API_DOCS.md)
- [Zustand Documentation](https://zustand.docs.pmnd.rs/)

---

**Last Updated:** January 15, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
