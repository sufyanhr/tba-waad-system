package com.waad.tba.modules.medicalservice;

import com.waad.tba.modules.medicalcategory.MedicalCategory;
import com.waad.tba.modules.medicalservice.dto.MedicalServiceCreateDto;
import com.waad.tba.modules.medicalservice.dto.MedicalServiceSelectorDto;
import com.waad.tba.modules.medicalservice.dto.MedicalServiceUpdateDto;
import com.waad.tba.modules.medicalservice.dto.MedicalServiceViewDto;

public class MedicalServiceMapper {

    public static MedicalServiceViewDto toViewDto(MedicalService entity) {
        if (entity == null) return null;
        
        return MedicalServiceViewDto.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .nameAr(entity.getNameAr())
                .nameEn(entity.getNameEn())
                .descriptionAr(null)
                .descriptionEn(null)
                .categoryId(entity.getCategoryEntity() != null ? entity.getCategoryEntity().getId() : null)
                .categoryNameAr(entity.getCategoryEntity() != null ? entity.getCategoryEntity().getNameAr() : null)
                .categoryNameEn(entity.getCategoryEntity() != null ? entity.getCategoryEntity().getNameEn() : null)
                .basePrice(entity.getPriceLyd())
                .requiresApproval(false)
                .active(true)
                .createdAt(null)
                .updatedAt(null)
                .build();
    }

    public static MedicalServiceSelectorDto toSelectorDto(MedicalService entity) {
        if (entity == null) return null;
        
        return MedicalServiceSelectorDto.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .nameAr(entity.getNameAr())
                .nameEn(entity.getNameEn())
                .build();
    }

    public static MedicalService toEntity(MedicalServiceCreateDto dto, MedicalCategory category) {
        if (dto == null) return null;
        
        return MedicalService.builder()
                .code(dto.getCode())
                .nameAr(dto.getNameAr())
                .nameEn(dto.getNameEn())
                .categoryEntity(category)
                .priceLyd(dto.getBasePrice())
                .costLyd(0.0)
                .build();
    }

    public static void updateEntity(MedicalService entity, MedicalServiceUpdateDto dto, MedicalCategory category) {
        if (entity == null || dto == null) return;
        
        entity.setCode(dto.getCode());
        entity.setNameAr(dto.getNameAr());
        entity.setNameEn(dto.getNameEn());
        entity.setCategoryEntity(category);
        entity.setPriceLyd(dto.getBasePrice());
    }
}
