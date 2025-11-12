package com.waad.tba.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "claim_attachments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String fileUrl;

    private String fileType;

    private Long fileSize;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id")
    private Claim claim;

    private LocalDateTime uploadedAt = LocalDateTime.now();

    private String uploadedBy;
}
