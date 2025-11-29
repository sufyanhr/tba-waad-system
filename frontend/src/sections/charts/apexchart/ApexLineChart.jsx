import { useEffect, useState } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';

import ReactApexChart from 'react-apexcharts';

// project imports
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// chart options
const lineChartOptions = {
  chart: {
    height: 350,
    type: 'line',
    zoom: { enabled: false },
    background: 'transparent'
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'straight' },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] }
};

// ==============================|| APEXCHART - LINE ||============================== //

export default function ApexLineChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const {
    state: { fontFamily }
  } = useConfig();

  // Safe palette access
  const varsPalette = (theme?.vars?.palette) || theme.palette || {};
  const primaryVars = varsPalette.primary || theme.palette?.primary || {};
  const textVars = varsPalette.text || theme.palette?.text || {};
  
  const line = varsPalette.divider || theme.palette?.divider || '#e0e0e0';
  const textPrimary = textVars.primary || '#000';
  const primary700 = primaryVars[700] || primaryVars.dark || '#1565c0';

  const [series] = useState([
    {
      name: 'Desktops',
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    }
  ]);

  const [options, setOptions] = useState(lineChartOptions);

  useEffect(() => {
    setOptions({
      ...lineChartOptions,
      chart: { ...lineChartOptions.chart, fontFamily: fontFamily },
      colors: [primary700],
      xaxis: { ...lineChartOptions.xaxis, labels: { style: { colors: textPrimary } } },
      yaxis: { labels: { style: { colors: textPrimary } } },
      grid: { borderColor: line },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, fontFamily, textPrimary, line, primary700]);

  return <ReactApexChart options={options} series={series} type="line" height={350} />;
}
