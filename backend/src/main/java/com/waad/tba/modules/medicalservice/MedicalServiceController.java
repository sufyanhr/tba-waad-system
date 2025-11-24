package com.waad.tba.modules.medicalservice;

import com.waad.tba.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-services")
@RequiredArgsConstructor
public class MedicalServiceController {

    private final MedicalServiceService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MedicalService>>> getAll() {
        List<MedicalService> services = service.findAll();
        return ResponseEntity.ok(ApiResponse.success(services));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MedicalService>> create(@RequestBody MedicalService s) {
        MedicalService created = service.create(s);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalService>> update(@PathVariable Long id, @RequestBody MedicalService s) {
        MedicalService updated = service.update(id, s);
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
