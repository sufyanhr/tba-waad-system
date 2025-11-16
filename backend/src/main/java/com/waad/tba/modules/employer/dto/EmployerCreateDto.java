package com.waad.tba.modules.employer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployerCreateDto {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    private String contactName;
    
    private String contactPhone;
    
    @Email(message = "Contact email must be valid")
    private String contactEmail;
    
    private String address;
}
