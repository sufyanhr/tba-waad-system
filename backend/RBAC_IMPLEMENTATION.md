# TBA-WAAD RBAC System Implementation

## 🎯 Overview
This implementation provides a complete Role-Based Access Control (RBAC) system for the TBA-WAAD insurance management platform, replacing the simple enum-based roles with a professional, enterprise-level permission system.

## 📊 System Architecture

### Core Components

1. **Entities**
   - `Permission`: Defines granular access rights
   - `Role`: Groups permissions into meaningful job functions
   - `UserRole`: Links users to roles (many-to-many with metadata)
   - `RolePermission`: Links roles to permissions (many-to-many with metadata)
   - `User`: Updated to work with new role system

2. **Repositories**
   - `PermissionRepository`: CRUD operations for permissions
   - `RoleRepository`: CRUD operations for roles  
   - `UserRoleRepository`: Manages user-role assignments
   - `RolePermissionRepository`: Manages role-permission assignments

3. **Services**
   - `PermissionService`: Business logic for permission management
   - `RoleService`: Business logic for role management
   - `UserRoleService`: Business logic for user-role assignments

4. **Controllers**
   - `PermissionController`: REST API for permission management
   - `RoleController`: REST API for role management
   - `UserRoleController`: REST API for user-role assignments

## 🔐 Security Integration

### JWT Enhancement
- **JwtTokenProvider**: Enhanced to include user permissions in JWT payload
- **JwtAuthenticationFilter**: Updated to extract permissions from JWT and set in SecurityContext
- **Token Payload**: Now includes `roles`, `permissions`, `userId`, `fullName`, `email`

### Spring Security
- **Method-level security**: `@PreAuthorize` annotations support both role and permission checks
- **Permission-based access**: Can check for specific permissions like `hasAuthority('CREATE_USER')`
- **Role-based access**: Traditional role checks still work with `hasRole('ADMIN')`

## 🗃️ Database Schema

### Key Tables
```sql
permissions (id, name, description, created_at, updated_at)
roles (id, name, description, created_at, updated_at) 
role_permissions (id, role_id, permission_id, active, created_at, updated_at)
user_roles (id, user_id, role_id, active, created_at, updated_at)
```

### Relationships
- **Role ↔ Permission**: Many-to-Many via `role_permissions`
- **User ↔ Role**: Many-to-Many via `user_roles`
- **Soft deletes**: Using `active` flags instead of hard deletes

## 🎭 Default Roles & Permissions

### Roles
1. **ADMIN**: System administrator (all permissions)
2. **REVIEW**: Medical review company (WAAD)
3. **INSURANCE**: Insurance company (WAHDA) 
4. **EMPLOYER**: Organization/company HR managers
5. **PROVIDER**: Healthcare providers (hospitals, clinics)
6. **MEMBER**: Insured individuals

### Permission Categories
- **User Management**: CREATE_USER, READ_USER, UPDATE_USER, DELETE_USER
- **Member Management**: CREATE_MEMBER, READ_MEMBER, UPDATE_MEMBER, DELETE_MEMBER
- **Claim Management**: CREATE_CLAIM, READ_CLAIM, UPDATE_CLAIM, DELETE_CLAIM, APPROVE_CLAIM, REJECT_CLAIM
- **Role Management**: CREATE_ROLE, READ_ROLE, UPDATE_ROLE, DELETE_ROLE
- **Permission Management**: CREATE_PERMISSION, READ_PERMISSION, UPDATE_PERMISSION, DELETE_PERMISSION
- **System Management**: MANAGE_SYSTEM, VIEW_REPORTS, EXPORT_DATA, etc.

## 🚀 API Endpoints

### Permissions API
```
GET    /api/permissions              # Get all permissions
POST   /api/permissions              # Create permission
GET    /api/permissions/{id}         # Get permission by ID
PUT    /api/permissions/{id}         # Update permission
DELETE /api/permissions/{id}         # Delete permission
GET    /api/permissions/role/{roleId} # Get permissions by role
```

### Roles API
```
GET    /api/roles                    # Get all roles
POST   /api/roles                    # Create role
GET    /api/roles/{id}               # Get role by ID
PUT    /api/roles/{id}               # Update role
DELETE /api/roles/{id}               # Delete role
POST   /api/roles/{roleId}/permissions/{permissionId}  # Add permission to role
DELETE /api/roles/{roleId}/permissions/{permissionId}  # Remove permission from role
PUT    /api/roles/{roleId}/permissions                 # Set role permissions
```

### User Roles API
```
GET    /api/user-roles               # Get all user-role assignments
POST   /api/user-roles/assign        # Assign role to user
DELETE /api/user-roles/remove        # Remove role from user
GET    /api/user-roles/user/{userId} # Get user's roles
PUT    /api/user-roles/user/{userId}/roles  # Set user's roles
```

## 🔧 Usage Examples

### 1. Create New Permission
```bash
curl -X POST http://localhost:9090/api/permissions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MANAGE_REPORTS",
    "description": "إدارة التقارير"
  }'
```

### 2. Assign Permission to Role
```bash
curl -X POST http://localhost:9090/api/roles/1/permissions/5 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Assign Role to User
```bash
curl -X POST http://localhost:9090/api/user-roles/assign?userId=1&roleId=2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Check User Permissions in Code
```java
// In your service or controller
@PreAuthorize("hasAuthority('CREATE_CLAIM')")
public Claim createClaim(Claim claim) {
    // Only users with CREATE_CLAIM permission can execute
}

@PreAuthorize("hasRole('ADMIN') or hasAuthority('READ_USER')")
public List<User> getUsers() {
    // ADMIN role OR READ_USER permission required
}
```

### 5. Get User's Permissions from JWT
```java
// In your filter or service
String token = getTokenFromRequest(request);
List<String> permissions = jwtTokenProvider.extractPermissions(token);
List<String> roles = jwtTokenProvider.extractRoles(token);
```

## 🔄 Migration from Old System

### Automatic Migration
The `DataInitializer` class handles migration:
1. Creates default permissions and roles
2. Migrates existing users to new role system
3. Assigns appropriate permissions to roles
4. Preserves existing user data

### Manual Steps (if needed)
1. Run the database schema: `database/rbac_schema.sql`
2. Start the application (DataInitializer runs automatically)
3. Verify users can login and have correct permissions
4. Test API endpoints with different role combinations

## 🧪 Testing

### Login and Get Token
```bash
curl -X POST http://localhost:9090/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin",
    "password": "changeMeAdmin!"
  }'
```

### Test Permission-based Access
```bash
# Should work for ADMIN
curl -X GET http://localhost:9090/api/permissions \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Should fail for MEMBER
curl -X GET http://localhost:9090/api/permissions \
  -H "Authorization: Bearer MEMBER_TOKEN"
```

### Verify JWT Payload
Decode the JWT token to verify it contains:
```json
{
  "sub": "admin",
  "userId": 1,
  "fullName": "مدير النظام",
  "email": "admin@tba.ly",
  "roles": ["ADMIN"],
  "permissions": ["CREATE_USER", "READ_USER", "UPDATE_USER", "DELETE_USER", ...],
  "iat": 1700000000,
  "exp": 1700086400
}
```

## 🔍 Monitoring & Maintenance

### Database Queries for Monitoring
```sql
-- Check active user-role assignments
SELECT u.username, r.name as role, ur.active 
FROM users u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN roles r ON ur.role_id = r.id 
WHERE ur.active = true;

-- Check role permissions
SELECT r.name as role, p.name as permission 
FROM roles r 
JOIN role_permissions rp ON r.id = rp.role_id 
JOIN permissions p ON rp.permission_id = p.id 
WHERE rp.active = true 
ORDER BY r.name, p.name;

-- Find users with specific permission
SELECT DISTINCT u.username 
FROM users u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN roles r ON ur.role_id = r.id 
JOIN role_permissions rp ON r.id = rp.role_id 
JOIN permissions p ON rp.permission_id = p.id 
WHERE p.name = 'CREATE_CLAIM' AND ur.active = true AND rp.active = true;
```

### Performance Considerations
- Permissions are loaded into JWT at login time (no database lookups during requests)
- Database indexes on frequently queried columns
- Lazy loading for large permission sets
- Caching strategies can be added for role/permission lookups

## 🔐 Security Best Practices
1. **Principle of Least Privilege**: Users get minimum required permissions
2. **Role Separation**: Clear boundaries between different user types
3. **Permission Granularity**: Fine-grained permissions for precise control
4. **Audit Trail**: Created/updated timestamps on all permission changes
5. **Soft Deletes**: Use `active` flags instead of hard deletes
6. **JWT Security**: Permissions embedded in JWT for stateless authentication

## 🐛 Troubleshooting

### Common Issues
1. **403 Forbidden**: User lacks required permission
2. **Role Not Found**: Role may not exist or user not assigned
3. **Permission Denied**: Check permission assignments in database
4. **JWT Issues**: Verify token contains expected roles/permissions

### Debug Commands
```bash
# Check user's current roles
curl -X GET http://localhost:9090/api/user-roles/user/{userId}/roles \
  -H "Authorization: Bearer TOKEN"

# Verify permission exists
curl -X GET http://localhost:9090/api/permissions/name/{permissionName} \
  -H "Authorization: Bearer TOKEN"

# Check role permissions
curl -X GET http://localhost:9090/api/permissions/role/{roleId} \
  -H "Authorization: Bearer TOKEN"
```

This RBAC system provides enterprise-level access control with the flexibility to handle complex permission scenarios while maintaining performance and security.