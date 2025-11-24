import MainCard from 'components/MainCard';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { FileTextOutlined } from '@ant-design/icons';

export default function ReportsPage() {
  return (
    <MainCard title="Reports">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <FileTextOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 16 }} />
        <Typography variant="h4" gutterBottom>
          Reports Module
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This module will provide comprehensive reporting capabilities for TBA operations.
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Features coming soon: Claims reports, Financial reports, Provider analytics, Member statistics
        </Typography>
      </Box>
    </MainCard>
  );
}
