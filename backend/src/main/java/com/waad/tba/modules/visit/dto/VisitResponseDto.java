package com.waad.tba.modules.visit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisitResponseDto {
    private Long id;
    private Long memberId;
    private String memberName;
    private String memberNumber;
    private LocalDate visitDate;
    private String doctorName;
    private String specialty;
    private String diagnosis;
    private String treatment;
    private BigDecimal totalAmount;
    private String notes;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
