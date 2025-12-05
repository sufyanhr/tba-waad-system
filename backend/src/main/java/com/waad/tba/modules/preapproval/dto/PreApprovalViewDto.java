package com.waad.tba.modules.preapproval.dto;

import com.waad.tba.modules.preapproval.entity.PreApprovalStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for viewing pre-approval request details
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreApprovalViewDto {

    private Long id;

    // Member information
    private Long memberId;
    private String memberFullNameArabic;
    private String memberCivilId;

    // Insurance Company information
    private Long insuranceCompanyId;
    private String insuranceCompanyName;
    private String insuranceCompanyCode;

    // Insurance Policy information
    private Long insurancePolicyId;
    private String insurancePolicyName;
    private String insurancePolicyCode;

    // Benefit Package information
    private Long benefitPackageId;
    private String benefitPackageName;
    private String benefitPackageCode;

    // Provider information
    private String providerName;
    private String doctorName;

    // Medical information
    private String diagnosis;
    private String procedure;

    // Financial information
    private BigDecimal requestedAmount;
    private BigDecimal approvedAmount;

    // Approval status
    private PreApprovalStatus status;
    private String reviewerComment;
    private LocalDateTime reviewedAt;

    // Attachments
    private Integer attachmentsCount;

    // Status
    private Boolean active;

    // Audit fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
}
