package com.waad.tba.repository;

import com.waad.tba.model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    Optional<Claim> findByClaimNumber(String claimNumber);
    List<Claim> findByMemberId(Long memberId);
    List<Claim> findByProviderId(Long providerId);
    List<Claim> findByStatus(Claim.ClaimStatus status);
}
