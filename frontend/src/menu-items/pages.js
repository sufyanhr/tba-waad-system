// assets
import LoginOutlined from '@ant-design/icons/LoginOutlined';
import RocketOutlined from '@ant-design/icons/RocketOutlined';

// icons
const icons = { LoginOutlined, RocketOutlined };

// ==============================|| MENU ITEMS - PAGES ||============================== //

const pages = {
  id: 'group-pages',
  title: 'pages',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'authentication',
      type: 'collapse',
      icon: icons.LoginOutlined,
      children: [
        {
          id: 'login',
          title: 'login',
          type: 'item',
          url: '/auth/login',
          target: true
        },
        {
          id: 'register',
          title: 'register',
          type: 'item',
          url: '/auth/register',
          target: true
        },
        {
          id: 'forgot-password',
          title: 'forgot-password',
          type: 'item',
          url: '/auth/forgot-password',
          target: true
        },
        {
          id: 'reset-password',
          title: 'reset-password',
          type: 'item',
          url: '/auth/reset-password',
          target: true
        },
        {
          id: 'check-mail',
          title: 'check-mail',
          type: 'item',
          url: '/auth/check-mail',
          target: true
        },
        {
          id: 'code-verification',
          title: 'code-verification',
          type: 'item',
          url: '/auth/code-verification',
          target: true
        }
      ]
    },
    {
      id: 'maintenance',
      title: 'maintenance',
      type: 'collapse',
      icon: icons.RocketOutlined,
      isDropdown: true,
      children: [
        {
          id: 'error-404',
          title: 'error-404',
          type: 'item',
          url: '/maintenance/404',
          target: true
        },
        {
          id: 'error-500',
          title: 'error-500',
          type: 'item',
          url: '/maintenance/500',
          target: true
        }
      ]
    }
  ]
};

export default pages;
