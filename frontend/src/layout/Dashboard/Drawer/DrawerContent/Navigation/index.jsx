import { useLayoutEffect, useState } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import NavItem from './NavItem';
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { MenuFromAPI } from 'menu-items/dashboard';

import { useAuth } from 'modules/auth/useAuth';
import useConfig from 'hooks/useConfig';
import { HORIZONTAL_MAX_ITEM, MenuOrientation } from 'config';
import { useGetMenu, useGetMenuMaster } from 'api/menu';

function isFound(arr, str) {
  return arr.items.some((element) => {
    if (element.id === str) {
      return true;
    }
    return false;
  });
}

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const { state } = useConfig();
  const { user, hasRole, hasPermission } = useAuth();
  const { menuLoading } = useGetMenu();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const [selectedID, setSelectedID] = useState('');
  const [selectedItems, setSelectedItems] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [menuItems, setMenuItems] = useState({ items: [] });

  const dashboardMenu = MenuFromAPI();

  // Function to check if menu item should be visible
  const isMenuItemVisible = (item) => {
    // If no user, hide everything except public items
    if (!user) return false;
    
    // ADMIN has access to everything
    if (user.roles?.includes('ADMIN')) return true;
    
    // If no permissions/roles defined, show by default
    if (!item.roles && !item.permissions) return true;
    
    // Check roles
    if (item.roles && item.roles.length > 0) {
      const hasRequiredRole = item.roles.some(role => hasRole(role));
      if (hasRequiredRole) return true;
    }
    
    // Check permissions
    if (item.permissions && item.permissions.length > 0) {
      const hasRequiredPermission = item.permissions.some(permission => hasPermission(permission));
      if (hasRequiredPermission) return true;
    }
    
    return false;
  };

  // Function to filter menu items based on permissions
  const filterMenuItems = (items) => {
    return items.filter(item => {
      if (!isMenuItemVisible(item)) return false;
      if (item.children && item.children.length > 0) {
        const filteredChildren = filterMenuItems([...item.children]);
        item.children = filteredChildren;
        return filteredChildren.length > 0;
      }
      return true;
    });
  };

  useLayoutEffect(() => {
    let items = [];
    if (menuLoading && !isFound(menuItem, 'group-dashboard-loading')) {
      menuItem.items.splice(0, 0, dashboardMenu);
      items = [...menuItem.items];
    } else if (!menuLoading && dashboardMenu?.id !== undefined && !isFound(menuItem, 'group-dashboard')) {
      menuItem.items.splice(0, 1, dashboardMenu);
      items = [...menuItem.items];
    } else {
      items = [...menuItem.items];
    }
    
    // Filter menu items based on user permissions
    const filteredItems = filterMenuItems(items);
    setMenuItems({ items: filteredItems });
    // eslint-disable-next-line
  }, [menuLoading]);

  const isHorizontal = state.menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;
  let lastItemIndex = menuItems.items.length - 1;
  let remItems = [];
  let lastItemId;

  //  first it checks menu item is more than giving HORIZONTAL_MAX_ITEM after that get lastItemid by giving horizontal max
  // item and it sets horizontal menu by giving horizontal max item lastly slice menuItem from array and set into remItems

  if (lastItem && lastItem < menuItems.items.length) {
    lastItemId = menuItems.items[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = menuItems.items.slice(lastItem - 1, menuItems.items.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon,
      ...(item.url && {
        url: item.url
      })
    }));
  }

  const navGroups = menuItems.items.slice(0, lastItemIndex + 1).map((item, index) => {
    switch (item.type) {
      case 'group':
        if (item.url && item.id !== lastItemId) {
          return (
            <List key={item.id} sx={{ zIndex: 0, ...(isHorizontal && { mt: 0.5 }) }}>
              {!isHorizontal && index !== 0 && <Divider sx={{ my: 0.5 }} />}
              <NavItem item={item} level={1} isParents setSelectedID={setSelectedID} />
            </List>
          );
        }

        return (
          <NavGroup
            key={item.id}
            setSelectedID={setSelectedID}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedID={selectedID}
            selectedItems={selectedItems}
            lastItem={lastItem}
            remItems={remItems}
            lastItemId={lastItemId}
            item={item}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return (
    <Box
      sx={{
        pt: drawerOpen ? (isHorizontal ? 0 : 2) : 0,
        ...(!isHorizontal && { '& > ul:first-of-type': { mt: 0 } }),
        display: isHorizontal ? { xs: 'block', lg: 'flex' } : 'block'
      }}
    >
      {navGroups}
    </Box>
  );
}
