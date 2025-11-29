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
  children: [
    {
      id: 'reports',
      title: 'Reports',
      type: 'item',
      url: '/tools/reports',
      icon: icons.FileTextOutlined,
      breadcrumbs: false
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      type: 'item',
      url: '/tools/settings/general',
      icon: icons.SettingOutlined,
      breadcrumbs: false
    }
  ]
};

export default tools;
