package com.waad.tba.modules.claims.repository;

import com.waad.tba.modules.claims.model.ClaimAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClaimAttachmentRepository extends JpaRepository<ClaimAttachment, Long> {
    List<ClaimAttachment> findByClaimId(Long claimId);
}
