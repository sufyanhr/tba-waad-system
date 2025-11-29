// material-ui
import GlobalStyles from '@mui/material/GlobalStyles';

// ==============================|| MAP BOX - CONTROL STYLED ||============================== //

export default function MapControlsStyled() {
  return (
    <GlobalStyles
      styles={(theme) => ({
        '.mapboxgl-ctrl.mapboxgl-ctrl-group': { borderRadius: 4, boxShadow: theme.vars.customShadows.z1 },

        '.mapboxgl-ctrl-fullscreen': { '.mapboxgl-ctrl-icon': { transform: ' scale(0.75)' } },

        '.mapboxgl-ctrl-zoom-in': { borderRadius: '4px 4px 0 0' },
        '.mapboxgl-ctrl-compass': { borderRadius: '0 0 4px 4px' },

        '.mapboxgl-ctrl.mapboxgl-ctrl-scale': {
          border: 'none',
          lineHeight: '14px',
          borderRadius: 4,
          color: (() => {
            const varsPalette = (theme?.vars && theme.vars.palette) || theme.palette || {};
            const commonVars = varsPalette.common || theme.palette?.common || {};
            return commonVars.white ?? theme.palette?.common?.white ?? '#ffffff';
          })(),
          fontWeight: theme.typography.fontWeightBold,
          backgroundImage: `linear-gradient(to right, #8a2387, #e94057, #f27121)`
        }
      })}
    />
  );
}
