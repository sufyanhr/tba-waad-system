import { Component } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineOutlined from '@ant-design/icons/ErrorOutlineOutlined';

// ==============================|| ERROR BOUNDARY ||============================== //

class RbacErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            m: 2,
            textAlign: 'center',
            maxWidth: 600,
            mx: 'auto',
            mt: 8
          }}
        >
          <ErrorOutlineOutlined style={{ fontSize: 64, color: '#f44336', marginBottom: 16 }} />
          
          <Typography variant="h4" gutterBottom>
            عذراً، حدث خطأ غير متوقع
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            حدث خطأ أثناء تحميل نظام إدارة الأدوار والصلاحيات. 
            يرجى المحاولة مرة أخرى أو الاتصال بالدعم التقني.
          </Typography>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                textAlign: 'left'
              }}
            >
              <Typography variant="h6" gutterBottom>
                تفاصيل الخطأ (بيئة التطوير):
              </Typography>
              <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              color="primary"
            >
              إعادة تحميل الصفحة
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              color="secondary"
            >
              المحاولة مرة أخرى
            </Button>
          </Box>
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default RbacErrorBoundary;