#!/bin/bash

# Missing auth page
mkdir -p src/pages/auth/jwt
if [ ! -f src/pages/auth/jwt/code-verification.jsx ]; then
cat > src/pages/auth/jwt/code-verification.jsx << 'EOF'
import { Typography, Box } from '@mui/material';
const CodeVerification = () => (
  <Box><Typography variant="h3">Code Verification</Typography></Box>
);
export default CodeVerification;
EOF
fi

if [ ! -f src/pages/auth/jwt/reset-password.jsx ]; then
cat > src/pages/auth/jwt/reset-password.jsx << 'EOF'
import { Typography, Box } from '@mui/material';
const ResetPassword = () => (
  <Box><Typography variant="h3">Reset Password</Typography></Box>
);
export default ResetPassword;
EOF
fi

# Create missing sections
mkdir -p src/sections/apps/{kanban,customer,invoice,profiles/user,profiles/account,e-commerce}
mkdir -p src/sections/auth

# Kanban sections
cat > src/sections/apps/kanban/Backlogs.jsx << 'EOF'
import { Typography, Box } from '@mui/material';
const Backlogs = () => (
  <Box><Typography variant="h4">Kanban Backlogs</Typography></Box>
);
export default Backlogs;
EOF

cat > src/sections/apps/kanban/Board.jsx << 'EOF'
import { Typography, Box } from '@mui/material';
const Board = () => (
  <Box><Typography variant="h4">Kanban Board</Typography></Box>
);
export default Board;
EOF

# Invoice pages
mkdir -p src/pages/apps/invoice
for page in create dashboard list details edit; do
cat > src/pages/apps/invoice/${page}.jsx << EOF
import { Typography, Box } from '@mui/material';
const Invoice${page^} = () => (
  <Box><Typography variant="h3">Invoice ${page^}</Typography></Box>
);
export default Invoice${page^};
EOF
done

# Profile pages
mkdir -p src/pages/apps/profiles/{user,account}
cat > src/pages/apps/profiles/user.jsx << 'EOF'
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
const UserProfile = () => (
  <Box><Outlet /></Box>
);
export default UserProfile;
EOF

cat > src/pages/apps/profiles/account.jsx << 'EOF'
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
const AccountProfile = () => (
  <Box><Outlet /></Box>
);
export default AccountProfile;
EOF

# Profile tabs
mkdir -p src/sections/apps/profiles/user
for tab in TabPersonal TabPayment TabPassword TabSettings; do
cat > src/sections/apps/profiles/user/${tab}.jsx << EOF
import { Typography, Box } from '@mui/material';
const ${tab} = () => (
  <Box><Typography variant="h4">${tab}</Typography></Box>
);
export default ${tab};
EOF
done

mkdir -p src/sections/apps/profiles/account
for tab in TabProfile TabPersonal TabAccount TabPassword TabRole TabSettings; do
cat > src/sections/apps/profiles/account/${tab}.jsx << EOF
import { Typography, Box } from '@mui/material';
const ${tab} = () => (
  <Box><Typography variant="h4">${tab}</Typography></Box>
);
export default ${tab};
EOF
done

# E-commerce pages
mkdir -p src/pages/apps/e-commerce
for page in products product-details products-list add-product checkout; do
pagename=$(echo $page | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1' | sed 's/ //g')
cat > src/pages/apps/e-commerce/${page}.jsx << EOF
import { Typography, Box } from '@mui/material';
const ${pagename} = () => (
  <Box><Typography variant="h3">${pagename}</Typography></Box>
);
export default ${pagename};
EOF
done

# Forms pages
mkdir -p src/pages/forms/{layouts,plugins}
for page in validation wizard; do
cat > src/pages/forms/${page}.jsx << EOF
import { Typography, Box } from '@mui/material';
const Forms${page^} = () => (
  <Box><Typography variant="h3">Forms ${page^}</Typography></Box>
);
export default Forms${page^};
EOF
done

for layout in basic multi-column action-bar sticky-bar; do
layoutname=$(echo $layout | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1' | sed 's/ //g')
cat > src/pages/forms/layouts/${layout}.jsx << EOF
import { Typography, Box } from '@mui/material';
const FormsLayout${layoutname} = () => (
  <Box><Typography variant="h3">Forms Layout ${layoutname}</Typography></Box>
);
export default FormsLayout${layoutname};
EOF
done

for plugin in mask clipboard re-captcha editor dropzone; do
pluginname=$(echo $plugin | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1' | sed 's/ //g')
cat > src/pages/forms/plugins/${plugin}.jsx << EOF
import { Typography, Box } from '@mui/material';
const FormsPlugins${pluginname} = () => (
  <Box><Typography variant="h3">Forms Plugins ${pluginname}</Typography></Box>
);
export default FormsPlugins${pluginname};
EOF
done

# Tables pages
mkdir -p src/pages/tables/{react-table,mui-table}
tables="basic dense sorting filtering grouping pagination row-selection expanding editable drag-drop column-visibility column-resizing sticky-table umbrella empty virtualized"
for table in $tables; do
tablename=$(echo $table | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1' | sed 's/ //g')
cat > src/pages/tables/react-table/${table}.jsx << EOF
import { Typography, Box } from '@mui/material';
const ReactTable${tablename} = () => (
  <Box><Typography variant="h3">React Table ${tablename}</Typography></Box>
);
export default ReactTable${tablename};
EOF
done

muitables="basic dense enhanced datatable custom fixed-header collapse"
for table in $muitables; do
tablename=$(echo $table | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1' | sed 's/ //g')
cat > src/pages/tables/mui-table/${table}.jsx << EOF
import { Typography, Box } from '@mui/material';
const MuiTable${tablename} = () => (
  <Box><Typography variant="h3">MUI Table ${tablename}</Typography></Box>
);
export default MuiTable${tablename};
EOF
done

# Charts and other pages
mkdir -p src/pages/{charts,maintenance,extra-pages}
cat > src/pages/charts/apexchart.jsx << 'EOF'
import { Typography, Box } from '@mui/material';
const Apexchart = () => (
  <Box><Typography variant="h3">ApexCharts</Typography></Box>
);
export default Apexchart;
EOF

cat > src/pages/charts/org-chart.jsx << 'EOF'
import { Typography, Box } from '@mui/material';
const OrgChart = () => (
  <Box><Typography variant="h3">Organization Chart</Typography></Box>
);
export default OrgChart;
EOF

cat > src/pages/map.jsx << 'EOF'
import { Typography, Box } from '@mui/material';
const Map = () => (
  <Box><Typography variant="h3">Map</Typography></Box>
);
export default Map;
EOF

for page in 404 500 under-construction coming-soon join-waitlist; do
pagename=$(echo $page | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1' | sed 's/ //g')
cat > src/pages/maintenance/${page}.jsx << EOF
import { Typography, Box } from '@mui/material';
const ${pagename} = () => (
  <Box sx={{ textAlign: 'center', py: 10 }}><Typography variant="h1">${pagename}</Typography></Box>
);
export default ${pagename};
EOF
done

for page in sample-page pricing; do
pagename=$(echo $page | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1' | sed 's/ //g')
cat > src/pages/extra-pages/${page}.jsx << EOF
import { Typography, Box } from '@mui/material';
const ${pagename} = () => (
  <Box><Typography variant="h3">${pagename}</Typography></Box>
);
export default ${pagename};
EOF
done

cat > src/pages/contact-us.jsx << 'EOF'
import { Typography, Box } from '@mui/material';
const ContactUs = () => (
  <Box><Typography variant="h3">Contact Us</Typography></Box>
);
export default ContactUs;
EOF

cat > src/pages/change-log.jsx << 'EOF'
import { Typography, Box } from '@mui/material';
const ChangeLog = () => (
  <Box><Typography variant="h3">Change Log</Typography></Box>
);
export default ChangeLog;
EOF

cat > src/pages/faqs.jsx << 'EOF'
import { Typography, Box } from '@mui/material';
const Faqs = () => (
  <Box><Typography variant="h3">FAQs</Typography></Box>
);
export default Faqs;
EOF

# Create missing components
mkdir -p src/components/{@extended,third-party}

cat > src/components/MainCard.jsx << 'EOF'
import PropTypes from 'prop-types';
import { Card } from '@mui/material';

const MainCard = ({ children, ...other }) => {
  return <Card {...other}>{children}</Card>;
};

MainCard.propTypes = {
  children: PropTypes.node
};

export default MainCard;
EOF

cat > src/components/third-party/SimpleBar.jsx << 'EOF'
import PropTypes from 'prop-types';
import SimpleBarReact from 'simplebar-react';

const SimpleBar = ({ children, ...other }) => {
  return <SimpleBarReact {...other}>{children}</SimpleBarReact>;
};

SimpleBar.propTypes = {
  children: PropTypes.node
};

export default SimpleBar;
EOF

cat > src/components/@extended/Avatar.jsx << 'EOF'
import { Avatar as MuiAvatar } from '@mui/material';
export default MuiAvatar;
EOF

cat > src/components/@extended/IconButton.jsx << 'EOF'
import { IconButton as MuiIconButton } from '@mui/material';
export default MuiIconButton;
EOF

cat > src/components/@extended/progress/CircularWithPath.jsx << 'EOF'
import { CircularProgress } from '@mui/material';
const CircularWithPath = (props) => <CircularProgress {...props} />;
export default CircularWithPath;
EOF

cat > src/components/@extended/Transitions.jsx << 'EOF'
import { Fade } from '@mui/material';
export const PopupTransition = Fade;
EOF

# Create missing module hooks
mkdir -p src/modules/customers
cat > src/modules/customers/useCustomers.js << 'EOF'
export const useDeleteCustomer = () => {
  return () => console.log('Delete customer');
};
EOF

echo "All stub pages and components created!"
