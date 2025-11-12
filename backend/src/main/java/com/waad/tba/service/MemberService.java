package com.waad.tba.service;

import com.waad.tba.model.Member;
import com.waad.tba.model.Organization;
import com.waad.tba.model.User;
import com.waad.tba.repository.MemberRepository;
import com.waad.tba.repository.OrganizationRepository;
import com.waad.tba.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.waad.tba.util.MemberNumberGenerator;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final MemberNumberGenerator memberNumberGenerator;

    // ✅ فلترة الأعضاء تلقائيًا حسب دور المستخدم
    public List<Member> getAllMembers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthorized access");
        }

        String username = auth.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // ✅ أولوية للـ ADMIN قبل أي دور آخر
        if (currentUser.getRoles().contains(User.Role.ADMIN)) {
            return memberRepository.findAll();
        }

        // ✅ لو المستخدم مدير شركة (Employer)
        if (currentUser.getRoles().contains(User.Role.EMPLOYER)) {
            if (currentUser.getOrganization() == null) {
                throw new RuntimeException("Employer not linked to an organization");
            }
            return memberRepository.findByOrganization(currentUser.getOrganization());
        }

        // ✅ لو المستخدم تابع لشركة التأمين
        if (currentUser.getRoles().contains(User.Role.INSURANCE)) {
            if (currentUser.getInsuranceCompany() == null) {
                throw new RuntimeException("Insurance user not linked to a company");
            }
            // عرض الأعضاء التابعين لكل المنظمات التي تتعامل مع شركة التأمين
            return memberRepository.findAll(); // لاحقاً نخصصها حسب العقود
        }

        // 🚫 باقي الأدوار لا يمكنهم عرض الأعضاء
        throw new RuntimeException("Access denied for role: " + currentUser.getRoles());
    }

    public Member getMemberById(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with ID: " + id));

        // فلترة أمان إضافية: لا يمكن للـ Employer مشاهدة عضو من مؤسسة أخرى
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth != null ? auth.getName() : null;
        if (username != null) {
            User currentUser = userRepository.findByUsername(username).orElse(null);
            if (currentUser != null && currentUser.getRoles().contains(User.Role.EMPLOYER)) {
                if (!member.getOrganization().equals(currentUser.getOrganization())) {
                    throw new RuntimeException("Access denied: member belongs to another organization");
                }
            }
        }

        return member;
    }

    public List<Member> getMembersByOrganization(Long organizationId) {
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("Organization not found with ID: " + organizationId));
        return memberRepository.findByOrganization(organization);
    }

    public Member createMember(Member member) {
        // ✅ توليد رقم العضو تلقائيًا عند الإنشاء
        if (member.getMemberNumber() == null || member.getMemberNumber().isBlank()) {
            if (member.getOrganization() == null) {
                throw new RuntimeException("Member must be linked to an organization to generate a member number");
            }
            String memberNum = memberNumberGenerator.generateMemberNumber(member.getOrganization());
            member.setMemberNumber(memberNum);
        }

        return memberRepository.save(member);
    }


    public Member updateMember(Long id, Member member) {
        Member existing = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with ID: " + id));
        member.setId(existing.getId());
        return memberRepository.save(member);
    }

    public void deleteMember(Long id) {
        memberRepository.deleteById(id);
    }
}
