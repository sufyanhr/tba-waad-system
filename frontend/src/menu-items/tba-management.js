// assets
import {
  MedicineBoxOutlined,
  AppstoreOutlined,
  SafetyOutlined,
  UserOutlined,
  TeamOutlined,
  AuditOutlined,
  EyeOutlined
} from '@ant-design/icons';

const icons = {
  MedicineBoxOutlined,
  AppstoreOutlined,
  SafetyOutlined,
  UserOutlined,
  TeamOutlined,
  AuditOutlined,
  EyeOutlined
};

// ==============================|| MENU ITEMS - TBA MANAGEMENT ||============================== //

const tbaManagement = {
  id: 'tba-management',
  title: 'TBA Management',
  type: 'group',
  children: [
    {
      id: 'medical-services',
      title: 'Medical Services',
      type: 'item',
      url: '/tba/medical-services',
      icon: icons.MedicineBoxOutlined,
      breadcrumbs: false
    },
    {
      id: 'medical-categories',
      title: 'Medical Categories',
      type: 'item',
      url: '/tba/medical-categories',
      icon: icons.AppstoreOutlined,
      breadcrumbs: false
    },
    {
      id: 'providers',
      title: 'Providers',
      type: 'item',
      url: '/tba/providers',
      icon: icons.SafetyOutlined,
      breadcrumbs: false
    },
    {
      id: 'members',
      title: 'Members',
      type: 'item',
      url: '/tba/members',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'employers',
      title: 'Employers',
      type: 'item',
      url: '/tba/employers',
      icon: icons.TeamOutlined,
      breadcrumbs: false
    },
    {
      id: 'claims',
      title: 'Claims (Approvals)',
      type: 'item',
      url: '/tba/claims',
      icon: icons.AuditOutlined,
      breadcrumbs: false
    },
    {
      id: 'visits',
      title: 'Visits',
      type: 'item',
      url: '/tba/visits',
      icon: icons.EyeOutlined,
      breadcrumbs: false
    }
  ]
};

export default tbaManagement;
