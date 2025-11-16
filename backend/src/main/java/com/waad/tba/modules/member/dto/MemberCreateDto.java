package com.waad.tba.modules.member.dto;

import com.waad.tba.modules.member.entity.Member;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @NotBlank(message = "National ID is required")
    private String nationalId;
    
    private String memberNumber;
    
    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;
    
    private String phone;
    
    @Email(message = "Email must be valid")
    private String email;
    
    private String address;
    
    @NotNull(message = "Employer ID is required")
    private Long employerId;
    
    @NotNull(message = "Insurance company ID is required")
    private Long insuranceCompanyId;
    
    private Member.MemberStatus status;
}
