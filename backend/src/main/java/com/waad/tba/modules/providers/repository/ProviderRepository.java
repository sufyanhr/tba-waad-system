package com.waad.tba.modules.providers.repository;

import com.waad.tba.modules.providers.model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {
    Optional<Provider> findByLicenseNumber(String licenseNumber);
}
