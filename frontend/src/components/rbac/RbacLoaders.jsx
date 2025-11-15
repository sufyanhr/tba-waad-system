import { Box, CircularProgress, Typography, Skeleton, Stack } from '@mui/material';

// ==============================|| RBAC LOADING COMPONENTS ||============================== //

// Loading للصفحة الكاملة
export const RbacPageLoader = ({ message = "جارٍ تحميل البيانات..." }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="60vh"
    gap={2}
  >
    <CircularProgress size={60} thickness={4} />
    <Typography variant="h6" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

// Loading للجداول
export const TableLoader = ({ rows = 5, columns = 4 }) => (
  <Stack spacing={1}>
    {[...Array(rows)].map((_, index) => (
      <Stack key={index} direction="row" spacing={2}>
        {[...Array(columns)].map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="rectangular"
            height={52}
            sx={{ flex: colIndex === 0 ? '2' : '1' }}
          />
        ))}
      </Stack>
    ))}
  </Stack>
);

// Loading للبطاقات
export const CardLoader = ({ count = 3 }) => (
  <Stack spacing={2}>
    {[...Array(count)].map((_, index) => (
      <Skeleton
        key={index}
        variant="rectangular"
        height={120}
        sx={{ borderRadius: 2 }}
      />
    ))}
  </Stack>
);

// Loading للنماذج
export const FormLoader = () => (
  <Stack spacing={3}>
    <Skeleton variant="rectangular" height={56} />
    <Skeleton variant="rectangular" height={120} />
    <Skeleton variant="rectangular" height={56} />
    <Stack direction="row" spacing={2} justifyContent="flex-end">
      <Skeleton variant="rectangular" width={100} height={40} />
      <Skeleton variant="rectangular" width={80} height={40} />
    </Stack>
  </Stack>
);

// Loading مع رسالة مخصصة
export const CustomLoader = ({ size = 40, message, showProgress = true }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    gap={2}
    p={3}
  >
    {showProgress && <CircularProgress size={size} />}
    {message && (
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {message}
      </Typography>
    )}
  </Box>
);

export default {
  RbacPageLoader,
  TableLoader,
  CardLoader,
  FormLoader,
  CustomLoader
};