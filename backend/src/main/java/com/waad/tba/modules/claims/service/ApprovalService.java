package com.waad.tba.modules.claims.service;

import com.waad.tba.core.exception.ResourceNotFoundException;
import com.waad.tba.modules.claims.model.Approval;
import com.waad.tba.modules.claims.repository.ApprovalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovalService {
    
    private final ApprovalRepository approvalRepository;
    
    public List<Approval> getAllApprovals() {
        return approvalRepository.findAll();
    }
    
    public Approval getApprovalById(Long id) {
        return approvalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Approval not found with id: " + id));
    }
    
    public List<Approval> getApprovalsByMember(Long memberId) {
        return approvalRepository.findByMemberId(memberId);
    }
    
    public List<Approval> getApprovalsByProvider(Long providerId) {
        return approvalRepository.findByProviderId(providerId);
    }
    
    public List<Approval> getApprovalsByStatus(Approval.ApprovalStatus status) {
        return approvalRepository.findByStatus(status);
    }
    
    @Transactional
    public Approval createApproval(Approval approval) {
        approval.setRequestedDate(LocalDate.now());
        approval.setStatus(Approval.ApprovalStatus.PENDING);
        return approvalRepository.save(approval);
    }
    
    @Transactional
    public Approval updateApproval(Long id, Approval approvalDetails) {
        Approval approval = getApprovalById(id);
        
        if (approvalDetails.getProcedureName() != null) {
            approval.setProcedureName(approvalDetails.getProcedureName());
        }
        if (approvalDetails.getProcedureDescription() != null) {
            approval.setProcedureDescription(approvalDetails.getProcedureDescription());
        }
        if (approvalDetails.getEstimatedCost() != null) {
            approval.setEstimatedCost(approvalDetails.getEstimatedCost());
        }
        if (approvalDetails.getProposedDate() != null) {
            approval.setProposedDate(approvalDetails.getProposedDate());
        }
        if (approvalDetails.getJustification() != null) {
            approval.setJustification(approvalDetails.getJustification());
        }
        
        return approvalRepository.save(approval);
    }
    
    @Transactional
    public Approval approveRequest(Long id, String approvedBy, LocalDate validUntil) {
        Approval approval = getApprovalById(id);
        approval.setStatus(Approval.ApprovalStatus.APPROVED);
        approval.setApprovedBy(approvedBy);
        approval.setDecisionDate(LocalDateTime.now());
        approval.setValidUntil(validUntil);
        return approvalRepository.save(approval);
    }
    
    @Transactional
    public Approval rejectRequest(Long id, String approvedBy, String reason) {
        Approval approval = getApprovalById(id);
        approval.setStatus(Approval.ApprovalStatus.REJECTED);
        approval.setApprovedBy(approvedBy);
        approval.setDecisionDate(LocalDateTime.now());
        approval.setDecisionReason(reason);
        return approvalRepository.save(approval);
    }
    
    @Transactional
    public void deleteApproval(Long id) {
        Approval approval = getApprovalById(id);
        approvalRepository.delete(approval);
    }
}
