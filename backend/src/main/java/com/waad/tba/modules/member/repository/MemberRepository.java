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
    Optional<Member> findByMemberNumber(String memberNumber);
    Optional<Member> findByNationalId(String nationalId);
    Boolean existsByMemberNumber(String memberNumber);
    Boolean existsByNationalId(String nationalId);
    
    @Query("SELECT m FROM Member m WHERE " +
           "LOWER(m.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.memberNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.nationalId) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Member> search(String query);

    @Query("SELECT m FROM Member m WHERE " +
           "LOWER(m.firstName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(m.lastName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(m.memberNumber) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(m.nationalId) LIKE LOWER(CONCAT('%', :q, '%'))")
    Page<Member> searchPaged(@Param("q") String q, Pageable pageable);
}
