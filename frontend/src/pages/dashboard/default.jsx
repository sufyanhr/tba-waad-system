import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-hot-toast';
import { count as claimsCount } from 'api/claimsApi';
import { count as membersCount } from 'api/membersApi';
import { count as employersCount } from 'api/employersApi';
import { count as insuranceCount } from 'api/insuranceCompaniesApi';
import { count as reviewersCount } from 'api/reviewerCompaniesApi';
import { count as visitsCount } from 'api/visitsApi';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ claims:0, members:0, employers:0, insurance:0, reviewers:0, visits:0 });

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const [c,m,e,i,r,v] = await Promise.all([
        claimsCount(), membersCount(), employersCount(), insuranceCount(), reviewersCount(), visitsCount()
      ]);
      setMetrics({
        claims: c?.count ?? c ?? 0,
        members: m?.count ?? m ?? 0,
        employers: e?.count ?? e ?? 0,
        insurance: i?.count ?? i ?? 0,
        reviewers: r?.count ?? r ?? 0,
        visits: v?.count ?? v ?? 0
      });
    } catch (err) {
      toast.error(err?.message || 'Failed to load dashboard metrics');
    } finally { setLoading(false); }
  };

  useEffect(()=>{ loadMetrics(); },[]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Typography variant="h5">System Overview</Typography>
      </Grid>
      {loading && (
        <Grid item xs={12}>
          <MainCard><Grid sx={{ display:'flex', justifyContent:'center', py:4 }}><CircularProgress /></Grid></MainCard>
        </Grid>
      )}
      {!loading && (
        <>
          <Grid item xs={12} sm={6} lg={3}>
            <MainCard>
              <Typography variant="subtitle2">Total Claims</Typography>
              <Typography variant="h4">{(metrics.claims || 0).toLocaleString()}</Typography>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MainCard>
              <Typography variant="subtitle2">Total Members</Typography>
              <Typography variant="h4">{(metrics.members || 0).toLocaleString()}</Typography>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MainCard>
              <Typography variant="subtitle2">Employers</Typography>
              <Typography variant="h4">{(metrics.employers || 0).toLocaleString()}</Typography>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MainCard>
              <Typography variant="subtitle2">Insurance Companies</Typography>
              <Typography variant="h4">{(metrics.insurance || 0).toLocaleString()}</Typography>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MainCard>
              <Typography variant="subtitle2">Reviewer Companies</Typography>
              <Typography variant="h4">{(metrics.reviewers || 0).toLocaleString()}</Typography>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MainCard>
              <Typography variant="subtitle2">Total Visits</Typography>
              <Typography variant="h4">{(metrics.visits || 0).toLocaleString()}</Typography>
            </MainCard>
          </Grid>
        </>
      )}
    </Grid>
  );
}
