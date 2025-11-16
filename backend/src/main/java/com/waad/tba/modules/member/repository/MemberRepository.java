package com.waad.tba.modules.member.repository;

import com.waad.tba.modules.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByMemberNumber(String memberNumber);
    Optional<Member> findByNationalId(String nationalId);
    Boolean existsByMemberNumber(String memberNumber);
    Boolean existsByNationalId(String nationalId);
    
    @Query("SELECT m FROM Member m WHERE " +
           "LOWER(m.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.memberNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.nationalId) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Member> search(String query);
}
