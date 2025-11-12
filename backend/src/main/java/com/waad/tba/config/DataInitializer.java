package com.waad.tba.config;

import com.waad.tba.model.*;
import com.waad.tba.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepo;
    private final ReviewCompanyRepository reviewCompanyRepo;
    private final InsuranceCompanyRepository insuranceCompanyRepo;
    private final OrganizationRepository organizationRepository; // NEW
    private final MemberRepository memberRepository;             // NEW
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {

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
            admin.getRoles().add(User.Role.ADMIN);
            admin.setFullName("مدير النظام");
            userRepo.save(admin);
        }

        // 4) مدير شركة المراجعة
        if (!userRepo.existsByUsername("reviewAdmin")) {
            User reviewer = new User();
            reviewer.setUsername("reviewAdmin");
            reviewer.setEmail("review@waad.ly");
            reviewer.setPassword(encoder.encode(reviewPassword));
            reviewer.getRoles().add(User.Role.REVIEW);
            reviewer.setFullName("مدير شركة وعد");
            reviewer.setReviewCompany(waad);
            userRepo.save(reviewer);
        }

        // 5) مدير شركة التأمين
        if (!userRepo.existsByUsername("insuranceAdmin")) {
            User insuranceUser = new User();
            insuranceUser.setUsername("insuranceAdmin");
            insuranceUser.setEmail("insurance@wahda.ly");
            insuranceUser.setPassword(encoder.encode(insurancePassword));
            insuranceUser.getRoles().add(User.Role.INSURANCE);
            insuranceUser.setFullName("مدير شركة الواحة للتأمين");
            insuranceUser.setInsuranceCompany(wahda);
            userRepo.save(insuranceUser);
        }

        // 6) مؤسسة تجريبية + Employer تابع لها
        // نتجنب الإنشاء المكرر إن كانت المؤسسة موجودة باسمها
        Organization cementCompany = organizationRepository.findByName("شركة الأسمنت الأهلية")
                .orElseGet(() -> {
                    Organization org = new Organization();
                    org.setName("شركة الأسمنت الأهلية");
                    org.setAddress("بنغازي");
                    org.setParentOrganization(null); // يمكن لاحقًا ربطها بمنظمة رئيسية
                    return organizationRepository.save(org);
                });

        // لو لم يتم تعيين مدير لها بعد، ننشئ Member Employer
        if (cementCompany.getEmployerOwner() == null) {
            Member employer = new Member();
            employer.setFullName("مدير شركة الأسمنت");
            employer.setEmail("employer@cement.ly");
            employer.setPhone("0911111111");
            employer.setMemberNumber("EMP001");
            employer.setOrganization(cementCompany);
            employer.setInsuranceCompany(wahda);
            employer.setEmployer(true); // ملاحظة: setter الصحيح
            memberRepository.save(employer);

            cementCompany.setEmployerOwner(employer);
            organizationRepository.save(cementCompany);
        }
    }
}
