package com.waad.tba.repository;

import com.waad.tba.model.Approval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long> {
    Optional<Approval> findByApprovalNumber(String approvalNumber);
    List<Approval> findByMemberId(Long memberId);
    List<Approval> findByProviderId(Long providerId);
    List<Approval> findByStatus(Approval.ApprovalStatus status);
}
