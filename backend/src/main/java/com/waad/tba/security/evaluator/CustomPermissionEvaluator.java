package com.waad.tba.security.evaluator;

import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.Collection;

/**
 * Custom PermissionEvaluator that checks for permissions in JWT token authorities
 */
@Component
public class CustomPermissionEvaluator implements PermissionEvaluator {

    /**
     * Check if the authenticated user has the specified permission
     */
    @Override
    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        if (authentication == null || permission == null) {
            return false;
        }

        return hasPermission(authentication, permission.toString());
    }

    /**
     * Check if the authenticated user has the specified permission on target object with specific ID
     */
    @Override
    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        if (authentication == null || permission == null) {
            return false;
        }

        return hasPermission(authentication, permission.toString());
    }

    /**
     * Internal method to check if user has specific permission
     * Looks for authorities with format: PERMISSION_{PERMISSION_NAME}
     */
    private boolean hasPermission(Authentication authentication, String permission) {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        
        // Check for exact permission match
        String permissionAuthority = "PERMISSION_" + permission;
        for (GrantedAuthority authority : authorities) {
            if (authority.getAuthority().equals(permissionAuthority)) {
                return true;
            }
        }

        // Check for admin role - admins have all permissions
        for (GrantedAuthority authority : authorities) {
            if (authority.getAuthority().equals("ROLE_ADMIN")) {
                return true;
            }
        }

        return false;
    }
}