package com.waad.tba.service;

import com.waad.tba.exception.ResourceNotFoundException;
import com.waad.tba.model.Claim;
import com.waad.tba.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimService {
    
    private final ClaimRepository claimRepository;
    
    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }
    
    public Claim getClaimById(Long id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + id));
    }
    
    public List<Claim> getClaimsByMember(Long memberId) {
        return claimRepository.findByMemberId(memberId);
    }
    
    public List<Claim> getClaimsByProvider(Long providerId) {
        return claimRepository.findByProviderId(providerId);
    }
    
    public List<Claim> getClaimsByStatus(Claim.ClaimStatus status) {
        return claimRepository.findByStatus(status);
    }
    
    @Transactional
    public Claim createClaim(Claim claim) {
        claim.setSubmissionDate(LocalDate.now());
        claim.setStatus(Claim.ClaimStatus.SUBMITTED);
        return claimRepository.save(claim);
    }
    
    @Transactional
    public Claim updateClaim(Long id, Claim claimDetails) {
        Claim claim = getClaimById(id);
        
        if (claimDetails.getServiceDate() != null) {
            claim.setServiceDate(claimDetails.getServiceDate());
        }
        if (claimDetails.getDiagnosis() != null) {
            claim.setDiagnosis(claimDetails.getDiagnosis());
        }
        if (claimDetails.getTreatmentDescription() != null) {
            claim.setTreatmentDescription(claimDetails.getTreatmentDescription());
        }
        if (claimDetails.getClaimedAmount() != null) {
            claim.setClaimedAmount(claimDetails.getClaimedAmount());
        }
        if (claimDetails.getApprovedAmount() != null) {
            claim.setApprovedAmount(claimDetails.getApprovedAmount());
        }
        if (claimDetails.getStatus() != null) {
            claim.setStatus(claimDetails.getStatus());
        }
        if (claimDetails.getRejectionReason() != null) {
            claim.setRejectionReason(claimDetails.getRejectionReason());
        }
        if (claimDetails.getDocumentUrls() != null) {
            claim.setDocumentUrls(claimDetails.getDocumentUrls());
        }
        if (claimDetails.getNotes() != null) {
            claim.setNotes(claimDetails.getNotes());
        }
        
        return claimRepository.save(claim);
    }
    
    @Transactional
    public Claim approveClaim(Long id, String reviewedBy) {
        Claim claim = getClaimById(id);
        claim.setStatus(Claim.ClaimStatus.APPROVED);
        claim.setReviewedBy(reviewedBy);
        claim.setReviewDate(LocalDateTime.now());
        return claimRepository.save(claim);
    }
    
    @Transactional
    public Claim rejectClaim(Long id, String reviewedBy, String reason) {
        Claim claim = getClaimById(id);
        claim.setStatus(Claim.ClaimStatus.REJECTED);
        claim.setReviewedBy(reviewedBy);
        claim.setReviewDate(LocalDateTime.now());
        claim.setRejectionReason(reason);
        return claimRepository.save(claim);
    }
    
    @Transactional
    public void deleteClaim(Long id) {
        Claim claim = getClaimById(id);
        claimRepository.delete(claim);
    }
}
