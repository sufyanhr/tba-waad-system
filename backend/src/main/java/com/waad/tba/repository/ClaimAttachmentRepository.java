package com.waad.tba.repository;

import com.waad.tba.model.ClaimAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClaimAttachmentRepository extends JpaRepository<ClaimAttachment, Long> {
    List<ClaimAttachment> findByClaimId(Long claimId);
}
