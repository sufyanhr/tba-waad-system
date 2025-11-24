package com.waad.tba.modules.employer.entity;

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

import java.time.LocalDateTime;

@Entity
@Table(name = "employers", uniqueConstraints = {
    @UniqueConstraint(columnNames = "code")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Employer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Employer name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Employer code is required")
    @Column(nullable = false, unique = true)
    private String code;

    @NotNull(message = "Company ID is required")
    @Column(nullable = false)
    private Long companyId;

    private String contactName;
    
    private String contactPhone;
    
    @Email(message = "Contact email must be valid")
    private String contactEmail;
    
    private String address;

    private String phone;

    @Email(message = "Email must be valid")
    private String email;

    @Builder.Default
    private Boolean active = true;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
