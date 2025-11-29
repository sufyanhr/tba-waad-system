import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';

// assets
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';
import ClockCircleFilled from '@ant-design/icons/ClockCircleFilled';
import MinusCircleFilled from '@ant-design/icons/MinusCircleFilled';

// ==============================|| AVATAR STATUS ICONS ||============================== //

export default function AvatarStatus({ status }) {
  const theme = useTheme();

  // Safe palette access with fallbacks
  const varsPalette = (theme?.vars && theme.vars.palette) || theme.palette || {};
  const successVars = varsPalette.success || theme.palette?.success || {};
  const errorVars = varsPalette.error || theme.palette?.error || {};
  const warningVars = varsPalette.warning || theme.palette?.warning || {};
  
  switch (status) {
    case 'available':
      return <CheckCircleFilled style={{ color: successVars.main ?? theme.palette?.success?.main ?? '#4caf50' }} />;

    case 'do_not_disturb':
      return <MinusCircleFilled style={{ color: errorVars.main ?? theme.palette?.error?.main ?? '#f44336' }} />;

    case 'offline':
      return <ClockCircleFilled style={{ color: warningVars.main ?? theme.palette?.warning?.main ?? '#ff9800' }} />;

    default:
      return null;
  }
}

AvatarStatus.propTypes = { status: PropTypes.string };
