package com.waad.tba.modules.member.entity;

import jakarta.persistence.*;
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
@Table(name = "dependents", uniqueConstraints = {
    @UniqueConstraint(columnNames = "civilId", name = "uk_dependent_civil_id"),
    @UniqueConstraint(columnNames = "cardNumber", name = "uk_dependent_card_number")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Dependent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Main Member (parent relationship)
    @NotNull(message = "Main member is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "main_member_id", nullable = false)
    private Member mainMember;

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

    // Relation to main member
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Relation is required")
    @Column(nullable = false, length = 20)
    private Member.MemberRelation relation;

    @NotNull(message = "Date of birth is required")
    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Member.Gender gender;

    // Membership Details
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 20)
    private Member.MemberStatus status = Member.MemberStatus.ACTIVE;

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

    @Column(length = 100)
    private String nationality;

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
}
