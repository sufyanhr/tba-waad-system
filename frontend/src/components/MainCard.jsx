import PropTypes from 'prop-types';
import { Card } from '@mui/material';

const MainCard = ({ children, ...other }) => {
  return <Card {...other}>{children}</Card>;
};

MainCard.propTypes = {
  children: PropTypes.node
};

export default MainCard;
