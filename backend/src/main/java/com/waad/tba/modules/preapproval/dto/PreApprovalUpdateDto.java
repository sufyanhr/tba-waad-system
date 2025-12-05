package com.waad.tba.modules.preapproval.dto;

import com.waad.tba.modules.preapproval.entity.PreApprovalStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * DTO for updating an existing pre-approval request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreApprovalUpdateDto {

    private PreApprovalStatus status;

    private String reviewerComment;

    @DecimalMin(value = "0.0", message = "Approved amount cannot be negative")
    @Digits(integer = 13, fraction = 2, message = "Invalid amount format")
    private BigDecimal approvedAmount;

    @Size(max = 255, message = "Provider name must not exceed 255 characters")
    private String providerName;

    @Size(max = 255, message = "Doctor name must not exceed 255 characters")
    private String doctorName;

    private String diagnosis;

    private String procedure;

    @DecimalMin(value = "0.01", message = "Requested amount must be greater than zero")
    @Digits(integer = 13, fraction = 2, message = "Invalid amount format")
    private BigDecimal requestedAmount;

    private Long benefitPackageId;

    private Long insurancePolicyId;

    @Min(value = 0, message = "Attachments count cannot be negative")
    private Integer attachmentsCount;

    private Boolean active;
}
