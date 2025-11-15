import { Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// utils
import { ROLES } from 'utils/permissions';

// ==============================|| ROLE BADGE COMPONENT ||============================== //

const RoleBadge = ({ role, size = 'small', variant = 'filled' }) => {
  const theme = useTheme();

  const getRoleColor = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return {
          color: theme.palette.error.main,
          backgroundColor: theme.palette.error.lighter
        };
      case ROLES.MANAGER:
        return {
          color: theme.palette.warning.main,
          backgroundColor: theme.palette.warning.lighter
        };
      case ROLES.EMPLOYEE:
        return {
          color: theme.palette.info.main,
          backgroundColor: theme.palette.info.lighter
        };
      case ROLES.USER:
        return {
          color: theme.palette.success.main,
          backgroundColor: theme.palette.success.lighter
        };
      default:
        return {
          color: theme.palette.secondary.main,
          backgroundColor: theme.palette.secondary.lighter
        };
    }
  };

  const getRoleLabel = (role) => {
    const labels = {
      [ROLES.ADMIN]: 'مدير نظام',
      [ROLES.MANAGER]: 'مدير',
      [ROLES.EMPLOYEE]: 'موظف',
      [ROLES.USER]: 'مستخدم'
    };
    return labels[role] || role;
  };

  const roleStyle = getRoleColor(role);

  return (
    <Chip
      label={getRoleLabel(role)}
      size={size}
      variant={variant}
      sx={{
        color: roleStyle.color,
        backgroundColor: roleStyle.backgroundColor,
        fontWeight: 600,
        '& .MuiChip-label': {
          paddingX: 1
        }
      }}
    />
  );
};

export default RoleBadge;