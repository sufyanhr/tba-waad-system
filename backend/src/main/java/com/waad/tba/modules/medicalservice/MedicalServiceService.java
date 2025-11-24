package com.waad.tba.modules.medicalservice;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalServiceService {

    private final MedicalServiceRepository repo;

    public List<MedicalService> findAll() {
        return repo.findAll();
    }

    public MedicalService create(MedicalService s) {
        return repo.save(s);
    }

    public MedicalService update(Long id, MedicalService s) {
        s.setId(id);
        return repo.save(s);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
