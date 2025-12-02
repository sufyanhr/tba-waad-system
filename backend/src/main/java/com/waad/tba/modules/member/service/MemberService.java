package com.waad.tba.modules.member.service;

import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.waad.tba.common.exception.ResourceNotFoundException;
import com.waad.tba.modules.audit.service.AuditTrailService;
import com.waad.tba.modules.employer.repository.EmployerRepository;
import com.waad.tba.modules.member.dto.MemberCreateDto;
import com.waad.tba.modules.member.dto.MemberResponseDto;
import com.waad.tba.modules.member.entity.Member;
import com.waad.tba.modules.member.mapper.MemberMapper;
import com.waad.tba.modules.member.repository.MemberRepository;
import com.waad.tba.modules.rbac.entity.User;
import com.waad.tba.security.AuthorizationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository repository;
    private final EmployerRepository employerRepository;
    private final MemberMapper mapper;
    private final AuthorizationService authorizationService;
    private final AuditTrailService auditTrailService;

    @Transactional(readOnly = true)
    public MemberResponseDto findById(Long id) {
        log.debug("Finding member by id: {}", id);
        
        // Get current user and validate access
        User currentUser = authorizationService.getCurrentUser();
        if (currentUser == null) {
            log.warn("No authenticated user found when accessing member: {}", id);
            throw new AccessDeniedException("Authentication required");
        }
        
        // Check if user can access this member
        if (!authorizationService.canAccessMember(currentUser, id)) {
            log.warn("Access denied: user {} attempted to view member {}", 
                currentUser.getUsername(), id);
            throw new AccessDeniedException("You are not allowed to view this member");
        }
        
        Member entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));
        
        // Audit log: Member viewed
        auditTrailService.logView("Member", id, currentUser);
        
        log.debug("Member {} accessed successfully by user {}", id, currentUser.getUsername());
        return mapper.toResponseDto(entity);
    }

    @Transactional
    public MemberResponseDto create(MemberCreateDto dto) {
        log.info("Creating new member: {}", dto.getFullName());

        // Phase 9: Check if EMPLOYER_ADMIN can edit members
        User currentUser = authorizationService.getCurrentUser();
        if (currentUser != null && authorizationService.isEmployerAdmin(currentUser)) {
            if (!authorizationService.canEmployerEditMembers(currentUser)) {
                log.warn("FeatureCheck: EMPLOYER_ADMIN user {} attempted to create member but feature EDIT_MEMBERS is disabled", 
                    currentUser.getUsername());
                throw new AccessDeniedException("Your employer account does not have permission to create members");
            }
        }

        // Validate employer exists
        if (!employerRepository.existsById(dto.getEmployerId())) {
            throw new ResourceNotFoundException("Employer", "id", dto.getEmployerId());
        }
        
        // Validate unique civilId
        if (repository.existsByCivilId(dto.getCivilId())) {
            throw new IllegalArgumentException("Civil ID already exists: " + dto.getCivilId());
        }
        
        // Validate unique cardNumber (policyNumber)
        if (repository.existsByCardNumber(dto.getPolicyNumber())) {
            throw new IllegalArgumentException("Card number already exists: " + dto.getPolicyNumber());
        }

        Member entity = mapper.toEntity(dto);
        
        // Automatically set insuranceCompany from employer (Phase 8.2)
        // In this system, Member.insuranceCompany should be set based on the employer's insurance company
        // For now, we keep it null and let it be set manually or through a different process
        // TODO: Link Employer to InsuranceCompany in the data model
        
        Member saved = repository.save(entity);
        
        log.info("Member created successfully with id: {}", saved.getId());
        return mapper.toResponseDto(saved);
    }

    @Transactional
    public MemberResponseDto update(Long id, MemberCreateDto dto) {
        log.info("Updating member with id: {}", id);
        
        // Phase 9: Check if EMPLOYER_ADMIN can edit members
        User currentUser = authorizationService.getCurrentUser();
        if (currentUser != null && authorizationService.isEmployerAdmin(currentUser)) {
            if (!authorizationService.canEmployerEditMembers(currentUser)) {
                log.warn("FeatureCheck: EMPLOYER_ADMIN user {} attempted to update member {} but feature EDIT_MEMBERS is disabled", 
                    currentUser.getUsername(), id);
                throw new AccessDeniedException("Your employer account does not have permission to edit members");
            }
        }
        
        Member entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));

        // Validate employer exists
        if (!employerRepository.existsById(dto.getEmployerId())) {
            throw new ResourceNotFoundException("Employer", "id", dto.getEmployerId());
        }
        
        // Validate unique civilId (excluding current member)
        if (repository.existsByCivilIdAndIdNot(dto.getCivilId(), id)) {
            throw new IllegalArgumentException("Civil ID already exists: " + dto.getCivilId());
        }
        
        // Validate unique cardNumber (excluding current member)
        if (repository.existsByCardNumberAndIdNot(dto.getPolicyNumber(), id)) {
            throw new IllegalArgumentException("Card number already exists: " + dto.getPolicyNumber());
        }

        mapper.updateEntityFromDto(entity, dto);
        Member updated = repository.save(entity);
        
        log.info("Member updated successfully: {}", id);
        return mapper.toResponseDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting member with id: {}", id);
        
        // Phase 9: Check if EMPLOYER_ADMIN can edit members
        User currentUser = authorizationService.getCurrentUser();
        if (currentUser != null && authorizationService.isEmployerAdmin(currentUser)) {
            if (!authorizationService.canEmployerEditMembers(currentUser)) {
                log.warn("FeatureCheck: EMPLOYER_ADMIN user {} attempted to delete member {} but feature EDIT_MEMBERS is disabled", 
                    currentUser.getUsername(), id);
                throw new AccessDeniedException("Your employer account does not have permission to delete members");
            }
        }
        
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Member", "id", id);
        }
        
        repository.deleteById(id);
        log.info("Member deleted successfully: {}", id);
    }

    @Transactional(readOnly = true)
    public Page<MemberResponseDto> findAllPaginated(Long companyId, String search, Pageable pageable) {
        log.debug("Finding members with pagination. companyId={}, search={}", companyId, search);
        
        // Get current user and apply employer-level filtering
        User currentUser = authorizationService.getCurrentUser();
        if (currentUser == null) {
            log.warn("No authenticated user found when accessing members list");
            return Page.empty(pageable);
        }
        
        Page<Member> page;
        
        // Apply data-level security based on user role
        if (authorizationService.isSuperAdmin(currentUser)) {
            // SUPER_ADMIN: Access to all members
            log.debug("SUPER_ADMIN access: returning all members");
            page = findAllMembersWithFilters(companyId, search, pageable);
            
        } else if (authorizationService.isInsuranceAdmin(currentUser)) {
            // INSURANCE_ADMIN: Filter by insurance company
            Long companyFilter = authorizationService.getCompanyFilterForUser(currentUser);
            if (companyFilter != null) {
                log.info("Applying insurance company filter: companyId={} for user {}", 
                    companyFilter, currentUser.getUsername());
                
                // Override companyId parameter with user's companyId
                if (search != null && !search.isBlank()) {
                    page = repository.searchByInsuranceCompany(companyFilter, search, pageable);
                } else {
                    page = repository.findByInsuranceCompanyIdPaged(companyFilter, pageable);
                }
            } else {
                log.debug("INSURANCE_ADMIN access: returning all members (no company filter)");
                page = findAllMembersWithFilters(companyId, search, pageable);
            }
            
        } else if (authorizationService.isEmployerAdmin(currentUser)) {
            // EMPLOYER_ADMIN: Filter by employer
            Long employerId = authorizationService.getEmployerFilterForUser(currentUser);
            if (employerId == null) {
                log.warn("EMPLOYER_ADMIN user {} has no employerId assigned", currentUser.getUsername());
                return Page.empty(pageable);
            }
            
            log.info("Applying employer filter: employerId={} for user {}", 
                employerId, currentUser.getUsername());
            
            if (search != null && !search.isBlank()) {
                page = repository.searchByEmployer(employerId, search, pageable);
            } else {
                page = repository.findByEmployerIdPaged(employerId, pageable);
            }
            
        } else {
            // PROVIDER, REVIEWER, USER: No access to member list
            log.warn("Access denied: user {} with roles {} attempted to access members list", 
                currentUser.getUsername(), 
                currentUser.getRoles().stream()
                    .map(r -> r.getName())
                    .collect(Collectors.joining(", ")));
            return Page.empty(pageable);
        }
        
        return page.map(mapper::toResponseDto);
    }
    
    /**
     * Helper method to find members with company and search filters (for admins only)
     */
    private Page<Member> findAllMembersWithFilters(Long companyId, String search, Pageable pageable) {
        if (companyId != null) {
            if (search != null && !search.isBlank()) {
                return repository.searchPagedByCompany(companyId, search, pageable);
            } else {
                return repository.findByCompanyId(companyId, pageable);
            }
        } else {
            if (search != null && !search.isBlank()) {
                return repository.searchPaged(search, pageable);
            } else {
                return repository.findAll(pageable);
            }
        }
    }

    @Transactional(readOnly = true)
    public long count() {
        return repository.count();
    }
}
