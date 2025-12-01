package com.waad.tba.modules.member.entity;

import com.waad.tba.modules.employer.entity.Employer;
import com.waad.tba.modules.policy.entity.Policy;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "members", uniqueConstraints = {
    @UniqueConstraint(columnNames = "civilId", name = "uk_member_civil_id"),
    @UniqueConstraint(columnNames = "cardNumber", name = "uk_member_card_number")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relations
    @NotNull(message = "Employer is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    private Employer employer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id")
    private Policy policy;

    // Personal Information
    @NotBlank(message = "First name is required")
    @Column(nullable = false, length = 100)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(length = 200)
    private String fullNameAr;

    @Column(length = 200)
    private String fullNameEn;

    @NotBlank(message = "Civil ID (National ID) is required")
    @Column(unique = true, nullable = false, length = 50)
    private String civilId;

    @NotBlank(message = "Card number is required")
    @Column(unique = true, nullable = false, length = 50)
    private String cardNumber;

    // Relation Type (SELF for main member, others for dependents)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 20)
    private MemberRelation relation = MemberRelation.SELF;

    @NotNull(message = "Date of birth is required")
    @Column(nullable = false)
    private LocalDate dateOfBirth;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private MaritalStatus maritalStatus;
    
    @Column(length = 20)
    private String phone;
    
    @Email(message = "Invalid email format")
    @Column(length = 255)
    private String email;

    // Membership Details
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 20)
    private MemberStatus status = MemberStatus.ACTIVE;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    // QR Code for eligibility check
    @Column(unique = true, length = 100)
    private String qrCodeValue;

    // Eligibility
    @Builder.Default
    @Column(nullable = false)
    private Boolean eligibilityStatus = true;

    private LocalDateTime eligibilityUpdatedAt;

    // Additional Information
    @Column(length = 500)
    private String photoUrl;

    @Column(length = 2000)
    private String notes;

    @Column(length = 500)
    private String address;

    @Column(length = 100)
    private String nationality;

    @Column(length = 100)
    private String occupation;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Computed field for full name
    @Transient
    public String getFullName() {
        return firstName + " " + lastName;
    }

    public enum Gender {
        MALE, FEMALE
    }

    public enum MaritalStatus {
        SINGLE, MARRIED, DIVORCED, WIDOWED
    }

    public enum MemberRelation {
        SELF, SPOUSE, SON, DAUGHTER, FATHER, MOTHER, OTHER
    }

    public enum MemberStatus {
        ACTIVE, SUSPENDED, TERMINATED, PENDING
    }
}
