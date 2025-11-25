package com.waad.tba.modules.member.entity;

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
    @UniqueConstraint(columnNames = "policyNumber", name = "uk_member_policy_number")
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

    @NotNull(message = "Employer ID is required")
    @Column(nullable = false)
    private Long employerId;

    @NotNull(message = "Company ID is required")
    @Column(nullable = false)
    private Long companyId;

    @NotBlank(message = "Full name is required")
    @Column(nullable = false)
    private String fullName;

    @NotBlank(message = "Civil ID is required")
    @Column(unique = true, nullable = false)
    private String civilId;

    @NotBlank(message = "Policy number is required")
    @Column(unique = true, nullable = false)
    private String policyNumber;
    
    private LocalDate dateOfBirth;
    
    @Column(length = 10)
    private String gender; // MALE, FEMALE
    
    @Column(length = 20)
    private String phone;
    
    @Email(message = "Invalid email format")
    @Column(length = 255)
    private String email;
    
    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
