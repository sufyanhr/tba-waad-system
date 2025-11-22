// assets
import { ToolOutlined, SafetyOutlined, SettingOutlined } from '@ant-design/icons';

// icons
const icons = { ToolOutlined, SafetyOutlined, SettingOutlined };

// ==============================|| MENU ITEMS - SYSTEM TOOLS ||============================== //

const systemTools = {
  id: 'system-tools',
  title: 'System Tools',
  type: 'group',
  children: [
    {
      id: 'rbac',
      title: 'RBAC',
      type: 'item',
      url: '/rbac',
      icon: icons.SafetyOutlined,
      breadcrumbs: true
    },
    {
      id: 'settings',
      title: 'Settings',
      type: 'item',
      url: '/settings',
      icon: icons.SettingOutlined,
      breadcrumbs: true
    }
  ]
};

export default systemTools;
