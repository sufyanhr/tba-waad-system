package com.waad.tba.modules.employer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployerCreateDto {
    
    @NotBlank(message = "Employer name is required")
    private String name;
    
    @NotBlank(message = "Employer code is required")
    private String code;
    
    @NotNull(message = "Company ID is required")
    private Long companyId;
    
    private String contactName;
    
    private String contactPhone;
    
    @Email(message = "Contact email must be valid")
    private String contactEmail;
    
    private String address;
    
    private String phone;
    
    @Email(message = "Email must be valid")
    private String email;
    
    private Boolean active;
}
