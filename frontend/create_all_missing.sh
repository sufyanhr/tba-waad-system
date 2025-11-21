#!/bin/bash

# Create all common missing components at once
mkdir -p src/components/cards/{skeleton,statistics}

# Skeleton cards
cat > src/components/cards/skeleton/EmptyUserCard.jsx << 'EOF'
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
EOF

cat > src/components/cards/skeleton/UserCard.jsx << 'EOF'
import EmptyUserCard from './EmptyUserCard';
export default EmptyUserCard;
EOF

# Statistics cards
cat > src/components/cards/statistics/AnalyticEcommerce.jsx << 'EOF'
import PropTypes from 'prop-types';
import { Box, Typography, Card, CardContent } from '@mui/material';

const AnalyticEcommerce = ({ title, count, color = 'primary' }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" color="textSecondary">{title}</Typography>
        <Typography variant="h4" sx={{ mt: 1 }}>{count}</Typography>
      </CardContent>
    </Card>
  );
};

AnalyticEcommerce.propTypes = {
  title: PropTypes.string,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string
};

export default AnalyticEcommerce;
EOF

# Logo component
mkdir -p src/components/logo
cat > src/components/logo/index.jsx << 'EOF'
import { Box, Typography } from '@mui/material';

const Logo = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        TBA WAAD
      </Typography>
    </Box>
  );
};

export default Logo;
EOF

cat > src/components/logo/LogoMain.jsx << 'EOF'
import Logo from './index';
export default Logo;
EOF

cat > src/components/logo/LogoIcon.jsx << 'EOF'
import { Box } from '@mui/material';
const LogoIcon = () => <Box sx={{ width: 32, height: 32, bgcolor: 'primary.main', borderRadius: 1 }} />;
export default LogoIcon;
EOF

# Form components
mkdir -p src/components/forms
cat > src/components/forms/FormikTextField.jsx << 'EOF'
import { TextField } from '@mui/material';
import { useField } from 'formik';

const FormikTextField = ({ name, ...props }) => {
  const [field, meta] = useField(name);
  return (
    <TextField
      {...field}
      {...props}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};

export default FormikTextField;
EOF

echo "✅ All common missing components created!"
