import { useState, useEffect, useCallback } from 'react';
import { Grid, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, Chip, Alert } from '@mui/material';
import {
  Refresh as RefreshIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  LocalHospital as ProviderIcon,
  Description as PolicyIcon,
  RequestPage as ClaimIcon,
  CheckCircle as ApprovalIcon,
  Event as VisitIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import MainCard from 'components/MainCard';
import RBACGuard from 'components/guards/RBACGuard';
import dashboardService from 'services/dashboard.service';
import KPIStatCard from './KPIStatCard';
import TrendChart from './TrendChart';
import PieChart from './PieChart';
import BarChart from './BarChart';
import MiniTable from './MiniTable';
import { EMPLOYERS } from 'constants/companies';

/**
 * Dashboard & Analytics Page
 * Displays KPIs, trends, and analytics from all modules
 */
const Dashboard = () => {
  const { enqueueSnackbar } = useSnackbar();

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30'); // 30, 90, 365 days
  const [employerFilter, setEmployerFilter] = useState('all');

  // KPIs State
  const [kpis, setKpis] = useState({
    totalMembers: 0,
    totalEmployers: 0,
    totalProviders: 0,
    activePolicies: 0,
    pendingClaims: 0,
    pendingPreAuths: 0,
    monthlyVisits: 0,
    claimsPaidThisMonth: 0,
    preauthApprovalRate: 0,
    averageClaimCost: 0
  });

  // Charts State
  const [claimsTrend, setClaimsTrend] = useState({ categories: [], series: [] });
  const [preauthTrend, setPreauthTrend] = useState({ categories: [], series: [] });
  const [visitsTrend, setVisitsTrend] = useState({ categories: [], series: [] });
  const [membersTrend, setMembersTrend] = useState({ categories: [], series: [] });
  const [preauthByStatus, setPreauthByStatus] = useState({ labels: [], series: [] });
  const [claimsByEmployer, setClaimsByEmployer] = useState({ categories: [], series: [] });
  const [claimsByProvider, setClaimsByProvider] = useState({ categories: [], series: [] });
  const [servicesUsage, setServicesUsage] = useState({ labels: [], series: [] });

  // Mini Tables State
  const [latestClaims, setLatestClaims] = useState([]);
  const [latestPreauth, setLatestPreauth] = useState([]);
  const [latestVisits, setLatestVisits] = useState([]);

  // Load all dashboard data
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Load KPIs
      const kpisResponse = await dashboardService.getKPIs();
      if (kpisResponse.success && kpisResponse.data) {
        setKpis(kpisResponse.data);
      }

      // Load Claims Trend
      const claimsTrendResponse = await dashboardService.getClaimsTrend();
      if (claimsTrendResponse.success && claimsTrendResponse.data) {
        setClaimsTrend({
          categories: claimsTrendResponse.data.categories || [],
          series: claimsTrendResponse.data.series || []
        });
      }

      // Load PreAuth Trend
      const preauthTrendResponse = await dashboardService.getPreauthTrend();
      if (preauthTrendResponse.success && preauthTrendResponse.data) {
        setPreauthTrend({
          categories: preauthTrendResponse.data.categories || [],
          series: preauthTrendResponse.data.series || []
        });
      }

      // Load Visits Trend
      const visitsTrendResponse = await dashboardService.getVisitsTrend();
      if (visitsTrendResponse.success && visitsTrendResponse.data) {
        setVisitsTrend({
          categories: visitsTrendResponse.data.categories || [],
          series: visitsTrendResponse.data.series || []
        });
      }

      // Load Members Trend
      const membersTrendResponse = await dashboardService.getMembersTrend();
      if (membersTrendResponse.success && membersTrendResponse.data) {
        setMembersTrend({
          categories: membersTrendResponse.data.categories || [],
          series: membersTrendResponse.data.series || []
        });
      }

      // Load PreAuth By Status
      const preauthStatusResponse = await dashboardService.getPreauthByStatus();
      if (preauthStatusResponse.success && preauthStatusResponse.data) {
        setPreauthByStatus({
          labels: preauthStatusResponse.data.labels || [],
          series: preauthStatusResponse.data.series || []
        });
      }

      // Load Claims By Employer
      const claimsEmployerResponse = await dashboardService.getClaimsByEmployer();
      if (claimsEmployerResponse.success && claimsEmployerResponse.data) {
        setClaimsByEmployer({
          categories: claimsEmployerResponse.data.categories || [],
          series: claimsEmployerResponse.data.series || []
        });
      }

      // Load Claims By Provider
      const claimsProviderResponse = await dashboardService.getClaimsByProvider();
      if (claimsProviderResponse.success && claimsProviderResponse.data) {
        setClaimsByProvider({
          categories: claimsProviderResponse.data.categories || [],
          series: claimsProviderResponse.data.series || []
        });
      }

      // Load Services Usage
      try {
        const servicesResponse = await dashboardService.getServicesUsage();
        if (servicesResponse.success && servicesResponse.data) {
          setServicesUsage({
            labels: servicesResponse.data.labels || [],
            series: servicesResponse.data.series || []
          });
        }
      } catch {
        console.log('Services usage not available');
      }

      // Load Latest Claims
      const latestClaimsResponse = await dashboardService.getLatestClaims();
      if (latestClaimsResponse.success && latestClaimsResponse.data) {
        setLatestClaims(Array.isArray(latestClaimsResponse.data) ? latestClaimsResponse.data : []);
      }

      // Load Latest PreAuth
      const latestPreauthResponse = await dashboardService.getLatestPreauth();
      if (latestPreauthResponse.success && latestPreauthResponse.data) {
        setLatestPreauth(Array.isArray(latestPreauthResponse.data) ? latestPreauthResponse.data : []);
      }

      // Load Latest Visits
      const latestVisitsResponse = await dashboardService.getLatestVisits();
      if (latestVisitsResponse.success && latestVisitsResponse.data) {
        setLatestVisits(Array.isArray(latestVisitsResponse.data) ? latestVisitsResponse.data : []);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError(err.message || 'Failed to load dashboard data');
      setLoading(false);
      enqueueSnackbar('Failed to load dashboard data', { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  // Load data on mount
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle refresh
  const handleRefresh = () => {
    loadDashboardData();
    enqueueSnackbar('Dashboard refreshed', { variant: 'success' });
  };

  // Mini table columns
  const claimsColumns = [
    { id: 'claimId', label: 'Claim ID', align: 'left' },
    { id: 'memberName', label: 'Member', align: 'left' },
    { id: 'serviceName', label: 'Service', align: 'left' },
    {
      id: 'status',
      label: 'Status',
      align: 'center',
      render: (value) => {
        const colors = {
          PENDING: 'warning',
          APPROVED: 'success',
          REJECTED: 'error',
          PROCESSING: 'info'
        };
        return <Chip label={value} color={colors[value] || 'default'} size="small" />;
      }
    },
    {
      id: 'amountLyd',
      label: 'Amount',
      align: 'right',
      render: (value) => `${value?.toFixed(2) || '0.00'} LYD`
    }
  ];

  const preauthColumns = [
    { id: 'preauthId', label: 'PreAuth ID', align: 'left' },
    { id: 'memberName', label: 'Member', align: 'left' },
    { id: 'serviceName', label: 'Service', align: 'left' },
    {
      id: 'status',
      label: 'Status',
      align: 'center',
      render: (value) => {
        const colors = {
          PENDING: 'warning',
          APPROVED: 'success',
          REJECTED: 'error',
          EXPIRED: 'error'
        };
        return <Chip label={value} color={colors[value] || 'default'} size="small" />;
      }
    },
    {
      id: 'requestDate',
      label: 'Date',
      align: 'right',
      render: (value) => (value ? new Date(value).toLocaleDateString() : '-')
    }
  ];

  const visitsColumns = [
    { id: 'visitId', label: 'Visit ID', align: 'left' },
    { id: 'memberName', label: 'Member', align: 'left' },
    { id: 'providerName', label: 'Provider', align: 'left' },
    { id: 'visitType', label: 'Type', align: 'left' },
    {
      id: 'status',
      label: 'Status',
      align: 'center',
      render: (value) => {
        const colors = {
          SCHEDULED: 'info',
          IN_PROGRESS: 'warning',
          COMPLETED: 'success',
          CANCELLED: 'error'
        };
        return <Chip label={value} color={colors[value] || 'default'} size="small" />;
      }
    }
  ];

  // Error state
  if (error && !loading) {
    return (
      <RBACGuard requiredPermissions={['DASHBOARD_READ']}>
        <MainCard>
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </MainCard>
      </RBACGuard>
    );
  }

  return (
    <RBACGuard requiredPermissions={['DASHBOARD_READ']}>
      <MainCard
        title="Dashboard & Analytics"
        secondary={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Date Range</InputLabel>
              <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)} label="Date Range">
                <MenuItem value="30">Last 30 Days</MenuItem>
                <MenuItem value="90">Last 90 Days</MenuItem>
                <MenuItem value="365">Last 12 Months</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Employer</InputLabel>
              <Select value={employerFilter} onChange={(e) => setEmployerFilter(e.target.value)} label="Employer">
                <MenuItem value="all">All Employers</MenuItem>
                {EMPLOYERS.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.nameEn}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh} disabled={loading}>
              Refresh
            </Button>
          </Box>
        }
      >
        {/* KPI Cards Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Key Performance Indicators
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <KPIStatCard
                title="Total Members"
                value={kpis.totalMembers}
                subtitle="Active members"
                icon={<PeopleIcon />}
                color="primary"
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPIStatCard
                title="Total Employers"
                value={kpis.totalEmployers}
                subtitle="Registered employers"
                icon={<BusinessIcon />}
                color="secondary"
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPIStatCard
                title="Total Providers"
                value={kpis.totalProviders}
                subtitle="Healthcare providers"
                icon={<ProviderIcon />}
                color="info"
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPIStatCard
                title="Active Policies"
                value={kpis.activePolicies}
                subtitle="Current policies"
                icon={<PolicyIcon />}
                color="success"
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPIStatCard
                title="Pending Claims"
                value={kpis.pendingClaims}
                subtitle="Awaiting approval"
                icon={<ClaimIcon />}
                color="warning"
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPIStatCard
                title="Pending PreAuths"
                value={kpis.pendingPreAuths}
                subtitle="Awaiting approval"
                icon={<ApprovalIcon />}
                color="warning"
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPIStatCard
                title="Monthly Visits"
                value={kpis.monthlyVisits}
                subtitle="This month"
                icon={<VisitIcon />}
                color="info"
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPIStatCard
                title="Claims Paid"
                value={kpis.claimsPaidThisMonth}
                subtitle="This month (LYD)"
                icon={<MoneyIcon />}
                color="success"
                loading={loading}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Trend Charts Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Trends & Analytics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              <TrendChart
                title="Claims Trend (12 Months)"
                categories={claimsTrend.categories}
                series={claimsTrend.series}
                height={300}
                loading={loading}
                type="area"
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TrendChart
                title="Pre-Authorizations Trend (12 Months)"
                categories={preauthTrend.categories}
                series={preauthTrend.series}
                height={300}
                loading={loading}
                type="area"
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TrendChart
                title="Visits Trend (12 Months)"
                categories={visitsTrend.categories}
                series={visitsTrend.series}
                height={300}
                loading={loading}
                type="area"
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TrendChart
                title="Members Growth (12 Months)"
                categories={membersTrend.categories}
                series={membersTrend.series}
                height={300}
                loading={loading}
                type="area"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Distribution Charts Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Distribution Analytics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <PieChart
                title="Pre-Authorizations by Status"
                labels={preauthByStatus.labels}
                series={preauthByStatus.series}
                height={300}
                loading={loading}
                type="donut"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <PieChart
                title="Services Consumption by Category"
                labels={servicesUsage.labels}
                series={servicesUsage.series}
                height={300}
                loading={loading}
                type="donut"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <BarChart
                title="Claims by Employer"
                categories={claimsByEmployer.categories}
                series={claimsByEmployer.series}
                height={300}
                loading={loading}
                horizontal={false}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <BarChart
                title="Claims by Provider"
                categories={claimsByProvider.categories}
                series={claimsByProvider.series}
                height={300}
                loading={loading}
                horizontal={true}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Mini Tables Section */}
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Recent Activity
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={4}>
              <MiniTable
                title="Latest Claims"
                columns={claimsColumns}
                rows={latestClaims}
                loading={loading}
                emptyMessage="No recent claims"
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <MiniTable
                title="Latest Pre-Authorizations"
                columns={preauthColumns}
                rows={latestPreauth}
                loading={loading}
                emptyMessage="No recent pre-authorizations"
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <MiniTable
                title="Latest Visits"
                columns={visitsColumns}
                rows={latestVisits}
                loading={loading}
                emptyMessage="No recent visits"
              />
            </Grid>
          </Grid>
        </Box>
      </MainCard>
    </RBACGuard>
  );
};

export default Dashboard;
