import MainCard from 'components/MainCard';
import RBACGuard from 'components/tba/RBACGuard';
import { Typography, Box } from '@mui/material';

const InvoicesList = () => {
  return (
    <RBACGuard permission="INVOICE_VIEW">
      <MainCard title="Invoices">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Invoices Module - Coming Soon
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Provider batch invoicing and payment processing
          </Typography>
        </Box>
      </MainCard>
    </RBACGuard>
  );
};

export default InvoicesList;