import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';

/**
 * KPI Stat Card Component
 * Displays a single KPI metric with optional growth indicator
 */
const KPIStatCard = ({ title, value, subtitle, icon, color = 'primary', loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={40} sx={{ my: 1 }} />
          <Skeleton variant="text" width="50%" height={20} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" color="textSecondary" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {title}
          </Typography>
          {icon && <Box sx={{ color: `${color}.main`, opacity: 0.8 }}>{icon}</Box>}
        </Box>
        <Typography variant="h3" sx={{ mb: 1, fontWeight: 600, color: `${color}.main` }}>
          {value?.toLocaleString() || '0'}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

KPIStatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'info']),
  loading: PropTypes.bool
};

export default KPIStatCard;
