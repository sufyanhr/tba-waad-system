import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import RBACGuard from 'components/tba/RBACGuard';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const DashboardAnalytics = Loadable(lazy(() => import('pages/dashboard/analytics')));

// render - TBA pages
const TbaMedicalServices = Loadable(lazy(() => import('pages/tba/medical-services')));
const TbaMedicalCategories = Loadable(lazy(() => import('pages/tba/medical-categories')));
const TbaProviders = Loadable(lazy(() => import('pages/tba/providers')));
const TbaMembers = Loadable(lazy(() => import('pages/tba/members')));
const TbaEmployers = Loadable(lazy(() => import('pages/tba/employers')));
const TbaClaims = Loadable(lazy(() => import('pages/tba/claims')));
const TbaVisits = Loadable(lazy(() => import('pages/tba/visits')));
const TbaPolicies = Loadable(lazy(() => import('pages/tba/policies')));
const TbaBenefitPackages = Loadable(lazy(() => import('pages/tba/benefit-packages')));
const TbaPreAuthorizations = Loadable(lazy(() => import('pages/tba/pre-authorizations')));
const TbaInvoices = Loadable(lazy(() => import('pages/tba/invoices')));
const TbaProviderContracts = Loadable(lazy(() => import('pages/tba/provider-contracts')));
const TbaReviewerCompanies = Loadable(lazy(() => import('pages/tba/reviewer-companies')));
const TbaMedicalPackages = Loadable(lazy(() => import('pages/tba/medical-packages')));
const TbaInsuranceCompanies = Loadable(lazy(() => import('pages/tba/insurance-companies')));

// render - Members module
const MembersList = Loadable(lazy(() => import('pages/tba/members/MembersList')));
const MemberCreate = Loadable(lazy(() => import('pages/tba/members/MemberCreate')));
const MemberEdit = Loadable(lazy(() => import('pages/tba/members/MemberEdit')));
const MemberView = Loadable(lazy(() => import('pages/tba/members/MemberView')));

// render - Employers module
const EmployersList = Loadable(lazy(() => import('pages/tba/employers/EmployersList')));
const EmployerCreate = Loadable(lazy(() => import('pages/tba/employers/EmployerCreate')));
const EmployerEdit = Loadable(lazy(() => import('pages/tba/employers/EmployerEdit')));
const EmployerView = Loadable(lazy(() => import('pages/tba/employers/EmployerView')));

// render - Administration pages
const AdminUsers = Loadable(lazy(() => import('pages/admin/users')));
const AdminRoles = Loadable(lazy(() => import('pages/admin/roles')));
const AdminCompanies = Loadable(lazy(() => import('pages/admin/companies')));

// render - Tools pages
const ToolsReports = Loadable(lazy(() => import('pages/tools/reports')));

// render - System Settings
const SystemSettings = Loadable(lazy(() => import('pages/system-settings/SystemSettings')));
const SystemSettingsTabGeneral = Loadable(lazy(() => import('sections/tools/system-settings/TabGeneral')));
const SystemSettingsTabCompanyInfo = Loadable(lazy(() => import('sections/tools/system-settings/TabCompanyInfo')));
const SystemSettingsTabNotifications = Loadable(lazy(() => import('sections/tools/system-settings/TabNotifications')));
const SystemSettingsTabIntegrations = Loadable(lazy(() => import('sections/tools/system-settings/TabIntegrations')));
const SystemSettingsTabSecurity = Loadable(lazy(() => import('sections/tools/system-settings/TabSecurity')));
const SystemSettingsTabAuditLog = Loadable(lazy(() => import('sections/tools/system-settings/TabAuditLog')));

// render - Profile pages
const ProfileOverview = Loadable(lazy(() => import('pages/profile/ProfileOverview')));
const AccountSettings = Loadable(lazy(() => import('pages/profile/AccountSettings')));

// pages routing
const AuthLogin = Loadable(lazy(() => import('pages/auth/jwt/login')));
const AuthRegister = Loadable(lazy(() => import('pages/auth/jwt/register')));
const AuthForgotPassword = Loadable(lazy(() => import('pages/auth/jwt/forgot-password')));
const AuthResetPassword = Loadable(lazy(() => import('pages/auth/jwt/reset-password')));
const AuthCheckMail = Loadable(lazy(() => import('pages/auth/jwt/check-mail')));
const AuthCodeVerification = Loadable(lazy(() => import('pages/auth/jwt/code-verification')));

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'dashboard',
          children: [
            {
              path: 'default',
              element: <DashboardDefault />
            },
            {
              path: 'analytics',
              element: <DashboardAnalytics />
            }
          ]
        },
        {
          path: 'tba',
          children: [
            {
              path: 'medical-services',
              element: <TbaMedicalServices />
            },
            {
              path: 'medical-categories',
              element: <TbaMedicalCategories />
            },
            {
              path: 'medical-packages',
              element: <TbaMedicalPackages />
            },
            {
              path: 'providers',
              element: <TbaProviders />
            },
            {
              path: 'reviewer-companies',
              element: <TbaReviewerCompanies />
            },
            {
              path: 'insurance-companies',
              element: <TbaInsuranceCompanies />
            },
            {
              path: 'members',
              element: (
                <RBACGuard requiredPermissions={['MANAGE_MEMBERS']}>
                  <MembersList />
                </RBACGuard>
              )
            },
            {
              path: 'members/create',
              element: (
                <RBACGuard requiredPermissions={['MANAGE_MEMBERS']}>
                  <MemberCreate />
                </RBACGuard>
              )
            },
            {
              path: 'members/edit/:id',
              element: (
                <RBACGuard requiredPermissions={['MANAGE_MEMBERS']}>
                  <MemberEdit />
                </RBACGuard>
              )
            },
            {
              path: 'members/view/:id',
              element: (
                <RBACGuard requiredPermissions={['MANAGE_MEMBERS']}>
                  <MemberView />
                </RBACGuard>
              )
            },
            {
              path: 'employers',
              element: (
                <RBACGuard requiredPermissions={['MANAGE_EMPLOYERS']}>
                  <EmployersList />
                </RBACGuard>
              )
            },
            {
              path: 'employers/create',
              element: (
                <RBACGuard requiredPermissions={['MANAGE_EMPLOYERS']}>
                  <EmployerCreate />
                </RBACGuard>
              )
            },
            {
              path: 'employers/edit/:id',
              element: (
                <RBACGuard requiredPermissions={['MANAGE_EMPLOYERS']}>
                  <EmployerEdit />
                </RBACGuard>
              )
            },
            {
              path: 'employers/view/:id',
              element: (
                <RBACGuard requiredPermissions={['MANAGE_EMPLOYERS']}>
                  <EmployerView />
                </RBACGuard>
              )
            },
            {
              path: 'claims',
              element: <TbaClaims />
            },
            {
              path: 'visits',
              element: <TbaVisits />
            },
            {
              path: 'policies',
              element: <TbaPolicies />
            },
            {
              path: 'benefit-packages',
              element: <TbaBenefitPackages />
            },
            {
              path: 'pre-authorizations',
              element: <TbaPreAuthorizations />
            },
            {
              path: 'invoices',
              element: <TbaInvoices />
            },
            {
              path: 'provider-contracts',
              element: <TbaProviderContracts />
            }
          ]
        },
        {
          path: 'admin',
          children: [
            {
              path: 'users',
              element: <AdminUsers />
            },
            {
              path: 'roles',
              element: <AdminRoles />
            },
            {
              path: 'companies',
              element: <AdminCompanies />
            }
          ]
        },
        {
          path: 'tools',
          children: [
            {
              path: 'reports',
              element: <ToolsReports />
            },
            {
              path: 'settings',
              element: <SystemSettings />,
              children: [
                {
                  path: 'general',
                  element: <SystemSettingsTabGeneral />
                },
                {
                  path: 'company-info',
                  element: <SystemSettingsTabCompanyInfo />
                },
                {
                  path: 'notifications',
                  element: <SystemSettingsTabNotifications />
                },
                {
                  path: 'integrations',
                  element: <SystemSettingsTabIntegrations />
                },
                {
                  path: 'security',
                  element: <SystemSettingsTabSecurity />
                },
                {
                  path: 'audit-log',
                  element: <SystemSettingsTabAuditLog />
                }
              ]
            }
          ]
        },
        {
          path: 'profile',
          children: [
            {
              path: 'account',
              element: <ProfileOverview />
            },
            {
              path: 'settings',
              element: <AccountSettings />
            }
          ]
        }
      ]
    },
    {
      path: '/maintenance',
      element: <PagesLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
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
    }
  ]
};

export default MainRoutes;
