import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Box, Typography, Breadcrumbs as MuiBreadcrumbs } from '@mui/material';
import { HomeOutlined } from '@ant-design/icons';

// ==============================|| BREADCRUMBS ||============================== //

const Breadcrumbs = () => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const crumbs = pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
      return { label, to };
    });
    setBreadcrumbs(crumbs);
  }, [location]);

  return (
    <Box sx={{ mb: 3 }}>
      <MuiBreadcrumbs aria-label="breadcrumb">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <HomeOutlined style={{ marginRight: 4 }} />
          <Typography color="text.primary">Home</Typography>
        </Link>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return isLast ? (
            <Typography key={crumb.to} color="text.primary">
              {crumb.label}
            </Typography>
          ) : (
            <Link key={crumb.to} to={crumb.to} style={{ textDecoration: 'none' }}>
              <Typography color="text.secondary">{crumb.label}</Typography>
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
