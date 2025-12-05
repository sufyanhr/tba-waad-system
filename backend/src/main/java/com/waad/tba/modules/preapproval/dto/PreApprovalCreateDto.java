package com.waad.tba.modules.preapproval.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * DTO for creating a new pre-approval request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreApprovalCreateDto {

    @NotNull(message = "Member ID is required")
    private Long memberId;

    @NotNull(message = "Insurance Company ID is required")
    private Long insuranceCompanyId;

    private Long insurancePolicyId;

    private Long benefitPackageId;

    @NotBlank(message = "Provider name is required")
    @Size(max = 255, message = "Provider name must not exceed 255 characters")
    private String providerName;

    @Size(max = 255, message = "Doctor name must not exceed 255 characters")
    private String doctorName;

    @NotBlank(message = "Diagnosis is required")
    private String diagnosis;

    private String procedure;

    @NotNull(message = "Requested amount is required")
    @DecimalMin(value = "0.01", message = "Requested amount must be greater than zero")
    @Digits(integer = 13, fraction = 2, message = "Invalid amount format")
    private BigDecimal requestedAmount;

    @Min(value = 0, message = "Attachments count cannot be negative")
    private Integer attachmentsCount;
}
