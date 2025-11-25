package com.waad.tba.modules.member.repository;

import com.waad.tba.modules.member.entity.Dependent;
import com.waad.tba.modules.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DependentRepository extends JpaRepository<Dependent, Long> {
    
    List<Dependent> findByMainMemberId(Long mainMemberId);
    
    Optional<Dependent> findByCivilId(String civilId);
    
    Optional<Dependent> findByCardNumber(String cardNumber);
    
    Optional<Dependent> findByQrCodeValue(String qrCodeValue);
    
    List<Dependent> findByStatus(Member.MemberStatus status);
    
    @Query("SELECT d FROM Dependent d WHERE d.mainMember.id = :memberId AND d.status = :status")
    List<Dependent> findByMainMemberIdAndStatus(@Param("memberId") Long memberId, 
                                                 @Param("status") Member.MemberStatus status);
    
    @Query("SELECT d FROM Dependent d WHERE d.mainMember.id = :memberId AND d.active = true")
    List<Dependent> findActiveDependentsByMainMemberId(@Param("memberId") Long memberId);
    
    boolean existsByCivilId(String civilId);
    
    boolean existsByCardNumber(String cardNumber);
}
