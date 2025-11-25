import { FileTextOutlined, UserOutlined, TeamOutlined, SafetyOutlined, AuditOutlined, MedicineBoxOutlined } from '@ant-design/icons';

const icons = {
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  AuditOutlined,
  MedicineBoxOutlined
};

const tba = {
  id: 'tba',
  title: 'TBA System',
  type: 'group',
  children: [
    {
      id: 'claims',
      title: 'Claims',
      type: 'item',
      url: '/tba/claims',
      icon: icons.FileTextOutlined,
      breadcrumbs: false,
      requiredPermissions: ['READ_CLAIM']
    },
    {
      id: 'members',
      title: 'Members',
      type: 'item',
      url: '/tba/members',
      icon: icons.UserOutlined,
      breadcrumbs: false,
      requiredPermissions: ['MANAGE_MEMBERS']
    },
    {
      id: 'employers',
      title: 'Employers',
      type: 'item',
      url: '/tba/employers',
      icon: icons.TeamOutlined,
      breadcrumbs: false,
      requiredPermissions: ['MANAGE_EMPLOYERS']
    },
    {
      id: 'insurance-companies',
      title: 'Insurance Companies',
      type: 'item',
      url: '/tba/insurance-companies',
      icon: icons.SafetyOutlined,
      breadcrumbs: false,
      requiredPermissions: ['READ_INSURANCE']
    },
    {
      id: 'reviewer-companies',
      title: 'Reviewer Companies',
      type: 'item',
      url: '/tba/reviewer-companies',
      icon: icons.AuditOutlined,
      breadcrumbs: false,
      requiredPermissions: ['READ_REVIEWER']
    },
    {
      id: 'visits',
      title: 'Visits',
      type: 'item',
      url: '/tba/visits',
      icon: icons.MedicineBoxOutlined,
      breadcrumbs: false,
      requiredPermissions: ['READ_VISIT']
    }
  ]
};

export default tba;
