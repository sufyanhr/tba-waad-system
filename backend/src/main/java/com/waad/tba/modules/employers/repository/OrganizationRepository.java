package com.waad.tba.modules.employers.repository;

import com.waad.tba.modules.employers.model.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByName(String name);

    List<Organization> findByActiveTrue();
}
