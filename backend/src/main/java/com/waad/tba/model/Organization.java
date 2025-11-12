package com.waad.tba.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "organizations")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "registration_number", unique = true)
    private String registrationNumber;

    private String industry;

    private String address;

    private String phone;

    private String email;

    @Column(name = "contact_person")
    private String contactPerson;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "organization_code", length = 10, unique = true)
    private String organizationCode;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_member_id")
    private Member employerOwner;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Member> members;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_organization_id")
    private Organization parentOrganization;

    @ManyToOne
    @JoinColumn(name = "review_company_id")
    private ReviewCompany reviewCompany;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

