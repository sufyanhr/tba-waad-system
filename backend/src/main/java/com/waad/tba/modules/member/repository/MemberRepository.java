package com.waad.tba.modules.member.repository;

import com.waad.tba.modules.member.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    
    Optional<Member> findByCivilId(String civilId);
    Optional<Member> findByPolicyNumber(String policyNumber);
    
    boolean existsByCivilId(String civilId);
    boolean existsByPolicyNumber(String policyNumber);
    boolean existsByCivilIdAndIdNot(String civilId, Long id);
    boolean existsByPolicyNumberAndIdNot(String policyNumber, Long id);
    
    Page<Member> findByCompanyId(Long companyId, Pageable pageable);
    
    @Query("SELECT m FROM Member m WHERE m.companyId = :companyId AND (" +
           "LOWER(m.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.civilId) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.policyNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Member> searchPagedByCompany(@Param("companyId") Long companyId, @Param("search") String search, Pageable pageable);
    
    @Query("SELECT m FROM Member m WHERE " +
           "LOWER(m.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.civilId) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.policyNumber) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Member> searchPaged(@Param("search") String search, Pageable pageable);
}
