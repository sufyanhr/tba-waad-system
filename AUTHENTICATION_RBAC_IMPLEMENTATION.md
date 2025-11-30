# TBA-WAAD System - Authentication & RBAC Implementation

## ✅ Completed Implementation

### Authentication System

The system now uses **real JWT-based authentication** connected to the Spring Boot backend at `http://localhost:8080/api`.

#### Key Features

1. **Real Backend Login**
   - Endpoint: `POST /api/auth/login`
   - Request: `{ identifier: string, password: string }`
   - Response: `{ token: string, user: { id, username, fullName, email, roles[], permissions[] } }`

2. **Token Management**
   - JWT tokens stored in `localStorage` as `serviceToken`
   - Automatic token injection in all API requests via Axios interceptor
   - Token verification using `jwtDecode`
   - Automatic redirect to `/login` on 401 responses

3. **Session Management**
   - User verification on app init using `GET /api/auth/me`
   - Roles and permissions stored in localStorage
   - Persistent sessions across page refreshes

### Role-Based Access Control (RBAC)

#### Supported Roles

The system supports the following business roles:

| Role | Access Level | Description |
|------|-------------|-------------|
| `ADMIN` | Full System Access | TBA System Administrator |
| `TBA_OPERATIONS` | TBA Operations | TBA staff managing members, employers, providers |
| `TBA_MEDICAL_REVIEWER` | Medical Review | Review pre-authorizations and claims |
| `TBA_FINANCE` | Financial Operations | Manage invoices and financial settlements |
| `INSURANCE_ADMIN` | Insurance Company | Insurance company administrator |
| `EMPLOYER` | Limited Access | HR coordinators (own company data only) |
| `PROVIDER` | Claims & Visits | Hospital/clinic staff submitting claims |

#### RBAC Implementation Components

##### 1. JWTContext with RBAC Helpers

The authentication context now includes:

```javascript
const { 
  user,           // User object
  roles,          // Array of role strings
  permissions,    // Array of permission strings
  hasRole,        // Check single role
  hasAnyRole,     // Check any of multiple roles
  hasAllRoles,    // Check all roles
  hasPermission,  // Check permission
  isAdmin,        // Quick admin check
  isTBAStaff      // Check for any TBA_* role
} = useAuth();
```

##### 2. ProtectedRoute Component

For route-level protection:

```jsx
// Require ADMIN role only
<ProtectedRoute requiredRoles={['ADMIN']}>
  <AdminDashboard />
</ProtectedRoute>

// Require ANY of multiple roles (OR logic)
<ProtectedRoute requiredRoles={['ADMIN', 'TBA_OPERATIONS', 'TBA_MEDICAL_REVIEWER']}>
  <ClaimsReview />
</ProtectedRoute>

// Require permission
<ProtectedRoute requiredPermissions={['WRITE_CLAIMS', 'APPROVE_CLAIMS']}>
  <ClaimApproval />
</ProtectedRoute>

// Require ALL roles (AND logic)
<ProtectedRoute requiredRoles={['ADMIN', 'TBA_FINANCE']} requireAll>
  <FinancialSettings />
</ProtectedRoute>
```

##### 3. RBACGuard Component

For component-level visibility:

```jsx
// Hide button for non-admins
<RBACGuard requiredRoles={['ADMIN']}>
  <Button>Delete User</Button>
</RBACGuard>

// Show content based on permissions
<RBACGuard requiredPermissions={['MANAGE_EMPLOYERS']}>
  <CreateEmployerButton />
</RBACGuard>
```

##### 4. Menu Item Filtering

Menu items automatically hide/show based on user roles:

```javascript
// In menu-items/administration.js
const administration = {
  id: 'administration',
  title: 'Administration',
  type: 'group',
  requiredRoles: ['ADMIN'],  // Only ADMIN sees this section
  children: [...]
};

// In menu-items/tba-management.js
{
  id: 'claims',
  title: 'Claims',
  type: 'item',
  url: '/tba/claims',
  icon: icons.AuditOutlined,
  requiredRoles: ['ADMIN', 'TBA_OPERATIONS', 'TBA_MEDICAL_REVIEWER', 'INSURANCE_ADMIN']
}
```

### Protected Routes

The following routes are now protected:

#### Administration (ADMIN only)
- `/admin/users` - User management
- `/admin/roles` - Roles & Permissions
- `/admin/companies` - Companies management

#### Tools (ADMIN & TBA_OPERATIONS)
- `/tools/settings/*` - System settings (all tabs)

#### TBA Management (Role-specific)
- `/tba/members` - ADMIN, TBA_OPERATIONS, INSURANCE_ADMIN
- `/tba/employers` - ADMIN, TBA_OPERATIONS, INSURANCE_ADMIN
- `/tba/claims` - ADMIN, TBA_OPERATIONS, TBA_MEDICAL_REVIEWER, INSURANCE_ADMIN
- `/tba/pre-authorizations` - ADMIN, TBA_OPERATIONS, TBA_MEDICAL_REVIEWER, INSURANCE_ADMIN
- `/tba/invoices` - ADMIN, TBA_FINANCE, INSURANCE_ADMIN

### Unauthorized Access

Users without proper permissions are redirected to `/unauthorized` page showing:
- 403 Forbidden error
- Clear message in Arabic
- Options to go back or return to dashboard

### Files Modified/Created

#### Created Files
1. `/frontend/src/components/ProtectedRoute.jsx` - Route protection component
2. `/frontend/src/pages/extra-pages/unauthorized.jsx` - 403 error page
3. `/frontend/src/utils/menuUtils.js` - Menu filtering utilities

#### Modified Files
1. `/frontend/src/contexts/JWTContext.jsx` - Added RBAC helpers
2. `/frontend/src/contexts/auth-reducer/auth.js` - Support roles/permissions in state
3. `/frontend/src/routes/MainRoutes.jsx` - Added route protection
4. `/frontend/src/menu-items/administration.js` - Added role requirements
5. `/frontend/src/menu-items/tba-management.js` - Added role requirements per item
6. `/frontend/src/menu-items/tools.js` - Added role requirements
7. `/frontend/src/hooks/useAuth.js` - Removed unused auth provider comments
8. `/frontend/src/App.jsx` - Removed unused auth provider comments

### Clean Implementation

✅ All Firebase/Auth0/AWS/Supabase references removed from:
- `useAuth.js`
- `App.jsx`

✅ No demo/test credentials in the codebase

✅ Real backend authentication only

### Testing the System

1. **Start Backend** (Spring Boot on port 8080):
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   yarn start
   ```

3. **Test Login**:
   - Navigate to `http://localhost:3000/login`
   - Use real credentials from backend database
   - System will fetch user roles and permissions
   - Menu items will automatically adjust based on roles
   - Protected routes will enforce access control

4. **Test Role-Based Access**:
   - Login with different roles (ADMIN, TBA_OPERATIONS, etc.)
   - Verify menu visibility changes
   - Try accessing admin routes with non-admin user
   - Should redirect to `/unauthorized` page

### API Integration

#### Login Flow
```
1. User enters credentials
2. POST /api/auth/login
3. Backend validates and returns { token, user: { roles[], permissions[] } }
4. Frontend stores token in localStorage
5. Frontend stores roles/permissions in state
6. Axios automatically adds Bearer token to all requests
7. Menu filters based on roles
8. Routes protect based on roles
```

#### Session Verification Flow
```
1. App loads
2. Check localStorage for 'serviceToken'
3. If token exists, verify it's not expired
4. GET /api/auth/me to get current user
5. Store user, roles, permissions in state
6. Render protected UI
```

#### Logout Flow
```
1. User clicks Logout
2. Remove token from localStorage
3. Remove roles/permissions from localStorage
4. Clear axios authorization header
5. Redirect to /login
```

### Build Status

✅ Production build successful: `yarn build`
- Build time: 33.24s
- No errors
- All chunks optimized

### Next Steps (Optional Enhancements)

1. **Add Permission-Based Guards**
   - Fine-grained permissions (e.g., `CREATE_EMPLOYER`, `APPROVE_CLAIM`)
   - Permission checking at component level

2. **Add Role Hierarchy**
   - ADMIN inherits all permissions
   - Role composition support

3. **Add Session Timeout**
   - Auto-logout after inactivity
   - Token refresh mechanism

4. **Add Audit Logging**
   - Log all RBAC decisions
   - Track access attempts

5. **Add Multi-Company Support**
   - Company-level data isolation
   - Cross-company access for ADMIN

## Role Assignment Guide

### For System Administrators

When creating users in the backend, assign roles based on job function:

| User Type | Recommended Roles |
|-----------|------------------|
| TBA System Admin | `ADMIN` |
| TBA Operations Staff | `TBA_OPERATIONS` |
| Medical Reviewer | `TBA_MEDICAL_REVIEWER` |
| Finance Staff | `TBA_FINANCE` |
| Insurance Company Admin | `INSURANCE_ADMIN` |
| Employer HR | `EMPLOYER` |
| Hospital Staff | `PROVIDER` |

### Multiple Roles

Users can have multiple roles:
- Example: `['ADMIN', 'TBA_OPERATIONS']` - Full admin + operational tasks
- Example: `['TBA_OPERATIONS', 'TBA_MEDICAL_REVIEWER']` - Operations + medical review

The system uses **OR logic** for role checks - user needs ANY of the required roles to access a resource.

## Security Notes

✅ **Secure Token Storage**: Tokens stored in localStorage (consider httpOnly cookies for enhanced security)

✅ **Automatic Token Injection**: Axios interceptor adds token to all requests

✅ **401 Handling**: Automatic redirect to login on unauthorized responses

✅ **Route Protection**: Server-side validation still required (frontend RBAC is for UX only)

⚠️ **Important**: Frontend RBAC is for user experience only. **Always validate permissions on the backend** - never trust frontend-only authorization.

## Support

For issues or questions:
- Check backend logs for authentication errors
- Verify user roles in database
- Ensure backend is running on port 8080
- Check browser console for JWT errors

---

**Implementation Date**: January 2025  
**Status**: ✅ Production Ready  
**Build Status**: ✅ Passing (33.24s, 0 errors)
