import { useMemo, useEffect, useState } from 'react';

// Project-imports
import { fetcher } from 'utils/axios';

const initialState = {
  isDashboardDrawerOpened: false,
  isComponentDrawerOpened: true
};

const endpoints = {
  key: 'api/menu',
  master: 'master',
  dashboard: '/dashboard' // server URL
};

const staticMenuItem = {
  id: 'invoice1',
  title: 'invoice',
  type: 'item',
  url: '/dashboard/invoice',
  breadcrumbs: false
};

export function useGetMenu() {
  const [menu, setMenu] = useState(null);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setMenuLoading(true);
    fetcher(endpoints.key + endpoints.dashboard)
      .then((res) => {
        if (!mounted) return;
        let updatedMenu = res?.dashboard || res;
        if (updatedMenu && Array.isArray(updatedMenu.children) && updatedMenu.children.length > 0) {
          updatedMenu = {
            ...updatedMenu,
            children: updatedMenu.children.map((group) => {
              if (Array.isArray(group.children)) {
                return {
                  ...group,
                  children: [...group.children, staticMenuItem]
                };
              }
              return group;
            })
          };
        }
        setMenu(updatedMenu);
        setMenuLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setMenuError(err);
        setMenuLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const memoizedValue = useMemo(() => ({ menu, menuLoading, menuError, menuValidating: false, menuEmpty: !menu && !menuLoading }), [menu, menuLoading, menuError]);
  return memoizedValue;
}

let menuMasterState = initialState;

export function useGetMenuMaster() {
  const [menuMaster, setMenuMaster] = useState(menuMasterState);
  useEffect(() => {
    function handle(e) {
      setMenuMaster(e.detail || initialState);
    }
    window.addEventListener('menuMasterUpdate', handle);
    // initialize with current state
    setMenuMaster(menuMasterState);
    return () => window.removeEventListener('menuMasterUpdate', handle);
  }, []);

  const memoizedValue = useMemo(() => ({ menuMaster, menuMasterLoading: false }), [menuMaster]);
  return memoizedValue;
}

export function handlerComponentDrawer(isComponentDrawerOpened) {
  menuMasterState = { ...menuMasterState, isComponentDrawerOpened };
  window.dispatchEvent(new CustomEvent('menuMasterUpdate', { detail: menuMasterState }));
}

export function handlerDrawerOpen(isDashboardDrawerOpened) {
  menuMasterState = { ...menuMasterState, isDashboardDrawerOpened };
  window.dispatchEvent(new CustomEvent('menuMasterUpdate', { detail: menuMasterState }));
}
