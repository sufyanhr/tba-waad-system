package com.waad.tba.util;

import com.waad.tba.model.Organization;
import com.waad.tba.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MemberNumberGenerator {

    private final MemberRepository memberRepository;

    public String generateMemberNumber(Organization organization) {
        String orgCode = organization.getOrganizationCode();
        if (orgCode == null || orgCode.isBlank()) {
            orgCode = "ORG"; // fallback إذا لم يكن للشركة رمز
        }

        // احسب عدد الأعضاء الحاليين في نفس المؤسسة
        long count = memberRepository.countByOrganization(organization);

        // أضف 1 ليكون الرقم الجديد
        long next = count + 1;

        // صيغة مثل ASM-0001
        return String.format("%s-%04d", orgCode, next);
    }
}
