#!/bin/bash

# ==============================
# TBA Waad System - Employers Module Test Script
# ==============================
# Purpose: Comprehensive automated testing of Employers CRUD API
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
EMPLOYERS_ENDPOINT="${BASE_URL}/employers"

# Test credentials
ADMIN_USERNAME="admin@tba.sa"
ADMIN_PASSWORD="Admin@123"

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# JWT Token (will be set after login)
JWT_TOKEN=""

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
        echo "$RESPONSE" | jq '.'
        exit 1
    fi
}

test_create_company() {
    print_header "TEST 2: Create Insurance Company (Prerequisite)"
    print_test "Creating insurance company for employer testing"
    
    RESPONSE=$(curl -s -X POST "${BASE_URL}/insurance-companies" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${JWT_TOKEN}" \
        -d '{
            "name": "Test Insurance Company",
            "code": "TIC-001",
            "licenseNumber": "LIC-TEST-001",
            "active": true
        }')
    
    COMPANY_ID=$(echo "$RESPONSE" | jq -r '.data.id')
    
    if [ "$COMPANY_ID" != "null" ] && [ -n "$COMPANY_ID" ]; then
        print_success "Insurance company created successfully (ID: $COMPANY_ID)"
    else
        print_info "Company might already exist, attempting to fetch existing company"
        
        RESPONSE=$(curl -s -X GET "${BASE_URL}/insurance-companies?page=0&size=1" \
            -H "Authorization: Bearer ${JWT_TOKEN}")
        
        COMPANY_ID=$(echo "$RESPONSE" | jq -r '.data.items[0].id')
        
        if [ "$COMPANY_ID" != "null" ] && [ -n "$COMPANY_ID" ]; then
            print_success "Using existing company (ID: $COMPANY_ID)"
        else
            print_fail "Failed to create or fetch insurance company"
            echo "$RESPONSE" | jq '.'
            exit 1
        fi
    fi
}

test_create_employer() {
    print_header "TEST 3: Create Employer"
    print_test "Creating Libyan Cement Company employer record"
    
    RESPONSE=$(curl -s -X POST "${EMPLOYERS_ENDPOINT}" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${JWT_TOKEN}" \
        -d "{
            \"name\": \"شركة الإسمنت الليبية\",
            \"nameEn\": \"Libyan Cement Company\",
            \"code\": \"LIBCEMENT\",
            \"companyId\": ${COMPANY_ID},
            \"contactName\": \"أحمد محمود\",
            \"phone\": \"+218912345678\",
            \"email\": \"info@libcement.ly\",
            \"active\": true
        }")
    
    EMPLOYER_ID=$(echo "$RESPONSE" | jq -r '.data.id')
    
    if [ "$EMPLOYER_ID" != "null" ] && [ -n "$EMPLOYER_ID" ]; then
        print_success "Employer created successfully (ID: $EMPLOYER_ID)"
        echo "$RESPONSE" | jq '.'
    else
        print_info "Employer might already exist, attempting to fetch existing employer"
        
        RESPONSE=$(curl -s -X GET "${EMPLOYERS_ENDPOINT}?search=LIBCEMENT&page=0&size=1" \
            -H "Authorization: Bearer ${JWT_TOKEN}")
        
        EMPLOYER_ID=$(echo "$RESPONSE" | jq -r '.data.items[0].id')
        
        if [ "$EMPLOYER_ID" != "null" ] && [ -n "$EMPLOYER_ID" ]; then
            print_success "Using existing Libyan Cement Company (ID: $EMPLOYER_ID)"
        else
            print_fail "Failed to create or fetch employer"
            exit 1
        fi
    fi
}

test_get_employer_by_id() {
    print_header "TEST 4: Get Employer by ID"
    print_test "Fetching employer details by ID: $EMPLOYER_ID"
    
    RESPONSE=$(curl -s -X GET "${EMPLOYERS_ENDPOINT}/${EMPLOYER_ID}" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    NAME=$(echo "$RESPONSE" | jq -r '.data.name')
    CODE=$(echo "$RESPONSE" | jq -r '.data.code')
    
    if [ "$NAME" == "شركة الإسمنت الليبية" ] && [ "$CODE" == "LIBCEMENT" ]; then
        print_success "Employer retrieved successfully"
        echo "$RESPONSE" | jq '.'
    else
        print_fail "Failed to retrieve employer correctly"
        echo "$RESPONSE" | jq '.'
    fi
}

test_list_employers() {
    print_header "TEST 5: List Employers (Paginated)"
    print_test "Fetching paginated list of employers (page 0, size 10)"
    
    RESPONSE=$(curl -s -X GET "${EMPLOYERS_ENDPOINT}?page=0&size=10" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    TOTAL_ELEMENTS=$(echo "$RESPONSE" | jq -r '.data.total')
    CONTENT_LENGTH=$(echo "$RESPONSE" | jq '.data.items | length')
    
    if [ "$TOTAL_ELEMENTS" != "null" ] && [ "$TOTAL_ELEMENTS" -ge 1 ]; then
        print_success "Employers list retrieved successfully (Total: $TOTAL_ELEMENTS, Returned: $CONTENT_LENGTH)"
        echo "$RESPONSE" | jq '.data.items[0]'
    else
        print_fail "Failed to retrieve employers list"
        echo "$RESPONSE" | jq '.'
    fi
}

test_search_employers() {
    print_header "TEST 6: Search Employers"
    print_test "Searching employers by name: 'Libyan Cement'"
    
    RESPONSE=$(curl -s -X GET "${EMPLOYERS_ENDPOINT}?search=LIBCEMENT&page=0&size=10" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    TOTAL_ELEMENTS=$(echo "$RESPONSE" | jq -r '.data.total')
    FIRST_NAME=$(echo "$RESPONSE" | jq -r '.data.items[0].name')
    
    if [ "$TOTAL_ELEMENTS" -ge 1 ] && [[ "$FIRST_NAME" == *"إسمنت"* ]]; then
        print_success "Search returned ${TOTAL_ELEMENTS} result(s)"
        echo "$RESPONSE" | jq '.data.items[0]'
    else
        print_fail "Search failed to return expected results"
        echo "$RESPONSE" | jq '.'
    fi
}

test_filter_by_status() {
    print_header "TEST 7: Filter Employers by Status"
    print_test "Filtering active employers only"
    
    RESPONSE=$(curl -s -X GET "${EMPLOYERS_ENDPOINT}?status=true&page=0&size=10" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    TOTAL_ELEMENTS=$(echo "$RESPONSE" | jq -r '.data.total')
    FIRST_ACTIVE=$(echo "$RESPONSE" | jq -r '.data.items[0].active')
    
    if [ "$TOTAL_ELEMENTS" -ge 1 ] && [ "$FIRST_ACTIVE" == "true" ]; then
        print_success "Status filter working correctly (Active employers: $TOTAL_ELEMENTS)"
        echo "$RESPONSE" | jq '.data.items[0]'
    else
        print_fail "Status filter not working as expected"
        echo "$RESPONSE" | jq '.'
    fi
}

test_update_employer() {
    print_header "TEST 8: Update Employer"
    print_test "Updating employer details (ID: $EMPLOYER_ID)"
    
    RESPONSE=$(curl -s -X PUT "${EMPLOYERS_ENDPOINT}/${EMPLOYER_ID}" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${JWT_TOKEN}" \
        -d "{
            \"name\": \"شركة الإسمنت الليبية\",
            \"nameEn\": \"Libyan Cement Company\",
            \"code\": \"LIBCEMENT\",
            \"companyId\": ${COMPANY_ID},
            \"contactName\": \"فاطمة علي\",
            \"phone\": \"+218917654321\",
            \"email\": \"fatima.ali@libcement.ly\",
            \"active\": true
        }")
    
    UPDATED_NAME=$(echo "$RESPONSE" | jq -r '.data.name')
    UPDATED_CONTACT=$(echo "$RESPONSE" | jq -r '.data.contactName')
    
    if [ "$UPDATED_NAME" == "شركة الإسمنت الليبية" ] && [ "$UPDATED_CONTACT" == "فاطمة علي" ]; then
        print_success "Employer updated successfully"
        echo "$RESPONSE" | jq '.'
    else
        print_fail "Failed to update employer"
        echo "$RESPONSE" | jq '.'
    fi
}

test_unauthorized_access() {
    print_header "TEST 9: Unauthorized Access (Security Test)"
    print_test "Attempting to access employers without JWT token"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "${EMPLOYERS_ENDPOINT}")
    
    if [ "$HTTP_CODE" == "401" ] || [ "$HTTP_CODE" == "403" ]; then
        print_success "Unauthorized access correctly blocked (HTTP $HTTP_CODE)"
    else
        print_fail "Security issue: Unauthorized access not blocked (HTTP $HTTP_CODE)"
    fi
}

test_not_found() {
    print_header "TEST 10: Not Found (404 Test)"
    print_test "Attempting to fetch non-existent employer (ID: 999999)"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "${EMPLOYERS_ENDPOINT}/999999" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    if [ "$HTTP_CODE" == "404" ]; then
        print_success "404 Not Found handled correctly"
    else
        print_fail "Expected 404, got HTTP $HTTP_CODE"
    fi
}

test_delete_employer() {
    print_header "TEST 11: Delete Employer"
    print_test "Deleting employer (ID: $EMPLOYER_ID)"
    
    RESPONSE=$(curl -s -X DELETE "${EMPLOYERS_ENDPOINT}/${EMPLOYER_ID}" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    MESSAGE=$(echo "$RESPONSE" | jq -r '.message')
    
    if [[ "$MESSAGE" == *"success"* ]] || [[ "$MESSAGE" == *"deleted"* ]]; then
        print_success "Employer deleted successfully"
        
        # Verify deletion
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "${EMPLOYERS_ENDPOINT}/${EMPLOYER_ID}" \
            -H "Authorization: Bearer ${JWT_TOKEN}")
        
        if [ "$HTTP_CODE" == "404" ]; then
            print_success "Deletion verified (HTTP 404 on subsequent GET)"
        else
            print_fail "Employer still exists after deletion (HTTP $HTTP_CODE)"
        fi
    else
        print_fail "Failed to delete employer"
        echo "$RESPONSE" | jq '.'
    fi
}

# ==============================
# Main Execution
# ==============================

main() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                                                                ║"
    echo "║        TBA WAAD SYSTEM - EMPLOYERS MODULE TEST SUITE           ║"
    echo "║                                                                ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    
    print_info "API Base URL: ${BASE_URL}"
    print_info "Testing as user: ${ADMIN_USERNAME}"
    print_info "Start Time: $(date)"
    
    # Check if jq is installed
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}Error: jq is not installed. Please install jq to parse JSON responses.${NC}"
        exit 1
    fi
    
    # Run all tests
    test_login
    test_create_company
    test_create_employer
    test_get_employer_by_id
    test_list_employers
    test_search_employers
    test_filter_by_status
    test_update_employer
    test_unauthorized_access
    test_not_found
    test_delete_employer
    
    # Print summary
    print_summary
    
    print_info "End Time: $(date)"
    
    # Exit with appropriate code
    if [ $TESTS_FAILED -eq 0 ]; then
        exit 0
    else
        exit 1
    fi
}

# Run main function
main "$@"
