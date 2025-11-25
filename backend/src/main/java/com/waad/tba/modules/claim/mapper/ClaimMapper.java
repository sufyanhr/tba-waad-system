package com.waad.tba.modules.claim.mapper;

import com.waad.tba.modules.claim.dto.ClaimCreateDto;
import com.waad.tba.modules.claim.dto.ClaimResponseDto;
import com.waad.tba.modules.claim.entity.Claim;
import com.waad.tba.modules.member.entity.Member;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
public class ClaimMapper {

    public ClaimResponseDto toResponseDto(Claim entity) {
        if (entity == null) return null;
        
        Long memberId = null;
        String memberName = null;
        String memberCardNumber = null;
        if (entity.getMember() != null) {
            memberId = entity.getMember().getId();
            memberName = entity.getMember().getFullName();
            memberCardNumber = entity.getMember().getCardNumber();
        }
        
        return ClaimResponseDto.builder()
                .id(entity.getId())
                .claimNumber(entity.getClaimNumber())
                .memberId(memberId)
                .memberName(memberName)
                .memberCardNumber(memberCardNumber)
                .providerId(entity.getProviderId())
                .providerName(entity.getProviderName())
                .claimType(entity.getClaimType() != null ? entity.getClaimType().name() : null)
                .serviceDate(entity.getServiceDate())
                .submissionDate(entity.getSubmissionDate())
                .totalClaimed(entity.getTotalClaimed())
                .totalApproved(entity.getTotalApproved())
                .totalRejected(entity.getTotalRejected())
                .memberCoPayment(entity.getMemberCoPayment())
                .netPayable(entity.getNetPayable())
                .diagnosisCode(entity.getDiagnosisCode())
                .diagnosisDescription(entity.getDiagnosisDescription())
                .preAuthNumber(entity.getPreAuthNumber())
                .status(entity.getStatus())
                .medicalReviewStatus(entity.getMedicalReviewStatus() != null ? entity.getMedicalReviewStatus().name() : null)
                .financialReviewStatus(entity.getFinancialReviewStatus() != null ? entity.getFinancialReviewStatus().name() : null)
                .rejectionReason(entity.getRejectionReason())
                .notes(entity.getNotes())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public Claim toEntity(ClaimCreateDto dto, Member member) {
        if (dto == null) return null;
        
        String claimNumber = dto.getClaimNumber();
        if (claimNumber == null || claimNumber.isBlank()) {
            claimNumber = generateClaimNumber();
        }
        
        LocalDate submissionDate = dto.getSubmissionDate();
        if (submissionDate == null) {
            submissionDate = LocalDate.now();
        }
        
        return Claim.builder()
                .member(member)
                .providerId(dto.getProviderId())
                .providerName(dto.getProviderName())
                .claimNumber(claimNumber)
                .claimType(dto.getClaimType() != null ? Claim.ClaimType.valueOf(dto.getClaimType()) : Claim.ClaimType.OUTPATIENT)
                .serviceDate(dto.getServiceDate())
                .submissionDate(submissionDate)
                .totalClaimed(dto.getTotalClaimed())
                .totalApproved(dto.getTotalApproved())
                .diagnosisCode(dto.getDiagnosisCode())
                .diagnosisDescription(dto.getDiagnosisDescription())
                .preAuthNumber(dto.getPreAuthNumber())
                .status(dto.getStatus() != null ? dto.getStatus() : Claim.ClaimStatus.PENDING)
                .rejectionReason(dto.getRejectionReason())
                .notes(dto.getNotes())
                .active(true)
                .build();
    }

    public void updateEntityFromDto(Claim entity, ClaimCreateDto dto, Member member) {
        if (dto == null) return;
        
        entity.setMember(member);
        entity.setProviderId(dto.getProviderId());
        entity.setProviderName(dto.getProviderName());
        entity.setClaimType(dto.getClaimType() != null ? Claim.ClaimType.valueOf(dto.getClaimType()) : entity.getClaimType());
        entity.setServiceDate(dto.getServiceDate());
        if (dto.getSubmissionDate() != null) {
            entity.setSubmissionDate(dto.getSubmissionDate());
        }
        entity.setTotalClaimed(dto.getTotalClaimed());
        if (dto.getTotalApproved() != null) {
            entity.setTotalApproved(dto.getTotalApproved());
        }
        entity.setDiagnosisCode(dto.getDiagnosisCode());
        entity.setDiagnosisDescription(dto.getDiagnosisDescription());
        entity.setPreAuthNumber(dto.getPreAuthNumber());
        if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
        }
        entity.setRejectionReason(dto.getRejectionReason());
        entity.setNotes(dto.getNotes());
    }

    private String generateClaimNumber() {
        return "CLM-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
