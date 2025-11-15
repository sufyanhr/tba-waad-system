import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// project imports
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import ComponentsRoutes from './ComponentsRoutes';

import Loadable from 'components/Loadable';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/auth/login" replace />
    },
    LoginRoutes,
    ComponentsRoutes,
    MainRoutes
  ],
  { basename: import.meta.env.VITE_APP_BASE_NAME }
);

export default router;
