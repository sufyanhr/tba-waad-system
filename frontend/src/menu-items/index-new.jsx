// project imports
import dashboard from './dashboard';
import applications from './applications';
import widget from './widget';
import formsTables from './forms-tables';
import samplePage from './sample-page';
import chartsMap from './charts-map';
import other from './other';
import pages from './pages';
import rbac from './rbac';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, widget, applications, formsTables, chartsMap, pages, rbac, other]
};

export default menuItems;

// Role-based menu filtering helper
export const getMenuItemsByRole = (items, userRoles) => {
  if (!userRoles || userRoles.length === 0) return [];
  
  // ADMIN has access to everything
  if (userRoles.includes('ADMIN')) return items;
  
  return items.filter(item => {
    // If no roles specified, show to all
    if (!item.roles || item.roles.length === 0) return true;
    
    // Check if user has any of the required roles
    return item.roles.some(role => userRoles.includes(role));
  }).map(item => {
    // If item has children, filter them too
    if (item.children && item.children.length > 0) {
      return {
        ...item,
        children: getMenuItemsByRole(item.children, userRoles)
      };
    }
    return item;
  });
};
