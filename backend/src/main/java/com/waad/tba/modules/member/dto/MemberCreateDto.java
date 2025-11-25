package com.waad.tba.modules.member.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberCreateDto {
    
    @NotNull(message = "Employer ID is required")
    private Long employerId;
    
    @NotNull(message = "Company ID is required")
    private Long companyId;
    
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @NotBlank(message = "Civil ID is required")
    private String civilId;
    
    @NotBlank(message = "Policy number is required")
    private String policyNumber;
    
    private LocalDate dateOfBirth;
    
    private String gender; // MALE, FEMALE
    
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid phone number format")
    private String phone;
    
    @Email(message = "Email must be valid")
    private String email;
    
    private Boolean active;
}
