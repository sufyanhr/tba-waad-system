// material-ui
import { styled } from '@mui/material/styles';

// project imports
import { withAlpha } from 'utils/colorUtils';

// ==============================|| MAP BOX - CONTROL STYLED ||============================== //

const ControlPanelStyled = styled('div')(({ theme }) => {
  const varsPalette = (theme?.vars && theme.vars.palette) || theme.palette || {};
  const backgroundVars = varsPalette.background || theme.palette?.background || {};
  const paperColor = backgroundVars.paper ?? theme.palette?.background?.paper ?? '#ffffff';
  return {
    backdropFilter: `blur(4px)`,
    WebkitBackdropFilter: `blur(4px)`,
    background: withAlpha(paperColor, 0.85),
    zIndex: 9,
    minWidth: 200,
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 20,
    borderRadius: 4
  };
});

export default ControlPanelStyled;
