// project imports
import rbac from './rbac';

// Lightweight inline icon component to avoid external icon dependency
const BusinessIcon = () => {
  // eslint-disable-next-line react/display-name
  return () => <span style={{ fontSize: 18, lineHeight: '18px' }}>🏢</span>;
};

// ==============================|| MENU ITEMS ||============================== //

const dashboard = { id: 'group-dashboard', title: 'Dashboard', type: 'group', children: [ { id: 'dashboard-default', title: 'Overview', type: 'item', url: '/dashboard/default', permissions: ['dashboard.view'] } ] };
const claims = { id: 'group-claims', title: 'Claims', type: 'group', children: [ { id: 'claims', title: 'Claims', type: 'item', url: '/claims', permissions: ['claim.view'] } ] };
const members = { id: 'group-members', title: 'Members', type: 'group', children: [ { id: 'members', title: 'Members', type: 'item', url: '/members', permissions: ['member.view'] } ] };
const employers = { id: 'group-employers', title: 'Employers', type: 'group', children: [ { id: 'employers', title: 'Employers', type: 'item', url: '/employers', permissions: ['employer.view'], icon: BusinessIcon() } ] };
const insurance = { id: 'group-insurance', title: 'Insurance Companies', type: 'group', children: [ { id: 'insurance-companies', title: 'Insurance Companies', type: 'item', url: '/insurance-companies', permissions: ['insurance.view'] } ] };
const reviewers = { id: 'group-reviewers', title: 'Reviewer Companies', type: 'group', children: [ { id: 'reviewer-companies', title: 'Reviewer Companies', type: 'item', url: '/reviewer-companies', permissions: ['reviewer.view'] } ] };
const visits = { id: 'group-visits', title: 'Visits', type: 'group', children: [ { id: 'visits', title: 'Visits', type: 'item', url: '/visits', permissions: ['visit.view'] } ] };
const systemTools = { id: 'group-system', title: 'System Tools', type: 'group', children: [ { id: 'system-tools', title: 'Tools', type: 'item', url: '/admin/system/tools', permissions: ['system.manage'] } ] };

const menuItems = { items: [dashboard, claims, members, employers, insurance, reviewers, visits, rbac, systemTools] };
export default menuItems;
