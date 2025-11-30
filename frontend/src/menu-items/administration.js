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
  requiredRoles: ['ADMIN'], // Only ADMIN can see this entire section
  children: [
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/admin/users',
      icon: icons.UserOutlined,
      breadcrumbs: true,
      requiredRoles: ['ADMIN']
    },
    {
      id: 'roles-permissions',
      title: 'Roles & Permissions',
      type: 'item',
      url: '/admin/roles',
      icon: icons.SafetyCertificateOutlined,
      breadcrumbs: true,
      requiredRoles: ['ADMIN']
    },
    {
      id: 'companies',
      title: 'Companies',
      type: 'item',
      url: '/admin/companies',
      icon: icons.BankOutlined,
      breadcrumbs: true,
      requiredRoles: ['ADMIN']
    }
  ]
};

export default administration;
