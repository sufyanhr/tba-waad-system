import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import AnalyticsDataCard from 'components/cards/statistics/AnalyticsDataCard';

// assets
import TeamOutlined from '@ant-design/icons/TeamOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import SafetyOutlined from '@ant-design/icons/SafetyOutlined';
import ShopOutlined from '@ant-design/icons/ShopOutlined';

// hooks
import { useQuery } from '@tanstack/react-query';
import axios from 'utils/axios';

// ==============================|| TBA DASHBOARD - MANTIS STYLE ||============================== //

export default function TbaDashboard() {
  // Fetch dashboard stats from backend
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await axios.get('/dashboard/statistics');
      return response.data;
    },
    initialData: {
      totalMembers: 0,
      activeMembers: 0,
      totalClaims: 0,
      pendingClaims: 0,
      totalVisits: 0,
      monthlyVisits: 0,
      totalProviders: 0,
      activeProviders: 0,
      totalEmployers: 0,
      totalPolicies: 0
    }
  });

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Page Title */}
      <Grid item xs={12}>
        <Typography variant="h5">TBA Management Dashboard</Typography>
      </Grid>

      {/* Row 1: Main KPIs */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticsDataCard
          title="Total Members"
          count={stats?.totalMembers || '0'}
          percentage={stats?.membersGrowth || 0}
          isLoss={false}
          extra={`${stats?.activeMembers || 0} Active`}
        >
          <TeamOutlined style={{ fontSize: '2rem', color: '#1890ff' }} />
        </AnalyticsDataCard>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticsDataCard
          title="Total Claims"
          count={stats?.totalClaims || '0'}
          percentage={stats?.claimsGrowth || 0}
          isLoss={false}
          extra={`${stats?.pendingClaims || 0} Pending`}
          color="warning"
        >
          <FileTextOutlined style={{ fontSize: '2rem', color: '#fa8c16' }} />
        </AnalyticsDataCard>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticsDataCard
          title="Total Visits"
          count={stats?.totalVisits || '0'}
          percentage={stats?.visitsGrowth || 0}
          isLoss={false}
          extra={`${stats?.monthlyVisits || 0} This Month`}
          color="success"
        >
          <SafetyOutlined style={{ fontSize: '2rem', color: '#52c41a' }} />
        </AnalyticsDataCard>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticsDataCard
          title="Total Providers"
          count={stats?.totalProviders || '0'}
          percentage={stats?.providersGrowth || 0}
          isLoss={false}
          extra={`${stats?.activeProviders || 0} Active`}
          color="error"
        >
          <ShopOutlined style={{ fontSize: '2rem', color: '#f5222d' }} />
        </AnalyticsDataCard>
      </Grid>

      {/* Row 2: Charts Placeholder */}
      <Grid item xs={12} md={7} lg={8}>
        <MainCard>
          <Stack spacing={1.5}>
            <Typography variant="h6">Monthly Trends</Typography>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Chart component will be added in Phase 2
              </Typography>
            </Box>
          </Stack>
        </MainCard>
      </Grid>

      <Grid item xs={12} md={5} lg={4}>
        <MainCard>
          <Stack spacing={1.5}>
            <Typography variant="h6">Quick Stats</Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Total Employers</Typography>
                <Typography variant="h6">{stats?.totalEmployers || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Total Policies</Typography>
                <Typography variant="h6">{stats?.totalPolicies || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Pre-Authorizations</Typography>
                <Typography variant="h6">{stats?.totalPreAuths || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Active Contracts</Typography>
                <Typography variant="h6">{stats?.activeContracts || 0}</Typography>
              </Box>
            </Stack>
          </Stack>
        </MainCard>
      </Grid>

      {/* Row 3: Recent Activity Placeholder */}
      <Grid item xs={12}>
        <MainCard title="Recent Activity">
          <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Activity timeline will be added in Phase 2
            </Typography>
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
}
