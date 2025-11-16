package com.waad.tba.modules.member.dto;

import com.waad.tba.modules.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberResponseDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String nationalId;
    private String memberNumber;
    private LocalDate dateOfBirth;
    private String phone;
    private String email;
    private String address;
    private Long employerId;
    private String employerName;
    private Long insuranceCompanyId;
    private String insuranceCompanyName;
    private Member.MemberStatus status;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
