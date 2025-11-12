package com.waad.tba.repository;

import com.waad.tba.model.Member;
import com.waad.tba.model.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    // 🔹 جميع الأعضاء داخل مؤسسة معينة
    List<Member> findByOrganization(Organization organization);

    // 🔹 جميع المدراء (Employers)
    List<Member> findByIsEmployerTrue();

    // 🔹 جميع الموظفين العاديين داخل مؤسسة معينة
    List<Member> findByOrganizationAndIsEmployerFalse(Organization organization);
    long countByOrganization(Organization organization);

}

