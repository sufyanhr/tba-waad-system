package com.waad.tba.security;

/**
 * Application Permission Constants
 * Defines all available permissions in the TBA-WAAD system
 */
public enum AppPermission {
    
    // System Settings Module
    MANAGE_SYSTEM_SETTINGS("Manage system settings and configurations"),
    
    // User & Role Management
    MANAGE_USERS("Manage user accounts"),
    MANAGE_ROLES("Manage roles and permissions"),
    
    // Core Business Modules
    MANAGE_MEMBERS("Manage members and member information"),
    MANAGE_EMPLOYERS("Manage employer organizations"),
    MANAGE_PROVIDERS("Manage healthcare providers"),
    MANAGE_PROVIDER_CONTRACTS("Manage provider-company contracts"),
    VIEW_PROVIDER_CONTRACTS("View provider-company contracts"),
    MANAGE_CLAIMS("Manage insurance claims"),
    MANAGE_VISITS("Manage patient visits and appointments"),
    
    // Reporting & Analytics
    MANAGE_REPORTS("Access and generate reports");

    private final String description;

    AppPermission(String description) {
        this.description = description;
    }

    public String getPermissionName() {
        return this.name();
    }

    public String getDescription() {
        return this.description;
    }

    /**
     * Get all permission names as a String array
     */
    public static String[] getAllPermissionNames() {
        AppPermission[] values = values();
        String[] names = new String[values.length];
        for (int i = 0; i < values.length; i++) {
            names[i] = values[i].name();
        }
        return names;
    }
}
