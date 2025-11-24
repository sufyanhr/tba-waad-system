import MainCard from 'components/MainCard';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { SettingOutlined } from '@ant-design/icons';

export default function SystemSettingsPage() {
  return (
    <MainCard title="System Settings">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <SettingOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 16 }} />
        <Typography variant="h4" gutterBottom>
          System Settings
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Configure system-wide settings and preferences.
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Features coming soon: System configuration, User preferences, Integration settings, Notification rules
        </Typography>
      </Box>
    </MainCard>
  );
}
