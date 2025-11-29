// third-party
import { Popup } from 'react-map-gl/mapbox';

// material-ui
import { styled } from '@mui/material/styles';

// ==============================|| MAP BOX - POPUP STYLED ||============================== //

const PopupStyled = styled(Popup)(({ theme }) => {
  const isRTL = theme.direction === 'rtl';

  const varsPalette = (theme?.vars && theme.vars.palette) || theme.palette || {};
  const backgroundVars = varsPalette.background || theme.palette?.background || {};
  const commonVars = varsPalette.common || theme.palette?.common || {};
  const dividerColor = varsPalette.divider ?? theme.palette?.divider ?? '#e0e0e0';
  const paperColor = backgroundVars.paper ?? theme.palette?.background?.paper ?? '#ffffff';
  const defaultBg = backgroundVars.default ?? theme.palette?.background?.default ?? '#121212';
  const whiteColor = commonVars.white ?? theme.palette?.common?.white ?? '#ffffff';

  return {
    '& .mapboxgl-popup-content': {
      maxWidth: 180,
      padding: 12,
      boxShadow: theme.vars.customShadows.z1,
      borderRadius: 4,
      background: paperColor,
      ...theme.applyStyles('dark', {
        background: defaultBg
      })
    },
    '& .mapboxgl-popup-close-button': {
      width: 24,
      height: 24,
      fontSize: 16,
      opacity: 0.48,
      color: whiteColor,
      right: isRTL && '0',
      left: isRTL && 'auto',
      '&:hover': {
        opacity: 1
      },
      '&:focus': {
        outline: 'none'
      }
    },
    '&.mapboxgl-popup-anchor-top .mapboxgl-popup-tip': {
      marginBottom: -1,
      borderBottomColor: dividerColor
    },
    '&.mapboxgl-popup-anchor-right .mapboxgl-popup-tip': {
      marginLeft: -1,
      borderLeftColor: dividerColor
    },
    '&.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip': {
      marginTop: -1,
      borderTopColor: dividerColor
    },
    '&.mapboxgl-popup-anchor-left .mapboxgl-popup-tip': {
      marginRight: -1,
      borderRightColor: dividerColor
    }
  };
});

export default PopupStyled;
