/**
 * Check if user has required permissions
 * @param {Array} userPermissions - Array of user's permission strings
 * @param {Array} requiredPermissions - Array of required permission strings
 * @returns {boolean} - True if user has at least one required permission
 */
export const hasPermission = (userPermissions = [], requiredPermissions = []) => {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true; // No permissions required, allow access
  }
  
  if (!userPermissions || userPermissions.length === 0) {
    return false; // User has no permissions
  }
  
  return requiredPermissions.some((perm) => userPermissions.includes(perm));
};

/**
 * Check if user has required roles
 * @param {Array} userRoles - Array of user's role strings
 * @param {Array} requiredRoles - Array of required role strings
 * @returns {boolean} - True if user has at least one required role
 */
export const hasRole = (userRoles = [], requiredRoles = []) => {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // No roles required, allow access
  }
  
  if (!userRoles || userRoles.length === 0) {
    return false; // User has no roles
  }
  
  return requiredRoles.some((role) => userRoles.includes(role));
};

/**
 * Filter menu items based on user permissions and roles
 * @param {Array} menuItems - Array of menu item objects
 * @param {Object} user - User object with roles and permissions arrays
 * @returns {Array} - Filtered menu items
 */
export const filterMenuByPermissions = (menuItems = [], user = null) => {
  if (!user) return [];
  
  const userPermissions = user.permissions || [];
  const userRoles = user.roles || [];
  
  return menuItems
    .map((item) => {
      // Check if item requires specific permissions or roles
      const hasRequiredPermissions = hasPermission(userPermissions, item.requiredPermissions);
      const hasRequiredRoles = hasRole(userRoles, item.requiredRoles);
      
      // If item has children, filter them recursively
      if (item.children && item.children.length > 0) {
        const filteredChildren = filterMenuByPermissions(item.children, user);
        
        // Only include group if it has visible children
        if (filteredChildren.length === 0 && item.type === 'group') {
          return null;
        }
        
        return {
          ...item,
          children: filteredChildren
        };
      }
      
      // For items without children, check permissions/roles
      if (!hasRequiredPermissions || !hasRequiredRoles) {
        return null;
      }
      
      return item;
    })
    .filter((item) => item !== null);
};
