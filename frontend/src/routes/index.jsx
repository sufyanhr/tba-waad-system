import { createBrowserRouter, Navigate } from 'react-router-dom';

// project imports
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import ComponentsRoutes from './ComponentsRoutes';

// ==============================|| ROUTING RENDER ||============================== //
// Root path redirects to dashboard (no landing page)

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/dashboard/default" replace />
    },
    LoginRoutes,
    ComponentsRoutes,
    MainRoutes
  ],
  { basename: import.meta.env.VITE_APP_BASE_NAME }
);

export default router;
