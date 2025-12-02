package com.waad.tba.modules.auth.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private UserInfo user;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String username;
        private String fullName;
        private String email;
        private List<String> roles;
        private List<String> permissions;
        private Long employerId;  // Phase 8: Employer ID for EMPLOYER_ADMIN
        private Long companyId;   // Phase 8: Company ID for INSURANCE_ADMIN
    }
}
