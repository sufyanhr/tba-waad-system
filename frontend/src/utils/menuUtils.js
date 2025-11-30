/**
 * Menu Utilities - Helper functions for role-based menu filtering
 */

/**
 * Check if user has any of the required roles
 * @param {string[]} userRoles - User's roles
 * @param {string[]} requiredRoles - Required roles for the menu item
 * @returns {boolean}
 */
const hasAnyRole = (userRoles, requiredRoles) => {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // No role requirement
  }
  if (!userRoles || userRoles.length === 0) {
    return false; // User has no roles
  }
  return requiredRoles.some((role) => userRoles.includes(role));
};

/**
 * Filter menu item based on user roles
 * @param {object} menuItem - Menu item to filter
 * @param {string[]} userRoles - User's roles
 * @returns {object|null} - Filtered menu item or null if user doesn't have access
 */
const filterMenuItem = (menuItem, userRoles) => {
  if (!menuItem) return null;

  // Check if user has required role for this item
  if (menuItem.requiredRoles && !hasAnyRole(userRoles, menuItem.requiredRoles)) {
    return null;
  }

  // If item has children, filter them recursively
  if (menuItem.children && menuItem.children.length > 0) {
    const filteredChildren = menuItem.children.map((child) => filterMenuItem(child, userRoles)).filter((child) => child !== null);

    // If no children remain after filtering, hide the parent too
    if (filteredChildren.length === 0) {
      return null;
    }

    return {
      ...menuItem,
      children: filteredChildren
    };
  }

  return menuItem;
};

/**
 * Filter entire menu structure based on user roles
 * @param {object} menuItems - Menu items object with 'items' array
 * @param {string[]} userRoles - User's roles
 * @returns {object} - Filtered menu items
 */
export const filterMenuByRoles = (menuItems, userRoles) => {
  if (!menuItems || !menuItems.items) {
    return { items: [] };
  }

  const filteredItems = menuItems.items.map((group) => filterMenuItem(group, userRoles)).filter((group) => group !== null);

  return {
    items: filteredItems
  };
};

export default filterMenuByRoles;
