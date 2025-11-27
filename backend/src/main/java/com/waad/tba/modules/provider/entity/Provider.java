package com.waad.tba.modules.provider.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "providers", uniqueConstraints = {
    @UniqueConstraint(columnNames = "code", name = "uk_provider_code"),
    @UniqueConstraint(columnNames = "licenseNumber", name = "uk_provider_license")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Provider code is required")
    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @NotBlank(message = "Provider name (Arabic) is required")
    @Column(nullable = false, length = 200)
    private String nameAr;

    @NotBlank(message = "Provider name (English) is required")
    @Column(nullable = false, length = 200)
    private String nameEn;

    // Provider Type
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProviderType type;

    // Specialization (for clinics/doctors)
    @Column(length = 100)
    private String specialization;

    // License Information
    @NotBlank(message = "License number is required")
    @Column(unique = true, nullable = false, length = 100)
    private String licenseNumber;

    private LocalDate licenseIssueDate;
    private LocalDate licenseExpiryDate;

    // Location Information
    @Column(length = 100)
    private String region;

    @Column(length = 100)
    private String city;

    @Column(length = 500)
    private String address;

    @Column(length = 200)
    private String landmark;

    private Double latitude;
    private Double longitude;

    // Contact Information
    @Column(length = 50)
    private String phone;

    @Column(length = 50)
    private String mobile;

    @Column(length = 50)
    private String fax;

    @Email(message = "Invalid email format")
    @Column(length = 100)
    private String email;

    @Column(length = 200)
    private String website;

    // Contract Information
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ContractType contractType;

    private LocalDate contractStartDate;
    private LocalDate contractEndDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ContractStatus contractStatus;

    // Discount and Pricing
    @Column()
    private BigDecimal discountPercentage;

    @Column(length = 2000)
    private String pricingNotes;

    // Banking Information (for settlements)
    @Column(length = 100)
    private String bankName;

    @Column(length = 50)
    private String bankAccountNumber;

    @Column(length = 50)
    private String iban;

    // Tax Information
    @Column(length = 50)
    private String taxNumber;

    // Contact Person
    @Column(length = 100)
    private String contactPersonName;

    @Column(length = 50)
    private String contactPersonPhone;

    @Email(message = "Invalid email format")
    @Column(length = 100)
    private String contactPersonEmail;

    // Services Offered (comma-separated or JSON)
    @Column(length = 2000)
    private String servicesOffered;

    // Working Hours
    @Column(length = 500)
    private String workingHours;

    // Emergency Services
    @Builder.Default
    @Column(nullable = false)
    private Boolean hasEmergency = false;

    // Accreditation
    @Column(length = 100)
    private String accreditation;

    private LocalDate accreditationDate;

    // Notes
    @Column(length = 3000)
    private String notes;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum ProviderType {
        HOSPITAL,
        CLINIC,
        PHARMACY,
        LABORATORY,
        RADIOLOGY_CENTER,
        DENTAL_CLINIC,
        OPTICAL_CENTER,
        PHYSIOTHERAPY_CENTER,
        HOME_CARE,
        MEDICAL_CENTER,
        OTHER
    }

    public enum ContractType {
        DIRECT,
        DISCOUNT,
        CASE_RATE,
        PER_DIEM,
        CAPITATION
    }

    public enum ContractStatus {
        ACTIVE,
        SUSPENDED,
        EXPIRED,
        TERMINATED,
        PENDING_RENEWAL
    }
}
