#!/bin/bash

echo "Adding missing imports..."

# إضافة imports للـ models في كل ملف
find src/main/java/com/waad/tba/modules/members/model -name "*.java" -exec sed -i '1a\
import com.waad.tba.modules.employers.model.Organization;\
import com.waad.tba.modules.insurance.model.InsuranceCompany;\
import com.waad.tba.modules.insurance.model.Policy;\
import com.waad.tba.modules.claims.model.Claim;' {} \;

find src/main/java/com/waad/tba/modules/employers/model -name "*.java" -exec sed -i '1a\
import com.waad.tba.modules.members.model.Member;\
import com.waad.tba.modules.insurance.model.ReviewCompany;' {} \;

find src/main/java/com/waad/tba/modules/insurance/model -name "*.java" -exec sed -i '1a\
import com.waad.tba.modules.employers.model.Organization;\
import com.waad.tba.modules.members.model.Member;\
import com.waad.tba.security.User;' {} \;

find src/main/java/com/waad/tba/modules/claims/model -name "*.java" -exec sed -i '1a\
import com.waad.tba.modules.members.model.Member;' {} \;

# إضافة imports للـ services و controllers
find src/main/java/com/waad/tba/modules -name "*Service.java" -exec sed -i '1a\
import com.waad.tba.modules.members.model.BenefitTable;\
import com.waad.tba.modules.members.repository.BenefitTableRepository;\
import com.waad.tba.modules.members.service.BenefitTableService;\
import com.waad.tba.modules.reports.model.AuditLog;\
import com.waad.tba.modules.reports.service.AuditLogService;\
import com.waad.tba.modules.insurance.repository.PolicyRepository;\
import com.waad.tba.modules.finance.service.FinanceService;\
import com.waad.tba.modules.settings.service.SystemSettingService;' {} \;

echo "Missing imports added!"