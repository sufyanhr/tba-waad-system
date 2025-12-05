package com.waad.tba.modules.preapproval.mapper;

import com.waad.tba.modules.insurance.entity.InsuranceCompany;
import com.waad.tba.modules.insurance.repository.InsuranceCompanyRepository;
import com.waad.tba.modules.insurancepolicy.entity.InsurancePolicy;
import com.waad.tba.modules.insurancepolicy.entity.PolicyBenefitPackage;
import com.waad.tba.modules.insurancepolicy.repository.InsurancePolicyRepository;
import com.waad.tba.modules.insurancepolicy.repository.PolicyBenefitPackageRepository;
import com.waad.tba.modules.member.entity.Member;
import com.waad.tba.modules.member.repository.MemberRepository;
import com.waad.tba.modules.preapproval.dto.PreApprovalCreateDto;
import com.waad.tba.modules.preapproval.dto.PreApprovalUpdateDto;
import com.waad.tba.modules.preapproval.dto.PreApprovalViewDto;
import com.waad.tba.modules.preapproval.entity.PreApproval;
import com.waad.tba.modules.preapproval.entity.PreApprovalStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Mapper for PreApproval entity and DTOs
 */
@Component
@RequiredArgsConstructor
public class PreApprovalMapper {

    private final MemberRepository memberRepository;
    private final InsuranceCompanyRepository insuranceCompanyRepository;
    private final InsurancePolicyRepository insurancePolicyRepository;
    private final PolicyBenefitPackageRepository benefitPackageRepository;

    /**
     * Convert CreateDto to Entity
     */
    public PreApproval toEntity(PreApprovalCreateDto dto) {
        if (dto == null) {
            return null;
        }

        // Fetch required entities
        Member member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("Member not found with ID: " + dto.getMemberId()));

        InsuranceCompany insuranceCompany = insuranceCompanyRepository.findById(dto.getInsuranceCompanyId())
                .orElseThrow(() -> new IllegalArgumentException("Insurance Company not found with ID: " + dto.getInsuranceCompanyId()));

        // Fetch optional entities
        InsurancePolicy insurancePolicy = null;
        if (dto.getInsurancePolicyId() != null) {
            insurancePolicy = insurancePolicyRepository.findById(dto.getInsurancePolicyId())
                    .orElse(null);
        }

        PolicyBenefitPackage benefitPackage = null;
        if (dto.getBenefitPackageId() != null) {
            benefitPackage = benefitPackageRepository.findById(dto.getBenefitPackageId())
                    .orElse(null);
        }

        return PreApproval.builder()
                .member(member)
                .insuranceCompany(insuranceCompany)
                .insurancePolicy(insurancePolicy)
                .benefitPackage(benefitPackage)
                .providerName(dto.getProviderName())
                .doctorName(dto.getDoctorName())
                .diagnosis(dto.getDiagnosis())
                .procedure(dto.getProcedure())
                .requestedAmount(dto.getRequestedAmount())
                .attachmentsCount(dto.getAttachmentsCount() != null ? dto.getAttachmentsCount() : 0)
                .status(PreApprovalStatus.PENDING)
                .active(true)
                .build();
    }

    /**
     * Update entity from UpdateDto
     */
    public void updateEntityFromDto(PreApproval entity, PreApprovalUpdateDto dto) {
        if (dto == null || entity == null) {
            return;
        }

        if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
            // Set reviewedAt when status changes from PENDING
            if (dto.getStatus() != PreApprovalStatus.PENDING && entity.getReviewedAt() == null) {
                entity.setReviewedAt(LocalDateTime.now());
            }
        }

        if (dto.getReviewerComment() != null) {
            entity.setReviewerComment(dto.getReviewerComment());
        }

        if (dto.getApprovedAmount() != null) {
            entity.setApprovedAmount(dto.getApprovedAmount());
        }

        if (dto.getProviderName() != null) {
            entity.setProviderName(dto.getProviderName());
        }

        if (dto.getDoctorName() != null) {
            entity.setDoctorName(dto.getDoctorName());
        }

        if (dto.getDiagnosis() != null) {
            entity.setDiagnosis(dto.getDiagnosis());
        }

        if (dto.getProcedure() != null) {
            entity.setProcedure(dto.getProcedure());
        }

        if (dto.getRequestedAmount() != null) {
            entity.setRequestedAmount(dto.getRequestedAmount());
        }

        if (dto.getInsurancePolicyId() != null) {
            insurancePolicyRepository.findById(dto.getInsurancePolicyId())
                    .ifPresent(entity::setInsurancePolicy);
        }

        if (dto.getBenefitPackageId() != null) {
            benefitPackageRepository.findById(dto.getBenefitPackageId())
                    .ifPresent(entity::setBenefitPackage);
        }

        if (dto.getAttachmentsCount() != null) {
            entity.setAttachmentsCount(dto.getAttachmentsCount());
        }

        if (dto.getActive() != null) {
            entity.setActive(dto.getActive());
        }
    }

    /**
     * Convert Entity to ViewDto
     */
    public PreApprovalViewDto toViewDto(PreApproval entity) {
        if (entity == null) {
            return null;
        }

        PreApprovalViewDto.PreApprovalViewDtoBuilder builder = PreApprovalViewDto.builder()
                .id(entity.getId())
                .providerName(entity.getProviderName())
                .doctorName(entity.getDoctorName())
                .diagnosis(entity.getDiagnosis())
                .procedure(entity.getProcedure())
                .requestedAmount(entity.getRequestedAmount())
                .approvedAmount(entity.getApprovedAmount())
                .status(entity.getStatus())
                .reviewerComment(entity.getReviewerComment())
                .reviewedAt(entity.getReviewedAt())
                .attachmentsCount(entity.getAttachmentsCount())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy());

        // Member information
        if (entity.getMember() != null) {
            builder.memberId(entity.getMember().getId())
                    .memberFullNameArabic(entity.getMember().getFullNameArabic())
                    .memberCivilId(entity.getMember().getCivilId());
        }

        // Insurance Company information
        if (entity.getInsuranceCompany() != null) {
            builder.insuranceCompanyId(entity.getInsuranceCompany().getId())
                    .insuranceCompanyName(entity.getInsuranceCompany().getName())
                    .insuranceCompanyCode(entity.getInsuranceCompany().getCode());
        }

        // Insurance Policy information
        if (entity.getInsurancePolicy() != null) {
            builder.insurancePolicyId(entity.getInsurancePolicy().getId())
                    .insurancePolicyName(entity.getInsurancePolicy().getName())
                    .insurancePolicyCode(entity.getInsurancePolicy().getCode());
        }

        // Benefit Package information
        if (entity.getBenefitPackage() != null) {
            builder.benefitPackageId(entity.getBenefitPackage().getId())
                    .benefitPackageName(entity.getBenefitPackage().getName())
                    .benefitPackageCode(entity.getBenefitPackage().getCode());
        }

        return builder.build();
    }
}
