// utils/permissions.js
// دوال مساعدة للصلاحيات المركزية

// ==================== PERMISSION CONSTANTS ====================
export const PERMISSIONS = {
  // Users permissions
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',
  USERS_ASSIGN_ROLES: 'users.assign_roles',

  // Roles permissions
  ROLES_VIEW: 'roles.view',
  ROLES_CREATE: 'roles.create',
  ROLES_EDIT: 'roles.edit',
  ROLES_DELETE: 'roles.delete',
  ROLES_MANAGE: 'roles.manage',
  ROLES_ASSIGN_PERMISSIONS: 'roles.assign_permissions',

  // Permissions permissions
  PERMISSIONS_VIEW: 'permissions.view',
  PERMISSIONS_CREATE: 'permissions.create',
  PERMISSIONS_EDIT: 'permissions.edit',
  PERMISSIONS_DELETE: 'permissions.delete',
  PERMISSIONS_MANAGE: 'permissions.manage',

  // Customers permissions
  CUSTOMERS_VIEW: 'customers.view',
  CUSTOMERS_CREATE: 'customers.create',
  CUSTOMERS_EDIT: 'customers.edit',
  CUSTOMERS_DELETE: 'customers.delete',

  // Reports permissions
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export',

  // Admin permissions
  ADMIN_PANEL: 'admin.panel',
  SYSTEM_SETTINGS: 'system.settings'
};

// ==================== ROLE CONSTANTS ====================
export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE',
  USER: 'USER'
};

// ==================== PERMISSION GROUPS ====================
export const PERMISSION_GROUPS = {
  'User Management': [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.USERS_ASSIGN_ROLES
  ],
  'Role Management': [
    PERMISSIONS.ROLES_VIEW,
    PERMISSIONS.ROLES_CREATE,
    PERMISSIONS.ROLES_EDIT,
    PERMISSIONS.ROLES_DELETE,
    PERMISSIONS.ROLES_MANAGE,
    PERMISSIONS.ROLES_ASSIGN_PERMISSIONS
  ],
  'Permission Management': [
    PERMISSIONS.PERMISSIONS_VIEW,
    PERMISSIONS.PERMISSIONS_CREATE,
    PERMISSIONS.PERMISSIONS_EDIT,
    PERMISSIONS.PERMISSIONS_DELETE,
    PERMISSIONS.PERMISSIONS_MANAGE
  ],
  'Customer Management': [
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.CUSTOMERS_CREATE,
    PERMISSIONS.CUSTOMERS_EDIT,
    PERMISSIONS.CUSTOMERS_DELETE
  ],
  'Reports': [
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT
  ],
  'Administration': [
    PERMISSIONS.ADMIN_PANEL,
    PERMISSIONS.SYSTEM_SETTINGS
  ]
};

// ==================== UTILITY FUNCTIONS ====================
export const getAllPermissions = () => {
  return Object.values(PERMISSIONS);
};

export const getPermissionsByGroup = (groupName) => {
  return PERMISSION_GROUPS[groupName] || [];
};

export const getPermissionGroups = () => {
  return Object.keys(PERMISSION_GROUPS);
};

// Check if user has admin role
export const isAdmin = (user) => {
  return user?.roles?.includes(ROLES.ADMIN) || false;
};

// Check if user has manager role
export const isManager = (user) => {
  return user?.roles?.includes(ROLES.MANAGER) || false;
};

// Get permission display name
export const getPermissionDisplayName = (permission) => {
  const displayNames = {
    [PERMISSIONS.USERS_VIEW]: 'عرض المستخدمين',
    [PERMISSIONS.USERS_CREATE]: 'إنشاء مستخدم',
    [PERMISSIONS.USERS_EDIT]: 'تعديل مستخدم',
    [PERMISSIONS.USERS_DELETE]: 'حذف مستخدم',
    [PERMISSIONS.USERS_ASSIGN_ROLES]: 'تعيين الأدوار',
    
    [PERMISSIONS.ROLES_VIEW]: 'عرض الأدوار',
    [PERMISSIONS.ROLES_CREATE]: 'إنشاء دور',
    [PERMISSIONS.ROLES_EDIT]: 'تعديل دور',
    [PERMISSIONS.ROLES_DELETE]: 'حذف دور',
    [PERMISSIONS.ROLES_MANAGE]: 'إدارة الأدوار',
    [PERMISSIONS.ROLES_ASSIGN_PERMISSIONS]: 'تعيين الصلاحيات',
    
    [PERMISSIONS.PERMISSIONS_VIEW]: 'عرض الصلاحيات',
    [PERMISSIONS.PERMISSIONS_CREATE]: 'إنشاء صلاحية',
    [PERMISSIONS.PERMISSIONS_EDIT]: 'تعديل صلاحية',
    [PERMISSIONS.PERMISSIONS_DELETE]: 'حذف صلاحية',
    [PERMISSIONS.PERMISSIONS_MANAGE]: 'إدارة الصلاحيات',
    
    [PERMISSIONS.CUSTOMERS_VIEW]: 'عرض العملاء',
    [PERMISSIONS.CUSTOMERS_CREATE]: 'إنشاء عميل',
    [PERMISSIONS.CUSTOMERS_EDIT]: 'تعديل عميل',
    [PERMISSIONS.CUSTOMERS_DELETE]: 'حذف عميل',
    
    [PERMISSIONS.REPORTS_VIEW]: 'عرض التقارير',
    [PERMISSIONS.REPORTS_EXPORT]: 'تصدير التقارير',
    
    [PERMISSIONS.ADMIN_PANEL]: 'لوحة الإدارة',
    [PERMISSIONS.SYSTEM_SETTINGS]: 'إعدادات النظام'
  };
  
  return displayNames[permission] || permission;
};

export default {
  PERMISSIONS,
  ROLES,
  PERMISSION_GROUPS,
  getAllPermissions,
  getPermissionsByGroup,
  getPermissionGroups,
  isAdmin,
  isManager,
  getPermissionDisplayName
};