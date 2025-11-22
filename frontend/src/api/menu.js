import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';

// ==============================|| MENU API ||============================== //

// Local menu state (no backend API needed)
const defaultMenuState = {
  menuMaster: {
    isDashboardOpen: true,
    openItem: null
  }
};

export const endpoints = {
  menu: 'local://menu' // Local state, not a real API endpoint
};

export function useGetMenuMaster() {
  // Use local state instead of fetching from backend
  const { data, error, isLoading } = useSWR(endpoints.menu, null, {
    fallbackData: defaultMenuState,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  return {
    menuMaster: data?.menuMaster || { isDashboardOpen: true },
    menuMasterLoading: isLoading,
    menuMasterError: error,
    menuMasterValidating: !error && !data,
    menuMasterEmpty: !isLoading && !data?.menuMaster
  };
}

export function handlerDrawerOpen(isOpen) {
  mutate(
    endpoints.menu,
    (currentData) => {
      return { menuMaster: { ...(currentData?.menuMaster || {}), isDashboardOpen: isOpen } };
    },
    false
  );
}

export function handlerActiveItem(openItem) {
  mutate(
    endpoints.menu,
    (currentData) => {
      return { menuMaster: { ...(currentData?.menuMaster || {}), openItem } };
    },
    false
  );
}
