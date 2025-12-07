import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import RBACGuard from 'components/tba/RBACGuard';
import ProtectedRoute from 'components/ProtectedRoute';
import RoleGuard from 'utils/route-guard/RoleGuard';

// render - TBA pages
const TbaMedicalServices = Loadable(lazy(() => import('pages/medical-services')));
const TbaMedicalCategories = Loadable(lazy(() => import('pages/medical-categories')));
const TbaProviders = Loadable(lazy(() => import('pages/providers')));
const TbaMembers = Loadable(lazy(() => import('pages/members')));
const TbaEmployers = Loadable(lazy(() => import('pages/employers')));
const TbaVisits = Loadable(lazy(() => import('pages/visits')));
const TbaPolicies = Loadable(lazy(() => import('pages/policies')));
const TbaBenefitPackages = Loadable(lazy(() => import('pages/benefit-packages')));
const TbaPreAuthorizations = Loadable(lazy(() => import('pages/pre-authorizations')));
const TbaInvoices = Loadable(lazy(() => import('pages/invoices')));
const TbaProviderContracts = Loadable(lazy(() => import('pages/provider-contracts')));
const TbaReviewerCompanies = Loadable(lazy(() => import('pages/reviewer-companies')));
const TbaMedicalPackages = Loadable(lazy(() => import('pages/medical-packages')));
const TbaInsuranceCompanies = Loadable(lazy(() => import('pages/insurance-companies')));

// render - TBA New Pages (Phase B1)
const TbaSettings = Loadable(lazy(() => import('pages/settings')));
const TbaRBAC = Loadable(lazy(() => import('pages/rbac')));
const TbaAudit = Loadable(lazy(() => import('pages/audit')));
const TbaCompanies = Loadable(lazy(() => import('pages/companies')));
const TbaDashboard = Loadable(lazy(() => import('pages/dashboard')));

// render - Error pages (Phase B2)
const Forbidden403 = Loadable(lazy(() => import('pages/errors/Forbidden403')));

// render - Members module
const MembersList = Loadable(lazy(() => import('pages/members/MembersList')));
const MemberCreate = Loadable(lazy(() => import('pages/members/MemberCreate')));
const MemberEdit = Loadable(lazy(() => import('pages/members/MemberEdit')));
const MemberView = Loadable(lazy(() => import('pages/members/MemberView')));

// render - Employers module
const EmployersList = Loadable(lazy(() => import('pages/employers/EmployersList')));
const EmployerCreate = Loadable(lazy(() => import('pages/employers/EmployerCreate')));
const EmployerEdit = Loadable(lazy(() => import('pages/employers/EmployerEdit')));
const EmployerView = Loadable(lazy(() => import('pages/employers/EmployerView')));

// render - Insurance Companies module
const InsuranceCompaniesList = Loadable(lazy(() => import('pages/insurance-companies/InsuranceCompaniesList')));
const InsuranceCompanyCreate = Loadable(lazy(() => import('pages/insurance-companies/InsuranceCompanyCreate')));
const InsuranceCompanyEdit = Loadable(lazy(() => import('pages/insurance-companies/InsuranceCompanyEdit')));
const InsuranceCompanyView = Loadable(lazy(() => import('pages/insurance-companies/InsuranceCompanyView')));

// render - Policies module (Phase B8)
const PoliciesList = Loadable(lazy(() => import('pages/policies/PoliciesList')));
const PolicyCreate = Loadable(lazy(() => import('pages/policies/PolicyCreate')));
const PolicyEdit = Loadable(lazy(() => import('pages/policies/PolicyEdit')));
const PolicyView = Loadable(lazy(() => import('pages/policies/PolicyView')));

// render - Pre-Approvals module (Phase B9)
const PreApprovalsList = Loadable(lazy(() => import('pages/pre-approvals/PreApprovalsList')));
const PreApprovalCreate = Loadable(lazy(() => import('pages/pre-approvals/PreApprovalCreate')));
const PreApprovalEdit = Loadable(lazy(() => import('pages/pre-approvals/PreApprovalEdit')));
const PreApprovalView = Loadable(lazy(() => import('pages/pre-approvals/PreApprovalView')));

// render - Claims module (Phase B10)
const ClaimsList = Loadable(lazy(() => import('pages/claims/ClaimsList')));
const ClaimCreate = Loadable(lazy(() => import('pages/claims/ClaimCreate')));
const ClaimEdit = Loadable(lazy(() => import('pages/claims/ClaimEdit')));
const ClaimView = Loadable(lazy(() => import('pages/claims/ClaimView')));

// render - Providers module (Phase B12)
const ProvidersList = Loadable(lazy(() => import('pages/providers/ProvidersList')));
const ProviderCreate = Loadable(lazy(() => import('pages/providers/ProviderCreate')));
const ProviderEdit = Loadable(lazy(() => import('pages/providers/ProviderEdit')));
const ProviderView = Loadable(lazy(() => import('pages/providers/ProviderView')));

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
const MaintenanceUnauthorized = Loadable(lazy(() => import('pages/extra-pages/unauthorized')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '',
          children: [
            {
              path: 'dashboard',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
                  <TbaDashboard />
                </RoleGuard>
              )
            },
            {
              path: 'medical-services',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
                  <TbaMedicalServices />
                </RoleGuard>
              )
            },
            {
              path: 'medical-categories',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
                  <TbaMedicalCategories />
                </RoleGuard>
              )
            },
            {
              path: 'medical-packages',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
                  <TbaMedicalPackages />
                </RoleGuard>
              )
            },
            {
              path: 'providers',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['VIEW_PROVIDERS']}>
                  <ProvidersList />
                </RoleGuard>
              )
            },
            {
              path: 'providers/create',
              element: (
                <RoleGuard roles={['SUPER_ADMIN']} permissions={['MANAGE_PROVIDERS']}>
                  <ProviderCreate />
                </RoleGuard>
              )
            },
            {
              path: 'providers/edit/:id',
              element: (
                <RoleGuard roles={['SUPER_ADMIN']} permissions={['MANAGE_PROVIDERS']}>
                  <ProviderEdit />
                </RoleGuard>
              )
            },
            {
              path: 'providers/view/:id',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['VIEW_PROVIDERS']}>
                  <ProviderView />
                </RoleGuard>
              )
            },
            {
              path: 'reviewer-companies',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
                  <TbaReviewerCompanies />
                </RoleGuard>
              )
            },
            {
              path: 'insurance-companies',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
                  <TbaInsuranceCompanies />
                </RoleGuard>
              )
            },
            {
              path: 'members',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'EMPLOYER_ADMIN']} permissions={['MANAGE_MEMBERS']}>
                  <MembersList />
                </RoleGuard>
              )
            },
            {
              path: 'members/create',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'EMPLOYER_ADMIN']} permissions={['MANAGE_MEMBERS']}>
                  <MemberCreate />
                </RoleGuard>
              )
            },
            {
              path: 'members/edit/:id',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'EMPLOYER_ADMIN']} permissions={['MANAGE_MEMBERS']}>
                  <MemberEdit />
                </RoleGuard>
              )
            },
            {
              path: 'members/view/:id',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'EMPLOYER_ADMIN']} permissions={['MANAGE_MEMBERS']}>
                  <MemberView />
                </RoleGuard>
              )
            },
            {
              path: 'employers',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['MANAGE_EMPLOYERS']}>
                  <EmployersList />
                </RoleGuard>
              )
            },
            {
              path: 'employers/create',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['MANAGE_EMPLOYERS']}>
                  <EmployerCreate />
                </RoleGuard>
              )
            },
            {
              path: 'employers/edit/:id',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['MANAGE_EMPLOYERS']}>
                  <EmployerEdit />
                </RoleGuard>
              )
            },
            {
              path: 'employers/view/:id',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['MANAGE_EMPLOYERS']}>
                  <EmployerView />
                </RoleGuard>
              )
            },
            {
              path: 'insurance-companies',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['VIEW_INSURANCE']}>
                  <InsuranceCompaniesList />
                </RoleGuard>
              )
            },
            {
              path: 'insurance-companies/create',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['MANAGE_INSURANCE']}>
                  <InsuranceCompanyCreate />
                </RoleGuard>
              )
            },
            {
              path: 'insurance-companies/edit/:id',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['MANAGE_INSURANCE']}>
                  <InsuranceCompanyEdit />
                </RoleGuard>
              )
            },
            {
              path: 'insurance-companies/view/:id',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['VIEW_INSURANCE']}>
                  <InsuranceCompanyView />
                </RoleGuard>
              )
            },
            {
              path: 'visits',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'EMPLOYER_ADMIN', 'PROVIDER']} featureToggle="canViewVisits">
                  <TbaVisits />
                </RoleGuard>
              )
            },
            {
              path: 'policies',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['VIEW_POLICIES']}>
                  <PoliciesList />
                </RoleGuard>
              )
            },
            {
              path: 'policies/create',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['MANAGE_POLICIES']}>
                  <PolicyCreate />
                </RoleGuard>
              )
            },
            {
              path: 'policies/edit/:id',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['MANAGE_POLICIES']}>
                  <PolicyEdit />
                </RoleGuard>
              )
            },
            {
              path: 'policies/view/:id',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['VIEW_POLICIES']}>
                  <PolicyView />
                </RoleGuard>
              )
            },
            {
              path: 'pre-approvals',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['VIEW_PREAPPROVALS']}>
                  <PreApprovalsList />
                </RoleGuard>
              )
            },
            {
              path: 'pre-approvals/create',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['MANAGE_PREAPPROVALS']}>
                  <PreApprovalCreate />
                </RoleGuard>
              )
            },
            {
              path: 'pre-approvals/edit/:id',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['MANAGE_PREAPPROVALS']}>
                  <PreApprovalEdit />
                </RoleGuard>
              )
            },
            {
              path: 'pre-approvals/view/:id',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['VIEW_PREAPPROVALS']}>
                  <PreApprovalView />
                </RoleGuard>
              )
            },
            {
              path: 'claims',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['VIEW_CLAIMS']}>
                  <ClaimsList />
                </RoleGuard>
              )
            },
            {
              path: 'claims/create',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['MANAGE_CLAIMS']}>
                  <ClaimCreate />
                </RoleGuard>
              )
            },
            {
              path: 'claims/edit/:id',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['MANAGE_CLAIMS']}>
                  <ClaimEdit />
                </RoleGuard>
              )
            },
            {
              path: 'claims/view/:id',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']} permissions={['VIEW_CLAIMS']}>
                  <ClaimView />
                </RoleGuard>
              )
            },
            {
              path: 'benefit-packages',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
                  <TbaBenefitPackages />
                </RoleGuard>
              )
            },
            {
              path: 'pre-authorizations',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
                  <TbaPreAuthorizations />
                </RoleGuard>
              )
            },
            {
              path: 'invoices',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
                  <TbaInvoices />
                </RoleGuard>
              )
            },
            {
              path: 'provider-contracts',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
                  <TbaProviderContracts />
                </RoleGuard>
              )
            },
            {
              path: 'settings',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
                  <TbaSettings />
                </RoleGuard>
              )
            },
            {
              path: 'rbac',
              element: (
                <RoleGuard roles={['SUPER_ADMIN']}>
                  <TbaRBAC />
                </RoleGuard>
              )
            },
            {
              path: 'audit',
              element: (
                <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
                  <TbaAudit />
                </RoleGuard>
              )
            },
            {
              path: 'companies',
              element: (
                <RoleGuard roles={['SUPER_ADMIN']}>
                  <TbaCompanies />
                </RoleGuard>
              )
            },
            {
              path: '403',
              element: <Forbidden403 />
            }
          ]
        },
        {
          path: 'admin',
          children: [
            {
              path: 'users',
              element: (
                <ProtectedRoute requiredRoles={['ADMIN']}>
                  <AdminUsers />
                </ProtectedRoute>
              )
            },
            {
              path: 'roles',
              element: (
                <ProtectedRoute requiredRoles={['ADMIN']}>
                  <AdminRoles />
                </ProtectedRoute>
              )
            },
            {
              path: 'companies',
              element: (
                <ProtectedRoute requiredRoles={['ADMIN']}>
                  <AdminCompanies />
                </ProtectedRoute>
              )
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
              element: (
                <ProtectedRoute requiredRoles={['ADMIN', 'TBA_OPERATIONS']}>
                  <SystemSettings />
                </ProtectedRoute>
              ),
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
        },
        {
          path: 'unauthorized',
          element: <MaintenanceUnauthorized />
        }
      ]
    },
    {
      path: '/unauthorized',
      element: <MaintenanceUnauthorized />
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
