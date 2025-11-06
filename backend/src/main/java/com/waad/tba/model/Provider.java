package com.waad.tba.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "providers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Provider {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "license_number", unique = true)
    private String licenseNumber;
    
    @Enumerated(EnumType.STRING)
    private ProviderType type;
    
    @Column(name = "specialties")
    private String specialties;
    
    private String address;
    
    private String phone;
    
    private String email;
    
    @Column(name = "contact_person")
    private String contactPerson;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalStatus status = ApprovalStatus.PENDING;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Claim> claims;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum ProviderType {
        HOSPITAL, CLINIC, PHARMACY, LABORATORY, DIAGNOSTIC_CENTER, OTHER
    }
    
    public enum ApprovalStatus {
        PENDING, APPROVED, REJECTED
    }
}
