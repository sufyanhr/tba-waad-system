import { Grid, Typography, Paper, Box } from '@mui/material';
import {
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  AuditOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';

// ==============================|| TBA DASHBOARD ||============================== //

const TBADashboard = () => {
  // Static JSON data (will be replaced with API in Phase F)
  const dashboardData = {
    totalClaims: 1247,
    totalMembers: 3456,
    totalVisits: 892,
    totalEmployers: 156,
    totalInsuranceCompanies: 23,
    totalReviewerCompanies: 12
  };

  const cards = [
    {
      title: 'Total Claims',
      value: dashboardData.totalClaims,
      icon: <FileTextOutlined style={{ fontSize: 40, color: '#1890ff' }} />,
      color: '#e6f7ff'
    },
    {
      title: 'Total Members',
      value: dashboardData.totalMembers,
      icon: <UserOutlined style={{ fontSize: 40, color: '#52c41a' }} />,
      color: '#f6ffed'
    },
    {
      title: 'Total Visits',
      value: dashboardData.totalVisits,
      icon: <MedicineBoxOutlined style={{ fontSize: 40, color: '#722ed1' }} />,
      color: '#f9f0ff'
    },
    {
      title: 'Total Employers',
      value: dashboardData.totalEmployers,
      icon: <TeamOutlined style={{ fontSize: 40, color: '#fa8c16' }} />,
      color: '#fff7e6'
    },
    {
      title: 'Insurance Companies',
      value: dashboardData.totalInsuranceCompanies,
      icon: <SafetyOutlined style={{ fontSize: 40, color: '#eb2f96' }} />,
      color: '#fff0f6'
    },
    {
      title: 'Reviewer Companies',
      value: dashboardData.totalReviewerCompanies,
      icon: <AuditOutlined style={{ fontSize: 40, color: '#13c2c2' }} />,
      color: '#e6fffb'
    }
  ];

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom>
          TBA WAAD Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Third Party Administrator - Healthcare Management System
        </Typography>
      </Grid>

      {/* Statistics Cards */}
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              backgroundColor: card.color,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 600 }}>
                  {card.value.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ mt: 1 }}>{card.icon}</Box>
            </Box>
          </Paper>
        </Grid>
      ))}

      {/* Quick Actions */}
      <Grid item xs={12}>
        <Paper elevation={1} sx={{ p: 3, mt: 2 }}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Navigate to the menu on the left to manage Claims, Members, Employers, Insurance Companies, Reviewer Companies, and Visits.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TBADashboard;
