// assets
import {
  FileTextOutlined,
  SettingOutlined
} from '@ant-design/icons';

const icons = {
  FileTextOutlined,
  SettingOutlined
};

// ==============================|| MENU ITEMS - TOOLS ||============================== //

const tools = {
  id: 'tools',
  title: 'Tools',
  type: 'group',
  requiredRoles: ['ADMIN', 'TBA_OPERATIONS', 'TBA_FINANCE', 'INSURANCE_ADMIN'], // TBA staff and admins
  children: [
    {
      id: 'reports',
      title: 'Reports',
      type: 'item',
      url: '/tools/reports',
      icon: icons.FileTextOutlined,
      breadcrumbs: false,
      requiredRoles: ['ADMIN', 'TBA_OPERATIONS', 'TBA_FINANCE', 'INSURANCE_ADMIN']
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      type: 'item',
      url: '/tools/settings/general',
      icon: icons.SettingOutlined,
      breadcrumbs: false,
      requiredRoles: ['ADMIN', 'TBA_OPERATIONS']
    }
  ]
};

export default tools;
