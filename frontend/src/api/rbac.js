import { create } from 'zustand';

// ==============================|| RBAC STORE - ROLE-BASED ACCESS CONTROL ||============================== //

/**
 * Zustand store for RBAC (Role-Based Access Control) and Employer Context
 * This store manages:
 * - User roles and permissions
 * - Current employer context (multi-employer switching)
 * - User information
 * - Access control for routes and menu items
 */

const STORAGE_KEYS = {
  ROLES: 'userRoles',
  USER: 'userData',
  EMPLOYER_ID: 'selectedEmployerId',
  TOKEN: 'serviceToken'
};

export const useRBACStore = create((set, get) => ({
  // State
  roles: [],
  permissions: [],
  employerId: null,
  user: null,
  isInitialized: false,

  // Actions
  setRoles: (roles) => {
    set({ roles });
    if (roles && roles.length > 0) {
      localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
    }
  },

  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  },

  setEmployerId: (employerId) => {
    const { user, roles } = get();
    
    // EMPLOYER role cannot switch companies - locked to their own employerId
    if (roles.includes('EMPLOYER') && user?.employerId) {
      console.warn('EMPLOYER role cannot switch companies. Using locked employerId:', user.employerId);
      set({ employerId: user.employerId });
      localStorage.setItem(STORAGE_KEYS.EMPLOYER_ID, user.employerId.toString());
      return;
    }

    // For other roles, allow switching
    set({ employerId });
    if (employerId) {
      localStorage.setItem(STORAGE_KEYS.EMPLOYER_ID, employerId.toString());
    } else {
      localStorage.removeItem(STORAGE_KEYS.EMPLOYER_ID);
    }
  },

  setPermissions: (permissions) => {
    set({ permissions });
  },

  /**
   * Initialize RBAC state from backend user data or localStorage
   * Called after login or on app startup
   * @param {Object} userData - User data from backend (optional)
   */
  initialize: (userData = null) => {
    try {
      let roles = [];
      let user = null;
      let employerId = null;
      let permissions = [];

      if (userData) {
        // Initialize from backend response (login)
        roles = userData.roles || [];
        user = userData;
        permissions = userData.permissions || [];
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        
        // Set employer context
        if (roles.includes('EMPLOYER') && user.employerId) {
          // EMPLOYER role locked to their company
          employerId = user.employerId;
        } else {
          // Other roles: try to restore from localStorage
          const storedEmployerId = localStorage.getItem(STORAGE_KEYS.EMPLOYER_ID);
          employerId = storedEmployerId ? parseInt(storedEmployerId, 10) : null;
        }
        
        if (employerId) {
          localStorage.setItem(STORAGE_KEYS.EMPLOYER_ID, employerId.toString());
        }
      } else {
        // Initialize from localStorage (page refresh)
        const rolesStr = localStorage.getItem(STORAGE_KEYS.ROLES);
        roles = rolesStr ? JSON.parse(rolesStr) : [];

        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        user = userStr ? JSON.parse(userStr) : null;

        const employerIdStr = localStorage.getItem(STORAGE_KEYS.EMPLOYER_ID);
        employerId = employerIdStr ? parseInt(employerIdStr, 10) : null;

        // EMPLOYER role MUST use their own employerId (locked)
        if (roles.includes('EMPLOYER') && user?.employerId) {
          employerId = user.employerId;
          localStorage.setItem(STORAGE_KEYS.EMPLOYER_ID, user.employerId.toString());
        }
      }

      set({
        roles,
        permissions,
        user,
        employerId,
        isInitialized: true
      });

      console.log('🔒 RBAC Initialized:', { roles, employerId, user: user?.username || user?.name });
    } catch (error) {
      console.error('Failed to initialize RBAC:', error);
      set({ isInitialized: true });
    }
  },

  /**
   * Clear RBAC state (on logout)
   */
  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.ROLES);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.EMPLOYER_ID);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    
    set({
      roles: [],
      permissions: [],
      employerId: null,
      user: null,
      isInitialized: false
    });
  },

  /**
   * Check if user has any of the required roles
   * @param {string[]} requiredRoles - Array of role names
   * @returns {boolean}
   */
  hasAnyRole: (requiredRoles) => {
    const { roles } = get();
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return roles.some((role) => requiredRoles.includes(role));
  },

  /**
   * Check if user has all required roles
   * @param {string[]} requiredRoles - Array of role names
   * @returns {boolean}
   */
  hasAllRoles: (requiredRoles) => {
    const { roles } = get();
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.every((role) => roles.includes(role));
  },

  /**
   * Check if user has specific permission
   * @param {string} permission - Permission name
   * @returns {boolean}
   */
  hasPermission: (permission) => {
    const { permissions } = get();
    return permissions.includes(permission);
  },

  /**
   * Check if user is EMPLOYER role (locked to their company)
   * @returns {boolean}
   */
  isEmployerRole: () => {
    const { roles } = get();
    return roles.includes('EMPLOYER');
  },

  /**
   * Check if employer switcher should be visible
   * EMPLOYER role cannot switch companies
   * @returns {boolean}
   */
  canSwitchEmployer: () => {
    const { roles } = get();
    return !roles.includes('EMPLOYER');
  }
}));

// ==============================|| EXPORTED HOOKS ||============================== //

/**
 * Hook to get user roles
 * @returns {string[]} Array of role names
 */
export const useRoles = () => {
  return useRBACStore((state) => state.roles);
};

/**
 * Hook to get employer context (current selected employer)
 * @returns {{ employerId: number|null, setEmployerId: function, canSwitch: boolean }}
 */
export const useEmployerContext = () => {
  const employerId = useRBACStore((state) => state.employerId);
  const setEmployerId = useRBACStore((state) => state.setEmployerId);
  const canSwitchEmployer = useRBACStore((state) => state.canSwitchEmployer);
  
  return {
    employerId,
    setEmployerId,
    canSwitch: canSwitchEmployer()
  };
};

/**
 * Hook to get current user data
 * @returns {Object|null} User object
 */
export const useUser = () => {
  return useRBACStore((state) => state.user);
};

/**
 * Hook to get complete RBAC state and methods
 * @returns {Object} Complete RBAC store
 */
export const useRBAC = () => {
  const roles = useRBACStore((state) => state.roles);
  const permissions = useRBACStore((state) => state.permissions);
  const employerId = useRBACStore((state) => state.employerId);
  const user = useRBACStore((state) => state.user);
  const isInitialized = useRBACStore((state) => state.isInitialized);
  const hasAnyRole = useRBACStore((state) => state.hasAnyRole);
  const hasAllRoles = useRBACStore((state) => state.hasAllRoles);
  const hasPermission = useRBACStore((state) => state.hasPermission);
  const isEmployerRole = useRBACStore((state) => state.isEmployerRole);
  const canSwitchEmployer = useRBACStore((state) => state.canSwitchEmployer);

  return {
    roles,
    permissions,
    employerId,
    user,
    isInitialized,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    isEmployerRole: isEmployerRole(),
    canSwitch: canSwitchEmployer()
  };
};

export default useRBACStore;
