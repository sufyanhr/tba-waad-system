import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from 'utils/axios';

// ==============================|| MENU API ||============================== //

export const endpoints = {
  menu: '/api/menu'
};

export function useGetMenuMaster() {
  const { data, error, isLoading } = useSWR(endpoints.menu, fetcher, {
    fallbackData: { menuMaster: { isDashboardOpen: true } },
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
