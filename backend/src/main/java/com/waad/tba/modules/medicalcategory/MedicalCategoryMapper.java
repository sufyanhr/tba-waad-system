package com.waad.tba.modules.medicalcategory;

import com.waad.tba.modules.medicalcategory.dto.MedicalCategoryCreateDto;
import com.waad.tba.modules.medicalcategory.dto.MedicalCategorySelectorDto;
import com.waad.tba.modules.medicalcategory.dto.MedicalCategoryUpdateDto;
import com.waad.tba.modules.medicalcategory.dto.MedicalCategoryViewDto;

public class MedicalCategoryMapper {

    public static MedicalCategoryViewDto toViewDto(MedicalCategory entity) {
        if (entity == null) return null;
        
        return MedicalCategoryViewDto.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .nameAr(entity.getNameAr())
                .nameEn(entity.getNameEn())
                .descriptionAr(entity.getDescription())
                .descriptionEn(entity.getDescription())
                .active(true) // Default to true since entity doesn't have active field
                .servicesCount(entity.getMedicalServices() != null ? entity.getMedicalServices().size() : 0)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static MedicalCategorySelectorDto toSelectorDto(MedicalCategory entity) {
        if (entity == null) return null;
        
        return MedicalCategorySelectorDto.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .nameAr(entity.getNameAr())
                .nameEn(entity.getNameEn())
                .build();
    }

    public static MedicalCategory toEntity(MedicalCategoryCreateDto dto) {
        if (dto == null) return null;
        
        return MedicalCategory.builder()
                .code(dto.getCode())
                .nameAr(dto.getNameAr())
                .nameEn(dto.getNameEn())
                .description(dto.getDescription())
                .build();
    }

    public static void updateEntity(MedicalCategory entity, MedicalCategoryUpdateDto dto) {
        if (entity == null || dto == null) return;
        
        entity.setCode(dto.getCode());
        entity.setNameAr(dto.getNameAr());
        entity.setNameEn(dto.getNameEn());
        entity.setDescription(dto.getDescription());
    }
}
