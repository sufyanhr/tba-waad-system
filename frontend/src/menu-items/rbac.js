// assets
import SecurityScanOutlined from '@ant-design/icons/SecurityScanOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';
import KeyOutlined from '@ant-design/icons/KeyOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

// utils
import { PERMISSIONS } from 'utils/permissions';

// icons
const icons = {
  SecurityScanOutlined,
  UserOutlined,
  TeamOutlined,
  KeyOutlined,
  SettingOutlined
};

// ==============================|| MENU ITEMS - RBAC ||============================== //

const rbac = {
  id: 'group-rbac',
  title: 'RBAC Administration',
  icon: icons.SecurityScanOutlined,
  type: 'group',
  children: [
    {
      id: 'roles',
      title: 'Roles Management',
      type: 'collapse',
      icon: icons.TeamOutlined,
      permissions: [PERMISSIONS.ROLES_MANAGE],
      children: [
        {
          id: 'roles-list',
          title: 'List Roles',
          type: 'item',
          url: '/admin/rbac/roles',
          permissions: [PERMISSIONS.ROLES_MANAGE]
        },
        {
          id: 'roles-create',
          title: 'Create Role',
          type: 'item',
          url: '/admin/rbac/roles/create',
          permissions: [PERMISSIONS.ROLES_MANAGE]
        },
        {
          id: 'roles-assign-permissions',
          title: 'Assign Permissions',
          type: 'item',
          url: '/admin/rbac/roles/assign-permissions',
          permissions: [PERMISSIONS.ROLES_ASSIGN_PERMISSIONS]
        }
      ]
    },
    {
      id: 'permissions',
      title: 'Permissions Management',
      type: 'collapse',
      icon: icons.KeyOutlined,
      permissions: ['permissions.manage'],
      children: [
        {
          id: 'permissions-list',
          title: 'List Permissions',
          type: 'item',
          url: '/admin/rbac/permissions',
          permissions: ['permissions.manage']
        },
        {
          id: 'permissions-create',
          title: 'Create Permission',
          type: 'item',
          url: '/admin/rbac/permissions/create',
          permissions: ['permissions.manage']
        }
      ]
    },
    {
      id: 'users-assignment',
      title: 'User Assignments',
      type: 'item',
      icon: icons.UserOutlined,
      url: '/admin/rbac/users/assign-roles',
      permissions: ['users.assign_roles']
    }
  ]
};

export default rbac;