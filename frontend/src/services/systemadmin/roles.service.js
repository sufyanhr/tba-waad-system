/**
 * DEPRECATED: This file is kept for backward compatibility only.
 * 
 * For Role CRUD operations, use: /services/rbac/roles.service.js
 * For Role Management (users, permissions), use: /services/systemadmin/roleManagement.service.js
 * 
 * This service now acts as a proxy to maintain backward compatibility.
 */

import rbacRolesService from '../rbac/roles.service';
import roleManagementService from './roleManagement.service';

// Re-export RBAC role CRUD operations
export const {
  getAllRoles,
  getRoleById,
  searchRoles,
  createRole,
  updateRole,
  deleteRole,
  getRolesPaginated,
  assignPermissions,
  removePermissions
} = rbacRolesService;

// Re-export role management operations
export const {
  getUsersWithRole
} = roleManagementService;

// Combined service object
const combinedService = {
  ...rbacRolesService,
  ...roleManagementService
};

// Named export for hooks compatibility
export { combinedService as rolesService };

// Default export for backward compatibility
export default combinedService;
