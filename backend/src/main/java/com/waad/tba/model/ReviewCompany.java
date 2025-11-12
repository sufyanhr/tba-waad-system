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
@Table(name = "review_companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ReviewCompany {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;
    private String address;

    // 🔹 مستخدمين الشركة (شركة وعد مثلاً)
    @OneToMany(mappedBy = "reviewCompany", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<User> users;

    // 🔹 المنظمات (شركات العملاء مثل الأسمنت أو المصرف)
    @OneToMany(mappedBy = "reviewCompany", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Organization> organizations;

    // 🔹 مزودو الخدمة (مثل المستشفيات أو العيادات)
    @OneToMany(mappedBy = "reviewCompany", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Provider> providers;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
