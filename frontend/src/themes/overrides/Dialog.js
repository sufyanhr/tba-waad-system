// project imports
import { withAlpha } from 'utils/colorUtils';

// ==============================|| OVERRIDES - DIALOG ||============================== //

export default function Dialog(theme) {
  const varsPalette = (theme.vars && theme.vars.palette) || theme.palette || {};
  return {
    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            backgroundColor: withAlpha(varsPalette.common?.black ?? (theme.palette && theme.palette.common && theme.palette.common.black) || '#000', 0.7)
          }
        },
        paper: {
          backgroundImage: 'none'
        }
      }
    }
  };
}
