import { useEffect, useState } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';

import ReactApexChart from 'react-apexcharts';

// project imports
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// chart options
const polarChartOptions = {
  chart: {
    width: 450,
    height: 450,
    type: 'polarArea',
    background: 'transparent'
  },
  fill: { opacity: 1 },
  legend: {
    show: true,
    offsetX: 10,
    offsetY: 10,
    labels: { useSeriesColors: false },
    markers: { size: 6, shape: 'circle', strokeWidth: 0 },
    itemMargin: { horizontal: 25, vertical: 4 }
  },
  responsive: [
    {
      breakpoint: 450,
      options: { chart: { width: 280, height: 280 }, legend: { show: false } }
    }
  ]
};

// ==============================|| APEXCHART - POLAR ||============================== //

export default function ApexPolarChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const {
    state: { fontFamily }
  } = useConfig();

  // Safe palette access
  const varsPalette = (theme?.vars?.palette) || theme.palette || {};
  const primaryVars = varsPalette.primary || theme.palette?.primary || {};
  const successVars = varsPalette.success || theme.palette?.success || {};
  const errorVars = varsPalette.error || theme.palette?.error || {};
  const warningVars = varsPalette.warning || theme.palette?.warning || {};
  const textVars = varsPalette.text || theme.palette?.text || {};
  const backgroundVars = varsPalette.background || theme.palette?.background || {};
  
  const line = varsPalette.divider || theme.palette?.divider || '#e0e0e0';
  const textPrimary = textVars.primary || '#000';
  const backColor = backgroundVars.paper || '#fff';

  const [series] = useState([13.5, 18, 11, 5, 10]);
  const [options, setOptions] = useState(polarChartOptions);

  const primary400 = primaryVars[400] || primaryVars.light || '#42a5f5';
  const primaryMain = primaryVars.main || '#1976d2';
  const successMain = successVars.main || '#2e7d32';
  const errorMain = errorVars.main || '#d32f2f';
  const warningMain = warningVars.main || '#ed6c02';

  useEffect(() => {
    setOptions({
      ...polarChartOptions,
      chart: { ...polarChartOptions.chart, fontFamily: fontFamily },
      colors: [errorMain, primaryMain, warningMain, successMain, primary400],
      yaxis: { labels: { style: { colors: textPrimary } } },
      grid: { borderColor: line },
      legend: { ...polarChartOptions.legend, labels: { ...polarChartOptions.legend?.labels, colors: textPrimary } },
      stroke: { colors: [backColor] },
      plotOptions: { polarArea: { rings: { strokeColor: line }, spokes: { connectorColors: line } } },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, fontFamily, textPrimary, line, backColor, primary400, primaryMain, successMain, errorMain, warningMain]);

  return <ReactApexChart options={options} series={series} type="polarArea" />;
}
