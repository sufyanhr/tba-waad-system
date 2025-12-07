import { useState, useEffect, lazy, Suspense } from 'react';

// material-ui
import { Box, Grid, Typography, Skeleton } from '@mui/material';
import TeamOutlined from '@ant-design/icons/TeamOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import MedicineBoxOutlined from '@ant-design/icons/MedicineBoxOutlined';
import BankOutlined from '@ant-design/icons/BankOutlined';

// project imports
import ModernPageHeader from 'components/tba/ModernPageHeader';
import KpiCard from 'components/tba/dashboard/KpiCard';
import RecentMembers from 'components/tba/dashboard/RecentMembers';
import QuickActions from 'components/tba/dashboard/QuickActions';
import useCompanyUiVisibility from 'hooks/useCompanyUiVisibility';
import axios from 'utils/axios';

// Lazy load chart components for better performance
const Bar = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Bar })));
const Line = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Line })));

// Chart.js registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * ModernDashboard Component
 * Phase B3 + Phase B4 - Modern Clean SaaS Dashboard with UI Visibility
 * 
 * Features:
 * - 4 KPI Cards (Members, Claims, Visits, Employers) - Visibility configurable
 * - 2 Charts (Monthly Members Growth, Claims/Visits Trend)
 * - Recent Members List
 * - Quick Actions
 * 
 * Theme-aware, RTL-ready, Performance-optimized
 */
const ModernDashboard = () => {
  const [stats, setStats] = useState({
    membersCount: 0,
    claimsCount: 0,
    visitsCount: 0,
    employersCount: 0
  });
  const [loading, setLoading] = useState(true);
  
  // Phase B4: Get UI visibility settings
  const { uiVisibility, loading: visibilityLoading } = useCompanyUiVisibility();

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/dashboard/stats');
        setStats(response.data || {
          membersCount: 0,
          claimsCount: 0,
          visitsCount: 0,
          employersCount: 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Demo data for charts
  const monthlyMembersData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    datasets: [
      {
        label: 'عدد الأعضاء المضافين',
        data: [65, 78, 90, 105, 115, 130, 145, 160, 175, 190, 205, 220],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  };

  const claimsVisitsTrendData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    datasets: [
      {
        label: 'المطالبات',
        data: [30, 45, 55, 60, 70, 80, 85, 95, 100, 110, 120, 130],
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderWidth: 3,
        tension: 0.4,
        fill: true
      },
      {
        label: 'الزيارات',
        data: [50, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 165],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 3,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          font: { size: 12 },
          usePointStyle: true,
          padding: 15
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          font: { size: 12 },
          usePointStyle: true,
          padding: 15
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  };

  // KPI sparkline data
  const membersSparkline = [65, 78, 90, 105, 115, 130, 145, 160, 175, 190, 205, 220];
  const claimsSparkline = [30, 45, 55, 60, 70, 80, 85, 95, 100, 110, 120, 130];
  const visitsSparkline = [50, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 165];
  const employersSparkline = [10, 12, 15, 18, 22, 25, 28, 32, 35, 38, 42, 45];

  return (
    <Box>
      {/* Page Header */}
      <ModernPageHeader
        title="لوحة التحكم"
        subtitle="نظرة عامة على النظام والإحصائيات الرئيسية"
      />

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Members KPI - Conditional based on UI visibility */}
        {uiVisibility.dashboard?.showMembersKpi && (
          <Grid item xs={12} sm={6} md={3}>
            {loading ? (
              <Skeleton variant="rounded" height={180} />
            ) : (
              <KpiCard
                title="عدد الأعضاء"
                value={stats.membersCount}
                icon={TeamOutlined}
                color="primary"
                sparklineData={membersSparkline}
              />
            )}
          </Grid>
        )}
        
        {/* Claims KPI - Conditional based on UI visibility */}
        {uiVisibility.dashboard?.showClaimsKpi && (
          <Grid item xs={12} sm={6} md={3}>
            {loading ? (
              <Skeleton variant="rounded" height={180} />
            ) : (
              <KpiCard
                title="عدد المطالبات"
                value={stats.claimsCount}
                icon={FileTextOutlined}
                color="warning"
                sparklineData={claimsSparkline}
              />
            )}
          </Grid>
        )}
        
        {/* Visits KPI - Conditional based on UI visibility */}
        {uiVisibility.dashboard?.showVisitsKpi && (
          <Grid item xs={12} sm={6} md={3}>
            {loading ? (
              <Skeleton variant="rounded" height={180} />
            ) : (
              <KpiCard
                title="عدد الزيارات"
                value={stats.visitsCount}
                icon={MedicineBoxOutlined}
                color="success"
                sparklineData={visitsSparkline}
              />
            )}
          </Grid>
        )}
        
        {/* Employers KPI - Always visible (not configurable) */}
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rounded" height={180} />
          ) : (
            <KpiCard
              title="عدد أصحاب العمل"
              value={stats.employersCount}
              icon={BankOutlined}
              color="error"
              sparklineData={employersSparkline}
            />
          )}
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              p: 3,
              boxShadow: 1,
              height: 400
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              نمو الأعضاء الشهري
            </Typography>
            <Box sx={{ height: 320 }}>
              <Suspense fallback={<Skeleton variant="rectangular" height={320} />}>
                <Bar data={monthlyMembersData} options={barChartOptions} />
              </Suspense>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              p: 3,
              boxShadow: 1,
              height: 400
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              اتجاه المطالبات والزيارات
            </Typography>
            <Box sx={{ height: 320 }}>
              <Suspense fallback={<Skeleton variant="rectangular" height={320} />}>
                <Line data={claimsVisitsTrendData} options={lineChartOptions} />
              </Suspense>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Recent Members */}
      <Box sx={{ mb: 3 }}>
        <RecentMembers />
      </Box>

      {/* Quick Actions */}
      <Box>
        <QuickActions />
      </Box>
    </Box>
  );
};

export default ModernDashboard;

