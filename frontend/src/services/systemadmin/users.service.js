/**
 * DEPRECATED: This file is kept for backward compatibility only.
 * 
 * For User CRUD operations, use: /services/rbac/users.service.js
 * For User Management (status, password, roles), use: /services/systemadmin/userManagement.service.js
 * 
 * This service now acts as a proxy to maintain backward compatibility.
 */

import usersService from '../rbac/users.service';
import userManagementService from './userManagement.service';

// Re-export RBAC user CRUD operations
export const {
  getAllUsers,
  getUserById,
  searchUsers,
  createUser,
  updateUser,
  deleteUser,
  getUsersPaginated
} = usersService;

// Re-export user management operations
export const {
  toggleUserStatus,
  resetPassword,
  assignRoles,
  removeRoles
} = userManagementService;

// Default export for backward compatibility
export default {
  ...usersService,
  ...userManagementService
};
