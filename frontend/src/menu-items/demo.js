// assets
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import ProjectOutlined from '@ant-design/icons/ProjectOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import CustomerServiceOutlined from '@ant-design/icons/CustomerServiceOutlined';

// icons
const icons = {
  MessageOutlined,
  CalendarOutlined,
  ProjectOutlined,
  FileTextOutlined,
  UserOutlined,
  CustomerServiceOutlined
};

// ==============================|| MENU ITEMS - DEMO PAGES ||============================== //

const demo = {
  id: 'demo-pages',
  title: 'Demo Pages',
  type: 'group',
  children: [
    {
      id: 'chat-demo',
      title: 'Chat',
      type: 'item',
      url: '/apps/chat',
      icon: icons.MessageOutlined,
      breadcrumbs: false
    },
    {
      id: 'calendar-demo',
      title: 'Calendar',
      type: 'item',
      url: '/apps/calendar',
      icon: icons.CalendarOutlined
    },
    {
      id: 'kanban-demo',
      title: 'Kanban',
      type: 'item',
      url: '/apps/kanban/board',
      icon: icons.ProjectOutlined,
      breadcrumbs: false
    },
    {
      id: 'invoice-demo',
      title: 'Invoice',
      type: 'collapse',
      icon: icons.FileTextOutlined,
      children: [
        {
          id: 'invoice-dashboard',
          title: 'Dashboard',
          type: 'item',
          url: '/apps/invoice/dashboard',
          breadcrumbs: false
        },
        {
          id: 'invoice-create',
          title: 'Create',
          type: 'item',
          url: '/apps/invoice/create',
          breadcrumbs: false
        },
        {
          id: 'invoice-list',
          title: 'List',
          type: 'item',
          url: '/apps/invoice/list',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'profile-demo',
      title: 'Profile',
      type: 'collapse',
      icon: icons.UserOutlined,
      children: [
        {
          id: 'user-profile',
          title: 'User Profile',
          type: 'item',
          url: '/apps/profiles/user/personal',
          breadcrumbs: false
        },
        {
          id: 'account-profile',
          title: 'Account Profile',
          type: 'item',
          url: '/apps/profiles/account/basic',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'customer-demo',
      title: 'Customer',
      type: 'collapse',
      icon: icons.CustomerServiceOutlined,
      children: [
        {
          id: 'customer-list',
          title: 'List',
          type: 'item',
          url: '/apps/customer/customer-list'
        },
        {
          id: 'customer-card',
          title: 'Cards',
          type: 'item',
          url: '/apps/customer/customer-card'
        }
      ]
    }
  ]
};

export default demo;
