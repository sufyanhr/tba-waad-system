import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const AuthCard = ({ children, ...other }) => {
  return (
    <Box
      sx={{
        maxWidth: { xs: 400, lg: 475 },
        margin: { xs: 2.5, md: 3 },
        '& > *': {
          flexGrow: 1,
          flexBasis: '50%'
        }
      }}
      {...other}
    >
      {children}
    </Box>
  );
};

AuthCard.propTypes = {
  children: PropTypes.node
};

export default AuthCard;
