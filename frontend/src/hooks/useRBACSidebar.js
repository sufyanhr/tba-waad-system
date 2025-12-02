import { useMemo, useState, useEffect } from 'react';
import { 
  Dashboard,
  People,
  Business,
  Receipt,
  LocalHospital,
  Settings,
  Security,
  Timeline,
  MedicalServices,
  Category,
  LocalOffer,
  AssignmentInd,
  Description
} from '@mui/icons-material';
import useAuth from './useAuth';
import axios from 'utils/axios';

/**
 * useRBACSidebar Hook
 * Phase B2 - Dynamic Role-Based Sidebar with Feature Toggles
 *
 * Returns sidebar menu items based on:
 * 1. User role (SUPER_ADMIN, INSURANCE_ADMIN, EMPLOYER_ADMIN, PROVIDER, USER)
 * 2. RBAC permissions
 * 3. Feature toggles (for EMPLOYER_ADMIN only from backend Phase 9)
 */
const useRBACSidebar = () => {
  const { user, roles, permissions, hasRole } = useAuth();
  const [featureToggles, setFeatureToggles] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch feature toggles for EMPLOYER_ADMIN
  useEffect(() => {
    const fetchFeatureToggles = async () => {
      // Only fetch for EMPLOYER_ADMIN
      if (!hasRole('EMPLOYER_ADMIN')) {
        setLoading(false);
        return;
      }

      const employerId = user?.employerId;
      if (!employerId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/company-settings/employer/${employerId}`);
        if (response.data && response.data.data) {
          setFeatureToggles(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch feature toggles:', error);
        // Default to all features disabled on error
        setFeatureToggles({
          canViewClaims: false,
          canViewVisits: false,
          canEditMembers: true,
          canDownloadAttachments: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeatureToggles();
  }, [user, hasRole]);

  const sidebarItems = useMemo(() => {
    if (!user || !roles || roles.length === 0) {
      return [];
    }

    // Define all possible menu items
    const allItems = [
      {
        id: 'dashboard',
        label: 'لوحة التحكم',
        icon: Dashboard,
        path: '/tba/dashboard',
        roles: ['SUPER_ADMIN', 'INSURANCE_ADMIN'],
        permissions: []
      },
      {
        id: 'members',
        label: 'الأعضاء',
        icon: People,
        path: '/tba/members',
        roles: ['SUPER_ADMIN', 'INSURANCE_ADMIN', 'EMPLOYER_ADMIN'],
        permissions: ['MANAGE_MEMBERS', 'VIEW_MEMBERS']
      },
      {
        id: 'employers',
        label: 'أصحاب العمل',
        icon: Business,
        path: '/tba/employers',
        roles: ['SUPER_ADMIN', 'INSURANCE_ADMIN'],
        permissions: ['MANAGE_EMPLOYERS', 'VIEW_EMPLOYERS']
      },
      {
        id: 'claims',
        label: 'المطالبات',
        icon: Receipt,
        path: '/tba/claims',
        roles: ['SUPER_ADMIN', 'INSURANCE_ADMIN', 'EMPLOYER_ADMIN', 'PROVIDER'],
        permissions: ['VIEW_CLAIMS', 'MANAGE_CLAIMS'],
        featureToggle: 'canViewClaims' // For EMPLOYER_ADMIN only
      },
      {
        id: 'visits',
        label: 'الزيارات',
        icon: LocalHospital,
        path: '/tba/visits',
        roles: ['SUPER_ADMIN', 'INSURANCE_ADMIN', 'EMPLOYER_ADMIN', 'PROVIDER'],
        permissions: ['VIEW_VISITS', 'MANAGE_VISITS'],
        featureToggle: 'canViewVisits' // For EMPLOYER_ADMIN only
      },
      {
        id: 'medical-services',
        label: 'الخدمات الطبية',
        icon: MedicalServices,
        path: '/tba/medical-services',
        roles: ['SUPER_ADMIN', 'INSURANCE_ADMIN'],
        permissions: ['MANAGE_MEDICAL_SERVICES']
      },
      {
        id: 'medical-categories',
        label: 'التصنيفات الطبية',
        icon: Category,
        path: '/tba/medical-categories',
        roles: ['SUPER_ADMIN', 'INSURANCE_ADMIN'],
        permissions: ['MANAGE_MEDICAL_CATEGORIES']
      },
      {
        id: 'medical-packages',
        label: 'الباقات الطبية',
        icon: LocalOffer,
        path: '/tba/medical-packages',
        roles: ['SUPER_ADMIN', 'INSURANCE_ADMIN'],
        permissions: ['MANAGE_MEDICAL_PACKAGES']
      },
      {
        id: 'providers',
        label: 'مقدمو الخدمة',
        icon: AssignmentInd,
        path: '/tba/providers',
        roles: ['SUPER_ADMIN', 'INSURANCE_ADMIN'],
        permissions: ['MANAGE_PROVIDERS', 'VIEW_PROVIDERS']
      },
      {
        id: 'policies',
        label: 'البوليصات',
        icon: Description,
        path: '/tba/policies',
        roles: ['SUPER_ADMIN', 'INSURANCE_ADMIN'],
        permissions: ['MANAGE_POLICIES']
      },
      {
        id: 'companies',
        label: 'شركات التأمين',
        icon: Business,
        path: '/tba/insurance-companies',
        roles: ['SUPER_ADMIN'],
        permissions: []
      },
      {
        id: 'rbac',
        label: 'إدارة الصلاحيات',
        icon: Security,
        path: '/tba/rbac',
        roles: ['SUPER_ADMIN'],
        permissions: []
      },
      {
        id: 'settings',
        label: 'الإعدادات',
        icon: Settings,
        path: '/tba/settings',
        roles: ['SUPER_ADMIN', 'INSURANCE_ADMIN'],
        permissions: []
      },
      {
        id: 'audit',
        label: 'سجل التدقيق',
        icon: Timeline,
        path: '/tba/audit',
        roles: ['SUPER_ADMIN', 'INSURANCE_ADMIN'],
        permissions: []
      }
    ];

    // Filter items based on role, permissions, and feature toggles
    const filteredItems = allItems.filter((item) => {
      // Check role access
      const hasRoleAccess = item.roles.some((role) => roles.includes(role));
      if (!hasRoleAccess) return false;

      // Check permissions (if any permission matches OR no permissions required)
      const hasPermissionAccess = item.permissions.length === 0 || item.permissions.some((perm) => permissions.includes(perm));

      if (!hasPermissionAccess) return false;

      // Special handling for EMPLOYER_ADMIN with feature toggles
      if (hasRole('EMPLOYER_ADMIN') && item.featureToggle) {
        // If still loading feature toggles, hide the item
        if (loading) return false;
        
        // If feature toggles loaded, check the specific toggle
        if (featureToggles && featureToggles[item.featureToggle] === false) {
          return false;
        }
      }

      return true;
    });

    return filteredItems.map((item) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      path: item.path,
      visible: true
    }));
  }, [user, roles, permissions, featureToggles, loading, hasRole]);

  return {
    sidebarItems,
    loading
  };
};

export default useRBACSidebar;
