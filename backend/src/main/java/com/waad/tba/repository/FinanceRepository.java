package com.waad.tba.repository;

import com.waad.tba.model.Finance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FinanceRepository extends JpaRepository<Finance, Long> {
    Optional<Finance> findByInvoiceNumber(String invoiceNumber);
    List<Finance> findByProviderId(Long providerId);
    List<Finance> findByStatus(Finance.PaymentStatus status);
}
