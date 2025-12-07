import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Skeleton, Box } from '@mui/material';
import ReactApexChart from 'react-apexcharts';

/**
 * Bar Chart Component
 * Displays horizontal/vertical bar chart for comparison data
 */
const BarChart = ({ title, categories = [], series = [], height = 300, loading = false, horizontal = false }) => {
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
      type: 'bar',
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
      }
    },
    plotOptions: {
      bar: {
        horizontal: horizontal,
        columnWidth: '55%',
        borderRadius: 4,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: horizontal ? 0 : -20,
      offsetX: horizontal ? 10 : 0,
      style: {
        fontSize: '12px',
        colors: ['#304758']
      },
      formatter: (val) => val?.toLocaleString() || '0'
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
        },
        formatter: (val) => val?.toLocaleString() || '0'
      }
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 4
    },
    tooltip: {
      theme: 'light',
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
    colors: ['#1976d2', '#dc004e', '#ff9800', '#4caf50']
  };

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Box sx={{ width: '100%' }}>
          <ReactApexChart options={options} series={series} type="bar" height={height} />
        </Box>
      </CardContent>
    </Card>
  );
};

BarChart.propTypes = {
  title: PropTypes.string.isRequired,
  categories: PropTypes.array,
  series: PropTypes.array,
  height: PropTypes.number,
  loading: PropTypes.bool,
  horizontal: PropTypes.bool
};

export default BarChart;
