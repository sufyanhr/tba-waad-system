/**
 * System Admin Services Index (Updated)
 * Central export for all System Admin services
 * 
 * These services handle relationship management and admin actions:
 * - User Management (status, password, roles)
 * - Role Management (role-user, role-permission relationships)
 * - Permission Matrix (permission matrix views and bulk operations)
 * - Feature Flags
 * - Module Access
 * - Audit Logs
 */

// New architecture services
export { default as userManagementService } from './userManagement.service';
export { default as roleManagementService } from './roleManagement.service';
export { default as permissionMatrixService } from './permissionMatrix.service';

// Existing services (unchanged)
export { default as featuresService } from './features.service';
export { default as modulesService } from './modules.service';
export { default as auditService } from './audit.service';

// Backward compatibility proxies (deprecated)
export { default as usersServiceCompat } from './users.service';
export { default as rolesServiceCompat } from './roles.service';
export { default as permissionsServiceCompat } from './permissions.service';

// Named exports for convenience
export { userManagementService as UserManagementService } from './userManagement.service';
export { roleManagementService as RoleManagementService } from './roleManagement.service';
export { permissionMatrixService as PermissionMatrixService } from './permissionMatrix.service';
