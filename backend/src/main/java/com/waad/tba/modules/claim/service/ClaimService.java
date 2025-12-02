package com.waad.tba.modules.claim.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.waad.tba.common.exception.ResourceNotFoundException;
import com.waad.tba.modules.audit.service.AuditTrailService;
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
import com.waad.tba.security.AuthorizationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository repository;
    private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final ClaimMapper mapper;
    private final ProviderCompanyContractService providerContractService;
    private final AuthorizationService authorizationService;
    private final AuditTrailService auditTrailService;

    @Transactional(readOnly = true)
    public List<ClaimResponseDto> findAll() {
        log.debug("Finding all claims with data-level filtering");
        
        // Get current user and apply role-based filtering
        User currentUser = authorizationService.getCurrentUser();
        if (currentUser == null) {
            log.warn("No authenticated user found when accessing claims list");
            return Collections.emptyList();
        }
        
        List<Claim> claims;
        
        // Apply data-level security based on user role
        if (authorizationService.isSuperAdmin(currentUser)) {
            // SUPER_ADMIN: Access to all claims
            log.debug("SUPER_ADMIN access: returning all claims");
            claims = repository.findAll();
            
        } else if (authorizationService.isInsuranceAdmin(currentUser)) {
            // INSURANCE_ADMIN: Filter by insurance company
            Long companyFilter = authorizationService.getCompanyFilterForUser(currentUser);
            if (companyFilter != null) {
                log.info("Applying insurance company filter for claims: companyId={} for user {}", 
                    companyFilter, currentUser.getUsername());
                // Get claims for members belonging to this insurance company
                claims = repository.findByMemberInsuranceCompanyId(companyFilter);
            } else {
                log.debug("INSURANCE_ADMIN access: returning all claims (no company filter)");
                claims = repository.findAll();
            }
            
        } else if (authorizationService.isReviewer(currentUser)) {
            // REVIEWER: Access to all claims for review purposes
            log.debug("REVIEWER access: returning all claims for review");
            claims = repository.findAll();
            
        } else if (authorizationService.isEmployerAdmin(currentUser)) {
            // EMPLOYER_ADMIN: Check feature toggle first (Phase 9)
            if (!authorizationService.canEmployerViewClaims(currentUser)) {
                log.warn("FeatureCheck: EMPLOYER_ADMIN user {} attempted to view claims but feature VIEW_CLAIMS is disabled", 
                    currentUser.getUsername());
                return Collections.emptyList();
            }
            
            // Feature enabled: Filter by employer
            Long employerId = authorizationService.getEmployerFilterForUser(currentUser);
            if (employerId == null) {
                log.warn("EMPLOYER_ADMIN user {} has no employerId assigned", currentUser.getUsername());
                return Collections.emptyList();
            }
            
            log.info("Applying employer filter for claims: employerId={} for user {}", 
                employerId, currentUser.getUsername());
            claims = repository.findByMemberEmployerId(employerId);
            
        } else if (authorizationService.isProvider(currentUser)) {
            // PROVIDER: Only claims created by this provider
            log.info("Applying provider filter: userId={} for user {}", 
                currentUser.getId(), currentUser.getUsername());
            claims = repository.findByCreatedById(currentUser.getId());
            
        } else {
            // USER: No access to claims list
            log.warn("Access denied: user {} with roles {} attempted to access claims list", 
                currentUser.getUsername(), 
                currentUser.getRoles().stream()
                    .map(r -> r.getName())
                    .collect(Collectors.joining(", ")));
            return Collections.emptyList();
        }
        
        return claims.stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClaimResponseDto findById(Long id) {
        log.debug("Finding claim by id: {}", id);
        
        // Get current user and validate access
        User currentUser = authorizationService.getCurrentUser();
        if (currentUser == null) {
            log.warn("No authenticated user found when accessing claim: {}", id);
            throw new AccessDeniedException("Authentication required");
        }
        
        // Phase 9: Check feature toggle for EMPLOYER_ADMIN
        if (authorizationService.isEmployerAdmin(currentUser)) {
            if (!authorizationService.canEmployerViewClaims(currentUser)) {
                log.warn("FeatureCheck: EMPLOYER_ADMIN user {} attempted to view claim {} but feature VIEW_CLAIMS is disabled", 
                    currentUser.getUsername(), id);
                throw new AccessDeniedException("Your employer account does not have permission to view claims");
            }
        }
        
        // Check if user can access this claim
        if (!authorizationService.canAccessClaim(currentUser, id)) {
            log.warn("Access denied: user {} attempted to view claim {}", 
                currentUser.getUsername(), id);
            throw new AccessDeniedException("Access denied to this claim");
        }
        
        Claim entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));
        
        // Audit log: Claim viewed
        auditTrailService.logView("Claim", id, currentUser);
        
        log.debug("Claim {} accessed successfully by user {}", id, currentUser.getUsername());
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

        // Get current user for createdBy tracking
        User currentUser = authorizationService.getCurrentUser();
        if (currentUser == null) {
            log.warn("No authenticated user found when creating claim");
            throw new AccessDeniedException("Authentication required");
        }

        Member member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", dto.getMemberId()));

        // Validate provider has active contract with member's company
        if (dto.getProviderId() != null) {
            Long companyId = member.getEmployer().getCompany().getId();
            providerContractService.validateActiveContract(companyId, dto.getProviderId());
        }

        Claim entity = mapper.toEntity(dto, member);
        
        // Set createdBy field to track who created the claim
        entity.setCreatedBy(currentUser);
        log.debug("Setting claim createdBy to user: {} (id: {})", currentUser.getUsername(), currentUser.getId());
        
        Claim saved = repository.save(entity);
        
        // Audit log: Claim created
        auditTrailService.logClaimCreation(saved.getId(), currentUser, saved.getClaimNumber());
        
        log.info("Claim created successfully with id: {} and claim number: {} by user: {}", 
            saved.getId(), saved.getClaimNumber(), currentUser.getUsername());
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
        
        // Get current user and validate access
        User currentUser = authorizationService.getCurrentUser();
        if (currentUser == null) {
            log.warn("No authenticated user found when approving claim: {}", id);
            throw new AccessDeniedException("Authentication required");
        }
        
        // Check if user can modify this claim
        if (!authorizationService.canModifyClaim(currentUser, id)) {
            log.warn("Access denied: user {} attempted to approve claim {}", 
                currentUser.getUsername(), id);
            throw new AccessDeniedException("Not allowed to modify this claim");
        }
        
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
        
        // Audit log: Claim approved
        auditTrailService.logClaimApproval(id, currentUser, approvedAmount.toString());
        
        log.info("Claim approved successfully: {} by user: {}", id, currentUser.getUsername());
        return mapper.toResponseDto(updated);
    }

    @Transactional
    public ClaimResponseDto rejectClaim(Long id, Long reviewerId, String rejectionReason) {
        log.info("Rejecting claim with id: {} by reviewer: {}", id, reviewerId);
        
        // Get current user and validate access
        User currentUser = authorizationService.getCurrentUser();
        if (currentUser == null) {
            log.warn("No authenticated user found when rejecting claim: {}", id);
            throw new AccessDeniedException("Authentication required");
        }
        
        // Check if user can modify this claim
        if (!authorizationService.canModifyClaim(currentUser, id)) {
            log.warn("Access denied: user {} attempted to reject claim {}", 
                currentUser.getUsername(), id);
            throw new AccessDeniedException("Not allowed to modify this claim");
        }
        
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
        
        // Audit log: Claim rejected
        auditTrailService.logClaimRejection(id, currentUser, rejectionReason);
        
        log.info("Claim rejected successfully: {} by user: {}", id, currentUser.getUsername());
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
