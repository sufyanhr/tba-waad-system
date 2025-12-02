#!/bin/bash
# Phase 8 - Permission Migration Script
# Updates all old permission strings to new AppPermission enum values

echo "🔄 Starting Phase 8 permission migration..."

BASE_DIR="/workspaces/tba-waad-system/backend/src/main/java/com/waad/tba/modules"

# Claim permissions
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'claim\.view'/'VIEW_CLAIMS'/g" {} \;
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'claim\.manage'/'MANAGE_CLAIMS'/g" {} \;
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'claim\.approve'/'APPROVE_CLAIMS'/g" {} \;
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'claim\.reject'/'REJECT_CLAIMS'/g" {} \;

# Visit permissions
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'visit\.view'/'VIEW_VISITS'/g" {} \;
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'visit\.manage'/'MANAGE_VISITS'/g" {} \;

# Member permissions (already correct, but ensure consistency)
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'member\.view'/'VIEW_MEMBERS'/g" {} \;
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'member\.manage'/'MANAGE_MEMBERS'/g" {} \;

# Employer permissions
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'employer\.view'/'VIEW_EMPLOYERS'/g" {} \;
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'employer\.manage'/'MANAGE_EMPLOYERS'/g" {} \;

# Provider permissions
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'provider\.view'/'VIEW_PROVIDERS'/g" {} \;
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'provider\.manage'/'MANAGE_PROVIDERS'/g" {} \;

# Insurance permissions
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'insurance\.view'/'VIEW_INSURANCE'/g" {} \;
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'insurance\.manage'/'MANAGE_INSURANCE'/g" {} \;

# Reviewer permissions
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'reviewer\.view'/'VIEW_REVIEWER'/g" {} \;
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'reviewer\.manage'/'MANAGE_REVIEWER'/g" {} \;

# RBAC permissions
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'rbac\.view'/'MANAGE_RBAC'/g" {} \;
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'rbac\.manage'/'MANAGE_RBAC'/g" {} \;
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'user\.view'/'MANAGE_RBAC'/g" {} \;
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'user\.manage'/'MANAGE_RBAC'/g" {} \;
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'role\.view'/'MANAGE_RBAC'/g" {} \;
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'role\.manage'/'MANAGE_RBAC'/g" {} \;
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'permission\.view'/'MANAGE_RBAC'/g" {} \;
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'permission\.manage'/'MANAGE_RBAC'/g" {} \;

# System settings
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'system\.manage'/'MANAGE_SYSTEM_SETTINGS'/g" {} \;

# Dashboard permissions
find "$BASE_DIR" -name "*.java" -type f -exec sed -i "s/'dashboard\.view'/'VIEW_REPORTS'/g" {} \;

echo "✅ Phase 8 permission migration completed!"
echo "📝 Please run: mvn compile -DskipTests to verify changes"
