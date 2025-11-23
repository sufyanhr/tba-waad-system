// third-party
import { Popup } from 'react-map-gl/mapbox';

// material-ui
import { styled } from '@mui/material/styles';

// ==============================|| MAP BOX - POPUP STYLED ||============================== //

const PopupStyled = styled(Popup)(({ theme }) => {
  const isRTL = theme.direction === 'rtl';

  return {
    '& .mapboxgl-popup-content': {
      maxWidth: 180,
      padding: 12,
      boxShadow: theme.vars.customShadows.z1,
      borderRadius: 4,
      background: theme.vars.palette.background.paper,
      ...theme.applyStyles('dark', {
        background: theme.vars.palette.background.default
      })
    },
    '& .mapboxgl-popup-close-button': {
      width: 24,
      height: 24,
      fontSize: 16,
      opacity: 0.48,
      color: theme.vars.palette.common.white,
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
      borderBottomColor: theme.vars.palette.divider
    },
    '&.mapboxgl-popup-anchor-right .mapboxgl-popup-tip': {
      marginLeft: -1,
      borderLeftColor: theme.vars.palette.divider
    },
    '&.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip': {
      marginTop: -1,
      borderTopColor: theme.vars.palette.divider
    },
    '&.mapboxgl-popup-anchor-left .mapboxgl-popup-tip': {
      marginRight: -1,
      borderRightColor: theme.vars.palette.divider
    }
  };
});

export default PopupStyled;
