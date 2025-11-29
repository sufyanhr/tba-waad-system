// material-ui
import { styled } from '@mui/material/styles';

// project imports
import { ThemeDirection } from 'config';

// ==============================|| CALENDAR - STYLED ||============================== //

const ExperimentalStyled = styled('div')(({ theme }) => {
  // Safe palette access with fallbacks
  const varsPalette = (theme?.vars && theme.vars.palette) || theme.palette || {};
  const primaryVars = varsPalette.primary || theme.palette?.primary || {};
  const secondaryVars = varsPalette.secondary || theme.palette?.secondary || {};
  const errorVars = varsPalette.error || theme.palette?.error || {};
  const greyVars = varsPalette.grey || theme.palette?.grey || {};
  const textVars = varsPalette.text || theme.palette?.text || {};
  const backgroundVars = varsPalette.background || theme.palette?.background || {};
  const dividerColor = varsPalette.divider ?? theme.palette?.divider ?? '#e0e0e0';

  return {
    width: 'calc(100% + 2px)',
    marginLeft: -1,
    marginBottom: '-50px',

    // hide license message
    '& .fc-license-message': {
      display: 'none'
    },
    '& .fc .fc-daygrid .fc-scroller-liquid-absolute': {
      overflow: 'hidden !important'
    },

    '& .fc-col-header ': {
      width: '100% !important'
    },

    '& .fc .fc-daygrid-body ': {
      width: '100% !important'
    },

    '& .fc-scrollgrid-sync-table': {
      width: '100% !important'
    },

    // basic style
    '& .fc': {
      '--fc-bg-event-opacity': 1,
      '--fc-border-color': dividerColor,
      '--fc-daygrid-event-dot-width': '10px',
      '--fc-today-bg-color': primaryVars.lighter ?? theme.palette?.primary?.lighter ?? '#e3f2fd',
      '--fc-list-event-dot-width': '10px',
      '--fc-event-border-color': primaryVars.dark ?? theme.palette?.primary?.dark ?? '#1565c0',
      '--fc-now-indicator-color': errorVars.main ?? theme.palette?.error?.main ?? '#f44336',
      color: textVars.primary ?? theme.palette?.text?.primary ?? '#212121',
      background: backgroundVars.paper ?? theme.palette?.background?.paper ?? '#ffffff',
      fontFamily: theme.typography.fontFamily
    },

  // date text
  '& .fc .fc-daygrid-day-top': {
    display: 'grid',
    '& .fc-daygrid-day-number': {
      textAlign: 'center',
      marginTop: 12,
      marginBottom: 12
    }
    },

    // weekday
    '& .fc .fc-col-header-cell': {
      background: greyVars[100] ?? theme.palette?.grey?.[100] ?? '#f5f5f5'
    },

    '& .fc .fc-col-header-cell-cushion': {
      color: greyVars[900] ?? theme.palette?.grey?.[900] ?? '#212121',
      padding: 16
    },

    // events
    '& .fc-direction-ltr .fc-daygrid-event.fc-event-end, .fc-direction-rtl .fc-daygrid-event.fc-event-start': {
      marginLeft: 4,
      marginBottom: 6,
      borderRadius: 4,
      background: primaryVars.main ?? theme.palette?.primary?.main ?? '#1976d2',
      border: 'none'
    },

    '& .fc-h-event .fc-event-main': {
      padding: 4,
      paddingLeft: 8
    },

    // popover when multiple events
    '& .fc .fc-more-popover': {
      border: 'none',
      borderRadius: 6,
      zIndex: 1200
    },

    '& .fc .fc-more-popover .fc-popover-body': {
      background: secondaryVars.lighter ?? theme.palette?.secondary?.lighter ?? '#e3f2fd',
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4
    },

    '& .fc .fc-popover-header': {
      padding: 12,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      background: secondaryVars.light ?? theme.palette?.secondary?.light ?? '#90caf9',
      color: textVars.primary ?? theme.palette?.text?.primary ?? '#212121'
    },

    // agenda view
    '& .fc-theme-standard .fc-list-day-cushion': {
      background: secondaryVars.lighter ?? theme.palette?.secondary?.lighter ?? '#e3f2fd'
    },

    '& .fc .fc-day': {
      cursor: 'pointer'
    },

    '& .fc .fc-timeGridDay-view .fc-timegrid-slot': {
      background: backgroundVars.paper ?? theme.palette?.background?.paper ?? '#ffffff'
    },

    '& .fc .fc-timegrid-slot': {
      cursor: 'pointer'
    },

    '& .fc .fc-list-event:hover td': {
      cursor: 'pointer',
      background: secondaryVars.lighter ?? theme.palette?.secondary?.lighter ?? '#e3f2fd'
    },

    '& .fc-timegrid-event-harness-inset .fc-timegrid-event, .fc-timegrid-event.fc-event-mirror, .fc-timegrid-more-link': {
      padding: 8,
      margin: 2
    },
    ...(theme.direction === ThemeDirection.RTL && { overflow: 'hidden', paddingTop: '8px' })
  };
});

export default ExperimentalStyled;
