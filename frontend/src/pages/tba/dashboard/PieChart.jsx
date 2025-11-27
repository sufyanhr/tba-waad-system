import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Skeleton, Box } from '@mui/material';
import ReactApexChart from 'react-apexcharts';

/**
 * Pie Chart Component
 * Displays donut/pie chart for distribution data
 */
const PieChart = ({ title, labels = [], series = [], height = 300, loading = false, type = 'donut' }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader title={<Skeleton width="40%" />} />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: height }}>
            <Skeleton variant="circular" width={200} height={200} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const options = {
    chart: {
      type: type,
      toolbar: {
        show: false
      }
    },
    labels: labels,
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '13px'
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`
    },
    plotOptions: {
      pie: {
        donut: {
          size: type === 'donut' ? '65%' : '0%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              fontWeight: 600,
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return total.toLocaleString();
              }
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: (val) => val?.toLocaleString() || '0'
      }
    },
    colors: ['#1976d2', '#dc004e', '#ff9800', '#4caf50', '#9c27b0', '#00bcd4']
  };

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Box sx={{ width: '100%' }}>
          <ReactApexChart options={options} series={series} type={type} height={height} />
        </Box>
      </CardContent>
    </Card>
  );
};

PieChart.propTypes = {
  title: PropTypes.string.isRequired,
  labels: PropTypes.array,
  series: PropTypes.array,
  height: PropTypes.number,
  loading: PropTypes.bool,
  type: PropTypes.oneOf(['pie', 'donut'])
};

export default PieChart;
