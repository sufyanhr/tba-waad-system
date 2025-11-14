package com.waad.tba.modules.insurance.service;

import com.waad.tba.modules.insurance.model.ReviewCompany;
import com.waad.tba.modules.insurance.repository.ReviewCompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewCompanyService {

    private final ReviewCompanyRepository reviewCompanyRepository;

    public List<ReviewCompany> getAll() {
        return reviewCompanyRepository.findAll();
    }

    public Optional<ReviewCompany> getById(Long id) {
        return reviewCompanyRepository.findById(id);
    }

    public ReviewCompany save(ReviewCompany reviewCompany) {
        return reviewCompanyRepository.save(reviewCompany);
    }

    public void delete(Long id) {
        reviewCompanyRepository.deleteById(id);
    }
}
