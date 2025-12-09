# Service Layer Implementation Guide
## Required Methods for Controllers to Work

This document lists all the methods that need to be implemented in the Service layer to support the updated Controllers.

---

## 🔴 CRITICAL - Required Immediately

### 1. MedicalServiceService

```java
package com.waad.tba.modules.medicalservice;

import com.waad.tba.modules.medicalservice.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface MedicalServiceService {
    
    // Selector for dropdowns
    List<MedicalServiceSelectorDto> getSelectorOptions();
    
    // Pagination
    Page<MedicalServiceViewDto> findAllPaginated(Pageable pageable, String search);
    
    // CRUD
    MedicalServiceViewDto findById(Long id);
    MedicalServiceViewDto create(MedicalServiceCreateDto dto);
    MedicalServiceViewDto update(Long id, MedicalServiceUpdateDto dto);
    void delete(Long id);
    
    // Additional
    long count();
    List<MedicalServiceViewDto> search(String query);
    
    // Legacy (if needed for backward compatibility)
    List<MedicalService> findAll();
}
```

**Mapper Example:**
```java
// In MedicalServiceMapper.java
public static MedicalServiceViewDto toViewDto(MedicalService entity) {
    return MedicalServiceViewDto.builder()
            .id(entity.getId())
            .code(entity.getCode())
            .nameAr(entity.getNameAr())
            .nameEn(entity.getNameEn())
            .descriptionAr(entity.getDescriptionAr())
            .descriptionEn(entity.getDescriptionEn())
            .categoryId(entity.getCategory() != null ? entity.getCategory().getId() : null)
            .categoryNameAr(entity.getCategory() != null ? entity.getCategory().getNameAr() : null)
            .categoryNameEn(entity.getCategory() != null ? entity.getCategory().getNameEn() : null)
            .basePrice(entity.getBasePrice())
            .requiresApproval(entity.getRequiresApproval())
            .active(entity.getActive())
            .createdAt(entity.getCreatedAt())
            .updatedAt(entity.getUpdatedAt())
            .build();
}

public static MedicalServiceSelectorDto toSelectorDto(MedicalService entity) {
    return MedicalServiceSelectorDto.builder()
            .id(entity.getId())
            .code(entity.getCode())
            .nameAr(entity.getNameAr())
            .nameEn(entity.getNameEn())
            .build();
}

public static MedicalService toEntity(MedicalServiceCreateDto dto, MedicalCategory category) {
    MedicalService entity = new MedicalService();
    entity.setCode(dto.getCode());
    entity.setNameAr(dto.getNameAr());
    entity.setNameEn(dto.getNameEn());
    entity.setDescriptionAr(dto.getDescriptionAr());
    entity.setDescriptionEn(dto.getDescriptionEn());
    entity.setCategory(category);
    entity.setBasePrice(dto.getBasePrice());
    entity.setRequiresApproval(dto.getRequiresApproval());
    entity.setActive(dto.getActive() != null ? dto.getActive() : true);
    return entity;
}
```

---

### 2. MedicalCategoryService

```java
package com.waad.tba.modules.medicalcategory;

import com.waad.tba.modules.medicalcategory.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface MedicalCategoryService {
    
    // Selector
    List<MedicalCategorySelectorDto> getSelectorOptions();
    
    // Pagination
    Page<MedicalCategoryViewDto> findAllPaginated(Pageable pageable, String search);
    
    // CRUD
    MedicalCategoryViewDto findById(Long id);
    MedicalCategoryViewDto findByCode(String code);
    MedicalCategoryViewDto create(MedicalCategoryCreateDto dto);
    MedicalCategoryViewDto update(Long id, MedicalCategoryUpdateDto dto);
    void delete(Long id);
    
    // Additional
    long count();
    List<MedicalCategoryViewDto> search(String query);
    
    // Legacy
    List<MedicalCategory> findAll();
    MedicalCategory findById(Long id); // Old signature if exists
}
```

---

### 3. MedicalPackageService

```java
package com.waad.tba.modules.medicalpackage;

import com.waad.tba.modules.medicalpackage.dto.MedicalPackageSelectorDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface MedicalPackageService {
    
    // NEW - Selector
    List<MedicalPackageSelectorDto> getSelectorOptions();
    
    // NEW - Pagination
    Page<MedicalPackage> findAllPaginated(Pageable pageable, String search);
    
    // NEW - Search
    List<MedicalPackage> search(String query);
    
    // EXISTING (keep as is)
    List<MedicalPackage> findAll();
    MedicalPackage findById(Long id);
    MedicalPackage findByCode(String code);
    List<MedicalPackage> findActive();
    MedicalPackage create(MedicalPackageDTO dto);
    MedicalPackage update(Long id, MedicalPackageDTO dto);
    void delete(Long id);
    Long count();
}
```

---

### 4. InsuranceCompanyService

```java
// ADD this method to existing service
List<InsuranceCompanySelectorDto> getSelectorOptions();
```

**Implementation Example:**
```java
@Override
public List<InsuranceCompanySelectorDto> getSelectorOptions() {
    return repository.findByActiveTrue().stream()
            .map(ic -> InsuranceCompanySelectorDto.builder()
                    .id(ic.getId())
                    .code(ic.getCode())
                    .nameAr(ic.getNameAr())
                    .nameEn(ic.getNameEn())
                    .build())
            .collect(Collectors.toList());
}
```

---

### 5. ReviewerCompanyService

```java
// ADD this method
List<ReviewerCompanySelectorDto> getSelectorOptions();
```

---

### 6. ProviderService

```java
// ADD these methods
List<ProviderSelectorDto> getSelectorOptions();
List<ProviderViewDto> search(String query);

// UPDATE this signature
Page<ProviderViewDto> listProviders(int page, int size, String search);
```

---

### 7. MemberService

```java
// ADD these methods
List<MemberSelectorDto> getSelectorOptions();
long count();
List<MemberViewDto> search(String query);
```

---

### 8. ClaimService

```java
// ADD this method
List<ClaimViewDto> search(String query);

// UPDATE signature if needed
Page<ClaimViewDto> listClaims(int page, int size, String search);
```

---

## 🟡 Repository Layer Updates

### Example: MedicalServiceRepository

```java
package com.waad.tba.modules.medicalservice;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MedicalServiceRepository extends JpaRepository<MedicalService, Long> {
    
    // Selector - active only
    List<MedicalService> findByActiveTrue();
    
    // Search
    @Query("SELECT ms FROM MedicalService ms WHERE " +
           "LOWER(ms.nameAr) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(ms.nameEn) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(ms.code) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<MedicalService> search(@Param("query") String query);
    
    // Pagination with search
    @Query("SELECT ms FROM MedicalService ms WHERE " +
           "(:search IS NULL OR " +
           "LOWER(ms.nameAr) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(ms.nameEn) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(ms.code) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<MedicalService> findAllWithSearch(@Param("search") String search, Pageable pageable);
}
```

---

## 🟢 Implementation Priority

### Immediate (Controllers will fail without these):
1. ✅ MedicalServiceService - all methods
2. ✅ MedicalCategoryService - all methods
3. ✅ MedicalPackageService - selector, pagination, search
4. ✅ ProviderService - selector, search
5. ✅ ClaimService - search

### Important (for full functionality):
6. ✅ InsuranceCompanyService - selector
7. ✅ ReviewerCompanyService - selector
8. ✅ MemberService - selector, count, search

---

## 📝 Implementation Checklist

For each Service update:
- [ ] Create/Update Service interface
- [ ] Implement methods in ServiceImpl
- [ ] Create Mapper class (if using DTOs)
- [ ] Update Repository with queries
- [ ] Test with Postman/Swagger
- [ ] Verify error handling

---

## 🔧 Common Patterns

### Selector Implementation:
```java
@Override
public List<XXXSelectorDto> getSelectorOptions() {
    return repository.findByActiveTrue().stream()
            .map(XXXMapper::toSelectorDto)
            .collect(Collectors.toList());
}
```

### Pagination with Search:
```java
@Override
public Page<XXXViewDto> findAllPaginated(Pageable pageable, String search) {
    Page<XXX> page = repository.findAllWithSearch(search, pageable);
    return page.map(XXXMapper::toViewDto);
}
```

### Search Implementation:
```java
@Override
public List<XXXViewDto> search(String query) {
    return repository.search(query).stream()
            .map(XXXMapper::toViewDto)
            .collect(Collectors.toList());
}
```

---

## ⚠️ Important Notes

1. **Don't break existing methods** - add new ones alongside old ones if needed
2. **Use DTOs consistently** - ViewDto for responses, CreateDto/UpdateDto for requests
3. **Validation happens in DTOs** - Services just process business logic
4. **Exceptions are caught by GlobalExceptionHandler** - throw ResourceNotFoundException etc.
5. **Active filter in selectors** - only return active records for dropdowns

---

**Status:** Controllers are ready ✅  
**Next Step:** Implement these Service methods  
**Estimated Time:** 4-6 hours for all services
