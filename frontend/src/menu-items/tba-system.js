// assets
import {
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  AuditOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  AuditOutlined,
  MedicineBoxOutlined
};

// ==============================|| MENU ITEMS - TBA SYSTEM ||============================== //

const tbaSystem = {
  id: 'tba-system',
  title: 'TBA System',
  type: 'group',
  children: [
    {
      id: 'tba-claims',
      title: 'Claims',
      type: 'item',
      url: '/tba/claims',
      icon: icons.FileTextOutlined,
      breadcrumbs: false
    },
    {
      id: 'tba-members',
      title: 'Members',
      type: 'item',
      url: '/tba/members',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'tba-employers',
      title: 'Employers',
      type: 'item',
      url: '/tba/employers',
      icon: icons.TeamOutlined,
      breadcrumbs: false
    },
    {
      id: 'tba-insurance',
      title: 'Insurance Companies',
      type: 'item',
      url: '/tba/insurance-companies',
      icon: icons.SafetyOutlined,
      breadcrumbs: false
    },
    {
      id: 'tba-reviewers',
      title: 'Reviewer Companies',
      type: 'item',
      url: '/tba/reviewer-companies',
      icon: icons.AuditOutlined,
      breadcrumbs: false
    },
    {
      id: 'tba-visits',
      title: 'Visits',
      type: 'item',
      url: '/tba/visits',
      icon: icons.MedicineBoxOutlined,
      breadcrumbs: false
    }
  ]
};

export default tbaSystem;
