import { Box, Skeleton, Card, CardContent } from '@mui/material';
const EmptyUserCard = () => (
  <Card>
    <CardContent>
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="text" sx={{ mt: 2 }} />
      <Skeleton variant="text" />
    </CardContent>
  </Card>
);
export default EmptyUserCard;
