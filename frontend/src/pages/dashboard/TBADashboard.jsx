import { Grid, Typography, Paper, Box, CircularProgress } from '@mui/material';
import {
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  AuditOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import httpClient from 'api/httpClient';

// ==============================|| TBA DASHBOARD ||============================== //

const TBADashboard = () => {
  // Fetch dashboard summary from API
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => httpClient.get('/dashboard/summary'),
    staleTime: 60000, // 1 minute
    retry: 2
  });

  // Default values while loading or if API fails
  const stats = {
    totalClaims: dashboardData?.totalClaims || 0,
    totalMembers: dashboardData?.totalMembers || 0,
    totalVisits: dashboardData?.totalVisits || 0,
    totalEmployers: dashboardData?.totalEmployers || 0,
    totalInsuranceCompanies: dashboardData?.totalInsuranceCompanies || 0,
    totalReviewerCompanies: dashboardData?.totalReviewerCompanies || 0
  };

  const cards = [
    {
      title: 'Total Claims',
      value: stats.totalClaims,
      icon: <FileTextOutlined style={{ fontSize: 40, color: '#1890ff' }} />,
      color: '#e6f7ff'
    },
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: <UserOutlined style={{ fontSize: 40, color: '#52c41a' }} />,
      color: '#f6ffed'
    },
    {
      title: 'Total Visits',
      value: stats.totalVisits,
      icon: <MedicineBoxOutlined style={{ fontSize: 40, color: '#722ed1' }} />,
      color: '#f9f0ff'
    },
    {
      title: 'Total Employers',
      value: stats.totalEmployers,
      icon: <TeamOutlined style={{ fontSize: 40, color: '#fa8c16' }} />,
      color: '#fff7e6'
    },
    {
      title: 'Insurance Companies',
      value: stats.totalInsuranceCompanies,
      icon: <SafetyOutlined style={{ fontSize: 40, color: '#eb2f96' }} />,
      color: '#fff0f6'
    },
    {
      title: 'Reviewer Companies',
      value: stats.totalReviewerCompanies,
      icon: <AuditOutlined style={{ fontSize: 40, color: '#13c2c2' }} />,
      color: '#e6fffb'
    }
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={400}>
        <Typography color="error" variant="h6" gutterBottom>
          Error loading dashboard data
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {error.message}
        </Typography>
      </Box>
    );
  }

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
