package com.waad.tba.modules.provider.dto;

import com.waad.tba.modules.provider.entity.Provider.ContractStatus;
import com.waad.tba.modules.provider.entity.Provider.ContractType;
import com.waad.tba.modules.provider.entity.Provider.ProviderType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for creating a new provider
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderCreateDto {

    @NotBlank(message = "Provider code is required")
    private String code;

    @NotBlank(message = "Provider name (Arabic) is required")
    private String nameAr;

    @NotBlank(message = "Provider name (English) is required")
    private String nameEn;

    @NotNull(message = "Provider type is required")
    private ProviderType type;

    private String specialization;

    @NotBlank(message = "License number is required")
    private String licenseNumber;

    private LocalDate licenseIssueDate;
    private LocalDate licenseExpiryDate;

    // Location
    private String region;
    private String city;
    private String address;
    private String landmark;
    private Double latitude;
    private Double longitude;

    // Contact
    private String phone;
    private String mobile;
    private String fax;

    @Email(message = "Invalid email format")
    private String email;

    private String website;

    // Contract
    private ContractType contractType;
    private LocalDate contractStartDate;
    private LocalDate contractEndDate;
    private ContractStatus contractStatus;

    // Pricing
    private BigDecimal discountPercentage;
    private String pricingNotes;

    // Banking
    private String bankName;
    private String bankAccountNumber;
    private String iban;

    // Tax
    private String taxNumber;

    // Contact Person
    private String contactPersonName;
    private String contactPersonPhone;

    @Email(message = "Invalid email format")
    private String contactPersonEmail;

    // Services
    private String servicesOffered;
    private String workingHours;
    private Boolean hasEmergency;

    // Accreditation
    private String accreditation;
    private LocalDate accreditationDate;

    // Notes
    private String notes;

    private Boolean active;
}
