import PropTypes from 'prop-types';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
  Divider
} from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';

// ==============================|| CRUD DRAWER ||============================== //

const CrudDrawer = ({
  open,
  onClose,
  title,
  children,
  onSave,
  onCancel,
  loading = false,
  width = 400
}) => {
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: width } }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">{title}</Typography>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Box>
        
        <Divider />
        
        {/* Content */}
        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          {children}
        </Box>
        
        <Divider />
        
        {/* Footer Actions */}
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};

CrudDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  loading: PropTypes.bool,
  width: PropTypes.number
};

export default CrudDrawer;
