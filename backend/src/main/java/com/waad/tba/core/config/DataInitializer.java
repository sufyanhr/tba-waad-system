package com.waad.tba.core.config;

import com.waad.tba.security.model.User;
import com.waad.tba.security.repository.UserRepository;
import com.waad.tba.modules.insurance.model.*;
import com.waad.tba.modules.insurance.repository.*;
import com.waad.tba.modules.employers.model.Organization;
import com.waad.tba.modules.employers.repository.OrganizationRepository;
import com.waad.tba.modules.members.model.Member;
import com.waad.tba.modules.members.repository.MemberRepository;
import com.waad.tba.rbac.model.*;
import com.waad.tba.rbac.service.PermissionService;
import com.waad.tba.rbac.service.RoleService;
import com.waad.tba.rbac.service.UserRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepo;
    private final ReviewCompanyRepository reviewCompanyRepo;
    private final InsuranceCompanyRepository insuranceCompanyRepo;
    private final OrganizationRepository organizationRepository;
    private final MemberRepository memberRepository;
    private final PasswordEncoder encoder;
    private final PermissionService permissionService;
    private final RoleService roleService;
    private final UserRoleService userRoleService;

    @Override
    public void run(String... args) {

        // Initialize permissions and roles first
        initializePermissionsAndRoles();

        // كلمات المرور الافتراضية
        String adminPassword = System.getProperty("app.default.admin.password",
                System.getenv().getOrDefault("APP_DEFAULT_ADMIN_PASSWORD", "changeMeAdmin!"));
        String reviewPassword = System.getProperty("app.default.review.password",
                System.getenv().getOrDefault("APP_DEFAULT_REVIEW_PASSWORD", "changeMeReview!"));
        String insurancePassword = System.getProperty("app.default.insurance.password",
                System.getenv().getOrDefault("APP_DEFAULT_INSURANCE_PASSWORD", "changeMeInsurance!"));

        // 1) شركة المراجعة (وعد)
        ReviewCompany waad = reviewCompanyRepo.findByName("شركة وعد للمراجعة الطبية")
                .orElseGet(() -> {
                    ReviewCompany rc = new ReviewCompany();
                    rc.setName("شركة وعد للمراجعة الطبية");
                    rc.setEmail("info@waad.ly");
                    rc.setPhone("0912345678");
                    rc.setAddress("طرابلس");
                    return reviewCompanyRepo.save(rc);
                });

        // 2) شركة التأمين (الواحة)
        InsuranceCompany wahda = insuranceCompanyRepo.findByName("شركة الواحة للتأمين")
                .orElseGet(() -> {
                    InsuranceCompany ic = new InsuranceCompany();
                    ic.setName("شركة الواحة للتأمين");
                    ic.setEmail("contact@wahda.ly");
                    ic.setPhone("0920000000");
                    ic.setAddress("طرابلس");
                    return insuranceCompanyRepo.save(ic);
                });

        // 3) مدير النظام
        if (!userRepo.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@tba.ly");
            admin.setPassword(encoder.encode(adminPassword));
            admin.setFullName("مدير النظام");
            User savedAdmin = userRepo.save(admin);
            
            // Assign ADMIN role
            Role adminRole = roleService.getRoleByName("ADMIN");
            userRoleService.assignRoleToUser(savedAdmin.getId(), adminRole.getId());
        }

        // 4) مدير شركة المراجعة
        if (!userRepo.existsByUsername("reviewAdmin")) {
            User reviewer = new User();
            reviewer.setUsername("reviewAdmin");
            reviewer.setEmail("review@waad.ly");
            reviewer.setPassword(encoder.encode(reviewPassword));
            reviewer.setFullName("مدير شركة وعد");
            reviewer.setReviewCompany(waad);
            User savedReviewer = userRepo.save(reviewer);
            
            // Assign REVIEW role
            Role reviewRole = roleService.getRoleByName("REVIEW");
            userRoleService.assignRoleToUser(savedReviewer.getId(), reviewRole.getId());
        }

        // 5) مدير شركة التأمين
        if (!userRepo.existsByUsername("insuranceAdmin")) {
            User insuranceUser = new User();
            insuranceUser.setUsername("insuranceAdmin");
            insuranceUser.setEmail("insurance@wahda.ly");
            insuranceUser.setPassword(encoder.encode(insurancePassword));
            insuranceUser.setFullName("مدير شركة الواحة للتأمين");
            insuranceUser.setInsuranceCompany(wahda);
            User savedInsuranceUser = userRepo.save(insuranceUser);
            
            // Assign INSURANCE role
            Role insuranceRole = roleService.getRoleByName("INSURANCE");
            userRoleService.assignRoleToUser(savedInsuranceUser.getId(), insuranceRole.getId());
        }

        // 6) مؤسسة تجريبية + Employer تابع لها
        Organization cementCompany = organizationRepository.findByName("شركة الأسمنت الأهلية")
                .orElseGet(() -> {
                    Organization org = new Organization();
                    org.setName("شركة الأسمنت الأهلية");
                    org.setAddress("بنغازي");
                    org.setParentOrganization(null);
                    return organizationRepository.save(org);
                });

        // Create employer user for cement company
        if (!userRepo.existsByUsername("employerCement")) {
            User employer = new User();
            employer.setUsername("employerCement");
            employer.setEmail("hr@cement.ly");
            employer.setPassword(encoder.encode("changeMeEmployer!"));
            employer.setFullName("مدير الموارد البشرية");
            employer.setOrganization(cementCompany);
            User savedEmployer = userRepo.save(employer);
            
            // Assign EMPLOYER role
            Role employerRole = roleService.getRoleByName("EMPLOYER");
            userRoleService.assignRoleToUser(savedEmployer.getId(), employerRole.getId());
        }
    }

    private void initializePermissionsAndRoles() {
        // Create RBAC permissions according to the specification
        
        // Members Module Permissions
        createPermissionIfNotExists("MEMBERS_VIEW", "عرض بيانات الأعضاء");
        createPermissionIfNotExists("MEMBERS_CREATE", "إنشاء عضو جديد");
        createPermissionIfNotExists("MEMBERS_UPDATE", "تحديث بيانات العضو");
        createPermissionIfNotExists("MEMBERS_DELETE", "حذف عضو");
        
        // Claims Module Permissions
        createPermissionIfNotExists("CLAIMS_SUBMIT", "تقديم مطالبة جديدة");
        createPermissionIfNotExists("CLAIMS_REVIEW", "مراجعة المطالبات");
        createPermissionIfNotExists("CLAIMS_APPROVE", "الموافقة على المطالبات");
        createPermissionIfNotExists("CLAIMS_REJECT", "رفض المطالبات");
        createPermissionIfNotExists("CLAIMS_DELETE", "حذف المطالبات");
        
        // Providers Module Permissions
        createPermissionIfNotExists("PROVIDERS_VIEW", "عرض مزودي الخدمة");
        createPermissionIfNotExists("PROVIDERS_CREATE", "إنشاء مزود خدمة جديد");
        createPermissionIfNotExists("PROVIDERS_UPDATE", "تحديث بيانات مزود الخدمة");
        createPermissionIfNotExists("PROVIDERS_DELETE", "حذف مزود خدمة");
        
        // Employers Module Permissions
        createPermissionIfNotExists("EMPLOYERS_VIEW", "عرض أصحاب العمل");
        createPermissionIfNotExists("EMPLOYERS_UPDATE", "تحديث بيانات أصحاب العمل");
        
        // Insurance Module Permissions
        createPermissionIfNotExists("INSURANCE_MANAGE", "إدارة شركات التأمين");
        
        // System Permissions
        createPermissionIfNotExists("SYSTEM_ADMIN", "إدارة النظام الكاملة");
        
        // Legacy permissions for compatibility
        createPermissionIfNotExists("CREATE_USER", "إنشاء مستخدم جديد");
        createPermissionIfNotExists("READ_USER", "عرض بيانات المستخدمين");
        createPermissionIfNotExists("UPDATE_USER", "تحديث بيانات المستخدم");
        createPermissionIfNotExists("DELETE_USER", "حذف مستخدم");
        createPermissionIfNotExists("CREATE_ROLE", "إنشاء دور جديد");
        createPermissionIfNotExists("READ_ROLE", "عرض الأدوار");
        createPermissionIfNotExists("CREATE_PERMISSION", "إنشاء صلاحية جديدة");
        createPermissionIfNotExists("READ_PERMISSION", "عرض الصلاحيات");

        // Create roles if they don't exist
        createRoleIfNotExists("ADMIN", "مدير النظام الكامل");
        createRoleIfNotExists("REVIEW", "شركة المراجعة الطبية");
        createRoleIfNotExists("INSURANCE", "شركة التأمين");
        createRoleIfNotExists("EMPLOYER", "صاحب العمل");
        createRoleIfNotExists("PROVIDER", "مزود الخدمة");
        createRoleIfNotExists("MEMBER", "العضو المؤمن عليه");

        // Assign permissions to roles
        assignPermissionsToRoles();
    }

    private void createPermissionIfNotExists(String name, String description) {
        if (!permissionService.existsByName(name)) {
            Permission permission = new Permission(name, description);
            permissionService.createPermission(permission);
        }
    }

    private void createRoleIfNotExists(String name, String description) {
        if (!roleService.existsByName(name)) {
            Role role = new Role(name, description);
            roleService.createRole(role);
        }
    }

    private void assignPermissionsToRoles() {
        try {
            // ADMIN - all permissions
            Role adminRole = roleService.getRoleByName("ADMIN");
            if (adminRole.getRolePermissions().isEmpty()) {
                Set<Long> allPermissionIds = Set.of(
                    permissionService.getPermissionByName("MEMBERS_VIEW").getId(),
                    permissionService.getPermissionByName("MEMBERS_CREATE").getId(),
                    permissionService.getPermissionByName("MEMBERS_UPDATE").getId(),
                    permissionService.getPermissionByName("MEMBERS_DELETE").getId(),
                    permissionService.getPermissionByName("CLAIMS_SUBMIT").getId(),
                    permissionService.getPermissionByName("CLAIMS_REVIEW").getId(),
                    permissionService.getPermissionByName("CLAIMS_APPROVE").getId(),
                    permissionService.getPermissionByName("CLAIMS_REJECT").getId(),
                    permissionService.getPermissionByName("CLAIMS_DELETE").getId(),
                    permissionService.getPermissionByName("PROVIDERS_VIEW").getId(),
                    permissionService.getPermissionByName("PROVIDERS_CREATE").getId(),
                    permissionService.getPermissionByName("PROVIDERS_UPDATE").getId(),
                    permissionService.getPermissionByName("PROVIDERS_DELETE").getId(),
                    permissionService.getPermissionByName("EMPLOYERS_VIEW").getId(),
                    permissionService.getPermissionByName("EMPLOYERS_UPDATE").getId(),
                    permissionService.getPermissionByName("INSURANCE_MANAGE").getId(),
                    permissionService.getPermissionByName("SYSTEM_ADMIN").getId(),
                    permissionService.getPermissionByName("CREATE_USER").getId(),
                    permissionService.getPermissionByName("READ_USER").getId(),
                    permissionService.getPermissionByName("UPDATE_USER").getId(),
                    permissionService.getPermissionByName("DELETE_USER").getId(),
                    permissionService.getPermissionByName("CREATE_ROLE").getId(),
                    permissionService.getPermissionByName("READ_ROLE").getId(),
                    permissionService.getPermissionByName("CREATE_PERMISSION").getId(),
                    permissionService.getPermissionByName("READ_PERMISSION").getId()
                );
                roleService.setRolePermissions(adminRole.getId(), allPermissionIds);
            }

            // REVIEW (Company: Waad) - Claims Review and Approve
            Role reviewRole = roleService.getRoleByName("REVIEW");
            if (reviewRole.getRolePermissions().isEmpty()) {
                Set<Long> reviewPermissionIds = Set.of(
                    permissionService.getPermissionByName("CLAIMS_REVIEW").getId(),
                    permissionService.getPermissionByName("CLAIMS_APPROVE").getId(),
                    permissionService.getPermissionByName("CLAIMS_REJECT").getId(),
                    permissionService.getPermissionByName("READ_USER").getId(),
                    permissionService.getPermissionByName("READ_ROLE").getId(),
                    permissionService.getPermissionByName("READ_PERMISSION").getId()
                );
                roleService.setRolePermissions(reviewRole.getId(), reviewPermissionIds);
            }

            // INSURANCE (Company: Al-Waha) - Members View, Claims Review
            Role insuranceRole = roleService.getRoleByName("INSURANCE");
            if (insuranceRole.getRolePermissions().isEmpty()) {
                Set<Long> insurancePermissionIds = Set.of(
                    permissionService.getPermissionByName("MEMBERS_VIEW").getId(),
                    permissionService.getPermissionByName("MEMBERS_CREATE").getId(),
                    permissionService.getPermissionByName("MEMBERS_UPDATE").getId(),
                    permissionService.getPermissionByName("CLAIMS_REVIEW").getId(),
                    permissionService.getPermissionByName("CLAIMS_APPROVE").getId(),
                    permissionService.getPermissionByName("CLAIMS_REJECT").getId(),
                    permissionService.getPermissionByName("INSURANCE_MANAGE").getId(),
                    permissionService.getPermissionByName("READ_USER").getId()
                );
                roleService.setRolePermissions(insuranceRole.getId(), insurancePermissionIds);
            }

            // EMPLOYER (cement factory, bank, etc.) - Members View
            Role employerRole = roleService.getRoleByName("EMPLOYER");
            if (employerRole.getRolePermissions().isEmpty()) {
                Set<Long> employerPermissionIds = Set.of(
                    permissionService.getPermissionByName("MEMBERS_VIEW").getId(),
                    permissionService.getPermissionByName("EMPLOYERS_VIEW").getId(),
                    permissionService.getPermissionByName("EMPLOYERS_UPDATE").getId()
                );
                roleService.setRolePermissions(employerRole.getId(), employerPermissionIds);
            }

            // PROVIDER (hospital/clinic) - Claims Submit
            Role providerRole = roleService.getRoleByName("PROVIDER");
            if (providerRole.getRolePermissions().isEmpty()) {
                Set<Long> providerPermissionIds = Set.of(
                    permissionService.getPermissionByName("CLAIMS_SUBMIT").getId(),
                    permissionService.getPermissionByName("PROVIDERS_VIEW").getId(),
                    permissionService.getPermissionByName("PROVIDERS_UPDATE").getId(),
                    permissionService.getPermissionByName("MEMBERS_VIEW").getId()
                );
                roleService.setRolePermissions(providerRole.getId(), providerPermissionIds);
            }

            // MEMBER (insured employee) - no permissions (for mobile app later)
            Role memberRole = roleService.getRoleByName("MEMBER");
            if (memberRole.getRolePermissions().isEmpty()) {
                // Members have no administrative permissions - they will use mobile app later
                // For now, we might give them minimal read access to their own data
                Set<Long> memberPermissionIds = Set.of();
                roleService.setRolePermissions(memberRole.getId(), memberPermissionIds);
            }
            
        } catch (Exception e) {
            System.out.println("Error in assignPermissionsToRoles: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
