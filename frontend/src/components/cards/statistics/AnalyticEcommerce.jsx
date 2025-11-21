import PropTypes from 'prop-types';
import { Box, Typography, Card, CardContent } from '@mui/material';

const AnalyticEcommerce = ({ title, count, color = 'primary' }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" color="textSecondary">{title}</Typography>
        <Typography variant="h4" sx={{ mt: 1 }}>{count}</Typography>
      </CardContent>
    </Card>
  );
};

AnalyticEcommerce.propTypes = {
  title: PropTypes.string,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string
};

export default AnalyticEcommerce;
