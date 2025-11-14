#!/bin/bash

# تحديث imports في جميع ملفات المشروع
echo "Updating imports..."

# تحديث imports للـ core classes
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.dto\.ApiResponse;/import com.waad.tba.core.dto.ApiResponse;/g' {} \;
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.exception\./import com.waad.tba.core.exception./g' {} \;
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.base\./import com.waad.tba.core.base./g' {} \;
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.util\./import com.waad.tba.core.util./g' {} \;

# تحديث imports للـ User و UserRepository
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.model\.User;/import com.waad.tba.security.User;/g' {} \;
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.repository\.UserRepository;/import com.waad.tba.security.UserRepository;/g' {} \;

# تحديث imports للـ models
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.model\.Member;/import com.waad.tba.modules.members.model.Member;/g' {} \;
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.model\.Organization;/import com.waad.tba.modules.employers.model.Organization;/g' {} \;
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.model\.Provider;/import com.waad.tba.modules.providers.model.Provider;/g' {} \;
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.model\.InsuranceCompany;/import com.waad.tba.modules.insurance.model.InsuranceCompany;/g' {} \;
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.model\.ReviewCompany;/import com.waad.tba.modules.insurance.model.ReviewCompany;/g' {} \;
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.model\.Policy;/import com.waad.tba.modules.insurance.model.Policy;/g' {} \;
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.model\.Claim;/import com.waad.tba.modules.claims.model.Claim;/g' {} \;
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.model\.Finance;/import com.waad.tba.modules.finance.model.Finance;/g' {} \;
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.model\.AuditLog;/import com.waad.tba.modules.reports.model.AuditLog;/g' {} \;

# تحديث imports للـ repositories
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.repository\.MemberRepository;/import com.waad.tba.modules.members.repository.MemberRepository;/g' {} \;
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.repository\.OrganizationRepository;/import com.waad.tba.modules.employers.repository.OrganizationRepository;/g' {} \;
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.repository\.ProviderRepository;/import com.waad.tba.modules.providers.repository.ProviderRepository;/g' {} \;
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.repository\.InsuranceCompanyRepository;/import com.waad.tba.modules.insurance.repository.InsuranceCompanyRepository;/g' {} \;
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.repository\.ReviewCompanyRepository;/import com.waad.tba.modules.insurance.repository.ReviewCompanyRepository;/g' {} \;

# تحديث imports للـ services
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.service\.MemberService;/import com.waad.tba.modules.members.service.MemberService;/g' {} \;
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.service\.OrganizationService;/import com.waad.tba.modules.employers.service.OrganizationService;/g' {} \;
find src/main/java -name "*.java" -exec sed -i 's/import com\.waad\.tba\.service\.UserService;/import com.waad.tba.security.UserService;/g' {} \;

echo "Imports updated!"