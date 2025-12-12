/**
 * DEPRECATED: This file is kept for backward compatibility only.
 * 
 * For Permission CRUD operations, use: /services/rbac/permissions.service.js
 * For Permission Matrix operations, use: /services/systemadmin/permissionMatrix.service.js
 * 
 * This service now acts as a proxy to maintain backward compatibility.
 */

import rbacPermissionsService from '../rbac/permissions.service';
import permissionMatrixService from './permissionMatrix.service';

// Re-export RBAC permission CRUD operations
export const {
  getAllPermissions,
  getPermissionById,
  searchPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  getPermissionsPaginated
} = rbacPermissionsService;

// Re-export permission matrix operations
export const {
  getPermissionMatrix,
  assignPermissionToRole,
  removePermissionFromRole,
  getPermissionsForRole,
  getEffectivePermissionsForUser,
  bulkAssignPermissions,
  bulkRemovePermissions
} = permissionMatrixService;

// Alias for backward compatibility
export const bulkAssign = bulkAssignPermissions;
export const bulkRemove = bulkRemovePermissions;

// Combined service object
const combinedService = {
  ...rbacPermissionsService,
  ...permissionMatrixService,
  bulkAssign,
  bulkRemove
};

// Named export for hooks compatibility
export { combinedService as permissionsService };

// Default export for backward compatibility
export default combinedService;
