import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// ==============================|| UNAUTHORIZED PAGE ||============================== //

const Unauthorized = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/dashboard/default');
  };

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center'
        }}
      >
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: theme.palette.error.lighter,
            color: theme.palette.error.main
          }}
        >
          <LockIcon sx={{ fontSize: 60 }} />
        </Box>

        <Typography variant="h1" sx={{ mb: 2, fontSize: { xs: '3rem', md: '4rem' } }}>
          403
        </Typography>

        <Typography variant="h4" sx={{ mb: 2, fontWeight: 500 }}>
          غير مصرح
        </Typography>

        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: 500 }}>
          عذراً، ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة. يرجى التواصل مع مسؤول النظام إذا كنت تعتقد أنك يجب أن تمتلك هذه الصلاحية.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleGoBack} sx={{ px: 3 }}>
            رجوع
          </Button>

          <Button variant="contained" onClick={handleGoHome} sx={{ px: 3 }}>
            الصفحة الرئيسية
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Unauthorized;
