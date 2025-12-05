package com.waad.tba.modules.preapproval.service;

import com.waad.tba.modules.preapproval.dto.PreApprovalCreateDto;
import com.waad.tba.modules.preapproval.dto.PreApprovalUpdateDto;
import com.waad.tba.modules.preapproval.dto.PreApprovalViewDto;
import com.waad.tba.modules.preapproval.entity.PreApproval;
import com.waad.tba.modules.preapproval.entity.PreApprovalStatus;
import com.waad.tba.modules.preapproval.mapper.PreApprovalMapper;
import com.waad.tba.modules.preapproval.repository.PreApprovalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for managing Pre-Approval requests
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PreApprovalService {

    private final PreApprovalRepository preApprovalRepository;
    private final PreApprovalMapper preApprovalMapper;

    /**
     * Create a new pre-approval request
     */
    public PreApprovalViewDto createPreApproval(PreApprovalCreateDto dto) {
        log.info("Creating pre-approval for member ID: {}", dto.getMemberId());

        PreApproval preApproval = preApprovalMapper.toEntity(dto);
        PreApproval saved = preApprovalRepository.save(preApproval);

        log.info("Pre-approval created with ID: {}", saved.getId());
        return preApprovalMapper.toViewDto(saved);
    }

    /**
     * Update an existing pre-approval request
     */
    public PreApprovalViewDto updatePreApproval(Long id, PreApprovalUpdateDto dto) {
        log.info("Updating pre-approval with ID: {}", id);

        PreApproval preApproval = preApprovalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pre-approval not found with ID: " + id));

        // Validate business rules
        validateUpdateBusinessRules(preApproval, dto);

        preApprovalMapper.updateEntityFromDto(preApproval, dto);
        PreApproval updated = preApprovalRepository.save(preApproval);

        log.info("Pre-approval updated with ID: {}", updated.getId());
        return preApprovalMapper.toViewDto(updated);
    }

    /**
     * Get pre-approval by ID
     */
    @Transactional(readOnly = true)
    public PreApprovalViewDto getPreApproval(Long id) {
        log.debug("Fetching pre-approval with ID: {}", id);

        PreApproval preApproval = preApprovalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pre-approval not found with ID: " + id));

        return preApprovalMapper.toViewDto(preApproval);
    }

    /**
     * List pre-approvals with pagination and search
     */
    @Transactional(readOnly = true)
    public Page<PreApprovalViewDto> listPreApprovals(int page, int size, String search) {
        log.debug("Listing pre-approvals - page: {}, size: {}, search: {}", page, size, search);

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<PreApproval> preApprovalsPage = preApprovalRepository.searchPaged(search, pageable);

        return preApprovalsPage.map(preApprovalMapper::toViewDto);
    }

    /**
     * Get pre-approvals by member ID
     */
    @Transactional(readOnly = true)
    public List<PreApprovalViewDto> getPreApprovalsByMember(Long memberId) {
        log.debug("Fetching pre-approvals for member ID: {}", memberId);

        List<PreApproval> preApprovals = preApprovalRepository.findByMemberId(memberId);
        return preApprovals.stream()
                .map(preApprovalMapper::toViewDto)
                .toList();
    }

    /**
     * Delete pre-approval (soft delete)
     */
    public void deletePreApproval(Long id) {
        log.info("Deleting pre-approval with ID: {}", id);

        PreApproval preApproval = preApprovalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pre-approval not found with ID: " + id));

        preApproval.setActive(false);
        preApprovalRepository.save(preApproval);

        log.info("Pre-approval soft deleted with ID: {}", id);
    }

    /**
     * Count total active pre-approvals
     */
    @Transactional(readOnly = true)
    public Long countPreApprovals() {
        return preApprovalRepository.countActive();
    }

    /**
     * Validate business rules for update
     */
    private void validateUpdateBusinessRules(PreApproval entity, PreApprovalUpdateDto dto) {
        // Only APPROVED status can have approved amount > 0
        if (dto.getStatus() == PreApprovalStatus.APPROVED) {
            BigDecimal approvedAmount = dto.getApprovedAmount() != null 
                    ? dto.getApprovedAmount() 
                    : entity.getApprovedAmount();
            
            if (approvedAmount == null || approvedAmount.compareTo(BigDecimal.ZERO) == 0) {
                throw new IllegalArgumentException("Approved status must have approved amount greater than zero");
            }
        }

        // On rejection, reviewer comment is required
        if (dto.getStatus() == PreApprovalStatus.REJECTED) {
            String comment = dto.getReviewerComment() != null 
                    ? dto.getReviewerComment() 
                    : entity.getReviewerComment();
            
            if (comment == null || comment.trim().isEmpty()) {
                throw new IllegalArgumentException("Reviewer comment is required when rejecting a pre-approval");
            }
        }
    }
}
