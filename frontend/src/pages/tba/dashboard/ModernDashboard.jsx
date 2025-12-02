import { useState, useEffect } from 'react';
import { Grid, Button, Stack, Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { 
  People, 
  Business, 
  Receipt, 
  LocalHospital,
  Add,
  ArrowForward,
  TrendingUp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';
import { ModernPageHeader, ModernStatCard, ModernQuickActions, ModernEmptyState } from 'components/tba';

/**
 * Modern Clean TBA Dashboard
 * Phase B1 - Clean, minimal, and professional design
 */
const ModernDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Mock statistics data
  const stats = {
    totalMembers: 1245,
    totalEmployers: 48,
    totalClaims: 892,
    totalVisits: 2341
  };

  // Quick actions
  const quickActions = [
    {
      title: 'إضافة عضو جديد',
      description: 'تسجيل عضو جديد في النظام',
      icon: People,
      color: 'primary',
      path: '/tba/members/create'
    },
    {
      title: 'إضافة صاحب عمل',
      description: 'تسجيل صاحب عمل جديد',
      icon: Business,
      color: 'secondary',
      path: '/tba/employers/create'
    },
    {
      title: 'تسجيل مطالبة',
      description: 'إدخال مطالبة جديدة',
      icon: Receipt,
      color: 'info',
      path: '/tba/claims'
    },
    {
      title: 'تسجيل زيارة',
      description: 'إدخال زيارة طبية',
      icon: LocalHospital,
      color: 'success',
      path: '/tba/visits'
    }
  ];

  // Recent claims mock data
  const recentClaims = [];

  // Recent members mock data
  const recentMembers = [];

  return (
    <>
      {/* Page Header */}
      <ModernPageHeader
        title="لوحة التحكم"
        subtitle="نظرة عامة على البيانات والإحصائيات"
        breadcrumbs={[{ label: 'لوحة التحكم' }]}
        statusChip={{
          label: 'نشط',
          color: 'success'
        }}
      />

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <ModernStatCard
            title="إجمالي الأعضاء"
            value={stats.totalMembers.toLocaleString('ar')}
            icon={People}
            color="primary"
            trend={8.2}
            trendValue="+8.2%"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <ModernStatCard
            title="أصحاب العمل"
            value={stats.totalEmployers.toLocaleString('ar')}
            icon={Business}
            color="secondary"
            trend={3.5}
            trendValue="+3.5%"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <ModernStatCard
            title="المطالبات"
            value={stats.totalClaims.toLocaleString('ar')}
            icon={Receipt}
            color="warning"
            trend={12.8}
            trendValue="+12.8%"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <ModernStatCard
            title="الزيارات"
            value={stats.totalVisits.toLocaleString('ar')}
            icon={LocalHospital}
            color="success"
            trend={15.3}
            trendValue="+15.3%"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          الإجراءات السريعة
        </Typography>
        <ModernQuickActions actions={quickActions} />
      </Box>

      {/* Recent Data Tables */}
      <Grid container spacing={3}>
        {/* Recent Claims */}
        <Grid item xs={12} lg={6}>
          <MainCard
            title="المطالبات الأخيرة"
            secondary={
              <Button
                size="small"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/tba/claims')}
              >
                عرض الكل
              </Button>
            }
          >
            {recentClaims.length === 0 ? (
              <ModernEmptyState
                title="لا توجد مطالبات حديثة"
                description="سيتم عرض المطالبات الأخيرة هنا"
                height={250}
              />
            ) : (
              <Box>
                {/* Table will go here when data is available */}
              </Box>
            )}
          </MainCard>
        </Grid>

        {/* Recent Members */}
        <Grid item xs={12} lg={6}>
          <MainCard
            title="الأعضاء الجدد"
            secondary={
              <Button
                size="small"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/tba/members')}
              >
                عرض الكل
              </Button>
            }
          >
            {recentMembers.length === 0 ? (
              <ModernEmptyState
                title="لا يوجد أعضاء جدد"
                description="سيتم عرض الأعضاء الجدد هنا"
                height={250}
              />
            ) : (
              <Box>
                {/* Table will go here when data is available */}
              </Box>
            )}
          </MainCard>
        </Grid>
      </Grid>

      {/* Performance Insights Card */}
      <Grid container spacing={3} sx={{ mt: 0 }}>
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'primary.lighter' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    color: 'white'
                  }}
                >
                  <TrendingUp sx={{ fontSize: '2rem' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                    أداء النظام ممتاز
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    جميع الوحدات تعمل بشكل طبيعي. آخر تحديث: قبل 5 دقائق
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip label="نشط" color="success" size="small" />
                  <Chip label="متزامن" color="primary" size="small" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ModernDashboard;
