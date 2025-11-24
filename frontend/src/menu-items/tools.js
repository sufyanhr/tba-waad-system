// assets
import {
  MessageOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { NavActionType } from 'config';
import LinkOutlined from '@ant-design/icons/LinkOutlined';

const icons = {
  MessageOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SettingOutlined,
  LinkOutlined
};

// ==============================|| MENU ITEMS - TOOLS ||============================== //

const tools = {
  id: 'tools',
  title: 'Tools',
  type: 'group',
  children: [
    {
      id: 'chat',
      title: 'Chat',
      type: 'item',
      url: '/apps/chat',
      icon: icons.MessageOutlined,
      breadcrumbs: false
    },
    {
      id: 'calendar',
      title: 'Calendar',
      type: 'item',
      url: '/apps/calendar',
      icon: icons.CalendarOutlined,
      breadcrumbs: false,
      actions: [
        {
          type: NavActionType.LINK,
          label: 'Full Calendar',
          icon: icons.LinkOutlined,
          url: 'https://fullcalendar.io/docs/react',
          target: true
        }
      ]
    },
    {
      id: 'reports',
      title: 'Reports',
      type: 'item',
      url: '/tools/reports',
      icon: icons.FileTextOutlined,
      breadcrumbs: false
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      type: 'item',
      url: '/tools/settings/general',
      icon: icons.SettingOutlined,
      breadcrumbs: false
    }
  ]
};

export default tools;
