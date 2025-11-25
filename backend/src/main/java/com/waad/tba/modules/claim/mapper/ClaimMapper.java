package com.waad.tba.modules.claim.mapper;

import com.waad.tba.modules.claim.dto.ClaimCreateDto;
import com.waad.tba.modules.claim.dto.ClaimResponseDto;
import com.waad.tba.modules.claim.dto.ClaimUpdateDto;
import com.waad.tba.modules.claim.entity.Claim;
import com.waad.tba.modules.visit.entity.Visit;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class ClaimMapper {

    public ClaimResponseDto toResponseDto(Claim entity) {
        if (entity == null) return null;
        
        String memberName = null;
        String memberNumber = null;
        if (entity.getVisit() != null && entity.getVisit().getMember() != null) {
            memberName = entity.getVisit().getMember().getFullName();
            memberNumber = entity.getVisit().getMember().getPolicyNumber();
        }
        
        return ClaimResponseDto.builder()
                .id(entity.getId())
                .visitId(entity.getVisit() != null ? entity.getVisit().getId() : null)
                .memberName(memberName)
                .memberNumber(memberNumber)
                .claimNumber(entity.getClaimNumber())
                .claimDate(entity.getClaimDate())
                .requestedAmount(entity.getRequestedAmount())
                .approvedAmount(entity.getApprovedAmount())
                .status(entity.getStatus())
                .rejectionReason(entity.getRejectionReason())
                .notes(entity.getNotes())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public Claim toEntity(ClaimCreateDto dto, Visit visit) {
        if (dto == null) return null;
        
        String claimNumber = dto.getClaimNumber();
        if (claimNumber == null || claimNumber.isBlank()) {
            claimNumber = generateClaimNumber();
        }
        
        return Claim.builder()
                .visit(visit)
                .claimNumber(claimNumber)
                .claimDate(dto.getClaimDate())
                .requestedAmount(dto.getRequestedAmount())
                .approvedAmount(dto.getApprovedAmount())
                .status(dto.getStatus() != null ? dto.getStatus() : Claim.ClaimStatus.PENDING)
                .rejectionReason(dto.getRejectionReason())
                .notes(dto.getNotes())
                .active(true)
                .build();
    }

    public void updateEntityFromDto(Claim entity, ClaimCreateDto dto, Visit visit) {
        if (dto == null) return;
        
        entity.setVisit(visit);
        entity.setClaimDate(dto.getClaimDate());
        entity.setRequestedAmount(dto.getRequestedAmount());
        entity.setApprovedAmount(dto.getApprovedAmount());
        if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
        }
        entity.setRejectionReason(dto.getRejectionReason());
        entity.setNotes(dto.getNotes());
    }

    public void updateEntityFromUpdateDto(Claim entity, ClaimUpdateDto dto) {
        if (dto == null) return;
        
        if (dto.getApprovedAmount() != null) {
            entity.setApprovedAmount(dto.getApprovedAmount());
        }
        if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
        }
        if (dto.getRejectionReason() != null) {
            entity.setRejectionReason(dto.getRejectionReason());
        }
        if (dto.getNotes() != null) {
            entity.setNotes(dto.getNotes());
        }
    }

    public void updateStatusAndReason(Claim.ClaimStatus status, String reason, Claim entity) {
        entity.setStatus(status);
    }

    private String generateClaimNumber() {
        return "CLM-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
