package com.waad.tba.modules.claim.service;

import com.waad.tba.common.exception.ResourceNotFoundException;
import com.waad.tba.modules.claim.dto.ClaimCreateDto;
import com.waad.tba.modules.claim.dto.ClaimResponseDto;
import com.waad.tba.modules.claim.entity.Claim;
import com.waad.tba.modules.claim.mapper.ClaimMapper;
import com.waad.tba.modules.claim.repository.ClaimRepository;
import com.waad.tba.modules.member.entity.Member;
import com.waad.tba.modules.member.repository.MemberRepository;
import com.waad.tba.modules.providercontract.service.ProviderCompanyContractService;
import com.waad.tba.modules.rbac.entity.User;
import com.waad.tba.modules.rbac.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository repository;
    private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final ClaimMapper mapper;
    private final ProviderCompanyContractService providerContractService;

    @Transactional(readOnly = true)
    public List<ClaimResponseDto> findAll() {
        log.debug("Finding all claims");
        return repository.findAll().stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClaimResponseDto findById(Long id) {
        log.debug("Finding claim by id: {}", id);
        Claim entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));
        return mapper.toResponseDto(entity);
    }

    @Transactional(readOnly = true)
    public List<ClaimResponseDto> findByMember(Long memberId) {
        log.debug("Finding claims for member: {}", memberId);
        return repository.findByMemberId(memberId).stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ClaimResponseDto> findByProvider(Long providerId) {
        log.debug("Finding claims for provider: {}", providerId);
        return repository.findByProviderId(providerId).stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClaimResponseDto create(ClaimCreateDto dto) {
        log.info("Creating new claim for member id: {}", dto.getMemberId());

        Member member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", dto.getMemberId()));

        // Validate provider has active contract with member's company
        if (dto.getProviderId() != null) {
            Long companyId = member.getEmployer().getCompany().getId();
            providerContractService.validateActiveContract(companyId, dto.getProviderId());
        }

        Claim entity = mapper.toEntity(dto, member);
        Claim saved = repository.save(entity);
        
        log.info("Claim created successfully with id: {} and claim number: {}", saved.getId(), saved.getClaimNumber());
        return mapper.toResponseDto(saved);
    }

    @Transactional
    public ClaimResponseDto update(Long id, ClaimCreateDto dto) {
        log.info("Updating claim with id: {}", id);
        
        Claim entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));

        Member member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", dto.getMemberId()));

        // Validate provider has active contract with member's company
        if (dto.getProviderId() != null) {
            Long companyId = member.getEmployer().getCompany().getId();
            providerContractService.validateActiveContract(companyId, dto.getProviderId());
        }

        mapper.updateEntityFromDto(entity, dto, member);
        Claim updated = repository.save(entity);
        
        log.info("Claim updated successfully: {}", id);
        return mapper.toResponseDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting claim with id: {}", id);
        
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Claim", "id", id);
        }
        
        repository.deleteById(id);
        log.info("Claim deleted successfully: {}", id);
    }

    @Transactional(readOnly = true)
    public List<ClaimResponseDto> search(String query) {
        log.debug("Searching claims with query: {}", query);
        return repository.search(query).stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ClaimResponseDto> findAllPaginated(Pageable pageable, String search) {
        log.debug("Finding claims with pagination. search={}", search);
        if (search == null || search.isBlank()) {
            return repository.findAll(pageable).map(mapper::toResponseDto);
        } else {
            return repository.searchPaged(search, pageable).map(mapper::toResponseDto);
        }
    }

    @Transactional(readOnly = true)
    public List<ClaimResponseDto> getByStatus(Claim.ClaimStatus status) {
        log.debug("Finding claims by status: {}", status);
        return repository.findByStatus(status).stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long count() {
        return repository.count();
    }

    @Transactional
    public ClaimResponseDto approveClaim(Long id, Long reviewerId, BigDecimal approvedAmount) {
        log.info("Approving claim with id: {} by reviewer: {}", id, reviewerId);
        
        Claim entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));

        if (entity.getStatus() != Claim.ClaimStatus.PENDING && 
            entity.getStatus() != Claim.ClaimStatus.UNDER_MEDICAL_REVIEW &&
            entity.getStatus() != Claim.ClaimStatus.UNDER_FINANCIAL_REVIEW) {
            throw new IllegalStateException("Claim cannot be approved in current status: " + entity.getStatus());
        }

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", reviewerId));

        entity.setStatus(Claim.ClaimStatus.APPROVED);
        entity.setTotalApproved(approvedAmount);
        entity.setFinancialReviewer(reviewer);
        entity.setFinancialReviewedAt(LocalDateTime.now());
        entity.setFinancialReviewStatus(Claim.ReviewStatus.APPROVED);
        entity.setRejectionReason(null);
        
        // Calculate net payable
        entity.setNetPayable(approvedAmount.subtract(entity.getMemberCoPayment() != null ? entity.getMemberCoPayment() : BigDecimal.ZERO));
        
        Claim updated = repository.save(entity);
        
        log.info("Claim approved successfully: {}", id);
        return mapper.toResponseDto(updated);
    }

    @Transactional
    public ClaimResponseDto rejectClaim(Long id, Long reviewerId, String rejectionReason) {
        log.info("Rejecting claim with id: {} by reviewer: {}", id, reviewerId);
        
        Claim entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));

        if (entity.getStatus() != Claim.ClaimStatus.PENDING &&
            entity.getStatus() != Claim.ClaimStatus.UNDER_MEDICAL_REVIEW &&
            entity.getStatus() != Claim.ClaimStatus.UNDER_FINANCIAL_REVIEW) {
            throw new IllegalStateException("Claim cannot be rejected in current status: " + entity.getStatus());
        }

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", reviewerId));

        entity.setStatus(Claim.ClaimStatus.REJECTED);
        entity.setRejectionReason(rejectionReason);
        entity.setTotalApproved(BigDecimal.ZERO);
        entity.setTotalRejected(entity.getTotalClaimed());
        entity.setFinancialReviewer(reviewer);
        entity.setFinancialReviewedAt(LocalDateTime.now());
        entity.setFinancialReviewStatus(Claim.ReviewStatus.REJECTED);
        
        Claim updated = repository.save(entity);
        
        log.info("Claim rejected successfully: {}", id);
        return mapper.toResponseDto(updated);
    }

    @Transactional
    public ClaimResponseDto updateFinancialReview(Long id, Long reviewerId, BigDecimal newTotalApproved, String notes) {
        log.info("Updating financial review for claim: {}", id);
        
        Claim entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", reviewerId));

        entity.setTotalApproved(newTotalApproved);
        entity.setTotalRejected(entity.getTotalClaimed().subtract(newTotalApproved));
        entity.setFinancialReviewer(reviewer);
        entity.setFinancialReviewedAt(LocalDateTime.now());
        entity.setFinancialReviewNotes(notes);
        
        // Calculate net payable
        entity.setNetPayable(newTotalApproved.subtract(entity.getMemberCoPayment() != null ? entity.getMemberCoPayment() : BigDecimal.ZERO));
        
        Claim updated = repository.save(entity);
        
        log.info("Financial review updated successfully");
        return mapper.toResponseDto(updated);
    }

    @Transactional
    public ClaimResponseDto markUnderMedicalReview(Long id, Long reviewerId) {
        log.info("Marking claim {} as under medical review", id);
        
        Claim entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", reviewerId));

        entity.setStatus(Claim.ClaimStatus.UNDER_MEDICAL_REVIEW);
        entity.setMedicalReviewer(reviewer);
        
        Claim updated = repository.save(entity);
        return mapper.toResponseDto(updated);
    }

    @Transactional
    public ClaimResponseDto markUnderFinancialReview(Long id, Long reviewerId) {
        log.info("Marking claim {} as under financial review", id);
        
        Claim entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", reviewerId));

        entity.setStatus(Claim.ClaimStatus.UNDER_FINANCIAL_REVIEW);
        entity.setFinancialReviewer(reviewer);
        
        Claim updated = repository.save(entity);
        return mapper.toResponseDto(updated);
    }
}
