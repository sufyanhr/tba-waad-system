import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import MainLayout from 'layout/Dashboard';
import RoleGuard from 'utils/route-guard/RoleGuard';

// ==============================|| LAZY LOADING - DASHBOARD ||============================== //

const Dashboard = Loadable(lazy(() => import('pages/dashboard')));

// ==============================|| LAZY LOADING - MEMBERS ||============================== //

const MembersList = Loadable(lazy(() => import('pages/members/MembersList')));
const MemberCreate = Loadable(lazy(() => import('pages/members/MemberCreate')));
const MemberEdit = Loadable(lazy(() => import('pages/members/MemberEdit')));
const MemberView = Loadable(lazy(() => import('pages/members/MemberView')));

// ==============================|| LAZY LOADING - EMPLOYERS ||============================== //

const EmployersList = Loadable(lazy(() => import('pages/employers/EmployersList')));
const EmployerCreate = Loadable(lazy(() => import('pages/employers/EmployerCreate')));
const EmployerEdit = Loadable(lazy(() => import('pages/employers/EmployerEdit')));
const EmployerView = Loadable(lazy(() => import('pages/employers/EmployerView')));

// ==============================|| LAZY LOADING - CLAIMS ||============================== //

const ClaimsList = Loadable(lazy(() => import('pages/claims/ClaimsList')));
const ClaimCreate = Loadable(lazy(() => import('pages/claims/ClaimCreate')));
const ClaimEdit = Loadable(lazy(() => import('pages/claims/ClaimEdit')));
const ClaimView = Loadable(lazy(() => import('pages/claims/ClaimView')));

// ==============================|| LAZY LOADING - PROVIDERS ||============================== //

const ProvidersList = Loadable(lazy(() => import('pages/providers/ProvidersList')));
const ProviderCreate = Loadable(lazy(() => import('pages/providers/ProviderCreate')));
const ProviderEdit = Loadable(lazy(() => import('pages/providers/ProviderEdit')));
const ProviderView = Loadable(lazy(() => import('pages/providers/ProviderView')));

// ==============================|| LAZY LOADING - PROVIDER CONTRACTS ||============================== //

const ProviderContractsList = Loadable(lazy(() => import('pages/provider-contracts')));

// ==============================|| LAZY LOADING - VISITS ||============================== //

const VisitsList = Loadable(lazy(() => import('pages/visits')));

// ==============================|| LAZY LOADING - POLICIES ||============================== //

const PoliciesList = Loadable(lazy(() => import('pages/policies/PoliciesList')));
const PolicyCreate = Loadable(lazy(() => import('pages/policies/PolicyCreate')));
const PolicyEdit = Loadable(lazy(() => import('pages/policies/PolicyEdit')));
const PolicyView = Loadable(lazy(() => import('pages/policies/PolicyView')));

// ==============================|| LAZY LOADING - PRE-APPROVALS ||============================== //

const PreApprovalsList = Loadable(lazy(() => import('pages/pre-approvals/PreApprovalsList')));
const PreApprovalCreate = Loadable(lazy(() => import('pages/pre-approvals/PreApprovalCreate')));
const PreApprovalEdit = Loadable(lazy(() => import('pages/pre-approvals/PreApprovalEdit')));
const PreApprovalView = Loadable(lazy(() => import('pages/pre-approvals/PreApprovalView')));

// ==============================|| LAZY LOADING - BENEFIT PACKAGES ||============================== //

const BenefitPackagesList = Loadable(lazy(() => import('pages/benefit-packages')));

// ==============================|| LAZY LOADING - INSURANCE COMPANIES ||============================== //

const InsuranceCompaniesList = Loadable(lazy(() => import('pages/insurance-companies/InsuranceCompaniesList')));
const InsuranceCompanyCreate = Loadable(lazy(() => import('pages/insurance-companies/InsuranceCompanyCreate')));
const InsuranceCompanyEdit = Loadable(lazy(() => import('pages/insurance-companies/InsuranceCompanyEdit')));
const InsuranceCompanyView = Loadable(lazy(() => import('pages/insurance-companies/InsuranceCompanyView')));

// ==============================|| LAZY LOADING - INSURANCE POLICIES ||============================== //

const InsurancePoliciesList = Loadable(lazy(() => import('pages/insurance-policies/InsurancePoliciesList')));
const InsurancePolicyCreate = Loadable(lazy(() => import('pages/insurance-policies/InsurancePolicyCreate')));
const InsurancePolicyEdit = Loadable(lazy(() => import('pages/insurance-policies/InsurancePolicyEdit')));
const InsurancePolicyView = Loadable(lazy(() => import('pages/insurance-policies/InsurancePolicyView')));

// ==============================|| LAZY LOADING - MEDICAL SERVICES ||============================== //

const MedicalServicesList = Loadable(lazy(() => import('pages/medical-services')));

// ==============================|| LAZY LOADING - MEDICAL CATEGORIES ||============================== //

const MedicalCategoriesList = Loadable(lazy(() => import('pages/medical-categories')));

// ==============================|| LAZY LOADING - MEDICAL PACKAGES ||============================== //

const MedicalPackagesList = Loadable(lazy(() => import('pages/medical-packages')));

// ==============================|| LAZY LOADING - COMPANIES ||============================== //

const CompaniesList = Loadable(lazy(() => import('pages/companies')));

// ==============================|| LAZY LOADING - RBAC ||============================== //

const RbacDashboard = Loadable(lazy(() => import('pages/rbac')));

// ==============================|| LAZY LOADING - REVIEWER COMPANIES ||============================== //

const ReviewerCompaniesList = Loadable(lazy(() => import('pages/reviewer-companies')));

// ==============================|| LAZY LOADING - ADMIN ||============================== //

const AdminCompaniesList = Loadable(lazy(() => import('pages/admin/companies')));
const AdminUsersList = Loadable(lazy(() => import('pages/admin/users')));
const AdminRolesList = Loadable(lazy(() => import('pages/admin/roles')));

// ==============================|| LAZY LOADING - SETTINGS ||============================== //

const Settings = Loadable(lazy(() => import('pages/settings')));

// ==============================|| LAZY LOADING - PROFILE ||============================== //

const ProfileOverview = Loadable(lazy(() => import('pages/profile/ProfileOverview')));
const AccountSettings = Loadable(lazy(() => import('pages/profile/AccountSettings')));

// ==============================|| LAZY LOADING - AUDIT ||============================== //

const AuditLog = Loadable(lazy(() => import('pages/audit')));

// ==============================|| LAZY LOADING - ERROR PAGES ||============================== //

const Error403 = Loadable(lazy(() => import('pages/errors/Forbidden403')));
const Error404 = Loadable(lazy(() => import('pages/errors/NotFound404')));
const Error500 = Loadable(lazy(() => import('pages/errors/ServerError500')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    // Dashboard
    {
      path: 'dashboard',
      element: (
        <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'COMPANY_ADMIN', 'TBA_OPERATIONS']}>
          <Dashboard />
        </RoleGuard>
      )
    },

    // Members Module
    {
      path: 'members',
      children: [
        {
          path: '',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'COMPANY_ADMIN', 'TBA_OPERATIONS']}>
              <MembersList />
            </RoleGuard>
          )
        },
        {
          path: 'add',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'COMPANY_ADMIN']}>
              <MemberCreate />
            </RoleGuard>
          )
        },
        {
          path: 'edit/:id',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'COMPANY_ADMIN']}>
              <MemberEdit />
            </RoleGuard>
          )
        },
        {
          path: ':id',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'COMPANY_ADMIN', 'TBA_OPERATIONS']}>
              <MemberView />
            </RoleGuard>
          )
        }
      ]
    },

    // Employers Module
    {
      path: 'employers',
      children: [
        {
          path: '',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
              <EmployersList />
            </RoleGuard>
          )
        },
        {
          path: 'add',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
              <EmployerCreate />
            </RoleGuard>
          )
        },
        {
          path: 'edit/:id',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
              <EmployerEdit />
            </RoleGuard>
          )
        },
        {
          path: ':id',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
              <EmployerView />
            </RoleGuard>
          )
        }
      ]
    },

    // Claims Module
    {
      path: 'claims',
      children: [
        {
          path: '',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'TBA_OPERATIONS', 'TBA_MEDICAL_REVIEWER', 'TBA_FINANCE']}>
              <ClaimsList />
            </RoleGuard>
          )
        },
        {
          path: 'add',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'TBA_OPERATIONS']}>
              <ClaimCreate />
            </RoleGuard>
          )
        },
        {
          path: 'edit/:id',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'TBA_OPERATIONS']}>
              <ClaimEdit />
            </RoleGuard>
          )
        },
        {
          path: ':id',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'TBA_OPERATIONS', 'TBA_MEDICAL_REVIEWER', 'TBA_FINANCE']}>
              <ClaimView />
            </RoleGuard>
          )
        }
      ]
    },

    // Providers Module
    {
      path: 'providers',
      children: [
        {
          path: '',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'TBA_OPERATIONS']}>
              <ProvidersList />
            </RoleGuard>
          )
        },
        {
          path: 'add',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
              <ProviderCreate />
            </RoleGuard>
          )
        },
        {
          path: 'edit/:id',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
              <ProviderEdit />
            </RoleGuard>
          )
        },
        {
          path: ':id',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'TBA_OPERATIONS']}>
              <ProviderView />
            </RoleGuard>
          )
        }
      ]
    },

    // Provider Contracts Module
    {
      path: 'provider-contracts',
      element: (
        <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
          <ProviderContractsList />
        </RoleGuard>
      )
    },

    // Visits Module
    {
      path: 'visits',
      element: (
        <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'TBA_OPERATIONS', 'TBA_MEDICAL_REVIEWER']}>
          <VisitsList />
        </RoleGuard>
      )
    },

    // Policies Module
    {
      path: 'policies',
      children: [
        {
          path: '',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'COMPANY_ADMIN']}>
              <PoliciesList />
            </RoleGuard>
          )
        },
        {
          path: 'add',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
              <PolicyCreate />
            </RoleGuard>
          )
        },
        {
          path: 'edit/:id',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
              <PolicyEdit />
            </RoleGuard>
          )
        },
        {
          path: ':id',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'COMPANY_ADMIN']}>
              <PolicyView />
            </RoleGuard>
          )
        }
      ]
    },

    // Pre-Approvals Module
    {
      path: 'pre-approvals',
      children: [
        {
          path: '',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'TBA_OPERATIONS', 'TBA_MEDICAL_REVIEWER']}>
              <PreApprovalsList />
            </RoleGuard>
          )
        },
        {
          path: 'add',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'TBA_OPERATIONS']}>
              <PreApprovalCreate />
            </RoleGuard>
          )
        },
        {
          path: 'edit/:id',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'TBA_OPERATIONS', 'TBA_MEDICAL_REVIEWER']}>
              <PreApprovalEdit />
            </RoleGuard>
          )
        },
        {
          path: ':id',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'TBA_OPERATIONS', 'TBA_MEDICAL_REVIEWER']}>
              <PreApprovalView />
            </RoleGuard>
          )
        }
      ]
    },

    // Benefit Packages Module
    {
      path: 'benefit-packages',
      element: (
        <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
          <BenefitPackagesList />
        </RoleGuard>
      )
    },

    // Insurance Companies Module
    {
      path: 'insurance-companies',
      children: [
        {
          path: '',
          element: (
            <RoleGuard roles={['SUPER_ADMIN']}>
              <InsuranceCompaniesList />
            </RoleGuard>
          )
        },
        {
          path: 'add',
          element: (
            <RoleGuard roles={['SUPER_ADMIN']}>
              <InsuranceCompanyCreate />
            </RoleGuard>
          )
        },
        {
          path: 'edit/:id',
          element: (
            <RoleGuard roles={['SUPER_ADMIN']}>
              <InsuranceCompanyEdit />
            </RoleGuard>
          )
        },
        {
          path: ':id',
          element: (
            <RoleGuard roles={['SUPER_ADMIN']}>
              <InsuranceCompanyView />
            </RoleGuard>
          )
        }
      ]
    },

    // Insurance Policies Module
    {
      path: 'insurance-policies',
      children: [
        {
          path: '',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
              <InsurancePoliciesList />
            </RoleGuard>
          )
        },
        {
          path: 'add',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
              <InsurancePolicyCreate />
            </RoleGuard>
          )
        },
        {
          path: 'edit/:id',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
              <InsurancePolicyEdit />
            </RoleGuard>
          )
        },
        {
          path: ':id',
          element: (
            <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
              <InsurancePolicyView />
            </RoleGuard>
          )
        }
      ]
    },

    // Medical Services Module
    {
      path: 'medical-services',
      element: (
        <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
          <MedicalServicesList />
        </RoleGuard>
      )
    },

    // Medical Categories Module
    {
      path: 'medical-categories',
      element: (
        <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
          <MedicalCategoriesList />
        </RoleGuard>
      )
    },

    // Medical Packages Module
    {
      path: 'medical-packages',
      element: (
        <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
          <MedicalPackagesList />
        </RoleGuard>
      )
    },

    // Companies Module
    {
      path: 'companies',
      element: (
        <RoleGuard roles={['SUPER_ADMIN']}>
          <CompaniesList />
        </RoleGuard>
      )
    },

    // Reviewer Companies Module
    {
      path: 'reviewer-companies',
      element: (
        <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
          <ReviewerCompaniesList />
        </RoleGuard>
      )
    },

    // Admin Module
    {
      path: 'admin',
      children: [
        {
          path: 'companies',
          element: (
            <RoleGuard roles={['SUPER_ADMIN']}>
              <AdminCompaniesList />
            </RoleGuard>
          )
        },
        {
          path: 'users',
          element: (
            <RoleGuard roles={['SUPER_ADMIN']}>
              <AdminUsersList />
            </RoleGuard>
          )
        },
        {
          path: 'roles',
          element: (
            <RoleGuard roles={['SUPER_ADMIN']}>
              <AdminRolesList />
            </RoleGuard>
          )
        }
      ]
    },

    // RBAC Module
    {
      path: 'rbac',
      element: (
        <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
          <RbacDashboard />
        </RoleGuard>
      )
    },

    // Settings
    {
      path: 'settings',
      element: (
        <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN', 'COMPANY_ADMIN']}>
          <Settings />
        </RoleGuard>
      )
    },

    // Profile
    {
      path: 'profile',
      children: [
        {
          path: '',
          element: <ProfileOverview />
        },
        {
          path: 'account',
          element: <AccountSettings />
        }
      ]
    },

    // Audit Log
    {
      path: 'audit',
      element: (
        <RoleGuard roles={['SUPER_ADMIN', 'INSURANCE_ADMIN']}>
          <AuditLog />
        </RoleGuard>
      )
    },

    // Error Pages
    {
      path: '403',
      element: <Error403 />
    },
    {
      path: '404',
      element: <Error404 />
    },
    {
      path: '500',
      element: <Error500 />
    },
    {
      path: '*',
      element: <Error404 />
    }
  ]
};

export default MainRoutes;
