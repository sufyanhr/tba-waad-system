import { create } from 'zustand';
import menuItem from 'menu-items/components';

// ==============================|| MENU API - STATE MANAGEMENT ||============================== //

/**
 * Zustand store for menu state management
 * Replaces old Redux implementation
 */
export const useMenuStore = create((set) => ({
  openDrawer: true,
  openComponentDrawer: true,
  menuMaster: menuItem,
  
  handlerDrawerOpen: (isOpen) => set({ openDrawer: isOpen }),
  handlerComponentDrawer: (isOpen) => set({ openComponentDrawer: isOpen }),
}));

// Export hooks for backward compatibility
export const handlerDrawerOpen = (isOpen) => useMenuStore.setState({ openDrawer: isOpen });
export const handlerComponentDrawer = (isOpen) => useMenuStore.setState({ openComponentDrawer: isOpen });

/**
 * Hook to get menu master data
 * @returns {Object} menuMaster - Menu configuration
 */
export const useGetMenuMaster = () => {
  const menuMaster = useMenuStore((state) => state.menuMaster);
  return { menuMaster };
};

export default useMenuStore;
