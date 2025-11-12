package com.waad.tba.controller;

import com.waad.tba.model.ReviewCompany;
import com.waad.tba.service.ReviewCompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review-companies")
@RequiredArgsConstructor
public class ReviewCompanyController {

    private final ReviewCompanyService reviewCompanyService;

    @GetMapping
    public ResponseEntity<List<ReviewCompany>> getAll() {
        return ResponseEntity.ok(reviewCompanyService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewCompany> getById(@PathVariable Long id) {
        return reviewCompanyService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ReviewCompany> create(@RequestBody ReviewCompany company) {
        return ResponseEntity.ok(reviewCompanyService.save(company));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewCompany> update(@PathVariable Long id, @RequestBody ReviewCompany company) {
        company.setId(id);
        return ResponseEntity.ok(reviewCompanyService.save(company));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reviewCompanyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
