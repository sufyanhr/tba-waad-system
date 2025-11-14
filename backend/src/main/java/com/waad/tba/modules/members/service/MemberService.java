package com.waad.tba.modules.members.service;

import com.waad.tba.modules.members.model.Member;
import com.waad.tba.modules.members.model.BenefitUsage;
import com.waad.tba.modules.members.model.BenefitTable;
import com.waad.tba.modules.employers.model.Organization;
import com.waad.tba.modules.insurance.model.Policy;
import com.waad.tba.security.model.User;
import com.waad.tba.modules.members.repository.MemberRepository;
import com.waad.tba.modules.members.repository.BenefitUsageRepository;
import com.waad.tba.modules.members.repository.BenefitTableRepository;
import com.waad.tba.modules.employers.repository.OrganizationRepository;
import com.waad.tba.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.waad.tba.core.util.MemberNumberGenerator;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final BenefitUsageRepository benefitUsageRepository;
    private final BenefitTableRepository benefitTableRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final MemberNumberGenerator memberNumberGenerator;

    /**
     * إنشاء عضو جديد مع توليد رقم العضو والملف الطبي تلقائياً
     */
    @Transactional
    public Member createMember(Member member) {
        // التحقق من المؤسسة
        if (member.getOrganization() == null) {
            throw new RuntimeException("Member must be linked to an organization");
        }
        
        // توليد رقم العضو تلقائياً
        if (member.getMemberNumber() == null || member.getMemberNumber().isBlank()) {
            String memberNum = memberNumberGenerator.generateMemberNumber(member.getOrganization());
            member.setMemberNumber(memberNum);
        }
        
        // توليد رقم الملف الطبي تلقائياً
        if (member.getMedicalFileNumber() == null || member.getMedicalFileNumber().isBlank()) {
            member.setMedicalFileNumber(generateMedicalFileNumber());
        }
        
        // حفظ العضو
        Member savedMember = memberRepository.save(member);
        
        // إنشاء BenefitUsage entries للعام الحالي إذا كان لديه بوليصة
        if (savedMember.getPolicy() != null) {
            initializeBenefitUsage(savedMember, savedMember.getPolicy(), Year.now().getValue());
        }
        
        return savedMember;
    }

    /**
     * تحديث بيانات عضو
     */
    @Transactional
    public Member updateMember(Long id, Member memberDetails) {
        Member existingMember = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with ID: " + id));

        // التحقق من صلاحية التحديث
        validateMemberAccess(existingMember);
        
        // تحديث البيانات الأساسية
        existingMember.setFullName(memberDetails.getFullName());
        existingMember.setEmail(memberDetails.getEmail());
        existingMember.setPhone(memberDetails.getPhone());
        existingMember.setDateOfBirth(memberDetails.getDateOfBirth());
        existingMember.setGender(memberDetails.getGender());
        existingMember.setAddress(memberDetails.getAddress());
        existingMember.setNationalId(memberDetails.getNationalId());
        
        // تحديث البوليصة إذا تغيرت
        if (memberDetails.getPolicy() != null && 
            !memberDetails.getPolicy().getId().equals(existingMember.getPolicy().getId())) {
            existingMember.setPolicy(memberDetails.getPolicy());
            // إعادة تهيئة BenefitUsage للبوليصة الجديدة
            initializeBenefitUsage(existingMember, memberDetails.getPolicy(), Year.now().getValue());
        }
        
        return memberRepository.save(existingMember);
    }

    /**
     * الحصول على عضو بالمعرف مع التحقق من الصلاحية
     */
    public Member getMemberById(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with ID: " + id));
        
        validateMemberAccess(member);
        return member;
    }

    /**
     * فلترة الأعضاء تلقائيًا حسب دور المستخدم
     */
    public List<Member> getAllMembers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthorized access");
        }

        String username = auth.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // ✅ أولوية للـ ADMIN قبل أي دور آخر
        if (currentUser.hasRole("ADMIN")) {
            return memberRepository.findAll();
        }

        // ✅ لو المستخدم مدير شركة (Employer)
        if (currentUser.hasRole("EMPLOYER")) {
            if (currentUser.getOrganization() == null) {
                throw new RuntimeException("Employer not linked to an organization");
            }
            return memberRepository.findByOrganization(currentUser.getOrganization());
        }

        // ✅ لو المستخدم تابع لشركة التأمين
        if (currentUser.hasRole("INSURANCE")) {
            if (currentUser.getInsuranceCompany() == null) {
                throw new RuntimeException("Insurance user not linked to a company");
            }
            // عرض الأعضاء التابعين لكل المنظمات التي تتعامل مع شركة التأمين
            return memberRepository.findAll(); // لاحقاً نخصصها حسب العقود
        }

        // 🚫 باقي الأدوار لا يمكنهم عرض الأعضاء
        throw new RuntimeException("Access denied for user roles");
    }

    /**
     * فلترة الأعضاء حسب المؤسسة
     */
    public List<Member> getMembersByOrganization(Long organizationId) {
        User currentUser = getCurrentUser();
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        // التحقق من صلاحية الوصول للمؤسسة
        if (!currentUser.hasRole("ADMIN") && 
            (currentUser.getOrganization() == null || 
             !currentUser.getOrganization().getId().equals(organizationId))) {
            throw new RuntimeException("Access denied to this organization");
        }
        
        return memberRepository.findByOrganization(organization);
    }

    /**
     * حذف عضو
     */
    @Transactional
    public void deleteMember(Long id) {
        Member member = getMemberById(id); // سيتحقق من الصلاحية تلقائياً
        memberRepository.delete(member);
    }

    /**
     * حساب الرصيد المتبقي من المنافع لعضو معين
     */
    public List<BenefitUsage> getMemberBenefitBalance(Long memberId) {
        Member member = getMemberById(memberId);
        int currentYear = Year.now().getValue();
        
        return benefitUsageRepository.findByMemberAndYear(member, currentYear);
    }

    /**
     * البحث عن الأعضاء
     */
    public List<Member> searchMembers(String searchTerm) {
        User currentUser = getCurrentUser();
        
        if (currentUser.hasRole("ADMIN")) {
            return memberRepository.findByFullNameContainingIgnoreCaseOrMemberNumberContaining(
                searchTerm, searchTerm);
        } else if (currentUser.hasRole("EMPLOYER") && currentUser.getOrganization() != null) {
            return memberRepository.findByOrganizationAndFullNameContainingIgnoreCase(
                currentUser.getOrganization(), searchTerm);
        }
        
        throw new RuntimeException("Unauthorized search access");
    }

    // ==== Private Helper Methods ====

    /**
     * التحقق من صلاحية الوصول لعضو معين
     */
    private void validateMemberAccess(Member member) {
        User currentUser = getCurrentUser();
        
        // ADMIN يمكنه الوصول لكل شيء
        if (currentUser.hasRole("ADMIN")) {
            return;
        }
        
        // EMPLOYER يمكنه فقط الوصول لأعضاء مؤسسته
        if (currentUser.hasRole("EMPLOYER")) {
            if (currentUser.getOrganization() == null || 
                !member.getOrganization().getId().equals(currentUser.getOrganization().getId())) {
                throw new RuntimeException("Access denied: member belongs to another organization");
            }
            return;
        }
        
        throw new RuntimeException("Access denied");
    }

    /**
     * الحصول على المستخدم الحالي
     */
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthorized access");
        }
        
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * توليد رقم الملف الطبي
     */
    private String generateMedicalFileNumber() {
        String prefix = "MF";
        String timestamp = String.valueOf(System.currentTimeMillis());
        return prefix + timestamp.substring(timestamp.length() - 8);
    }

    /**
     * تهيئة استخدام المنافع للعضو الجديد
     */
    private void initializeBenefitUsage(Member member, Policy policy, Integer year) {
        List<BenefitTable> benefits = benefitTableRepository.findByPolicyAndActiveTrue(policy);
        
        for (BenefitTable benefit : benefits) {
            // التحقق من وجود سجل مسبق
            Optional<BenefitUsage> existing = benefitUsageRepository
                .findByMemberAndBenefitAndYear(member, benefit, year);
            
            if (existing.isEmpty()) {
                BenefitUsage usage = new BenefitUsage(member, policy, benefit, year);
                benefitUsageRepository.save(usage);
            }
        }
    }
}
