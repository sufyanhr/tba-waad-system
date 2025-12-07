import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Skeleton, Box } from '@mui/material';
import ReactApexChart from 'react-apexcharts';

/**
 * Trend Chart Component
 * Displays line/area chart for time-series data
 */
const TrendChart = ({ title, categories = [], series = [], height = 300, loading = false, type = 'area' }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader title={<Skeleton width="40%" />} />
        <CardContent>
          <Skeleton variant="rectangular" width="100%" height={height} />
        </CardContent>
      </Card>
    );
  }

  const options = {
    chart: {
      type: type,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        }
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 4
    },
    tooltip: {
      theme: 'light',
      x: {
        show: true
      },
      y: {
        formatter: (val) => val?.toLocaleString() || '0'
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '13px'
    },
    fill: {
      type: type === 'area' ? 'gradient' : 'solid',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    }
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

TrendChart.propTypes = {
  title: PropTypes.string.isRequired,
  categories: PropTypes.array,
  series: PropTypes.array,
  height: PropTypes.number,
  loading: PropTypes.bool,
  type: PropTypes.oneOf(['line', 'area'])
};

export default TrendChart;
