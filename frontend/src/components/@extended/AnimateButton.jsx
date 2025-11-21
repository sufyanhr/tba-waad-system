import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const AnimateButton = ({ children, type = 'scale' }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
};

AnimateButton.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string
};

export default AnimateButton;
