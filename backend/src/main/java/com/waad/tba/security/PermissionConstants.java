package com.waad.tba.security;

/**
 * Centralized permission constants for RBAC enforcement
 * These values must match Permission entity names in the database
 */
public final class PermissionConstants {

    // Members permissions
    public static final String MEMBERS_VIEW = "MEMBERS_VIEW";
    public static final String MEMBERS_CREATE = "MEMBERS_CREATE";
    public static final String MEMBERS_UPDATE = "MEMBERS_UPDATE";
    public static final String MEMBERS_DELETE = "MEMBERS_DELETE";
    public static final String MEMBERS_MANAGE = "MEMBERS_MANAGE";

    // Claims permissions
    public static final String CLAIMS_VIEW = "CLAIMS_VIEW";
    public static final String CLAIMS_SUBMIT = "CLAIMS_SUBMIT";
    public static final String CLAIMS_REVIEW = "CLAIMS_REVIEW";
    public static final String CLAIMS_APPROVE = "CLAIMS_APPROVE";
    public static final String CLAIMS_REJECT = "CLAIMS_REJECT";

    // Providers permissions
    public static final String PROVIDERS_VIEW = "PROVIDERS_VIEW";
    public static final String PROVIDERS_MANAGE = "PROVIDERS_MANAGE";

    // Policies permissions
    public static final String POLICIES_VIEW = "POLICIES_VIEW";
    public static final String POLICIES_MANAGE = "POLICIES_MANAGE";

    // Employers permissions
    public static final String EMPLOYERS_VIEW = "EMPLOYERS_VIEW";
    public static final String EMPLOYERS_MANAGE = "EMPLOYERS_MANAGE";

    // Finance permissions
    public static final String FINANCE_VIEW = "FINANCE_VIEW";
    public static final String FINANCE_REPORT_VIEW = "FINANCE_REPORT_VIEW";

    // Reports permissions
    public static final String REPORTS_VIEW = "REPORTS_VIEW";
    public static final String REPORTS_GENERATE = "REPORTS_GENERATE";

    // Users permissions
    public static final String USERS_VIEW = "USERS_VIEW";
    public static final String USERS_MANAGE = "USERS_MANAGE";

    // Roles permissions
    public static final String ROLES_VIEW = "ROLES_VIEW";
    public static final String ROLES_MANAGE = "ROLES_MANAGE";

    private PermissionConstants() {
        // Utility class - prevent instantiation
    }
}