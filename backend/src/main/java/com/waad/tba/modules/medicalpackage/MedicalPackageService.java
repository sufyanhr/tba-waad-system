package com.waad.tba.modules.medicalpackage;

import com.waad.tba.modules.medicalservice.MedicalService;
import com.waad.tba.modules.medicalservice.MedicalServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MedicalPackageService {

    private final MedicalPackageRepository packageRepository;
    private final MedicalServiceRepository serviceRepository;

    public List<MedicalPackage> findAll() {
        return packageRepository.findAllWithServices();
    }

    public MedicalPackage findById(Long id) {
        return packageRepository.findByIdWithServices(id)
            .orElseThrow(() -> new RuntimeException("Medical package not found with id: " + id));
    }

    public MedicalPackage findByCode(String code) {
        return packageRepository.findByCode(code)
            .orElseThrow(() -> new RuntimeException("Medical package not found with code: " + code));
    }

    public List<MedicalPackage> findActive() {
        return packageRepository.findByActive(true);
    }

    public Long count() {
        return packageRepository.count();
    }

    @Transactional
    public MedicalPackage create(MedicalPackageDTO dto) {
        // Check if code already exists
        if (packageRepository.existsByCode(dto.getCode())) {
            throw new RuntimeException("Medical package with code " + dto.getCode() + " already exists");
        }

        MedicalPackage medicalPackage = MedicalPackage.builder()
            .code(dto.getCode())
            .nameAr(dto.getNameAr())
            .nameEn(dto.getNameEn())
            .description(dto.getDescription())
            .totalCoverageLimit(dto.getTotalCoverageLimit())
            .active(dto.getActive() != null ? dto.getActive() : true)
            .build();

        // Add services if provided
        if (dto.getServiceIds() != null && !dto.getServiceIds().isEmpty()) {
            Set<MedicalService> services = new HashSet<>();
            for (Long serviceId : dto.getServiceIds()) {
                MedicalService service = serviceRepository.findById(serviceId)
                    .orElseThrow(() -> new RuntimeException("Medical service not found with id: " + serviceId));
                services.add(service);
            }
            medicalPackage.setServices(services);
        }

        return packageRepository.save(medicalPackage);
    }

    @Transactional
    public MedicalPackage update(Long id, MedicalPackageDTO dto) {
        MedicalPackage existingPackage = findById(id);

        // Check if code is being changed and if new code already exists
        if (!existingPackage.getCode().equals(dto.getCode()) && 
            packageRepository.existsByCode(dto.getCode())) {
            throw new RuntimeException("Medical package with code " + dto.getCode() + " already exists");
        }

        existingPackage.setCode(dto.getCode());
        existingPackage.setNameAr(dto.getNameAr());
        existingPackage.setNameEn(dto.getNameEn());
        existingPackage.setDescription(dto.getDescription());
        existingPackage.setTotalCoverageLimit(dto.getTotalCoverageLimit());
        existingPackage.setActive(dto.getActive() != null ? dto.getActive() : true);

        // Update services
        if (dto.getServiceIds() != null) {
            Set<MedicalService> services = new HashSet<>();
            for (Long serviceId : dto.getServiceIds()) {
                MedicalService service = serviceRepository.findById(serviceId)
                    .orElseThrow(() -> new RuntimeException("Medical service not found with id: " + serviceId));
                services.add(service);
            }
            existingPackage.setServices(services);
        } else {
            existingPackage.getServices().clear();
        }

        return packageRepository.save(existingPackage);
    }

    @Transactional
    public void delete(Long id) {
        MedicalPackage medicalPackage = findById(id);
        packageRepository.delete(medicalPackage);
    }
}
