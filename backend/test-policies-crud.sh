#!/bin/bash

# ==============================
# TBA Waad System - Policies Module Test Script
# ==============================
# Purpose: Comprehensive automated testing of Policies CRUD API
# Date: $(date +%Y-%m-%d)
# ==============================

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# API Configuration
BASE_URL="http://localhost:8080/api"
AUTH_ENDPOINT="${BASE_URL}/auth/login"
POLICIES_ENDPOINT="${BASE_URL}/policies"
EMPLOYERS_ENDPOINT="${BASE_URL}/employers"
INSURANCE_ENDPOINT="${BASE_URL}/insurance-companies"
BENEFIT_PACKAGES_ENDPOINT="${BASE_URL}/benefit-packages"

# Test credentials
ADMIN_USERNAME="admin@tba.sa"
ADMIN_PASSWORD="Admin@123"

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# JWT Token (will be set after login)
JWT_TOKEN=""

# Test data IDs (will be set during tests)
POLICY_ID=""
EMPLOYER_ID=""
INSURANCE_COMPANY_ID=""
BENEFIT_PACKAGE_ID=""

# ==============================
# Utility Functions
# ==============================

print_header() {
    echo -e "\n${CYAN}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════════════════════${NC}\n"
}

print_test() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${BLUE}[TEST #${TOTAL_TESTS}]${NC} $1"
}

print_success() {
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}✓ PASS:${NC} $1"
}

print_fail() {
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}✗ FAIL:${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ INFO:${NC} $1"
}

print_summary() {
    echo -e "\n${CYAN}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  TEST SUMMARY${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════════════════════${NC}"
    echo -e "Total Tests: ${TOTAL_TESTS}"
    echo -e "${GREEN}Passed: ${TESTS_PASSED}${NC}"
    echo -e "${RED}Failed: ${TESTS_FAILED}${NC}"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "\n${GREEN}✓ ALL TESTS PASSED!${NC} 🎉"
    else
        echo -e "\n${RED}✗ SOME TESTS FAILED${NC} ⚠️"
    fi
    echo -e "${CYAN}════════════════════════════════════════════════════════════════${NC}\n"
}

# ==============================
# Test Functions
# ==============================

test_login() {
    print_header "TEST 1: Authentication"
    print_test "Admin login to obtain JWT token"
    
    RESPONSE=$(curl -s -X POST "${AUTH_ENDPOINT}" \
        -H "Content-Type: application/json" \
        -d "{
            \"identifier\": \"${ADMIN_USERNAME}\",
            \"password\": \"${ADMIN_PASSWORD}\"
        }")
    
    JWT_TOKEN=$(echo "$RESPONSE" | jq -r '.data.token')
    
    if [ "$JWT_TOKEN" != "null" ] && [ -n "$JWT_TOKEN" ]; then
        print_success "Login successful, JWT token obtained"
        print_info "Token: ${JWT_TOKEN:0:50}..."
    else
        print_fail "Login failed or invalid token"
        echo "$RESPONSE" | jq .
        exit 1
    fi
}

test_get_prerequisites() {
    print_header "TEST 2: Get Prerequisites (Employer, Insurance & Benefit Package)"
    
    # Get Al Waha Insurance Company
    print_test "Fetching Al Waha Insurance Company"
    RESPONSE=$(curl -s -X GET "${INSURANCE_ENDPOINT}" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    INSURANCE_COMPANY_ID=$(echo "$RESPONSE" | jq -r '.data.items[] | select(.name == "شركة الواحة للتأمين") | .id')
    
    if [ "$INSURANCE_COMPANY_ID" != "null" ] && [ -n "$INSURANCE_COMPANY_ID" ]; then
        print_success "Al Waha Insurance Company found (ID: ${INSURANCE_COMPANY_ID})"
    else
        print_fail "Al Waha Insurance Company not found"
        echo "$RESPONSE" | jq .
        exit 1
    fi
    
    # Get Libyan Cement Company
    print_test "Fetching Libyan Cement Employer"
    RESPONSE=$(curl -s -X GET "${EMPLOYERS_ENDPOINT}" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    EMPLOYER_ID=$(echo "$RESPONSE" | jq -r '.data.items[] | select(.name == "شركة الإسمنت الليبية") | .id')
    
    if [ "$EMPLOYER_ID" != "null" ] && [ -n "$EMPLOYER_ID" ]; then
        print_success "Libyan Cement Employer found (ID: ${EMPLOYER_ID})"
    else
        print_fail "Libyan Cement Employer not found"
        echo "$RESPONSE" | jq .
        exit 1
    fi
    
    # Create or get Benefit Package
    print_test "Creating/Fetching Benefit Package"
    
    # First try to get existing
    RESPONSE=$(curl -s -X GET "${BENEFIT_PACKAGES_ENDPOINT}" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    BENEFIT_PACKAGE_ID=$(echo "$RESPONSE" | jq -r '.data[0].id // empty')
    
    if [ -z "$BENEFIT_PACKAGE_ID" ] || [ "$BENEFIT_PACKAGE_ID" == "null" ]; then
        # Create new one with all required fields
        RESPONSE=$(curl -s -X POST "${BENEFIT_PACKAGES_ENDPOINT}" \
            -H "Authorization: Bearer ${JWT_TOKEN}" \
            -H "Content-Type: application/json" \
            -d "{
                \"code\": \"STD-PKG-$(date +%s)\",
                \"nameEn\": \"Standard Package\",
                \"nameAr\": \"الباقة القياسية\",
                \"description\": \"Standard medical insurance package\",
                \"active\": true,
                \"annualLimitPerMember\": 50000.00,
                \"lifetimeLimitPerMember\": 200000.00,
                \"opCoverageLimit\": 10000.00,
                \"ipCoverageLimit\": 30000.00,
                \"opCoPaymentPercentage\": 10.0,
                \"ipCoPaymentPercentage\": 20.0,
                \"emergencyCovered\": true,
                \"maternityCovered\": true,
                \"maternityCoverageLimit\": 5000.00,
                \"dentalCovered\": false,
                \"dentalCoverageLimit\": 0.00,
                \"opticalCovered\": false,
                \"opticalCoverageLimit\": 0.00,
                \"pharmacyCovered\": true,
                \"pharmacyCoverageLimit\": 5000.00,
                \"chronicDiseaseCovered\": true,
                \"preExistingConditionsCovered\": false
            }")
        
        BENEFIT_PACKAGE_ID=$(echo "$RESPONSE" | jq -r '.data.id')
    fi
    
    if [ "$BENEFIT_PACKAGE_ID" != "null" ] && [ -n "$BENEFIT_PACKAGE_ID" ]; then
        print_success "Benefit Package ready (ID: ${BENEFIT_PACKAGE_ID})"
    else
        print_fail "Failed to create/fetch benefit package"
        echo "$RESPONSE" | jq .
        exit 1
    fi
}

test_create_policy() {
    print_header "TEST 3: Create Policy"
    print_test "Creating policy (POL-2025-001)"
    
    # Generate unique policy number with timestamp
    POLICY_NUMBER="POL-2025-$(date +%s)"
    
    RESPONSE=$(curl -s -X POST "${POLICIES_ENDPOINT}" \
        -H "Authorization: Bearer ${JWT_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{
            \"policyNumber\": \"${POLICY_NUMBER}\",
            \"productName\": \"Group Medical Insurance\",
            \"employerId\": ${EMPLOYER_ID},
            \"insuranceCompanyId\": ${INSURANCE_COMPANY_ID},
            \"benefitPackageId\": ${BENEFIT_PACKAGE_ID},
            \"startDate\": \"2025-01-01\",
            \"endDate\": \"2025-12-31\",
            \"status\": \"ACTIVE\",
            \"generalWaitingPeriodDays\": 0,
            \"maternityWaitingPeriodDays\": 270,
            \"preExistingWaitingPeriodDays\": 365,
            \"numberOfLives\": 500,
            \"numberOfFamilies\": 100,
            \"totalPremium\": 250000.00,
            \"premiumPerMember\": 500.00,
            \"active\": true
        }")
    
    POLICY_ID=$(echo "$RESPONSE" | jq -r '.data.id')
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    
    if [ "$STATUS" == "success" ] && [ "$POLICY_ID" != "null" ] && [ -n "$POLICY_ID" ]; then
        print_success "Policy created successfully (ID: ${POLICY_ID}, Number: ${POLICY_NUMBER})"
        print_info "Policy: ${POLICY_NUMBER}"
    else
        print_fail "Failed to create policy"
        echo "$RESPONSE" | jq .
        exit 1
    fi
}

test_get_policy_by_id() {
    print_header "TEST 4: Get Policy by ID"
    print_test "Fetching policy with ID: ${POLICY_ID}"
    
    RESPONSE=$(curl -s -X GET "${POLICIES_ENDPOINT}/${POLICY_ID}" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    FETCHED_ID=$(echo "$RESPONSE" | jq -r '.data.id')
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    
    if [ "$STATUS" == "success" ] && [ "$FETCHED_ID" == "$POLICY_ID" ]; then
        print_success "Policy fetched successfully"
        POLICY_NUMBER=$(echo "$RESPONSE" | jq -r '.data.policyNumber')
        EMPLOYER_NAME=$(echo "$RESPONSE" | jq -r '.data.employerName')
        print_info "Policy Number: ${POLICY_NUMBER}"
        print_info "Employer: ${EMPLOYER_NAME}"
    else
        print_fail "Failed to fetch policy by ID"
        echo "$RESPONSE" | jq .
    fi
}

test_list_all_policies() {
    print_header "TEST 5: List All Policies"
    print_test "Fetching all policies"
    
    RESPONSE=$(curl -s -X GET "${POLICIES_ENDPOINT}" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    # Check if data is paginated or array
    COUNT=$(echo "$RESPONSE" | jq -r 'if .data | type == "array" then .data | length else .data.items | length end')
    
    if [ "$STATUS" == "success" ] && [ "$COUNT" -gt 0 ]; then
        print_success "Policies list fetched successfully (${COUNT} policies)"
    else
        print_fail "Failed to fetch policies list"
        echo "$RESPONSE" | jq .
    fi
}

test_get_policy_by_number() {
    print_header "TEST 6: Get Policy by Policy Number"
    print_test "Fetching policy by number"
    
    # Get the policy number from existing policy
    RESPONSE=$(curl -s -X GET "${POLICIES_ENDPOINT}/${POLICY_ID}" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    POLICY_NUMBER=$(echo "$RESPONSE" | jq -r '.data.policyNumber')
    
    RESPONSE=$(curl -s -X GET "${POLICIES_ENDPOINT}/number/${POLICY_NUMBER}" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    FETCHED_NUMBER=$(echo "$RESPONSE" | jq -r '.data.policyNumber')
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    
    if [ "$STATUS" == "success" ] && [ "$FETCHED_NUMBER" == "$POLICY_NUMBER" ]; then
        print_success "Policy found by policy number"
        print_info "Policy Number: ${FETCHED_NUMBER}"
    else
        print_fail "Failed to fetch policy by number"
        echo "$RESPONSE" | jq .
    fi
}

test_get_policies_by_employer() {
    print_header "TEST 7: Get Policies by Employer"
    print_test "Fetching policies for Employer ID: ${EMPLOYER_ID}"
    
    RESPONSE=$(curl -s -X GET "${POLICIES_ENDPOINT}/employer/${EMPLOYER_ID}" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    # Check if data is array or paginated
    COUNT=$(echo "$RESPONSE" | jq -r 'if .data | type == "array" then .data | length else if .data.items then .data.items | length else 0 end end')
    
    if [ "$STATUS" == "success" ]; then
        print_success "Policies fetched for employer (${COUNT} policies)"
    else
        print_fail "Failed to fetch policies by employer"
        echo "$RESPONSE" | jq .
    fi
}

test_get_policies_by_insurance() {
    print_header "TEST 8: Get Policies by Insurance Company"
    print_test "Fetching policies for Insurance Company ID: ${INSURANCE_COMPANY_ID}"
    
    RESPONSE=$(curl -s -X GET "${POLICIES_ENDPOINT}/insurance/${INSURANCE_COMPANY_ID}" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    # Check if data is array or paginated
    COUNT=$(echo "$RESPONSE" | jq -r 'if .data | type == "array" then .data | length else if .data.items then .data.items | length else 0 end end')
    
    if [ "$STATUS" == "success" ]; then
        print_success "Policies fetched for insurance company (${COUNT} policies)"
    else
        print_fail "Failed to fetch policies by insurance company"
        echo "$RESPONSE" | jq .
    fi
}

test_get_active_policies() {
    print_header "TEST 9: Get Active Policies"
    print_test "Fetching active policies only"
    
    RESPONSE=$(curl -s -X GET "${POLICIES_ENDPOINT}/active" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    # Check if data is array or paginated
    COUNT=$(echo "$RESPONSE" | jq -r 'if .data | type == "array" then .data | length else if .data.items then .data.items | length else 0 end end')
    
    if [ "$STATUS" == "success" ]; then
        print_success "Active policies fetched (${COUNT} active policies)"
    else
        print_fail "Failed to fetch active policies"
        echo "$RESPONSE" | jq .
    fi
}

test_update_policy() {
    print_header "TEST 10: Update Policy"
    print_test "Updating policy (numberOfLives: 500 → 750)"
    
    RESPONSE=$(curl -s -X PUT "${POLICIES_ENDPOINT}/${POLICY_ID}" \
        -H "Authorization: Bearer ${JWT_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{
            \"id\": ${POLICY_ID},
            \"policyNumber\": \"POL-2025-UPDATED\",
            \"productName\": \"Group Medical Insurance - Updated\",
            \"employerId\": ${EMPLOYER_ID},
            \"insuranceCompanyId\": ${INSURANCE_COMPANY_ID},
            \"benefitPackageId\": ${BENEFIT_PACKAGE_ID},
            \"startDate\": \"2025-01-01\",
            \"endDate\": \"2025-12-31\",
            \"status\": \"ACTIVE\",
            \"generalWaitingPeriodDays\": 0,
            \"maternityWaitingPeriodDays\": 270,
            \"preExistingWaitingPeriodDays\": 365,
            \"numberOfLives\": 750,
            \"numberOfFamilies\": 150,
            \"totalPremium\": 375000.00,
            \"premiumPerMember\": 500.00,
            \"active\": true
        }")
    
    UPDATED_LIVES=$(echo "$RESPONSE" | jq -r '.data.numberOfLives')
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    
    if [ "$STATUS" == "success" ] && [ "$UPDATED_LIVES" == "750" ]; then
        print_success "Policy updated successfully (numberOfLives: ${UPDATED_LIVES})"
    else
        print_fail "Failed to update policy"
        echo "$RESPONSE" | jq .
    fi
}

test_update_policy_status() {
    print_header "TEST 11: Update Policy Status"
    print_test "Updating policy status to EXPIRED"
    
    RESPONSE=$(curl -s -X PATCH "${POLICIES_ENDPOINT}/${POLICY_ID}/status?status=EXPIRED" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    UPDATED_STATUS=$(echo "$RESPONSE" | jq -r '.data.status')
    
    if [ "$STATUS" == "success" ] && [ "$UPDATED_STATUS" == "EXPIRED" ]; then
        print_success "Policy status updated to EXPIRED"
    else
        print_fail "Failed to update policy status"
        echo "$RESPONSE" | jq .
    fi
}

test_unauthorized_access() {
    print_header "TEST 12: Unauthorized Access (Security)"
    print_test "Attempting to access policies without authentication"
    
    RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "${POLICIES_ENDPOINT}")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    
    if [ "$HTTP_CODE" == "401" ] || [ "$HTTP_CODE" == "403" ]; then
        print_success "Unauthorized access blocked (HTTP ${HTTP_CODE})"
    else
        print_fail "Security issue: Unauthorized access allowed (HTTP ${HTTP_CODE})"
    fi
}

test_not_found() {
    print_header "TEST 13: Handle 404 Not Found"
    print_test "Fetching non-existent policy (ID: 999999)"
    
    RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "${POLICIES_ENDPOINT}/999999" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | head -n -1)
    STATUS=$(echo "$BODY" | jq -r '.status')
    
    if [ "$HTTP_CODE" == "404" ] || [ "$STATUS" == "error" ]; then
        print_success "404 Not Found handled correctly"
    else
        print_fail "404 Not Found not handled properly"
        echo "$BODY" | jq .
    fi
}

test_delete_policy() {
    print_header "TEST 14: Delete Policy"
    print_test "Deleting policy (ID: ${POLICY_ID})"
    
    RESPONSE=$(curl -s -X DELETE "${POLICIES_ENDPOINT}/${POLICY_ID}" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    
    if [ "$STATUS" == "success" ]; then
        print_success "Policy deleted successfully"
        
        # Verify deletion
        print_test "Verifying policy deletion"
        RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "${POLICIES_ENDPOINT}/${POLICY_ID}" \
            -H "Authorization: Bearer ${JWT_TOKEN}")
        
        HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
        BODY=$(echo "$RESPONSE" | head -n -1)
        RESPONSE_STATUS=$(echo "$BODY" | jq -r '.status')
        
        if [ "$HTTP_CODE" == "404" ] || [ "$RESPONSE_STATUS" == "error" ]; then
            print_success "Policy deletion verified (404 Not Found or error status)"
        else
            print_fail "Policy still exists after deletion"
            echo "$BODY" | jq .
        fi
    else
        print_fail "Failed to delete policy"
        echo "$RESPONSE" | jq .
    fi
}

# ==============================
# Main Execution
# ==============================

print_header "TBA WAAD SYSTEM - POLICIES MODULE TEST SUITE"
echo -e "Testing Policies CRUD operations with official entities"
echo -e "Base URL: ${BASE_URL}"
echo -e "Date: $(date)"

# Run all tests
test_login
test_get_prerequisites
test_create_policy
test_get_policy_by_id
test_list_all_policies
test_get_policy_by_number
test_get_policies_by_employer
test_get_policies_by_insurance
test_get_active_policies
test_update_policy
test_update_policy_status
test_unauthorized_access
test_not_found
test_delete_policy

# Print summary
print_summary

# Exit with appropriate code
if [ $TESTS_FAILED -eq 0 ]; then
    exit 0
else
    exit 1
fi
