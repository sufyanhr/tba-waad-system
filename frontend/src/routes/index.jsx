import { createBrowserRouter, Navigate } from 'react-router-dom';

// project imports
import { MainRoutes, TBARoutes, OtherRoutes } from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import AuthGuard from 'utils/route-guard/AuthGuard';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([
  LoginRoutes,
  {
    path: '/',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/default" replace />
      },
      MainRoutes,
      TBARoutes,
      ...OtherRoutes
    ]
  }
]);

export default router;
