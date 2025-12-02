import { Button } from '@mui/material';
import { Settings, Add } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import { ModernPageHeader, ModernEmptyState } from 'components/tba';

/**
 * Settings Page
 * Manage system and company settings
 */
const SettingsPage = () => {
  return (
    <>
      <ModernPageHeader
        title="الإعدادات"
        subtitle="إدارة إعدادات النظام والشركة"
        icon={Settings}
        breadcrumbs={[
          { label: 'الإعدادات' }
        ]}
        actions={
          <Button
            variant="contained"
            startIcon={<Add />}
            disabled
          >
            إضافة إعداد
          </Button>
        }
      />

      <MainCard>
        <ModernEmptyState
          title="صفحة الإعدادات قيد التطوير"
          description="سيتم إضافة إعدادات النظام والشركة قريباً"
          height={300}
        />
      </MainCard>
    </>
  );
};

export default SettingsPage;
