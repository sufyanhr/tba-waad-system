import PropTypes from 'prop-types';
import { Card, CardContent, Typography } from '@mui/material';

const CustomerCard = ({ customer }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{customer?.name || 'Customer'}</Typography>
        <Typography variant="body2" color="text.secondary">{customer?.email}</Typography>
      </CardContent>
    </Card>
  );
};

CustomerCard.propTypes = {
  customer: PropTypes.object
};

export default CustomerCard;
