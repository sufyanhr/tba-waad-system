package com.waad.tba.modules.members.repository;

import com.waad.tba.modules.members.model.Member;
import com.waad.tba.modules.employers.model.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    // 🔹 جميع الأعضاء داخل مؤسسة معينة
    List<Member> findByOrganization(Organization organization);

    // 🔹 جميع المدراء (Employers)
    List<Member> findByIsEmployerTrue();

    // 🔹 جميع الموظفين العاديين داخل مؤسسة معينة
    List<Member> findByOrganizationAndIsEmployerFalse(Organization organization);
    
    long countByOrganization(Organization organization);
    
    // البحث بالاسم أو رقم العضو
    List<Member> findByFullNameContainingIgnoreCaseOrMemberNumberContaining(String name, String memberNumber);
    
    // البحث داخل مؤسسة معينة
    List<Member> findByOrganizationAndFullNameContainingIgnoreCase(Organization organization, String name);
    
    // البحث بالبريد الإلكتروني
    Optional<Member> findByEmail(String email);
    
    // البحث برقم العضو
    Optional<Member> findByMemberNumber(String memberNumber);
    
    // البحث برقم الملف الطبي
    Optional<Member> findByMedicalFileNumber(String medicalFileNumber);
    
    // البحث بالرقم الوطني
    Optional<Member> findByNationalId(String nationalId);
    
    // الأعضاء النشطون
    @Query("SELECT m FROM Member m WHERE m.coverageStatus = 'ACTIVE'")
    List<Member> findActiveMembers();
    
    // الأعضاء النشطون داخل مؤسسة
    @Query("SELECT m FROM Member m WHERE m.organization = :organization AND m.coverageStatus = 'ACTIVE'")
    List<Member> findActiveMembersByOrganization(Organization organization);
}

