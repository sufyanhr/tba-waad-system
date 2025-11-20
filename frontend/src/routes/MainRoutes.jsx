import { lazy } from 'react';

// project imports
import ErrorBoundary from './ErrorBoundary';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/ProtectedRoute';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import { SimpleLayoutType } from 'config';
import SimpleLayout from 'layout/Simple';
import Unauthorized from 'pages/errors/Unauthorized';
import NotFound from 'pages/errors/NotFound';
import Claims from 'pages/claims/Claims';
import Members from 'pages/members/Members';
import Employers from 'pages/employers/Employers';
import InsuranceCompanies from 'pages/insurance/InsuranceCompanies';
import ReviewerCompanies from 'pages/reviewer/ReviewerCompanies';
import Visits from 'pages/visits/Visits';
import SystemTools from 'components/pages/SystemTools';
import RolesList from 'pages/rbac/roles/RolesList';
import RoleCreate from 'pages/rbac/roles/RoleCreate';
import RoleEdit from 'pages/rbac/roles/RoleEdit';
import AssignPermissions from 'pages/rbac/roles/AssignPermissions';
import PermissionsList from 'pages/rbac/permissions/PermissionsList';
import PermissionCreate from 'pages/rbac/permissions/PermissionCreate';
import PermissionEdit from 'pages/rbac/permissions/PermissionEdit';
import AssignRoles from 'pages/rbac/users/AssignRoles';
import AuthLogin from 'pages/auth/jwt/login';
import AuthRegister from 'pages/auth/jwt/register';
import AuthForgotPassword from 'pages/auth/jwt/forgot-password';
import AuthResetPassword from 'pages/auth/jwt/reset-password';
import AuthCheckMail from 'pages/auth/jwt/check-mail';
import AuthCodeVerification from 'pages/auth/jwt/code-verification';
import DashboardDefault from 'pages/dashboard/default';

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'dashboard',
          children: [
            {
              path: 'default',
              element: (
                <ProtectedRoute permissions={['dashboard.view']}>
                  <DashboardDefault />
                </ProtectedRoute>
              )
            }
          ]
        },
        {
          path: 'claims',
          element: (
            <ProtectedRoute permissions={['claim.view']}>
              <Claims />
            </ProtectedRoute>
          )
        },
        {
          path: 'members',
          element: (
            <ProtectedRoute permissions={['member.view']}>
              <Members />
            </ProtectedRoute>
          )
        },
        {
          path: 'employers',
          element: (
            <ProtectedRoute permissions={['employer.view']}>
              <Employers />
            </ProtectedRoute>
          )
        },
        {
          path: 'insurance-companies',
          element: (
            <ProtectedRoute permissions={['insurance.view']}>
              <InsuranceCompanies />
            </ProtectedRoute>
          )
        },
        {
          path: 'reviewer-companies',
          element: (
            <ProtectedRoute permissions={['reviewer.view']}>
              <ReviewerCompanies />
            </ProtectedRoute>
          )
        },
        {
          path: 'visits',
          element: (
            <ProtectedRoute permissions={['visit.view']}>
              <Visits />
            </ProtectedRoute>
          )
        },
        {
          path: 'admin',
          children: [
            {
              path: 'system',
              children: [
                {
                  path: 'tools',
                  element: (
                    <ProtectedRoute permissions={['system.manage']}>
                      <SystemTools />
                    </ProtectedRoute>
                  )
                }
              ]
            },
            {
              path: 'rbac',
              children: [
                {
                  path: 'roles',
                  element: (
                    <ProtectedRoute permissions={['roles.manage']}>
                      <RolesList />
                    </ProtectedRoute>
                  )
                },
                {
                  path: 'roles/create',
                  element: (
                    <ProtectedRoute permissions={['roles.manage']}>
                      <RoleCreate />
                    </ProtectedRoute>
                  )
                },
                {
                  path: 'roles/:id/edit',
                  element: (
                    <ProtectedRoute permissions={['roles.manage']}>
                      <RoleEdit />
                    </ProtectedRoute>
                  )
                },
                {
                  path: 'roles/assign-permissions',
                  element: (
                    <ProtectedRoute permissions={['roles.assign_permissions']}>
                      <AssignPermissions />
                    </ProtectedRoute>
                  )
                },
                {
                  path: 'permissions',
                  element: (
                    <ProtectedRoute permissions={['permissions.manage']}>
                      <PermissionsList />
                    </ProtectedRoute>
                  )
                },
                {
                  path: 'permissions/create',
                  element: (
                    <ProtectedRoute permissions={['permissions.manage']}>
                      <PermissionCreate />
                    </ProtectedRoute>
                  )
                },
                {
                  path: 'permissions/:id/edit',
                  element: (
                    <ProtectedRoute permissions={['permissions.manage']}>
                      <PermissionEdit />
                    </ProtectedRoute>
                  )
                },
                {
                  path: 'users/assign-roles',
                  element: (
                    <ProtectedRoute permissions={['users.assign_roles']}>
                      <AssignRoles />
                    </ProtectedRoute>
                  )
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/auth',
      element: <PagesLayout />,
      children: [
        {
          path: 'login',
          element: <AuthLogin />
        },
        {
          path: 'register',
          element: <AuthRegister />
        },
        {
          path: 'forgot-password',
          element: <AuthForgotPassword />
        },
        {
          path: 'reset-password',
          element: <AuthResetPassword />
        },
        {
          path: 'check-mail',
          element: <AuthCheckMail />
        },
        {
          path: 'code-verification',
          element: <AuthCodeVerification />
        }
      ]
    },
    {
      path: '/unauthorized',
      element: <Unauthorized />
    },
    {
      path: '/',
      element: <SimpleLayout layout={SimpleLayoutType.SIMPLE} />,
      children: []
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]
};

export default MainRoutes;
