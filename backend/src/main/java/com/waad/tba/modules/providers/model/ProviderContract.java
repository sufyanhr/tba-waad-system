package com.waad.tba.modules.providers.model;

import com.waad.tba.modules.insurance.model.InsuranceCompany;
import com.waad.tba.modules.members.model.BenefitTable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "provider_contracts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ProviderContract {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "contract_number", unique = true, nullable = false)
    private String contractNumber;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private Provider provider;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "insurance_company_id", nullable = false)
    private InsuranceCompany insuranceCompany;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type", nullable = false)
    private ContractType contractType = ContractType.DIRECT_BILLING;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @Column(name = "discount_percentage", precision = 5, scale = 2)
    private BigDecimal discountPercentage; // خصم المقدم للشركة
    
    @Column(name = "deductible_amount", precision = 10, scale = 2)
    private BigDecimal deductibleAmount; // المبلغ القابل للخصم من المطالبات
    
    @Column(name = "payment_terms")
    private String paymentTerms; // شروط الدفع (مثل: خلال 30 يوم)
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ContractStatus status = ContractStatus.ACTIVE;
    
    @Column(name = "auto_renewal")
    private Boolean autoRenewal = false;
    
    @Column(name = "renewal_notice_days")
    private Integer renewalNoticeDays = 30; // عدد أيام الإشعار قبل التجديد
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(columnDefinition = "TEXT")
    private String terms; // شروط العقد
    
    // الخدمات المسموحة في العقد
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "contract_services",
        joinColumns = @JoinColumn(name = "contract_id"),
        inverseJoinColumns = @JoinColumn(name = "benefit_id")
    )
    private List<BenefitTable> allowedServices;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // تواريخ التوقيع والتفعيل
    @Column(name = "signed_date")
    private LocalDate signedDate;
    
    @Column(name = "activated_date")
    private LocalDate activatedDate;
    
    @Column(name = "terminated_date")
    private LocalDate terminatedDate;
    
    @Column(name = "termination_reason")
    private String terminationReason;
    
    // إعدادات الفوترة
    @Column(name = "billing_frequency")
    private String billingFrequency = "MONTHLY"; // WEEKLY, MONTHLY, QUARTERLY
    
    @Column(name = "currency", length = 3)
    private String currency = "SAR";
    
    public enum ContractType {
        DIRECT_BILLING("فوترة مباشرة"), 
        REIMBURSEMENT("استرداد"), 
        COPAYMENT("دفع مشترك"),
        CAPITATION("دفع ثابت");
        
        private final String arabicName;
        
        ContractType(String arabicName) {
            this.arabicName = arabicName;
        }
        
        public String getArabicName() {
            return arabicName;
        }
    }
    
    public enum ContractStatus {
        DRAFT("مسودة"),
        PENDING_APPROVAL("في انتظار الموافقة"),
        ACTIVE("نشط"),
        SUSPENDED("معلق"),
        EXPIRED("منتهي الصلاحية"),
        TERMINATED("مُنهى");
        
        private final String arabicName;
        
        ContractStatus(String arabicName) {
            this.arabicName = arabicName;
        }
        
        public String getArabicName() {
            return arabicName;
        }
    }
    
    // Helper methods
    public boolean isActive() {
        return status == ContractStatus.ACTIVE && 
               LocalDate.now().isBefore(endDate.plusDays(1)) &&
               LocalDate.now().isAfter(startDate.minusDays(1));
    }
    
    public boolean isExpiring(int daysAhead) {
        return isActive() && 
               endDate.minusDays(daysAhead).isBefore(LocalDate.now());
    }
    
    public boolean requiresRenewal() {
        return isExpiring(renewalNoticeDays) && autoRenewal;
    }
}