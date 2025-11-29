import { useEffect, useState } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';

import ReactApexChart from 'react-apexcharts';

// project imports
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// chart options
const redialBarChartOptions = {
  chart: { background: 'transparent' },
  plotOptions: {
    radialBar: {
      hollow: { margin: 0, size: '75%' },
      track: { margin: 0 },
      dataLabels: { name: { show: false }, value: { fontSize: '1rem', fontWeight: 600, offsetY: 5 } }
    }
  },
  labels: ['Vimeo']
};

// ==============================|| TOP CARD - RADIAL BAR CHART ||============================== //

export default function ProfileRadialChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const {
    state: { fontFamily }
  } = useConfig();

  const [series] = useState([30]);
  const [options, setOptions] = useState(redialBarChartOptions);

  // Safe palette access with fallbacks
  const varsPalette = (theme?.vars && theme.vars.palette) || theme.palette || {};
  const textVars = varsPalette.text || theme.palette?.text || {};
  const primaryVars = varsPalette.primary || theme.palette?.primary || {};
  const greyVars = varsPalette.grey || theme.palette?.grey || {};
  
  const textPrimary = textVars.primary ?? theme.palette?.text?.primary ?? '#000';
  const primaryMain = primaryVars.main ?? theme.palette?.primary?.main ?? '#1976d2';
  const trackColor = colorScheme === ThemeMode.DARK 
    ? (greyVars[200] ?? theme.palette?.grey?.[200] ?? '#e0e0e0')
    : (greyVars[0] ?? theme.palette?.grey?.[0] ?? '#fafafa');

  useEffect(() => {
    setOptions({
      ...redialBarChartOptions,
      chart: { ...redialBarChartOptions.chart, fontFamily: fontFamily },
      colors: [primaryMain],
      plotOptions: {
        ...redialBarChartOptions.plotOptions,
        radialBar: {
          ...redialBarChartOptions.plotOptions?.radialBar,
          track: { background: trackColor },
          dataLabels: {
            ...redialBarChartOptions.plotOptions?.radialBar?.dataLabels,
            value: { ...redialBarChartOptions.plotOptions?.radialBar?.dataLabels?.value, color: textPrimary }
          }
        }
      },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, fontFamily, primaryMain, textPrimary, trackColor]);

  return <ReactApexChart options={options} series={series} type="radialBar" width={112} height={112} />;
}
