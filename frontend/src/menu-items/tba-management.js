// assets
import {
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  FileProtectOutlined,
  GiftOutlined,
  SafetyCertificateOutlined,
  AuditOutlined,
  FileTextOutlined,
  EyeOutlined,
  FileSearchOutlined,
  MedicineBoxOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

const icons = {
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  FileProtectOutlined,
  GiftOutlined,
  SafetyCertificateOutlined,
  AuditOutlined,
  FileTextOutlined,
  EyeOutlined,
  FileSearchOutlined,
  MedicineBoxOutlined,
  AppstoreOutlined
};

// ==============================|| MENU ITEMS - TBA MANAGEMENT ||============================== //

const tbaManagement = {
  id: 'tba-management',
  title: 'TBA Management',
  type: 'group',
  children: [
    {
      id: 'members',
      title: 'Members',
      type: 'item',
      url: '/tba/members',
      icon: icons.UserOutlined,
      breadcrumbs: true
    },
    {
      id: 'employers',
      title: 'Employers',
      type: 'item',
      url: '/tba/employers',
      icon: icons.TeamOutlined,
      breadcrumbs: true
    },
    {
      id: 'providers',
      title: 'Providers',
      type: 'item',
      url: '/tba/providers',
      icon: icons.SafetyOutlined,
      breadcrumbs: true
    },
    {
      id: 'policies',
      title: 'Policies',
      type: 'item',
      url: '/tba/policies',
      icon: icons.FileProtectOutlined,
      breadcrumbs: true
    },
    {
      id: 'benefit-packages',
      title: 'Benefit Packages',
      type: 'item',
      url: '/tba/benefit-packages',
      icon: icons.GiftOutlined,
      breadcrumbs: true
    },
    {
      id: 'pre-authorizations',
      title: 'Pre-Authorizations',
      type: 'item',
      url: '/tba/pre-authorizations',
      icon: icons.SafetyCertificateOutlined,
      breadcrumbs: true
    },
    {
      id: 'claims',
      title: 'Claims',
      type: 'item',
      url: '/tba/claims',
      icon: icons.AuditOutlined,
      breadcrumbs: true
    },
    {
      id: 'invoices',
      title: 'Invoices',
      type: 'item',
      url: '/tba/invoices',
      icon: icons.FileTextOutlined,
      breadcrumbs: true
    },
    {
      id: 'visits',
      title: 'Visits',
      type: 'item',
      url: '/tba/visits',
      icon: icons.EyeOutlined,
      breadcrumbs: true
    },
    {
      id: 'provider-contracts',
      title: 'Provider Contracts',
      type: 'item',
      url: '/tba/provider-contracts',
      icon: icons.FileSearchOutlined,
      breadcrumbs: true
    },
    {
      id: 'medical-services',
      title: 'Medical Services',
      type: 'item',
      url: '/tba/medical-services',
      icon: icons.MedicineBoxOutlined,
      breadcrumbs: true
    },
    {
      id: 'medical-categories',
      title: 'Medical Categories',
      type: 'item',
      url: '/tba/medical-categories',
      icon: icons.AppstoreOutlined,
      breadcrumbs: true
    }
  ]
};

export default tbaManagement;
