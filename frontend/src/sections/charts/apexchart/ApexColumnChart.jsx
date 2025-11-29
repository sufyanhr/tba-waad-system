import { useEffect, useState } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';

import ReactApexChart from 'react-apexcharts';

// project imports
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// chart options
const columnChartOptions = {
  chart: {
    type: 'bar',
    height: 350,
    background: 'transparent',
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%'
    }
  },
  dataLabels: { enabled: false },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: { categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'] },
  fill: { opacity: 1 },
  tooltip: {
    y: {
      formatter(val) {
        return `$ ${val} thousands`;
      }
    }
  },
  legend: {
    show: true,
    position: 'bottom',
    offsetX: 10,
    offsetY: 10,
    labels: { useSeriesColors: false },
    markers: { size: 6, shape: 'circle', strokeWidth: 0 },
    itemMargin: { horizontal: 15, vertical: 8 }
  },
  responsive: [{ breakpoint: 600, options: { yaxis: { show: false } } }]
};

// ==============================|| APEXCHART - COLUMN ||============================== //

export default function ApexColumnChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const {
    state: { fontFamily }
  } = useConfig();

  // Safe palette access
  const varsPalette = (theme?.vars?.palette) || theme.palette || {};
  const primaryVars = varsPalette.primary || theme.palette?.primary || {};
  const successVars = varsPalette.success || theme.palette?.success || {};
  const textVars = varsPalette.text || theme.palette?.text || {};
  
  const textPrimary = textVars.primary || '#000';
  const line = varsPalette.divider || theme.palette?.divider || '#e0e0e0';

  const primary700 = primaryVars[700] || primaryVars.dark || '#1565c0';
  const primaryMain = primaryVars.main || '#1976d2';
  const successMain = successVars.main || '#2e7d32';

  const [series] = useState([
    {
      name: 'Net Profit',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    },
    {
      name: 'Revenue',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    },
    {
      name: 'Free Cash Flow',
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
    }
  ]);

  const [options, setOptions] = useState(columnChartOptions);

  useEffect(() => {
    setOptions({
      ...columnChartOptions,
      chart: { ...columnChartOptions.chart, fontFamily: fontFamily },
      colors: [primary700, primaryMain, successMain],
      xaxis: { ...columnChartOptions.xaxis, labels: { style: { colors: textPrimary } } },
      yaxis: { labels: { style: { colors: textPrimary } } },
      grid: { borderColor: line },
      legend: { ...columnChartOptions.legend, labels: { ...columnChartOptions.legend?.labels, colors: textPrimary } },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, fontFamily, textPrimary, line, primary700, primaryMain, successMain]);

  return <ReactApexChart options={options} series={series} type="bar" height={350} />;
}
