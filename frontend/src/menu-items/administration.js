// assets
import {
  UserOutlined,
  SafetyCertificateOutlined,
  BankOutlined
} from '@ant-design/icons';

const icons = {
  UserOutlined,
  SafetyCertificateOutlined,
  BankOutlined
};

// ==============================|| MENU ITEMS - ADMINISTRATION ||============================== //

const administration = {
  id: 'administration',
  title: 'Administration',
  type: 'group',
  children: [
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/admin/users',
      icon: icons.UserOutlined,
      breadcrumbs: true
    },
    {
      id: 'roles-permissions',
      title: 'Roles & Permissions',
      type: 'item',
      url: '/admin/roles',
      icon: icons.SafetyCertificateOutlined,
      breadcrumbs: true
    },
    {
      id: 'companies',
      title: 'Companies',
      type: 'item',
      url: '/admin/companies',
      icon: icons.BankOutlined,
      breadcrumbs: true
    }
  ]
};

export default administration;
