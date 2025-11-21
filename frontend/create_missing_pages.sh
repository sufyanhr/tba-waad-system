#!/bin/bash

# Create missing dashboard pages
mkdir -p src/pages/dashboard
cat > src/pages/dashboard/analytics.jsx << 'PAGE'
import { Typography, Box } from '@mui/material';

const DashboardAnalytics = () => {
  return (
    <Box>
      <Typography variant="h3">Analytics Dashboard</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>Analytics dashboard coming soon...</Typography>
    </Box>
  );
};

export default DashboardAnalytics;
PAGE

# Create missing widget pages
mkdir -p src/pages/widget
for widget in statistics data chart; do
cat > src/pages/widget/${widget}.jsx << PAGE
import { Typography, Box } from '@mui/material';

const Widget${widget^} = () => {
  return (
    <Box>
      <Typography variant="h3">Widget ${widget^}</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>Widget ${widget} coming soon...</Typography>
    </Box>
  );
};

export default Widget${widget^};
PAGE
done

# Create missing app pages
mkdir -p src/pages/apps
for app in chat calendar kanban; do
cat > src/pages/apps/${app}.jsx << PAGE
import { Typography, Box } from '@mui/material';

const App${app^} = () => {
  return (
    <Box>
      <Typography variant="h3">${app^}</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>${app^} application coming soon...</Typography>
    </Box>
  );
};

export default App${app^};
PAGE
done

echo "Missing page stubs created!"
