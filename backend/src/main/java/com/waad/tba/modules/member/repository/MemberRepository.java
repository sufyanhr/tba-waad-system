package com.waad.tba.modules.member.repository;

import com.waad.tba.modules.member.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    
    Optional<Member> findByCivilId(String civilId);
    
    Optional<Member> findByCardNumber(String cardNumber);
    
    Optional<Member> findByQrCodeValue(String qrCodeValue);
    
    List<Member> findByEmployerId(Long employerId);
    
    Long countByEmployerId(Long employerId);
    
    List<Member> findByPolicyId(Long policyId);
    
    List<Member> findByStatus(Member.MemberStatus status);
    
    @Query("SELECT m FROM Member m WHERE m.employer.id = :employerId AND m.relation = 'SELF'")
    List<Member> findMainMembersByEmployer(@Param("employerId") Long employerId);
    
    @Query("SELECT m FROM Member m WHERE m.employer.id = :employerId AND m.status = :status")
    List<Member> findByEmployerIdAndStatus(@Param("employerId") Long employerId, 
                                           @Param("status") Member.MemberStatus status);
    
    boolean existsByCivilId(String civilId);
    boolean existsByCardNumber(String cardNumber);
    boolean existsByCivilIdAndIdNot(String civilId, Long id);
    boolean existsByCardNumberAndIdNot(String cardNumber, Long id);
    
    Page<Member> findByCompanyId(Long companyId, Pageable pageable);
    
    @Query("SELECT m FROM Member m WHERE m.companyId = :companyId AND (" +
           "LOWER(CONCAT(m.firstName, ' ', m.lastName)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.civilId) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.cardNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Member> searchPagedByCompany(@Param("companyId") Long companyId, @Param("search") String search, Pageable pageable);
    
    @Query("SELECT m FROM Member m WHERE " +
           "LOWER(CONCAT(m.firstName, ' ', m.lastName)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.civilId) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.cardNumber) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Member> searchPaged(@Param("search") String search, Pageable pageable);
}
