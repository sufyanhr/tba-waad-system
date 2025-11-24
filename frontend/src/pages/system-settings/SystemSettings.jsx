import { useEffect, useState } from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';

// material-ui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import RBACGuard from 'components/tba/RBACGuard';
import { APP_DEFAULT_PATH } from 'config';

// assets
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import BankOutlined from '@ant-design/icons/BankOutlined';
import BellOutlined from '@ant-design/icons/BellOutlined';
import ApiOutlined from '@ant-design/icons/ApiOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';

// ==============================|| SYSTEM SETTINGS ||============================== //

export default function SystemSettings() {
  const { pathname } = useLocation();

  let selectedTab = 0;
  let breadcrumbTitle = '';
  let breadcrumbHeading = '';

  switch (pathname) {
    case '/tools/settings/company-info':
      breadcrumbTitle = 'company-info';
      breadcrumbHeading = 'Company Information';
      selectedTab = 1;
      break;
    case '/tools/settings/notifications':
      breadcrumbTitle = 'notifications';
      breadcrumbHeading = 'Notifications';
      selectedTab = 2;
      break;
    case '/tools/settings/integrations':
      breadcrumbTitle = 'integrations';
      breadcrumbHeading = 'Integrations';
      selectedTab = 3;
      break;
    case '/tools/settings/security':
      breadcrumbTitle = 'security';
      breadcrumbHeading = 'Security';
      selectedTab = 4;
      break;
    case '/tools/settings/audit-log':
      breadcrumbTitle = 'audit-log';
      breadcrumbHeading = 'Audit Log';
      selectedTab = 5;
      break;
    case '/tools/settings/general':
    default:
      breadcrumbTitle = 'general';
      breadcrumbHeading = 'General Settings';
      selectedTab = 0;
  }

  const [value, setValue] = useState(selectedTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let breadcrumbLinks = [
    { title: 'home', to: APP_DEFAULT_PATH },
    { title: 'System Settings', to: '/tools/settings/general' },
    { title: breadcrumbTitle }
  ];

  if (selectedTab === 0) {
    breadcrumbLinks = [{ title: 'home', to: APP_DEFAULT_PATH }, { title: 'System Settings' }];
  }

  useEffect(() => {
    if (pathname === '/tools/settings/general') {
      setValue(0);
    }
  }, [pathname]);

  return (
    <RBACGuard requiredPermissions={['MANAGE_SYSTEM_SETTINGS']}>
      <Breadcrumbs custom heading={breadcrumbHeading} links={breadcrumbLinks} />
      <MainCard border={false} boxShadow>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="system settings tab">
            <Tab label="General" component={Link} to="/tools/settings/general" icon={<SettingOutlined />} iconPosition="start" />
            <Tab label="Company Info" component={Link} to="/tools/settings/company-info" icon={<BankOutlined />} iconPosition="start" />
            <Tab label="Notifications" component={Link} to="/tools/settings/notifications" icon={<BellOutlined />} iconPosition="start" />
            <Tab label="Integrations" component={Link} to="/tools/settings/integrations" icon={<ApiOutlined />} iconPosition="start" />
            <Tab label="Security" component={Link} to="/tools/settings/security" icon={<LockOutlined />} iconPosition="start" />
            <Tab label="Audit Log" component={Link} to="/tools/settings/audit-log" icon={<FileTextOutlined />} iconPosition="start" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2.5 }}>
          <Outlet />
        </Box>
      </MainCard>
    </RBACGuard>
  );
}
