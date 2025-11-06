package com.waad.tba.service;

import com.waad.tba.exception.ResourceNotFoundException;
import com.waad.tba.model.Finance;
import com.waad.tba.repository.FinanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FinanceService {
    
    private final FinanceRepository financeRepository;
    
    public List<Finance> getAllFinanceRecords() {
        return financeRepository.findAll();
    }
    
    public Finance getFinanceById(Long id) {
        return financeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Finance record not found with id: " + id));
    }
    
    public List<Finance> getFinanceByProvider(Long providerId) {
        return financeRepository.findByProviderId(providerId);
    }
    
    public List<Finance> getFinanceByStatus(Finance.PaymentStatus status) {
        return financeRepository.findByStatus(status);
    }
    
    @Transactional
    public Finance createFinanceRecord(Finance finance) {
        finance.setInvoiceDate(LocalDate.now());
        finance.setStatus(Finance.PaymentStatus.PENDING);
        return financeRepository.save(finance);
    }
    
    @Transactional
    public Finance updateFinanceRecord(Long id, Finance financeDetails) {
        Finance finance = getFinanceById(id);
        
        if (financeDetails.getAmount() != null) {
            finance.setAmount(financeDetails.getAmount());
        }
        if (financeDetails.getDueDate() != null) {
            finance.setDueDate(financeDetails.getDueDate());
        }
        if (financeDetails.getStatus() != null) {
            finance.setStatus(financeDetails.getStatus());
        }
        if (financeDetails.getPaymentMethod() != null) {
            finance.setPaymentMethod(financeDetails.getPaymentMethod());
        }
        if (financeDetails.getTransactionReference() != null) {
            finance.setTransactionReference(financeDetails.getTransactionReference());
        }
        if (financeDetails.getNotes() != null) {
            finance.setNotes(financeDetails.getNotes());
        }
        
        return financeRepository.save(finance);
    }
    
    @Transactional
    public Finance markAsPaid(Long id, String paymentMethod, String transactionReference) {
        Finance finance = getFinanceById(id);
        finance.setStatus(Finance.PaymentStatus.PAID);
        finance.setPaymentDate(LocalDate.now());
        finance.setPaymentMethod(paymentMethod);
        finance.setTransactionReference(transactionReference);
        return financeRepository.save(finance);
    }
    
    @Transactional
    public void deleteFinanceRecord(Long id) {
        Finance finance = getFinanceById(id);
        financeRepository.delete(finance);
    }
}
