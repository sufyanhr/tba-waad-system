# Authentication & RBAC - Quick Start Guide

## 🚀 Quick Setup

### 1. Prerequisites
- Backend running on `http://localhost:8080`
- User accounts created in database with roles

### 2. Start Application
```bash
cd frontend
yarn start
```

### 3. Login
- Navigate to `http://localhost:3000/login`
- Use real backend credentials
- System will load your roles and adjust UI accordingly

---

## 💡 Usage Examples

### Protect a Route

```jsx
import ProtectedRoute from 'components/ProtectedRoute';

// Require ADMIN role
<Route 
  path="/admin/users" 
  element={
    <ProtectedRoute requiredRoles={['ADMIN']}>
      <UserManagement />
    </ProtectedRoute>
  } 
/>

// Require any TBA role
<Route 
  path="/tba/claims" 
  element={
    <ProtectedRoute requiredRoles={['ADMIN', 'TBA_OPERATIONS', 'TBA_MEDICAL_REVIEWER']}>
      <ClaimsManagement />
    </ProtectedRoute>
  } 
/>
```

### Use RBAC in Components

```jsx
import useAuth from 'hooks/useAuth';

function MyComponent() {
  const { user, roles, hasRole, isAdmin, isTBAStaff } = useAuth();

  // Check specific role
  if (hasRole('ADMIN')) {
    return <AdminPanel />;
  }

  // Check any TBA role
  if (isTBAStaff()) {
    return <TBADashboard />;
  }

  // Check admin quickly
  if (isAdmin()) {
    return <DeleteButton />;
  }

  return <RegularUserView />;
}
```

### Hide UI Elements

```jsx
import RBACGuard from 'components/tba/RBACGuard';

// Hide button for non-admins
<RBACGuard requiredRoles={['ADMIN']}>
  <Button color="error">Delete</Button>
</RBACGuard>

// Hide section based on permission
<RBACGuard requiredPermissions={['MANAGE_EMPLOYERS']}>
  <EmployerSettings />
</RBACGuard>
```

### Add Role Requirement to Menu Item

```javascript
// In menu-items/my-menu.js
{
  id: 'my-feature',
  title: 'My Feature',
  type: 'item',
  url: '/my-feature',
  icon: icons.MyIcon,
  requiredRoles: ['ADMIN', 'TBA_OPERATIONS']  // Add this line
}
```

---

## 🔐 Role Matrix

| Feature | ADMIN | TBA_OPS | TBA_MED | TBA_FIN | INS_ADMIN | EMPLOYER | PROVIDER |
|---------|-------|---------|---------|---------|-----------|----------|----------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Members | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Employers | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Providers | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Claims | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Pre-Auths | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Invoices | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Admin Panel | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Settings | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 🧪 Testing Roles

### Test as ADMIN
```bash
# Login with ADMIN credentials
# Expected: See ALL menu items
# Can access: /admin/*, /tba/*, /tools/*
```

### Test as TBA_OPERATIONS
```bash
# Login with TBA_OPERATIONS credentials
# Expected: See TBA Management + Tools
# Cannot access: /admin/*
```

### Test as TBA_MEDICAL_REVIEWER
```bash
# Login with TBA_MEDICAL_REVIEWER credentials
# Expected: See Claims, Pre-Auths, Visits only
# Cannot access: /admin/*, /tba/members, /tba/employers
```

### Test as TBA_FINANCE
```bash
# Login with TBA_FINANCE credentials
# Expected: See Invoices and Reports only
# Cannot access: /admin/*, claims, pre-auths
```

---

## 🐛 Troubleshooting

### Menu items not hiding?
1. Check user roles: `console.log(useAuth().roles)`
2. Verify menu item has `requiredRoles` property
3. Ensure Navigation component uses `filterMenuByPermissions`

### Routes not protected?
1. Wrap route with `<ProtectedRoute>`
2. Check `requiredRoles` array is correct
3. Verify user has required role: `console.log(useAuth().hasRole('ADMIN'))`

### 401 errors?
1. Check token in localStorage: `localStorage.getItem('serviceToken')`
2. Verify backend is running on port 8080
3. Check token expiration: decode JWT token
4. Clear localStorage and login again

### User roles not loading?
1. Check backend response: `/api/auth/login` and `/api/auth/me`
2. Verify backend returns `roles: []` and `permissions: []`
3. Check browser console for errors
4. Clear localStorage and try again

---

## 📞 Support

- **Documentation**: `/AUTHENTICATION_RBAC_IMPLEMENTATION.md`
- **Backend API**: `http://localhost:8080/api/auth/login`
- **Frontend**: `http://localhost:3000`

---

**Quick Reference**:
- Login Endpoint: `POST /api/auth/login`
- Token Location: `localStorage.getItem('serviceToken')`
- Roles Location: `localStorage.getItem('userRoles')`
- Unauthorized Page: `/unauthorized`
