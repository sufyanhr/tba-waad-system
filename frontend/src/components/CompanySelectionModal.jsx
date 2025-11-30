import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Alert } from '@mui/material';
import { BankOutlined } from '@ant-design/icons';
import useCompany from 'hooks/useCompany';
import useAuth from 'hooks/useAuth';

// ==============================|| EMPLOYER SELECTION MODAL ||============================== //

export default function CompanySelectionModal() {
  const { selectedEmployerId, isInitialized } = useCompany();
  const { user, roles, isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);

  // Show modal to all users except EMPLOYER, INSURANCE_ADMIN, PROVIDER
  const shouldShowModal = roles && !roles.includes('EMPLOYER') && !roles.includes('INSURANCE_ADMIN') && !roles.includes('PROVIDER');

  useEffect(() => {
    // Only show modal if:
    // 1. User is logged in
    // 2. Context is initialized
    // 3. No employer selected
    // 4. User should see the modal (not excluded roles)
    if (isLoggedIn && isInitialized && !selectedEmployerId && shouldShowModal) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isLoggedIn, isInitialized, selectedEmployerId, shouldShowModal]);

  // Don't render for excluded roles
  if (!shouldShowModal) {
    return null;
  }

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: 'primary.lighter',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <BankOutlined style={{ fontSize: 24, color: 'var(--mui-palette-primary-main)' }} />
          </Box>
          <Typography variant="h4">Select an Employer</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          Please select an employer from the dropdown in the header to begin working with the system.
        </Alert>

        <Typography variant="body2" color="text.secondary">
          The employer selector is located in the top header bar, next to the language switcher. Once you select an employer, all data will
          be filtered to show only that employer&apos;s information.
        </Typography>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Welcome, {user?.fullName || user?.username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Your role: {roles?.join(', ')}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
          You must select an employer to continue
        </Typography>
      </DialogActions>
    </Dialog>
  );
}
